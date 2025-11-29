import pandas as pd

def explain_anomaly(visit_id, drop_df_reset, events, explainer, top_n=5):
    row = drop_df_reset[drop_df_reset['visit_id'] == visit_id]
    
    if row.empty:
        raise ValueError(f"Visit {visit_id} not found")
    
    is_anomaly = int(row['anomaly'].values[0] == -1)
    
    feature_cols = [c for c in drop_df_reset.columns if c not in ["visit_id", "anomaly"]]
    X_row = row[feature_cols]
    
    shap_values = explainer(X_row)
    
    feat_importance = pd.DataFrame({
        'feature': feature_cols,
        'value': X_row.values[0],
        'shap_value': shap_values.values[0]
    })
    feat_importance['abs_shap'] = feat_importance['shap_value'].abs()
    feat_importance = feat_importance.sort_values('abs_shap', ascending=False)
    
    top_feats = feat_importance.head(top_n)
    
    explanations = []
    for _, r in top_feats.iterrows():
        val = r['value']
        feat = r['feature']
        shap_val = r['shap_value']
        
        if shap_val < 0:
            text = f"Признак {feat}={val} увеличивает вероятность аномалии"
        elif shap_val > 0:
            text = f"Признак {feat}={val} уменьшает вероятность аномалии"
        else:
            text = f"Признак {feat}={val} не влияет на вероятность аномалии"
        explanations.append(text)
    
    explanation_text = "; ".join(explanations)
    
    visit_events = [e for e in events if e.visit_id == visit_id]
    
    return {
        'visit_id': visit_id,
        'is_anomaly': is_anomaly,
        'top_features': top_feats[['feature','value','shap_value']],
        'explanation': explanation_text,
        'events': visit_events
    }
