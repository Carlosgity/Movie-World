# backend/src/models/favorite.py
# This file defines the FavoriteItem model for the application.
from sqlalchemy import Column, Integer, BigInteger, Text, DateTime, func, UniqueConstraint
from ..config.db import Base

class FavoriteItem(Base):
    __tablename__ = "favorite_items"

    id = Column(Integer, primary_key=True, index=True)
    tmdb_id = Column(BigInteger, nullable=False, index=True)
    kind = Column(Text, nullable=False)  # 'Movie' | 'Series'
    title = Column(Text)
    poster_path = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint('tmdb_id', name='uq_favorite_tmdb_id'),)
