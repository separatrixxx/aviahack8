from fastapi import APIRouter, HTTPException, Query
from typing import List
from database.database import database
from models.models import events
from pydantic import BaseModel
from sqlalchemy import func
from app.service.inference import get_anomaly_insight
from app.dto.anomaly_response_dto import AnomalyResponse, FeatureContribution, EventDto

router = APIRouter()

class EventData(BaseModel):
    type: str
    data: dict

class MetricsIn(BaseModel):
    url: str
    metrics: List[EventData]

@router.post("/")
async def add_metrics(metrics_in: MetricsIn):
    query = events.select().where(events.c.url == metrics_in.url)
    row = await database.fetch_one(query)

    if row:
        new_metrics = row["metrics"] + [m.dict() for m in metrics_in.metrics]
        upd = events.update().where(events.c.url == metrics_in.url).values(
            metrics=new_metrics,
            updated_at=func.now()
        )

        await database.execute(upd)

        return {"result": "merged"}
    else:
        ins = events.insert().values(
            url=metrics_in.url,
            metrics=[m.dict() for m in metrics_in.metrics]
        )

        await database.execute(ins)

        return {"result": "created"}

@router.get("/")
async def all_metrics():
    query = events.select().order_by(events.c.id.desc())
    res = await database.fetch_all(query)

    return [dict(r) for r in res]

@router.get("/metrics/{event_id}")
async def get_metrics(event_id: int):
    query = events.select().where(events.c.id == event_id)
    row = await database.fetch_one(query)

    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    
    return dict(row)

@router.delete("/", status_code=204)
async def delete_all():
    await database.execute(events.delete())

    return

@router.delete("/metrics/{event_id}", status_code=204)
async def delete_one(event_id: int):
    res = await database.execute(events.delete().where(events.c.id == event_id))

    if not res:
        raise HTTPException(status_code=404, detail="Not found")
    
    return

@router.get("/by_url/")
async def get_metrics_by_url(url: str = Query(...)):
    query = events.select().where(events.c.url == url)
    rows = await database.fetch_all(query)
    
    return [dict(r) for r in rows]

@router.delete("/by_url/", status_code=204)
async def delete_metrics_by_url(url: str = Query(...)):
    query = events.delete().where(events.c.url == url)
    
    await database.execute(query)

    return

@router.get("/anomaly")
def anomaly(visit_id: str, top_n: int = 5):
    try:
        result, llm_anomaly_explain = get_anomaly_insight(visit_id, top_n=top_n)
    except KeyError:
        raise HTTPException(status_code=404, detail="visit_id не найден")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    top_features = []
    for _, row in result["top_features"].iterrows():
        top_features.append(
            FeatureContribution(
                feature=str(row["feature"]),
                value=float(row["value"]),
                shap_value=float(row["shap_value"])
            )
        )

    events = []
    for e in result["events"]:
        events.append(
            EventDto(
                event_type=str(e.event_type),
                timestamp=e.timestamp.to_pydatetime() if hasattr(e.timestamp, "to_pydatetime") else e.timestamp,
                visit_id=str(e.visit_id),
                client_id=str(e.client_id),
                url=str(e.url),
                referer=str(e.referer) if e.referer is not None else None,
                device=dict(e.device),
                geo=dict(e.geo),
                traffic=dict(e.traffic),
                additional=dict(e.additional)
            )
        )

    return AnomalyResponse(
        visit_id=str(result["visit_id"]),
        is_anomaly=int(result["is_anomaly"]),
        top_features=top_features,
        explanation=str(result["explanation"]),
        llm_explanation = str(llm_anomaly_explain),
        events=events
    )