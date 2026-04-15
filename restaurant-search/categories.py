"""카테고리 매핑 모듈 — categories.json 기반."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Category:
    key: str
    label_ja: str
    label_kr: str
    code: str


def _load_categories() -> dict[str, Category]:
    path = Path(__file__).parent / "categories.json"
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return {item["key"]: Category(**item) for item in data}


CATEGORIES: dict[str, Category] = _load_categories()


def get_category_code(key: str) -> str:
    return CATEGORIES[key].code


def get_category_label(key: str) -> str:
    return CATEGORIES[key].label_ja


def list_categories() -> str:
    lines = []
    for cat in CATEGORIES.values():
        lines.append(f"  {cat.key:<15} {cat.label_ja} ({cat.label_kr})")
    return "\n".join(lines)
