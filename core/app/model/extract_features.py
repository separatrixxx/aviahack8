import numpy as np
import pandas as pd
import hashlib
from collections import defaultdict
from event import Event

def extract_features_dropouts(events: list[Event]):
    from collections import defaultdict
    import pandas as pd

    visits = defaultdict(lambda: {
        "duration": 0.0,
        "pageviews": 0,
        "unique_pages": set(),
        "scroll_events": 0,
        "goals": 0,
        "http_errors": 0,
        "early_exit": 0,
        "refreshed_pages": 0,
        "back_navigation": 0
    })

    visit_start_time = {}
    last_page_per_visit = {}

    for e in events:
        v = visits[e.visit_id]

        if e.event_type == "visit_start":
            visit_start_time[e.visit_id] = e.timestamp

            v["pageviews"] += 1
            v["unique_pages"].add(e.url)
            last_page_per_visit[e.visit_id] = e.url

        elif e.event_type == "page_view":
            if last_page_per_visit.get(e.visit_id) == e.url:
                v["refreshed_pages"] += 1
            else:
                if e.url in v["unique_pages"]:
                    v["back_navigation"] += 1

            v["pageviews"] += 1
            v["unique_pages"].add(e.url)
            last_page_per_visit[e.visit_id] = e.url

            if e.additional.get("httpError", 0) != 0:
                v["http_errors"] += 1

        elif e.event_type == "goal":
            v["goals"] += 1

        elif e.event_type == "scroll":
            v["scroll_events"] += 1

        elif e.event_type == "visit_end":
            if e.visit_id in visit_start_time:
                v["duration"] = (e.timestamp - visit_start_time[e.visit_id]).total_seconds()

            end_url = e.url
            last_url = last_page_per_visit.get(e.visit_id)

            if last_url != end_url:
                v["pageviews"] += 1
                v["unique_pages"].add(end_url)

                if end_url in v["unique_pages"]:
                    v["back_navigation"] += 1

            v["early_exit"] = 1 if v["pageviews"] <= 1 else 0

            last_page_per_visit[e.visit_id] = end_url

    for v in visits.values():
        v["unique_pages"] = len(v["unique_pages"])

    return pd.DataFrame.from_dict(visits, orient="index").fillna(0)


def url_hash(url: str) -> int:
    """Хешируем URL в число (0..1e9)."""
    return int(hashlib.md5(url.encode()).hexdigest(), 16) % 10**9


def extract_features_click_sequences(events: list[Event]):
    sequences = defaultdict(list)
    events_sorted = sorted(events, key=lambda e: e.timestamp)

    for e in events_sorted:
        if e.event_type == "page_view" and e.visit_id and e.url:
            sequences[e.visit_id].append(url_hash(e.url))

    rows = []
    for vid, seq in sequences.items():
        row = {"visit_id": vid}
        # базовые фичи
        row["total_pageviews"] = len(seq)
        row["unique_pages"] = len(set(seq))

        # считаем переходы, если они есть
        if len(seq) > 1:
            transitions = list(zip(seq, seq[1:]))
            for (a, b) in transitions:
                key = f"{a}_{b}"
                row[key] = row.get(key, 0) + 1
        rows.append(row)

    df = pd.DataFrame(rows).fillna(0).set_index("visit_id")
    return df


def extract_features_form_errors(events: list[Event]):
    visits = defaultdict(lambda: {
        "http_errors": 0,
        "revisits": 0,
        "fast_double_hits": 0,
        "total_pageviews": 0
    })

    last_url = {}
    last_time = {}

    for e in events:
        if e.event_type != "page_view":
            continue
        v = visits[e.visit_id]
        v["total_pageviews"] += 1
        if e.additional.get("httpError", 0):
            v["http_errors"] += 1
        if last_url.get(e.visit_id) == e.url:
            v["revisits"] += 1
        if e.visit_id in last_time and (e.timestamp - last_time[e.visit_id]).total_seconds() < 1:
            v["fast_double_hits"] += 1
        last_url[e.visit_id] = e.url
        last_time[e.visit_id] = e.timestamp
        df = pd.DataFrame.from_dict(visits, orient="index").fillna(0)
    if df.empty:
        df = pd.DataFrame([{"http_errors": 0, "revisits": 0, "fast_double_hits": 0, "total_pageviews": 0}])
    return df



def extract_features_layout(events: list[Event]):
    visits = defaultdict(lambda: {
        "screen_small": 0,
        "rapid_repeat": 0,
        "total_pageviews": 0
    })

    last_time = {}

    for e in events:
        if e.event_type != "page_view":
            continue
        v = visits[e.visit_id]
        v["total_pageviews"] += 1
        if e.device.get("screen_w", 9999) < 400:
            v["screen_small"] += 1
        if e.visit_id in last_time and (e.timestamp - last_time[e.visit_id]).total_seconds() < 1:
            v["rapid_repeat"] += 1
        last_time[e.visit_id] = e.timestamp

    df = pd.DataFrame.from_dict(visits, orient="index").fillna(0)
    if df.empty:
        df = pd.DataFrame([{"screen_small": 0, "rapid_repeat": 0, "total_pageviews": 0}])
    return df