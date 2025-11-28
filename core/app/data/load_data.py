import pandas as pd
import ast
from datetime import datetime
from event import Event
from dropout_model import train_dropout_model, detect_dropouts
from layout_model import train_layout_model, detect_layout_problems
from sequence_model import train_sequence_model, detect_sequence_anoms
from form_errors_model import train_form_error_model, detect_form_errors
from extract_features import extract_features_click_sequences, extract_features_dropouts, extract_features_form_errors, extract_features_layout
import joblib

visits = pd.read_parquet("2024_visits.parquet")
hits = pd.read_parquet("2024_hits.parquet")

def safe_parse_list(x):
    """Парсинг строк вида "['a','b']" или "[]"."""
    if isinstance(x, list):
        return x
    if pd.isna(x):
        return []
    try:
        return ast.literal_eval(x)
    except:
        return []

if "ym:s:goalsID" in visits.columns:
    visits["ym:s:goalsID"] = visits["ym:s:goalsID"].apply(safe_parse_list)

if "ym:pv:goalsID" in hits.columns:
    hits["ym:pv:goalsID"] = hits["ym:pv:goalsID"].apply(safe_parse_list)

visits["ym:s:watchIDs"] = visits["ym:s:watchIDs"].apply(safe_parse_list)


watch_to_visit = {}

for _, row in visits.iterrows():
    visit_id = row["ym:s:visitID"]
    watch_ids = row["ym:s:watchIDs"]

    for wid in watch_ids:
        watch_to_visit[str(wid)] = str(visit_id)

hits["visitID"] = hits["ym:pv:watchID"].astype(str).map(watch_to_visit)

hits = hits.dropna(subset=["visitID"])

visit_events = []

for _, v in visits.iterrows():
    visit_id = str(v["ym:s:visitID"])

    visit_events.append({
        "event_type": "visit_start",
        "timestamp": pd.to_datetime(v["ym:s:dateTime"]),
        "visit_id": visit_id,
        "client_id": str(v["ym:s:clientID"]),
        "url": v["ym:s:startURL"],
        "referer": v["ym:s:referer"],
        "device": {
            "os": v["ym:s:operatingSystem"],
            "browser": v["ym:s:browser"],
            "device_category": v["ym:s:deviceCategory"],
            "screen_w": v["ym:s:screenWidth"],
            "screen_h": v["ym:s:screenHeight"],
        },
        "geo": {
            "country": v["ym:s:regionCountry"],
            "city": v["ym:s:regionCity"]
        },
        "traffic": {
            "source": v["ym:s:lastsignTrafficSource"],
            "utm_source": v["ym:s:lastsignUTMSource"],
            "utm_campaign": v["ym:s:lastsignUTMCampaign"]
        },
        "additional": {}
    })

    visit_events.append({
        "event_type": "visit_end",
        "timestamp": pd.to_datetime(v["ym:s:dateTime"]) + pd.to_timedelta(v["ym:s:visitDuration"], unit="s"),
        "visit_id": visit_id,
        "client_id": str(v["ym:s:clientID"]),
        "url": v["ym:s:endURL"],
        "referer": None,
        "device": {},
        "geo": {},
        "traffic": {},
        "additional": {
            "bounce": v["ym:s:bounce"],
            "pageViews": v["ym:s:pageViews"]
        }
    })

hit_events = []

for _, h in hits.iterrows():
    hit_events.append({
        "event_type": "page_view",
        "timestamp": pd.to_datetime(h["ym:pv:dateTime"]),
        "visit_id": str(h["visitID"]),
        "client_id": str(h["ym:pv:clientID"]),
        "url": h["ym:pv:URL"],
        "referer": h["ym:pv:referer"],
        "device": {
            "os": h["ym:pv:operatingSystem"],
            "browser": h["ym:pv:browser"],
            "device_category": h["ym:pv:deviceCategory"],
            "screen_w": h["ym:pv:screenWidth"],
            "screen_h": h["ym:pv:screenHeight"],
        },
        "geo": {
            "country": h["ym:pv:regionCountry"],
            "city": h["ym:pv:regionCity"]
        },
        "traffic": {
            "source": h["ym:pv:lastTrafficSource"],
            "utm_source": h["ym:pv:UTMSource"],
            "utm_campaign": h["ym:pv:UTMCampaign"]
        },
        "additional": {
            "title": h["ym:pv:title"],
            "httpError": h["ym:pv:httpError"],
            "notBounce": h["ym:pv:notBounce"]
        }
    })

    for goal in h["ym:pv:goalsID"]:
        hit_events.append({
            "event_type": "goal",
            "timestamp": pd.to_datetime(h["ym:pv:dateTime"]),
            "visit_id": str(h["visitID"]),
            "client_id": str(h["ym:pv:clientID"]),
            "url": h["ym:pv:URL"],
            "referer": h["ym:pv:referer"],
            "device": {},
            "geo": {},
            "traffic": {},
            "additional": {"goal_id": goal}
        })

events = visit_events + hit_events

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
event_objs = [dict_to_event(e) for e in events]

event_objs = sorted(event_objs, key=lambda e: e.timestamp)

try:
    drop_df = extract_features_dropouts(event_objs)
    # drop_model = train_dropout_model(drop_df)
    drop_model = joblib.load("drop_model.pkl")
    # joblib.dump(drop_model, "drop_model.pkl")
    # anom_df, perc = detect_dropouts(drop_model, drop_df)
    
    drop_df["anomaly"] = drop_model.predict(drop_df)
    anomalous_visits_set = set(drop_df[drop_df["anomaly"] == -1].index)
    percent_anomalies = len(anomalous_visits_set) / len(drop_df) * 100
    anomalous_events = [e for e in event_objs if e.visit_id in anomalous_visits_set]
    print(f"Процент аномальных визитов: {percent_anomalies:.2f}%")
    print(f"Количество аномальных событий: {len(anomalous_events)}")
    for e in anomalous_events[:5]:
        print(e)
except:
    print("Ошибка на drop_df")
    import sys
    print("Error details:", sys.exc_info())

try:
    seq_df = extract_features_click_sequences(event_objs)
    seq_model = train_sequence_model(seq_df)
    anom_df, perc = detect_sequence_anoms(seq_df, seq_model)
    print("Процент аномалий: {:.2f}%".format(perc))
    print("Количество аномалий:", len(anom_df))
except:
    print("Ошибка на seq_df")
    import sys
    print("Error details:", sys.exc_info())

try:
    form_df = extract_features_form_errors(event_objs)
    # form_model = train_form_error_model(form_df)
    form_model = joblib.load("form_model.pkl")
    # joblib.dump(form_model, "form_model.pkl")
    anom_df, perc = detect_form_errors(form_model, form_df)
    print("Процент аномалий: {:.2f}%".format(perc))
    print("Количество аномалий:", len(anom_df))
except:
    print("Ошибка на form_df")
    import sys
    print("Error details:", sys.exc_info())

try:
    layout_df = extract_features_layout(event_objs)
    # layout_model = train_layout_model(layout_df)
    layout_model = joblib.load("layout_model.pkl")
    # joblib.dump(layout_model, "layout_model.pkl")
    anom_df, perc = detect_layout_problems(layout_model, layout_df)
    print("Процент аномалий: {:.2f}%".format(perc))
    print("Количество аномалий:", len(anom_df))
except:
    print("Ошибка на layout_df")
    import sys
    print("Error details:", sys.exc_info())