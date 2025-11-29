import ast
import pandas as pd
import numpy as np
from app.dto.event_dto import Event

def safe_parse_list(x):
    if isinstance(x, list):
        return x
    if pd.isna(x):
        return []
    try:
        return ast.literal_eval(x)
    except Exception:
        return []
    
def dict_to_event(d: dict) -> Event:
    return Event(
        event_type=d["event_type"],
        timestamp=d["timestamp"],
        visit_id=d["visit_id"],
        client_id=d["client_id"],
        url=d["url"],
        referer=d["referer"],
        device=d["device"],
        geo=d["geo"],
        traffic=d["traffic"],
        additional=d["additional"]
    )

def normalize_watchid(val):
    if pd.isna(val):
        return None
    try:
        if isinstance(val, (list, tuple)):
            val = val[0] if len(val) else None
        if val is None:
            return None
        if isinstance(val, str):
            s = val.strip()
            try:
                f = float(s)
                i = int(f)
                return str(i)
            except Exception:
                return s
        if isinstance(val, float):
            if np.isnan(val):
                return None
            return str(int(val))
        if isinstance(val, (int, np.integer)):
            return str(int(val))
        return str(val)
    except Exception:
        return None

def load_data():
    visits = pd.read_parquet("app/data/2024_visits.parquet")
    hits = pd.read_parquet("app/data/2024_hits.parquet")

    if "ym:s:goalsID" in visits.columns:
        visits["ym:s:goalsID"] = visits["ym:s:goalsID"].apply(safe_parse_list)

    if "ym:pv:goalsID" in hits.columns:
        hits["ym:pv:goalsID"] = hits["ym:pv:goalsID"].apply(safe_parse_list)

    visits["ym:s:watchIDs"] = visits["ym:s:watchIDs"].apply(safe_parse_list)

    watch_to_visit = {}
    missing_watch_counts = 0
    for _, row in visits.iterrows():
        visit_id = row["ym:s:visitID"]
        watch_ids = row["ym:s:watchIDs"]
        if not watch_ids:
            continue
        for wid in watch_ids:
            nid = normalize_watchid(wid)
            if nid is None:
                missing_watch_counts += 1
                continue
            watch_to_visit[nid] = str(visit_id)

    print(f"Mapped watchIDs -> visitIDs: {len(watch_to_visit)} entries, skipped {missing_watch_counts} bad watchIDs")

    if "ym:pv:watchID" not in hits.columns:
        raise RuntimeError("hits does not contain ym:pv:watchID column")

    hits["_norm_watchID"] = hits["ym:pv:watchID"].apply(normalize_watchid)

    n_total_hits = len(hits)
    n_with_norm = hits["_norm_watchID"].notna().sum()
    print(f"Hits with normalized watchID: {n_with_norm} / {n_total_hits}")

    hits["visitID"] = hits["_norm_watchID"].map(watch_to_visit)

    n_mapped = hits["visitID"].notna().sum()
    print(f"Hits successfully mapped to visitID: {n_mapped} / {n_total_hits}")

    unmapped = hits[hits["visitID"].isna()]

    if len(unmapped) > 0:
        def normalize_more(x):
            if pd.isna(x):
                return None
            s = str(x).strip().strip("'\"")
            try:
                return str(int(float(s)))
            except Exception:
                return s
        hits["_norm_watchID2"] = hits["ym:pv:watchID"].apply(normalize_more)
        hits["visitID_2"] = hits["_norm_watchID2"].map(watch_to_visit)
        n_mapped2 = hits["visitID_2"].notna().sum()
        if n_mapped2 > 0:
            print(f"Second-pass mapping found additional {n_mapped2} hits.")
            hits["visitID"] = hits["visitID"].fillna(hits["visitID_2"])

    still_unmapped = hits["visitID"].isna().sum()
    print("Hits still unmapped (will be dropped):", still_unmapped)
    hits = hits.dropna(subset=["visitID"]).copy()
    print("After dropping unmapped, hits rows =", len(hits))

    if "ym:pv:isPageView" in hits.columns:
        hits["ym:pv:isPageView"] = pd.to_numeric(hits["ym:pv:isPageView"], errors="coerce").fillna(0)
        before = len(hits)
        hits = hits[hits["ym:pv:isPageView"] == 1].copy()
        after = len(hits)
        print(f"Filtered hits to isPageView==1: {before} -> {after}")

    visit_events = []
    for _, v in visits.iterrows():
        visit_id = str(v["ym:s:visitID"])
        visit_events.append({
            "event_type": "visit_start",
            "timestamp": pd.to_datetime(v["ym:s:dateTime"]),
            "visit_id": visit_id,
            "client_id": str(v.get("ym:s:clientID","")),
            "url": v.get("ym:s:startURL"),
            "referer": v.get("ym:s:referer"),
            "device": {
                "os": v.get("ym:s:operatingSystem"),
                "browser": v.get("ym:s:browser"),
                "device_category": v.get("ym:s:deviceCategory"),
                "screen_w": v.get("ym:s:screenWidth"),
                "screen_h": v.get("ym:s:screenHeight"),
            },
            "geo": {
                "country": v.get("ym:s:regionCountry"),
                "city": v.get("ym:s:regionCity")
            },
            "traffic": {
                "source": v.get("ym:s:lastsignTrafficSource"),
                "utm_source": v.get("ym:s:lastsignUTMSource"),
                "utm_campaign": v.get("ym:s:lastsignUTMCampaign")
            },
            "additional": {}
        })

        visit_events.append({
            "event_type": "visit_end",
            "timestamp": pd.to_datetime(v["ym:s:dateTime"]) + pd.to_timedelta(v["ym:s:visitDuration"], unit="s"),
            "visit_id": visit_id,
            "client_id": str(v.get("ym:s:clientID","")),
            "url": v.get("ym:s:endURL"),
            "referer": None,
            "device": {},
            "geo": {},
            "traffic": {},
            "additional": {
                "bounce": v.get("ym:s:bounce"),
                "pageViews": v.get("ym:s:pageViews")
            }
        })

    hit_events = []
    for _, h in hits.iterrows():
        try:
            evt = {
                "event_type": "page_view",
                "timestamp": pd.to_datetime(h["ym:pv:dateTime"]),
                "visit_id": str(h["visitID"]),
                "client_id": str(h.get("ym:pv:clientID","")),
                "url": h.get("ym:pv:URL"),
                "referer": h.get("ym:pv:referer"),
                "device": {
                    "os": h.get("ym:pv:operatingSystem"),
                    "browser": h.get("ym:pv:browser"),
                    "device_category": h.get("ym:pv:deviceCategory"),
                    "screen_w": h.get("ym:pv:screenWidth"),
                    "screen_h": h.get("ym:pv:screenHeight"),
                },
                "geo": {
                    "country": h.get("ym:pv:regionCountry"),
                    "city": h.get("ym:pv:regionCity")
                },
                "traffic": {
                    "source": h.get("ym:pv:lastTrafficSource"),
                    "utm_source": h.get("ym:pv:UTMSource"),
                    "utm_campaign": h.get("ym:pv:UTMCampaign")
                },
                "additional": {
                    "title": h.get("ym:pv:title"),
                    "httpError": h.get("ym:pv:httpError"),
                    "notBounce": h.get("ym:pv:notBounce")
                }
            }
            hit_events.append(evt)

            for goal in h.get("ym:pv:goalsID", []):
                hit_events.append({
                    "event_type": "goal",
                    "timestamp": pd.to_datetime(h["ym:pv:dateTime"]),
                    "visit_id": str(h["visitID"]),
                    "client_id": str(h.get("ym:pv:clientID","")),
                    "url": h.get("ym:pv:URL"),
                    "referer": h.get("ym:pv:referer"),
                    "device": {},
                    "geo": {},
                    "traffic": {},
                    "additional": {"goal_id": goal}
                })
        except Exception as ex:
            print("Skipping hit row due to error:", ex)
            continue

    events = visit_events + hit_events
    event_objs = [dict_to_event(e) for e in events]
    event_objs = sorted(event_objs, key=lambda e: e.timestamp)
    return event_objs