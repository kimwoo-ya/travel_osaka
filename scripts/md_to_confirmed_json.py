#!/usr/bin/env python3
"""Obsidian 마크다운 (숙소 정보.md 형식) → 확정 일정 JSON 변환 스크립트.

Usage:
    python3 md_to_confirmed_json.py --input "숙소 정보.md" --output itinerary.json
"""

import argparse
import json
import re
import sys
from typing import Any


def parse_date_from_heading(heading: str) -> tuple[str, int, str]:
    """### [2026-05-15(금)] 오사카 Day 1 로컬 체험 데이 → (date, dayNumber, title)"""
    m = re.match(r'###\s*\[(\d{4}-\d{2}-\d{2})\([^)]+\)\]\s*(.+)', heading.strip())
    if not m:
        return '', 0, heading.strip()
    date_str = m.group(1)
    rest = m.group(2).strip()
    day_m = re.search(r'Day\s*(\d+)', rest, re.IGNORECASE)
    day_num = int(day_m.group(1)) if day_m else 0
    return date_str, day_num, rest


def parse_slot_line(line: str) -> dict[str, Any] | None:
    """- **12:00~13:00** [場所名](url) ★3.50(1,956) [카테고리] · 메모"""
    line = line.strip()
    if not line.startswith('- **') and not line.startswith('- ~~**'):
        return None
    # Skip strikethrough lines
    if line.startswith('- ~~'):
        return None

    slot: dict[str, Any] = {}

    # Time
    time_m = re.search(r'\*\*(\d{1,2}:\d{2}[~～\-]\S*)\*\*', line)
    if not time_m:
        return None
    slot['time'] = time_m.group(1)

    # Place name - first markdown link text or bracketed text after time
    place_m = re.search(r'\[([^\]]+)\]\(([^)]+)\)', line)
    if place_m:
        slot['place'] = place_m.group(1).strip()
        url = place_m.group(2).strip()
        if 'google.com/maps' in url or 'maps.app.goo.gl' in url:
            slot['mapUrl'] = url
    else:
        # Try plain text after time
        after_time = line[time_m.end():]
        text_m = re.match(r'\s*(.+?)(?:\s*[·\|]|$)', after_time)
        if text_m:
            slot['place'] = text_m.group(1).strip()

    if not slot.get('place'):
        return None

    # Tabelog score: ★3.50(1,956)
    tabelog_m = re.search(r'★(\d+\.\d+)\(([0-9,]+)\)', line)
    if tabelog_m:
        slot['restaurant'] = {
            'tabelog': float(tabelog_m.group(1)),
            'reviews': int(tabelog_m.group(2).replace(',', '')),
        }

    # Category: [카테고리]
    cats = re.findall(r'\[([^\]]+)\]', line)
    # Filter out URLs and place names
    for cat in cats:
        if 'http' not in cat and cat != slot.get('place', ''):
            slot['category'] = cat
            break

    # Price: ¥ or ~¥
    price_m = re.search(r'[¥￥][0-9,~～\-]+', line)
    if price_m and slot.get('restaurant'):
        slot['restaurant']['price'] = price_m.group(0)

    # Note: text after · (center dot)
    note_parts = re.split(r'\s*[·]\s*', line)
    if len(note_parts) > 1:
        last = note_parts[-1].strip()
        # Clean up markdown artifacts
        last = re.sub(r'\[.*?\]\(.*?\)', '', last).strip()
        last = re.sub(r'★\d+\.\d+\([^)]+\)', '', last).strip()
        if last and last != slot.get('category', ''):
            slot['note'] = last

    return slot


def parse_markdown(text: str) -> dict[str, Any]:
    """Parse Obsidian markdown into ConfirmedItinerary JSON structure."""
    lines = text.split('\n')
    itinerary: dict[str, Any] = {
        'title': '',
        'startDate': '',
        'endDate': '',
        'days': [],
    }

    current_day: dict[str, Any] | None = None

    for line in lines:
        stripped = line.strip()

        # Day heading
        if stripped.startswith('### ['):
            if current_day:
                itinerary['days'].append(current_day)
            date_str, day_num, title = parse_date_from_heading(stripped)
            current_day = {
                'date': date_str,
                'dayNumber': day_num if day_num > 0 else len(itinerary['days']) + 1,
                'title': title,
                'slots': [],
            }

            # Extract route from next part of heading (after title)
            # Route is typically: 스미요시타이샤 → 신세카이 → 스파월드
            route_m = re.search(r'\n(.+→.+)', stripped)
            if route_m:
                current_day['route'] = route_m.group(1).strip()

            continue

        if not current_day:
            continue

        # Route line (line right after heading, contains →)
        if '→' in stripped and not stripped.startswith('- ') and not current_day.get('route'):
            # Split route and transport
            parts = stripped.split('·')
            current_day['route'] = parts[0].strip()
            if len(parts) > 1:
                # Look for transport info
                for p in parts[1:]:
                    p = p.strip()
                    if '券' in p or 'パス' in p or 'ICOCA' in p or '패스' in p or '1일권' in p:
                        current_day['transport'] = p
            continue

        # Accommodation line
        if '호텔 체크인' in stripped.lower() or '체크인' in stripped.lower():
            hotel_m = re.search(r'\[([^\]]+호텔[^\]]*)\]', stripped)
            if not hotel_m:
                hotel_m = re.search(r'\[([^\]]+)\]\(([^)]*agoda[^)]*)\)', stripped)
            if hotel_m:
                acc: dict[str, str] = {'name': hotel_m.group(1)}
                url_m = re.search(r'\((https?://[^)]+)\)', stripped)
                if url_m:
                    acc['bookingUrl'] = url_m.group(1)
                current_day['accommodation'] = acc
            continue

        # Slot line
        slot = parse_slot_line(stripped)
        if slot:
            current_day['slots'].append(slot)

    # Last day
    if current_day:
        itinerary['days'].append(current_day)

    # Set dates
    if itinerary['days']:
        itinerary['startDate'] = itinerary['days'][0].get('date', '')
        itinerary['endDate'] = itinerary['days'][-1].get('date', '')
        itinerary['title'] = '오사카·교토 여행'

    return itinerary


def main() -> None:
    parser = argparse.ArgumentParser(description='Obsidian 마크다운 → 확정 일정 JSON 변환')
    parser.add_argument('--input', '-i', required=True, help='입력 마크다운 파일 경로')
    parser.add_argument('--output', '-o', required=True, help='출력 JSON 파일 경로')
    args = parser.parse_args()

    with open(args.input, encoding='utf-8') as f:
        md_text = f.read()

    itinerary = parse_markdown(md_text)

    if not itinerary['days']:
        print('경고: 파싱된 일정이 없습니다.', file=sys.stderr)
        sys.exit(1)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(itinerary, f, ensure_ascii=False, indent=2)

    print(f'변환 완료: {len(itinerary["days"])}일 일정 → {args.output}')


if __name__ == '__main__':
    main()
