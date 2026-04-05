from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest


MODULE_PATH = Path(__file__).resolve().parents[1] / "app_modules" / "exercise_payloads.py"


def load_module(module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_normalize_generated_exercise_payload_maps_alternate_fields():
    module = load_module("exercise_payloads_alternate")
    try:
        payload = module.normalize_generated_exercise_payload(
            {
                "problem_title": "链表题",
                "problem_description": "题面",
                "starter_code": {
                    "cpp": "int main(){return 0;}",
                    "java": "public class Main{}",
                    "python3": "pass",
                },
                "reference_solutions": {
                    "cpp": "int main(){return 0;}",
                    "java": "public class Main{}",
                    "python": "pass",
                },
                "examples": [
                    {
                        "sampleInput": "1",
                        "output": "1",
                        "label": "样例",
                    }
                ],
                "tips": ["先考虑指针翻转。"],
                "analysis": "从前往后逐步翻转指针。",
                "difficulty": "easy",
            }
        )
        assert payload["title"] == "链表题"
        assert payload["description"]
        assert payload["templates"]["python"] == "pass"
        assert payload["testCases"][0]["expectedOutput"] == "1"
        assert payload["hints"] == ["先考虑指针翻转。"]
        assert payload["explanation"] == "从前往后逐步翻转指针。"
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_fill_blank_payload_maps_blank_items():
    module = load_module("exercise_payloads_fill_blank")
    try:
        payload = module.normalize_generated_fill_blank_payload(
            {
                "problemTitle": "补全链表反转函数",
                "statement": "补全程序中的函数体。",
                "templates": {
                    "cpp": "___FUNC1___",
                },
                "blankItems": [
                    {
                        "key": "FUNC1",
                        "expected_answer": "return head;",
                        "description": "返回反转后的头节点",
                    }
                ],
                "solution_explanation": "先处理空链表，再迭代反转。",
            }
        )
        assert payload["title"] == "补全链表反转函数"
        assert payload["codeTemplate"]["cpp"] == "___FUNC1___"
        assert payload["blanks"][0]["id"] == "FUNC1"
        assert payload["blanks"][0]["answer"] == "return head;"
        assert payload["explanation"] == "先处理空链表，再迭代反转。"
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_exercise_payload_rejects_missing_title():
    module = load_module("exercise_payloads_missing_title")
    try:
        with pytest.raises(ValueError, match="missing title"):
            module.normalize_generated_exercise_payload(
                {
                    "description": "题面",
                    "templates": {"cpp": "int main(){return 0;}"},
                    "testCases": [{"input": "1", "expectedOutput": "1", "description": "样例"}],
                }
            )
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_exercise_rejects_empty_description():
    module = load_module("exercise_payloads_empty_desc")
    try:
        with pytest.raises(ValueError, match="missing description"):
            module.normalize_generated_exercise_payload(
                {
                    "title": "链表题",
                    "description": "",
                    "templates": {"cpp": "int main(){return 0;}"},
                    "testCases": [{"input": "1", "expectedOutput": "1", "description": "样例"}],
                }
            )
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_exercise_rejects_empty_templates():
    module = load_module("exercise_payloads_empty_tpl")
    try:
        with pytest.raises(ValueError, match="missing templates"):
            module.normalize_generated_exercise_payload(
                {
                    "title": "链表题",
                    "description": "题面",
                    "templates": {},
                    "testCases": [{"input": "1", "expectedOutput": "1", "description": "样例"}],
                }
            )
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_exercise_rejects_empty_test_cases():
    module = load_module("exercise_payloads_empty_tc")
    try:
        with pytest.raises(ValueError, match="missing test cases"):
            module.normalize_generated_exercise_payload(
                {
                    "title": "链表题",
                    "description": "题面",
                    "templates": {"cpp": "int main(){return 0;}"},
                    "testCases": [{"noInput": "x", "noOutput": "y"}],
                }
            )
    finally:
        sys.modules.pop(module.__name__, None)


def test_normalize_generated_fill_blank_rejects_missing_code_template():
    module = load_module("exercise_payloads_empty_code_tpl")
    try:
        with pytest.raises(ValueError, match="missing code template"):
            module.normalize_generated_fill_blank_payload(
                {
                    "title": "补全函数",
                    "description": "补全程序。",
                    "codeTemplate": {},
                    "blankItems": [
                        {"key": "FUNC1", "expected_answer": "return head;", "description": "返回头节点"}
                    ],
                }
            )
    finally:
        sys.modules.pop(module.__name__, None)
