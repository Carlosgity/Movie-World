# backend/src/routes/watched_routes.py
# This file defines the routes for managing watched items in the application.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..controllers.watched_controller import add_watched, remove_watched, list_watched, MarkPayload

router = APIRouter(prefix="/watched", tags=["watched"])

@router.get("/movies")
def get_watched_movies(db: Session = Depends(get_db)):
    return list_watched(db, kind="Movie")

@router.get("/series")
def get_watched_series(db: Session = Depends(get_db)):
    return list_watched(db, kind="Series")

@router.post("")
def post_watched(payload: MarkPayload, db: Session = Depends(get_db)):
    row = add_watched(db, payload)
    return {"tmdb_id": row.tmdb_id, "kind": row.kind}

@router.delete("/{kind}/{tmdb_id}")
def delete_watched(kind: str, tmdb_id: int, db: Session = Depends(get_db)):
    return remove_watched(db, kind, tmdb_id)
