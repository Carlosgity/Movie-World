import React from 'react'
import './AboutMovieCard.css'

export type AboutMovieProps = {
  title: string;
  genreText: string;
  duration: string;
  imdb: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  onClose?: () => void;
};

const AboutMovie:React.FC<AboutMovieProps> = ({ title, genreText, duration, imdb, overview, posterUrl, backdropUrl, onClose }) => {
  return (
    <div className='movie-widget'>

                <div className='movie-widget-content'>

                  <div className="img-container">
                    <img src={posterUrl} alt={`${title} poster`} />
                  </div>
                  
                  <div className='movie-info'>
                    <h2>{title}</h2>
                    <p>Genre: {genreText}</p>
                    <p>Duration: {duration}</p>
                    <p>IMDb: {imdb}</p>
                    <p>Overview: {overview}</p>
                    {/* <p>Production: Marvel Studios</p> */}
                    {/* <p>Cast: Actor 1, Actor 2, Actor 3</p> */}

                  </div>

                  <div className='about-movie-button'>
                    <button className='close-button' onClick={onClose}>Close</button>
                  </div>
                </div>

              
    </div>
  )
}

export default AboutMovie