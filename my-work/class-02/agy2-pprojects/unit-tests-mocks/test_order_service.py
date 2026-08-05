import unittest
from unittest.mock import MagicMock

from order_service import (
    Order,
    InventoryService,
    PaymentGateway,
    InventoryShortageError,
    PaymentFailedError,
    InvalidOrderError,
)

class TestOrderCartManagement(unittest.TestCase):
    """Unit tests for cart manipulation methods in Order class."""

    def setUp(self):
        self.mock_inventory = MagicMock(spec=InventoryService)
        self.mock_payment = MagicMock(spec=PaymentGateway)
        self.order = Order(
            inventory_service=self.mock_inventory,
            payment_gateway=self.mock_payment,
            customer_email="test@example.com",
            is_vip=False,
        )

    def test_add_item_success(self):
        """Test adding items to the cart."""
        self.order.add_item("item-1", price=50.0, quantity=2)
        self.assertIn("item-1", self.order.items)
        self.assertEqual(self.order.items["item-1"], {"price": 50.0, "qty": 2})

    def test_add_item_accumulates_quantity(self):
        """Test adding an existing item increases the quantity."""
        self.order.add_item("item-1", price=50.0, quantity=2)
        self.order.add_item("item-1", price=50.0, quantity=3)
        self.assertEqual(self.order.items["item-1"]["qty"], 5)

    def test_add_item_negative_price_raises_value_error(self):
        """Test adding item with negative price raises ValueError."""
        with self.assertRaises(ValueError) as ctx:
            self.order.add_item("item-1", price=-10.0, quantity=1)
        self.assertEqual(str(ctx.exception), "Price cannot be negative")

    def test_add_item_invalid_quantity_raises_value_error(self):
        """Test adding item with zero or negative quantity raises ValueError."""
        with self.assertRaises(ValueError) as ctx_zero:
            self.order.add_item("item-1", price=10.0, quantity=0)
        self.assertEqual(str(ctx_zero.exception), "Quantity must be greater than zero")

        with self.assertRaises(ValueError) as ctx_neg:
            self.order.add_item("item-1", price=10.0, quantity=-2)
        self.assertEqual(str(ctx_neg.exception), "Quantity must be greater than zero")

    def test_remove_item_success(self):
        """Test removing an item from the cart."""
        self.order.add_item("item-1", price=25.0, quantity=1)
        self.order.remove_item("item-1")
        self.assertNotIn("item-1", self.order.items)

    def test_remove_item_non_existent(self):
        """Test removing a non-existent item does not raise error."""
        self.order.remove_item("non-existent-item")
        self.assertEqual(len(self.order.items), 0)


class TestOrderDiscounts(unittest.TestCase):
    """Unit tests for pricing calculation and discount rules."""

    def setUp(self):
        self.mock_inventory = MagicMock(spec=InventoryService)
        self.mock_payment = MagicMock(spec=PaymentGateway)

    def test_total_price_calculation(self):
        """Test total_price property sums all item prices multiplied by quantity."""
        order = Order(self.mock_inventory, self.mock_payment, "user@example.com")
        order.add_item("item-1", price=20.0, quantity=3) # 60.0
        order.add_item("item-2", price=15.5, quantity=2) # 31.0
        self.assertEqual(order.total_price, 91.0)

    def test_apply_discount_regular_customer_under_100(self):
        """Test non-VIP customer with total <= 100 gets no discount."""
        order = Order(self.mock_inventory, self.mock_payment, "user@example.com", is_vip=False)
        order.add_item("item-1", price=50.0, quantity=2) # 100.0
        self.assertEqual(order.apply_discount(), 100.0)

    def test_apply_discount_regular_customer_over_100(self):
        """Test non-VIP customer with total > 100 gets 10% discount."""
        order = Order(self.mock_inventory, self.mock_payment, "user@example.com", is_vip=False)
        order.add_item("item-1", price=150.0, quantity=1) # 150.0
        # 150 * 0.9 = 135.0
        self.assertEqual(order.apply_discount(), 135.0)

    def test_apply_discount_vip_customer_flat_20_percent(self):
        """Test VIP customer gets flat 20% discount regardless of total."""
        # Under $100 total
        vip_order_small = Order(self.mock_inventory, self.mock_payment, "vip@example.com", is_vip=True)
        vip_order_small.add_item("item-1", price=50.0, quantity=1) # 50.0
        # 50 * 0.8 = 40.0
        self.assertEqual(vip_order_small.apply_discount(), 40.0)

        # Over $100 total
        vip_order_large = Order(self.mock_inventory, self.mock_payment, "vip@example.com", is_vip=True)
        vip_order_large.add_item("item-1", price=200.0, quantity=1) # 200.0
        # 200 * 0.8 = 160.0
        self.assertEqual(vip_order_large.apply_discount(), 160.0)


