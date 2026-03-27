import uvicorn
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app import get_all_routers
from config.Config import config
from config.logger import setup_logger
from db.database import Base, engine
from db import load_all_models

setup_logger()
load_all_models()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini EMR API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for route in get_all_routers():
    app.include_router(route, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok", "datetime": datetime.now()}


@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
def fallback(request: Request, path: str):
    return JSONResponse(status_code=404, content={"detail": "Invalid request"})


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=config.RELOAD)
