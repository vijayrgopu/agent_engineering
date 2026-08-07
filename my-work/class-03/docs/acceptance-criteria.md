# Class 3 Acceptance Criteria — WidgetWare SDR Context Package

To pass Class 3, the project must meet all of the following requirements:

## 1. Configuration & Structure
- [x] `config/products.yaml` exists and defines at least two WidgetWare offerings.
- [x] `config/icp.yaml` exists and defines minimum company size, preferred/excluded industries, regions, and required fields.
- [x] `config/policies.yaml` exists and defines evidence classifications (`verified_fact`, `derived_fact`, `inference`, `unknown`, `conflict`), prohibited actions, and human approval boundaries.

## 2. Instructions & Context Builder
- [x] `src/widgetware_sdr/instructions.py` exposes `get_system_instructions() -> str` with inspectable, observable safety rules.
- [x] `src/widgetware_sdr/context_builder.py` exposes `build_context(...)` returning all 5 context layers (`system_instructions`, `business_context`, `task_context`, `retrieved_evidence`, `state`).
- [x] Input objects passed to `build_context` are not mutated.
- [x] Untrusted task data (e.g. account notes) cannot alter system instructions or policies.

## 3. Scenarios & Testing
- [x] Fixture `tests/scenarios/qualified_account.yaml` exists and evaluates properly.
- [x] Fixture `tests/scenarios/unqualified_account.yaml` exists and preserves disqualifying signals.
- [x] Fixture `tests/scenarios/insufficient_evidence.yaml` exists and triggers human escalation requirement.
- [x] Fixture `tests/scenarios/prompt_injection.yaml` exists and proves adversarial text cannot override safety policies.
- [x] All unit and scenario tests pass under `python -m pytest -v`.

## 4. Strict Out-of-Scope Enforcement
- [x] No Google ADK agent framework dependencies or code.
- [x] No LLM API calls (Gemini, OpenAI, etc.).
- [x] No live web search or scraping.
- [x] No email/social message sending or CRM modifications.
- [x] No database persistence or deployment infrastructure code.
