import React from 'react'
import './MovieCard.css';

interface MovieCardProps {
    img: string;
    title: string;
    year: string;
    kind: 'Movie' | 'Series';
    watched?: boolean;
    favorite?: boolean; 
    rating?: number;
    onToggleWatched?: () => void; 
    onToggleFavorite?: () => void; 
    savingWatched?: boolean;
  savingFavorite?: boolean;
  onOpenDetails?: () => void; 
}

const MovieCard:React.FC<MovieCardProps> = ({ img, title, year, kind, watched, favorite, rating, 
                                            onToggleWatched, onToggleFavorite, savingWatched, savingFavorite, onOpenDetails }) => {

  return (
    <div className='movie-card' onClick={onOpenDetails}>

        <div className='movie-top'>
            <img src={img} alt='Watch' className='watch-icon'/>
            <h1>{title}</h1>
        </div>
                    
        <div className='movie-btm'>
            <h3>{year}</h3>
            <h3>{kind}</h3>
           {rating !== undefined && <h3>IMDB:⭐ {rating.toFixed(1)}</h3>} {/* show IMDb */}
        </div>

        <div className='movie-card-buttons'>

          <button className={`watched-status ${watched ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleWatched?.()}} disabled={!!savingWatched}>
            <h4>Watched</h4>
            <p>{watched ? '☑️' : '☐'} {savingWatched ? '…' : ''}</p>
          </button>

          <button className={`favorite-status ${favorite ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleFavorite?.()}} disabled={!!savingFavorite}>
            <h4>Favorite</h4>
            <p>{favorite ? '❤️' : '♡'} {savingFavorite ? '…' : ''}</p>
          </button>
                    
        </div>
        
    </div>
  )
}

export default MovieCard