import shap
import joblib
import pickle

from app.service.extract_features import extract_features_dropouts
from app.service.explain_anomaly import explain_anomaly
from app.service.llm_anomalies_explainer import get_ai_analysis

with open("app/data/events.pkl", "rb") as f:
    event_objs = pickle.load(f)

drop_df = extract_features_dropouts(event_objs)
drop_df_reset = drop_df.reset_index().rename(columns={"index": "visit_id"})

X = drop_df_reset.drop(columns=["visit_id"])

iso_forest = joblib.load("app/model/iso_forest_dropouts_model.pkl")

drop_df_reset["anomaly"] = iso_forest.predict(X)

explainer = shap.Explainer(iso_forest.decision_function, X)

def get_anomaly_insight(visit_id: str, top_n=5):
    anomaly_analyze = explain_anomaly(
        visit_id,
        drop_df_reset,
        event_objs,
        explainer,
        top_n=top_n
    )
    llm_anomaly_explain = get_ai_analysis(anomaly_analyze)
    return anomaly_analyze, llm_anomaly_explain
