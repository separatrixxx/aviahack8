from sklearn.ensemble import IsolationForest

def train_dropout_model(df):
    model = IsolationForest(contamination=0.03, random_state=42)
    model.fit(df)
    return model

def detect_dropouts(model, df):
    df["anomaly"] = model.predict(df)
    anomalies = df[df["anomaly"] == -1]
    percent = (len(anomalies) / len(df)) * 100
    return anomalies, percent


