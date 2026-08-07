"""Context builder module for WidgetWare SDR context package."""

import copy
from pathlib import Path
from typing import Any

import yaml

from widgetware_sdr.instructions import get_system_instructions


def _find_config_dir(custom_path: str | Path | None = None) -> Path:
    """Locate the config directory reliably."""
    if custom_path is not None:
        p = Path(custom_path)
        if p.exists() and p.is_dir():
            return p
        raise FileNotFoundError(f"Specified configuration directory does not exist: {custom_path}")

    # Check cwd / config
    cwd_config = Path.cwd() / "config"
    if cwd_config.exists() and cwd_config.is_dir():
        return cwd_config

    # Check relative to module path (src/widgetware_sdr/../../config)
    pkg_config = Path(__file__).resolve().parent.parent.parent / "config"
    if pkg_config.exists() and pkg_config.is_dir():
        return pkg_config

    raise FileNotFoundError("Required configuration directory 'config/' could not be located.")


def load_config_files(config_dir: str | Path | None = None) -> dict[str, Any]:
    """Load and parse products.yaml, icp.yaml, and policies.yaml.

    Raises FileNotFoundError if any required configuration file is missing.
    """
    base_dir = _find_config_dir(config_dir)

    required_files = {
        "products": base_dir / "products.yaml",
        "icp": base_dir / "icp.yaml",
        "policies": base_dir / "policies.yaml",
    }

    loaded_config: dict[str, Any] = {}

    for key, file_path in required_files.items():
        if not file_path.exists():
            raise FileNotFoundError(
                f"Required configuration file '{key}.yaml' missing at {file_path}"
            )
        with open(file_path, "r", encoding="utf-8") as f:
            content = yaml.safe_load(f)
            if content is None:
                content = {}
            loaded_config[key] = content

    return loaded_config


def build_context(
    account: dict[str, Any],
    objective: str,
    evidence: list[dict[str, Any]],
    state: dict[str, Any] | None = None,
    config_dir: str | Path | None = None,
) -> dict[str, Any]:
    """Build and return the 5-layer context dictionary.

    Layers:
    1. system_instructions: Stable system prompt string
    2. business_context: products, icp, policies from YAML
    3. task_context: account and objective (untrusted task data)
    4. retrieved_evidence: list of evidence dicts with provenance preserved
    5. state: execution workflow state (defaults to empty dict)

    Input objects are deep-copied to prevent mutation.
    """
    # Prevent mutation of caller objects
    account_copy = copy.deepcopy(account)
    evidence_copy = copy.deepcopy(evidence)
    state_copy = copy.deepcopy(state) if state is not None else {}

    # Load business configuration
    business_config = load_config_files(config_dir)

    # Fetch system instructions
    instructions_text = get_system_instructions()

    # Construct the 5-layer context
    context = {
        "system_instructions": instructions_text,
        "business_context": business_config,
        "task_context": {
            "account": account_copy,
            "objective": objective,
        },
        "retrieved_evidence": evidence_copy,
        "state": state_copy,
    }

    return context