class TestOrderCheckout(unittest.TestCase):
    """Unit tests for checkout orchestration and service mocking."""

    def setUp(self):
        self.mock_inventory = MagicMock(spec=InventoryService)
        self.mock_payment = MagicMock(spec=PaymentGateway)
        self.order = Order(
            inventory_service=self.mock_inventory,
            payment_gateway=self.mock_payment,
            customer_email="customer@example.com",
            is_vip=False,
        )

    def test_checkout_empty_cart_raises_invalid_order_error(self):
        """Test checking out an empty cart raises InvalidOrderError."""
        with self.assertRaises(InvalidOrderError) as ctx:
            self.order.checkout()
        self.assertEqual(str(ctx.exception), "Cannot checkout an empty cart")
        self.mock_inventory.get_stock.assert_not_called()
        self.mock_payment.charge.assert_not_called()

    def test_checkout_insufficient_stock_raises_inventory_shortage_error(self):
        """Test checkout aborts and raises InventoryShortageError if stock is low."""
        self.order.add_item("item-1", price=30.0, quantity=5)
        # Mock stock lower than requested quantity
        self.mock_inventory.get_stock.return_value = 3

        with self.assertRaises(InventoryShortageError) as ctx:
            self.order.checkout()

        self.assertIn("Not enough stock for item-1", str(ctx.exception))
        self.mock_inventory.get_stock.assert_called_once_with("item-1")
        # Ensure payment was NOT charged and stock was NOT decremented
        self.mock_payment.charge.assert_not_called()
        self.mock_inventory.decrement_stock.assert_not_called()

    def test_checkout_payment_declined_raises_payment_failed_error(self):
        """Test checkout aborts if payment gateway declines transaction."""
        self.order.add_item("item-1", price=50.0, quantity=1)
        self.mock_inventory.get_stock.return_value = 10
        # Payment gateway returns False (declined)
        self.mock_payment.charge.return_value = False

        with self.assertRaises(PaymentFailedError) as ctx:
            self.order.checkout()

        self.assertIn("Transaction declined by gateway", str(ctx.exception))
        self.mock_payment.charge.assert_called_once_with(50.0, "USD")
        # Stock should NOT be decremented if payment fails
        self.mock_inventory.decrement_stock.assert_not_called()
        self.assertFalse(self.order.is_paid)
        self.assertEqual(self.order.status, "DRAFT")

    def test_checkout_payment_gateway_exception_raises_payment_failed_error(self):
        """Test checkout catches network/gateway exceptions and raises PaymentFailedError."""
        self.order.add_item("item-1", price=50.0, quantity=1)
        self.mock_inventory.get_stock.return_value = 10
        # Mock payment gateway raising network/connection error
        self.mock_payment.charge.side_effect = ConnectionError("Network timeout")

        with self.assertRaises(PaymentFailedError) as ctx:
            self.order.checkout()

        self.assertIn("Payment gateway error: Network timeout", str(ctx.exception))
        self.mock_inventory.decrement_stock.assert_not_called()
        self.assertFalse(self.order.is_paid)

    def test_checkout_success(self):
        """Test successful checkout completes payment, decrements stock, and updates order status."""
        self.order.add_item("widget-a", price=60.0, quantity=2) # Total 120 -> 10% discount = 108.0
        self.order.add_item("widget-b", price=20.0, quantity=1) # Total 140 -> 10% discount = 126.0

        # Mock inventory stock availability
        self.mock_inventory.get_stock.side_effect = lambda pid: {"widget-a": 10, "widget-b": 5}[pid]
        # Mock payment success
        self.mock_payment.charge.return_value = True

        result = self.order.checkout()

        # Check return value
        self.assertEqual(result, {"status": "success", "charged_amount": 126.0})

        # Verify inventory get_stock checks
        self.assertEqual(self.mock_inventory.get_stock.call_count, 2)

        # Verify payment gateway called with exact discounted amount
        self.mock_payment.charge.assert_called_once_with(126.0, "USD")

        # Verify inventory stock decremented for both products
        self.mock_inventory.decrement_stock.assert_any_call("widget-a", 2)
        self.mock_inventory.decrement_stock.assert_any_call("widget-b", 1)
        self.assertEqual(self.mock_inventory.decrement_stock.call_count, 2)

        # Verify order state updated
        self.assertTrue(self.order.is_paid)
        self.assertEqual(self.order.status, "COMPLETED")


if __name__ == "__main__":
    unittest.main()
