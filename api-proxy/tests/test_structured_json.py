from __future__ import annotations

import importlib.util
import sys
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "app_modules" / "structured_json.py"


def load_module(module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_parse_structured_json_object_accepts_markdown_code_fences():
    module = load_module(f"structured_json_markdown_{len(sys.modules)}")
    try:
      parsed = module.parse_structured_json_object(
          """```json
{"title":"链表题","description":"题面"}
```"""
      )
      assert parsed["title"] == "链表题"
      assert parsed["description"] == "题面"
    finally:
      sys.modules.pop(module.__name__, None)


def test_parse_structured_json_object_repairs_raw_newlines_inside_strings():
    module = load_module(f"structured_json_newlines_{len(sys.modules)}")
    try:
      parsed = module.parse_structured_json_object(
          '{"title":"链表题","description":"第一行\n第二行","difficulty":"easy"}'
      )
      assert parsed["description"] == "第一行\n第二行"
      assert parsed["difficulty"] == "easy"
    finally:
      sys.modules.pop(module.__name__, None)
