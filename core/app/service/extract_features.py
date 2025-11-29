from app.dto.event_dto import Event
from collections import defaultdict
import pandas as pd

def extract_features_dropouts(events: list[Event]):
    visits = defaultdict(lambda: {
        "duration": 0.0,
        "pageviews": 0,
        "unique_pages": set(),
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

        elif e.event_type == "visit_end":
            if e.visit_id in visit_start_time:
                v["duration"] = (e.timestamp - visit_start_time[e.visit_id]).total_seconds()

            end_url = e.url
            last_url = last_page_per_visit.get(e.visit_id)
            
            pageviews_real = e.additional.get("pageViews", 0)
            already_counted = v["pageviews"]
            v["pageviews"] += max(0, pageviews_real - already_counted)

            if last_url != end_url and end_url in v["unique_pages"]:
                v["back_navigation"] += 1

            v["early_exit"] = 1 if v["pageviews"] <= 1 else 0

            last_page_per_visit[e.visit_id] = end_url

    for v in visits.values():
        v["unique_pages"] = len(v["unique_pages"])

    return pd.DataFrame.from_dict(visits, orient="index").fillna(0)