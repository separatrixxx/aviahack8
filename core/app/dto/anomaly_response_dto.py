from pydantic import BaseModel
from typing import List, Any
from typing import Optional, Dict, Any

class FeatureContribution(BaseModel):
    feature: str
    value: float
    shap_value: float

class EventDto(BaseModel):
    event_type: str
    timestamp: Any
    visit_id: str
    client_id: str
    url: Optional[str] = None
    referer: Optional[str] = None
    device: Optional[Dict[str, Any]] = None
    geo: Optional[Dict[str, Any]] = None
    traffic: Optional[Dict[str, Any]] = None
    additional: Optional[Dict[str, Any]] = None

class AnomalyResponse(BaseModel):
    visit_id: str
    is_anomaly: bool
    top_features: List[FeatureContribution]
    explanation: str
    events: List[EventDto]
