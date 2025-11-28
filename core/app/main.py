from fastapi import FastAPI
from app.api.v1 import metrics

app = FastAPI()

app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
