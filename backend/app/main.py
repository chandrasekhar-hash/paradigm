from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, DB_PATH
from .routers import events

# Create tables in the target database if they don't already exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OD AI HUB — PARADIGM Event Page API",
    description="Backend service for PARADIGM Flagship Event, connected to separate management dashboard database",
    version="1.0.0"
)

# CORS Middleware to support localhost dev and production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)

@app.get("/")
def root():
    return {
        "service": "PARADIGM Event API",
        "status": "online",
        "docs_url": "/docs",
        "database_connected": DB_PATH
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "paradigm-event-backend",
        "database": DB_PATH
    }

