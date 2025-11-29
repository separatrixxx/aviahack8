from app.service.extract_features import extract_features_dropouts
from app.train.load_data import load_data

from sklearn.ensemble import IsolationForest
import joblib
import pickle

event_objs = load_data()

with open("app/data/events.pkl", "wb") as f:
    pickle.dump(event_objs, f)

drop_df = extract_features_dropouts(event_objs)
drop_df_reset = drop_df.reset_index().rename(columns={"index": "visit_id"})

X = drop_df_reset.drop(columns=["visit_id"])
iso_forest = IsolationForest(contamination=0.03, random_state=42)
iso_forest.fit(X)

joblib.dump(iso_forest, "app/model/iso_forest_dropouts_model.pkl")