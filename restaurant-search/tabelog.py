"""tabelog 검색 결과 스크래핑 모듈."""

from __future__ import annotations

import re
import time
from collections.abc import Callable
from dataclasses import dataclass

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://tabelog.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ja,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

REQUEST_DELAY = 3.0
MAX_RETRIES = 3
MAX_PAGES = 3


@dataclass
class Restaurant:
    name_ja: str
    name_kr: str
    category: str
    rating: float | None
    review_count: int
    price_lunch: str
    price_dinner: str
    url: str
    area_detail: str
    map_query: str

    @property
    def is_strong_recommend(self) -> bool:
        if self.rating is None:
            return False
        return self.rating >= 3.4 and self.review_count >= 800


def _fetch(url: str, params: dict) -> requests.Response | None:
    """HTTP GET with exponential backoff retry."""
    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            return resp
        except requests.RequestException as e:
            if attempt < MAX_RETRIES - 1:
                wait = REQUEST_DELAY * (attempt + 1)
                print(f"    [RETRY] {attempt+1}/{MAX_RETRIES} — {wait:.0f}s 후 재시도: {e}")
                time.sleep(wait)
            else:
                print(f"    [ERROR] {MAX_RETRIES}회 시도 실패: {e}")
                return None
    return None


def _build_url(prefecture: str, page: int, category_code: str = "") -> str:
    """tabelog 검색 URL을 생성한다."""
    if category_code:
        if page == 1:
            return f"{BASE_URL}/{prefecture}/rstLst/{category_code}/"
        return f"{BASE_URL}/{prefecture}/rstLst/{category_code}/{page}/"
    if page == 1:
        return f"{BASE_URL}/{prefecture}/rstLst/"
    return f"{BASE_URL}/{prefecture}/rstLst/{page}/"


def search(
    keyword: str,
    prefecture: str = "osaka",
    area_label: str = "",
    min_score: float = 3.0,
    min_reviews: int = 400,
    *,
    max_pages: int | None = None,
    limit: int | None = None,
    category_code: str = "",
    on_progress: Callable[[int, int, int], None] | None = None,
) -> list[Restaurant]:
    """tabelog에서 검색 결과를 수집한다."""
    results = []
    seen_urls: set[str] = set()
    effective_max_pages = max_pages if max_pages is not None else MAX_PAGES

    for page in range(1, effective_max_pages + 1):
        page_url = _build_url(prefecture, page, category_code)

        resp = _fetch(page_url, {"sw": keyword})
        if resp is None:
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        items = soup.select(".list-rst")

        if not items:
            break

        for item in items:
            try:
                r = _parse_item(item, area_label)
                if r is None:
                    continue
                if r.rating is not None and r.rating < min_score:
                    continue
                if r.rating is None and min_score > 0:
                    continue
                if r.review_count < min_reviews:
                    continue
                if r.url in seen_urls:
                    continue
                seen_urls.add(r.url)
                results.append(r)
                if limit and len(results) >= limit:
                    break
            except Exception:
                continue

        if on_progress:
            on_progress(page, effective_max_pages, len(results))

        if limit and len(results) >= limit:
            break

        time.sleep(REQUEST_DELAY)

    return results


def _parse_item(item, area_label: str) -> Restaurant | None:
    name_el = (
        item.select_one(".list-rst__rst-name-target")
        or item.select_one(".list-rst__rst-name a")
    )
    if not name_el:
        return None
    name_ja = name_el.get_text(strip=True)
    url = name_el.get("href", "")

    area_genre_el = item.select_one(".list-rst__area-genre")
    area_detail = ""
    category = ""
    if area_genre_el:
        text = area_genre_el.get_text(strip=True)
        if "/" in text:
            parts = text.split("/", 1)
            area_detail = parts[0].strip()
            category = parts[1].strip()
        else:
            area_detail = text

    rating_el = item.select_one(".c-rating__val")
    if not rating_el:
        return None
    rating_text = rating_el.get_text(strip=True)
    rating: float | None = None
    if rating_text and rating_text != "-":
        rating = float(rating_text)

    review_el = item.select_one(".list-rst__rvw-count-num")
    review_count = 0
    if review_el:
        text = review_el.get_text().replace(",", "")
        nums = re.findall(r"\d+", text)
        if nums:
            review_count = int(nums[0])

    price_lunch = ""
    price_dinner = ""
    for i, el in enumerate(item.select(".c-rating-v3__val")):
        text = el.get_text(strip=True)
        if text and text != "-":
            if i == 0:
                price_dinner = text
            elif i == 1:
                price_lunch = text

    return Restaurant(
        name_ja=name_ja,
        name_kr=name_ja,
        category=category,
        rating=rating,
        review_count=review_count,
        price_lunch=price_lunch,
        price_dinner=price_dinner,
        url=url,
        area_detail=area_detail,
        map_query=f"{name_ja} {area_label}",
    )
