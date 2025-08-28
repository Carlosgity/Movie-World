# backend/src/routes/favorite_routes.py
# This file defines the routes for managing favorite items in the application.
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..config.db import get_db
from ..controllers.favorite_controller import add_favorite, remove_favorite, list_favorites, MarkPayload

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("/movies")
def get_favorite_movies(db: Session = Depends(get_db)):
    return list_favorites(db, kind="Movie")

@router.get("/series")
def get_favorite_series(db: Session = Depends(get_db)):
    return list_favorites(db, kind="Series")

@router.post("")
def post_favorite(payload: MarkPayload, db: Session = Depends(get_db)):
    row = add_favorite(db, payload)
    return {"tmdb_id": row.tmdb_id, "kind": row.kind}

@router.delete("/{kind}/{tmdb_id}")
def delete_favorite(kind: str, tmdb_id: int, db: Session = Depends(get_db)):
    return remove_favorite(db, kind, tmdb_id)
