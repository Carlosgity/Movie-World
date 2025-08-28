# backend/src/controllers/favorite_controller.py
# This file contains the business logic for managing favorite items in the application.
from sqlalchemy.orm import Session
from fastapi import HTTPException
from pydantic import BaseModel, Field
from ..models.favorite import FavoriteItem

class MarkPayload(BaseModel):
    tmdb_id: int
    kind: str = Field(pattern="^(Movie|Series)$")
    title: str | None = None
    poster_path: str | None = None

def add_favorite(db: Session, payload: MarkPayload):
    existing = db.query(FavoriteItem).filter(FavoriteItem.tmdb_id == payload.tmdb_id).first()
    if existing:
        return existing  # idempotent
    row = FavoriteItem(
        tmdb_id=payload.tmdb_id,
        kind=payload.kind,
        title=payload.title,
        poster_path=payload.poster_path,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def remove_favorite(db: Session, kind: str, tmdb_id: int):
    row = db.query(FavoriteItem).filter(FavoriteItem.tmdb_id == tmdb_id, FavoriteItem.kind == kind).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not favorite")
    db.delete(row)
    db.commit()
    return {"removed": True}

def list_favorites(db: Session, kind: str | None):
    q = db.query(FavoriteItem)
    if kind:
        q = q.filter(FavoriteItem.kind == kind)
    rows = q.order_by(FavoriteItem.created_at.desc()).all()
    return [{"tmdb_id": r.tmdb_id, "kind": r.kind, "title": r.title, "poster_path": r.poster_path} for r in rows]
