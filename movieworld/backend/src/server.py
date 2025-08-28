# backend/src/server.py
# This file initializes the FastAPI application and includes the necessary routes and middleware.
import uvicorn
from fastapi import FastAPI
from .config.db import Base, engine
from .routes.watched_routes import router as watched_router
from .routes.favorite_routes import router as favorite_router
from fastapi.middleware.cors import CORSMiddleware

def get_app():
    app = FastAPI(title="MovieWorld API")
    Base.metadata.create_all(bind=engine)

    app.include_router(watched_router)
    app.include_router(favorite_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173","http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app

app = get_app()

if __name__ == "__main__":
    uvicorn.run("src.server:app", host="0.0.0.0", port=8000, reload=True)
