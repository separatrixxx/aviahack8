from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import database
from app.api.v1 import metrics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://aviahack8.vercel.app",
        "https://aviahack8-test.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(metrics.router, prefix='/api/v1/metrics')
