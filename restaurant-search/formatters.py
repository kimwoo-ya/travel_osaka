"""출력 포매터 모듈 — CSV, JSON, 터미널 테이블."""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime
from pathlib import Path

from tabulate import tabulate as tabulate_fn

from tabelog import Restaurant


def _to_row(r: Restaurant) -> dict:
    return {
        "name": r.name_kr,
        "nameJa": r.name_ja,
        "category": r.category,
        "area": r.area_detail,
        "tabelog": f"{r.rating:.2f}" if r.rating is not None else "-",
        "reviews": r.review_count,
        "price": r.price_lunch or r.price_dinner or "미확인",
        "tabelogUrl": r.url,
    }


def format_csv(results: list[Restaurant]) -> None:
    if not results:
        print("검색 결과가 없습니다.", file=sys.stderr)
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = Path.cwd() / f"results_{timestamp}.csv"
    headers = ["name", "nameJa", "category", "area", "tabelog", "reviews", "price", "tabelogUrl"]

    with open(out_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for r in results:
            writer.writerow(_to_row(r))

    print(f"결과 저장: {out_path} ({len(results)}건)", file=sys.stderr)


def format_json(results: list[Restaurant]) -> None:
    if not results:
        print("검색 결과가 없습니다.", file=sys.stderr)
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_path = Path.cwd() / f"results_{timestamp}.json"

    data = []
    for r in results:
        data.append({
            "name": r.name_kr,
            "nameJa": r.name_ja,
            "category": r.category,
            "area": r.area_detail,
            "rating": r.rating,
            "reviews": r.review_count,
            "priceLunch": r.price_lunch or None,
            "priceDinner": r.price_dinner or None,
            "url": r.url,
        })

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"결과 저장: {out_path} ({len(results)}건)", file=sys.stderr)


def _truncate(text: str, max_len: int) -> str:
    if len(text) <= max_len:
        return text
    return text[: max_len - 1] + "…"


def format_table(results: list[Restaurant]) -> None:
    if not results:
        print("검색 결과가 없습니다.", file=sys.stderr)
        return

    rows = []
    for r in results:
        rows.append([
            _truncate(r.name_ja, 30),
            _truncate(r.category, 15),
            _truncate(r.area_detail, 15),
            f"{r.rating:.2f}" if r.rating is not None else "-",
            r.review_count,
            _truncate(r.price_lunch or r.price_dinner or "미확인", 20),
        ])

    headers = ["가게명", "카테고리", "지역", "평점", "리뷰", "가격"]
    print(tabulate_fn(rows, headers=headers, tablefmt="simple"))
    print(f"\n총 {len(results)}건", file=sys.stderr)
