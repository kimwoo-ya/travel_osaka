#!/usr/bin/env python3
"""범용 tabelog 검색 CLI — restaurant-search v2."""

from __future__ import annotations

import argparse
import sys

from categories import CATEGORIES, get_category_label, list_categories
from formatters import format_csv, format_json, format_table
from tabelog import search


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="tabelog 기반 식당 검색 도구",
        epilog=(
            "사용 예시:\n"
            '  python search.py --area "道頓堀" --category ramen --score 3.0\n'
            '  python search.py --area "梅田" --reviews 200 --format table\n'
            '  python search.py --area "京都駅" --limit 10 --format json\n'
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--area", required=True, help="검색 지역명 (일본어, 필수)")
    parser.add_argument("--category", default=None, help=f"카테고리 키워드 (사용 가능: {', '.join(CATEGORIES.keys())})")
    parser.add_argument("--score", type=float, default=0.0, help="최소 tabelog 평점 (기본: 0.0)")
    parser.add_argument("--reviews", type=int, default=0, help="최소 리뷰수 (기본: 0)")
    parser.add_argument("--pages", type=int, default=3, help="최대 페이지수 (기본: 3, 범위: 1~20)")
    parser.add_argument("--limit", type=int, default=20, help="최대 결과수 (기본: 20, 범위: 1~100)")
    parser.add_argument("--format", choices=["csv", "json", "table"], default="csv", help="출력 형식 (기본: csv)")
    return parser


def validate_args(args: argparse.Namespace) -> None:
    if args.category and args.category not in CATEGORIES:
        print(f"알 수 없는 카테고리: {args.category}", file=sys.stderr)
        print(f"사용 가능한 카테고리:\n{list_categories()}", file=sys.stderr)
        sys.exit(1)

    if not 0.0 <= args.score <= 5.0:
        print("--score는 0.0~5.0 범위입니다.", file=sys.stderr)
        sys.exit(1)

    if args.reviews < 0:
        print("--reviews는 0 이상이어야 합니다.", file=sys.stderr)
        sys.exit(1)

    if not 1 <= args.pages <= 20:
        print("--pages는 1~20 범위입니다.", file=sys.stderr)
        sys.exit(1)

    if not 1 <= args.limit <= 100:
        print("--limit는 1~100 범위입니다.", file=sys.stderr)
        sys.exit(1)


def progress_callback(page: int, total: int, count: int) -> None:
    print(f"  [{page}/{total}] {count}건 수집 중...", file=sys.stderr)


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    validate_args(args)

    keyword = args.area
    if args.category:
        keyword = f"{args.area} {get_category_label(args.category)}"

    results = search(
        keyword=keyword,
        min_score=args.score,
        min_reviews=args.reviews,
        max_pages=args.pages,
        limit=args.limit,
        on_progress=progress_callback,
    )

    results.sort(key=lambda r: (
        -(r.rating if r.rating is not None else -1),
        -r.review_count,
    ))

    if not results:
        print("검색 결과가 없습니다.", file=sys.stderr)
        sys.exit(0)

    if args.format == "csv":
        format_csv(results)
    elif args.format == "json":
        format_json(results)
    elif args.format == "table":
        format_table(results)


if __name__ == "__main__":
    main()
