from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime

@dataclass
class Event:
    event_type: str
    timestamp: datetime
    visit_id: str
    client_id: str
    url: Optional[str] = None
    referer: Optional[str] = None

    device: Optional[Dict[str, Any]] = None
    geo: Optional[Dict[str, Any]] = None
    traffic: Optional[Dict[str, Any]] = None
    additional: Optional[Dict[str, Any]] = None
