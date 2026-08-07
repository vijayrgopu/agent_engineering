# Class 3 — WidgetWare SDR Context Package

This repository contains the complete Class 3 implementation for the WidgetWare SDR Context Package.

## 1. Project Overview

The Class 3 Context Package converts WidgetWare's business domain rules, product catalog, Ideal Customer Profile (ICP), safety boundaries, and evidence classifications into a structured, testable, 5-layer context dict designed for consumption by a future AI SDR agent.

---

## 2. The 5 Context Layers

1. **`system_instructions`**: Stable, non-overridable behavioral instructions and rules for the SDR agent (from `src/widgetware_sdr/instructions.py`).
2. **`business_context`**: Stable domain configuration files loaded dynamically from `config/`:
   - `products.yaml`: WidgetWare product offerings, target buyers, approved claims.
   - `icp.yaml`: Target manufacturing fit dimensions, company size thresholds, regions, buying signals.
   - `policies.yaml`: Evidence classifications, prohibited actions, human approval boundaries.
3. **`task_context`**: Current assignment details (`account` data and research `objective`). Account notes are treated strictly as untrusted task data.
4. **`retrieved_evidence`**: Evidence claims supplied with full provenance (`claim`, `classification`, `source.name`, `source.url`, `retrieved_at`, `excerpt`).
5. **`state`**: Execution state tracking object (defaults to `{}`).

---

## 3. Package Structure

```text
my-work/class-03/
├── README.md
├── SPEC.md
├── LAB.md
├── pyproject.toml
├── .env.example
├── config/
│   ├── products.yaml
│   ├── icp.yaml
│   └── policies.yaml
├── docs/
│   ├── widgetware-business-brief.md
│   └── acceptance-criteria.md
├── src/
│   └── widgetware_sdr/
│       ├── __init__.py
│       ├── instructions.py
│       └── context_builder.py
└── tests/
    ├── unit/
    │   ├── test_starter.py
    │   └── test_context_builder.py
    └── scenarios/
        ├── qualified_account.yaml
        ├── unqualified_account.yaml
        ├── insufficient_evidence.yaml
        └── prompt_injection.yaml
```

---

## 4. Setup and Verification

### Environment Setup

From this directory (`my-work/class-03`):

```bash
python -m pip install -e ".[dev]"
```

### Running Automated Tests

Run the full pytest suite:

```bash
python -m pytest -v
```

---

## 5. Important Boundaries

Class 3 strictly enforces:
- No Google ADK agent framework dependencies.
- No Gemini or LLM API calls.
- No live web research or scraping.
- No email or social-message delivery.
- No CRM integration or database persistence.
- Pure, deterministic Python and YAML execution.
