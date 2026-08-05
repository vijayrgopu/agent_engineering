"""
Automated pytest test suite for GCP TechCon 2026 Flask Web Application.
Tests HTTP routes, talk requirements (8 total, max 2 speakers), 60-min lunch break, category filtering, and search functionality.
"""

import pytest
from app import app
from data import TALKS, BREAKS, CONFERENCE_INFO

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_home_page_status(client):
    """Test home page loads successfully (HTTP 200)."""
    response = client.get("/")
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "GCP TechCon 2026" in html
    assert "Google Developer Center" in html
    assert "60-Minute Lunch & Networking Break" in html


def test_talk_count():
    """Requirement 2: Ensure there are 10 talks in total."""
    assert len(TALKS) == 10


def test_speaker_constraints():
    """
    Requirement 3 & 5:
    - Each talk must have 1 or 2 max speakers.
    - Each speaker must have First Name, Last Name, and LinkedIn URL.
    """
    for talk in TALKS:
        speakers = talk.get("speakers", [])
        assert 1 <= len(speakers) <= 2, f"Talk ID {talk['id']} has invalid speaker count: {len(speakers)}"
        
        for s in speakers:
            assert "first_name" in s and s["first_name"], f"Missing first_name in talk {talk['id']}"
            assert "last_name" in s and s["last_name"], f"Missing last_name in talk {talk['id']}"
            assert "linkedin" in s and s["linkedin"].startswith("http"), f"Invalid linkedin in talk {talk['id']}"


def test_talk_schema():
    """
    Requirement 4: Each talk has ID, Title, Speakers, Category (1 or 2), Description, and Time.
    """
    for talk in TALKS:
        assert "id" in talk
        assert "title" in talk and talk["title"]
        assert "category_id" in talk and talk["category_id"] in [1, 2]
        assert "description" in talk and talk["description"]
        assert "time" in talk and talk["time"]


def test_lunch_break_60_minutes():
    """Requirement 7: Give a lunch break of 60 minutes."""
    lunch_break = next((b for b in BREAKS if b.get("is_lunch")), None)
    assert lunch_break is not None, "Lunch break missing from schedule"
    assert "60 mins" in lunch_break.get("duration", ""), "Lunch break must be 60 minutes"


def test_api_info(client):
    """Test metadata API endpoint."""
    res = client.get("/api/info")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["total_talks"] == 10
    assert data["lunch_duration_minutes"] == 60


def test_api_talks_search_by_title(client):
    """Requirement 6: Test search by title."""
    res = client.get("/api/talks?q=Vertex")
    assert res.status_code == 200
    data = res.get_json()
    assert data["count"] >= 1
    assert "Vertex AI" in data["talks"][0]["title"]


def test_api_talks_search_by_speaker(client):
    """Requirement 6: Test search by speaker name."""
    res = client.get("/api/talks?q=Maya")
    assert res.status_code == 200
    data = res.get_json()
    assert data["count"] >= 1
    assert any(s["first_name"] == "Maya" for s in data["talks"][0]["speakers"])


def test_api_talks_filter_by_category(client):
    """Requirement 6: Test filter by category ID."""
    res_cat1 = client.get("/api/talks?category=1")
    assert res_cat1.status_code == 200
    data1 = res_cat1.get_json()
    assert all(t["category_id"] == 1 for t in data1["talks"])

    res_cat2 = client.get("/api/talks?category=2")
    assert res_cat2.status_code == 200
    data2 = res_cat2.get_json()
    assert all(t["category_id"] == 2 for t in data2["talks"])


def test_api_single_talk_detail(client):
    """Test API endpoint for retrieving a single talk by ID."""
    res = client.get("/api/talks/1")
    assert res.status_code == 200
    data = res.get_json()
    assert data["talk"]["id"] == 1
    assert data["talk"]["title"].startswith("Keynote")

    res_404 = client.get("/api/talks/999")
    assert res_404.status_code == 404
