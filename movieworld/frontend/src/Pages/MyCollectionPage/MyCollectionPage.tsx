import React from 'react'
import './MyCollectionPage.css';
import NavBar from '../../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { useGetFavoriteMoviesQuery, useGetFavoriteSeriesQuery, useGetWatchedMoviesQuery, useGetWatchedSeriesQuery, useRemoveFavoriteMutation, useRemoveWatchedMutation } from '../../store/api/libraryApi';



const MyCollectionPage = () => {
  const navigate = useNavigate();

  const {data: watchedMovies = [], isLoading: wmLoading, isFetching: wmFetching} = useGetWatchedMoviesQuery();
  const {data: watchedSeries = [], isLoading: wsLoading, isFetching: wsFetching} = useGetWatchedSeriesQuery();
  const {data: favoriteMovies = [], isLoading: fmLoading, isFetching: fmFetching} = useGetFavoriteMoviesQuery();
  const {data: favoriteSeries = [], isLoading: fsLoading, isFetching: fsFetching} = useGetFavoriteSeriesQuery();

    const [removeWatched]  = useRemoveWatchedMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

  // State for toggling between Movies and Series in Watched and Favorite tab
  const [watchedTab, setWatchedTab] = React.useState<'Movies'|'Series'>('Movies');
  const [favoriteTab, setFavoriteTab] = React.useState<'Movies'|'Series'>('Movies');

  // 
  const watchList = watchedTab === 'Movies' ? watchedMovies : watchedSeries;
  const watchInitialLoading   = watchedTab  === 'Movies' ? wmLoading  : wsLoading;
  const watchBackgroundFetch  = watchedTab  === 'Movies' ? wmFetching : wsFetching;

  // Determine which list to show based on the selected tab <-- favoriteTab
  const favoriteList = favoriteTab === 'Movies' ? favoriteMovies : favoriteSeries;
  const favoriteInitialLoading  = favoriteTab === 'Movies' ? fmLoading  : fsLoading;
  const favoriteBackgroundFetch = favoriteTab === 'Movies' ? fmFetching : fsFetching;





    function buildPosterUrl(path?: string | null): string {
    return path ? `https://image.tmdb.org/t/p/w342${path}` : '/no-poster.png';
  }

  type kind = 'Movie' | 'Series';

  function makeItemKey(kind: kind, tmdb_id: number): string {
    return kind + ':' + String(tmdb_id);
  }

  // optional: show a small disabled state while removing
  const [removingByKey, setRemovingByKey] = React.useState<Record<string, boolean>>({});

  async function handleUnwatch(item: { kind: 'Movie'|'Series'; tmdb_id: number }) {
  const key = makeItemKey(item.kind, item.tmdb_id);

  // Mark busy
  setRemovingByKey(function (previousMap) {
    const nextMap: Record<string, boolean> = { ...previousMap };
    nextMap[key] = true;
    return nextMap;
  });

  try {
    // Call API
    await removeWatched({ kind: item.kind, tmdb_id: item.tmdb_id }).unwrap();
    // After invalidation, the list refetches and the card disappears
  } finally {
    // Always clear busy
    setRemovingByKey(function (previousMap) {
      const nextMap: Record<string, boolean> = { ...previousMap };
      delete nextMap[key];
      return nextMap;
    });
  }
}

  async function handleUnFavorite(item: { kind: 'Movie'|'Series'; tmdb_id: number }) {

      const key = makeItemKey(item.kind, item.tmdb_id);

      // Mark busy
    setRemovingByKey(function (previousMap) {
      const nextMap: Record<string, boolean> = { ...previousMap };
      nextMap[key] = true;
      return nextMap;
    });

    try {
      // Call API
      await removeFavorite({ kind: item.kind, tmdb_id: item.tmdb_id }).unwrap();
      // After invalidation, the list refetches and the card disappears
    } finally {
      // Always clear busy
      setRemovingByKey(function (previousMap) {
        const nextMap: Record<string, boolean> = { ...previousMap };
        delete nextMap[key];
        return nextMap;
      });
    }
      
  }

  

  return (
    <div className='my-collection-page'>

      <div className='collection-nav'>
        <div>
          <button onClick={() => navigate('/homepage')}>Go Home</button>
        </div>
        <div>
          <img src='logo.png' alt='Logo' className='logo'/>
        </div>
      </div>

      <div className='collection-content'>

        <div className='watched-content'>

          <div className="watched-type">
            <h2 className=''>Watched</h2>

            <button className={"tab" + (watchedTab === 'Movies' ? ' active' : '')} onClick={() => setWatchedTab('Movies')}>Movies</button>

            <button className={"tab" + (watchedTab === 'Series' ? ' active' : '')} onClick={() => setWatchedTab('Series')}>Series</button>
          </div>

          <h1 className='col-title'>List of {watchedTab} you have  watched.</h1>

          {watchInitialLoading ? (
            <p>Loading Watched {watchedTab}</p>  
          ) : watchList.length === 0 ? (
            <p>No watched {watchedTab} yet</p>
          ) : (
            <>
            {watchBackgroundFetch && <div className="refetch-indicator">Refreshing…</div>}
            <ul className='movie-list'> 

              {watchList.map(function (movie) {
                const key = makeItemKey(movie.kind, movie.tmdb_id);
                const isBusy = removingByKey[key] === true;
              return (
                <li key={`${movie.kind}:${movie.tmdb_id}`} className='col-movie-card'>
                <div className='col-movie-top'>
                  <img src={buildPosterUrl(movie.poster_path)} alt={movie.title} className='col-poster'/>
                  <h1>{movie.title}</h1>
                </div>

                <div className='col-movie-btm'>
                  {/* <h3>{movie.duration}</h3> */}
                  <h3>{movie.kind}</h3>
                  {/* {movie.imdb !== undefined && <h3>IMDB:⭐ {movie.imdb}</h3>} */}
                </div>

                <div className='col-movie-card-buttons'>
                  <button disabled={isBusy} onClick={() => handleUnwatch(movie)} className='col-watched-status'>
                    <h4>{isBusy ? 'Removing…' : 'Remove from Watched'}</h4>
                  </button>
                </div>
              </li>
              )
          })}
          </ul>
          </>
          )}
        </div>


        <div className='favorite-content'>

          <div className="favorite-type">
            <h2 className=''>Favorites</h2>

            <button className={"tab" + (favoriteTab === 'Movies' ? ' active' : '')} onClick={() => setFavoriteTab('Movies')}>Movies</button>

            <button className={"tab" + (favoriteTab === 'Series' ? ' active' : '')} onClick={() => setFavoriteTab('Series')}>Series</button>
          </div>
          
          <h1 className='col-title'>List of your favorite {favoriteTab}.</h1>

          {favoriteInitialLoading ? (
            <p>Loading favorite {favoriteTab}</p>
          ) : favoriteList.length === 0 ? (
            <p>No favorite {favoriteTab} yet</p>
          ) : (
            <>
            {favoriteBackgroundFetch && <div className="refetch-indicator">Refreshing…</div>}
          <ul className='movie-list'>

            {favoriteList.map(function (movie) {
              const key = makeItemKey(movie.kind, movie.tmdb_id);
              const isBusy = removingByKey[key] === true;
              return (
              <li key={`${movie.kind}:${movie.tmdb_id}`} className='col-movie-card'>
                <div className='col-movie-top'>
                  <img src={buildPosterUrl(movie.poster_path)} alt={movie.title} className='col-poster'/>
                  <h1>{movie.title}</h1>
                </div>

                <div className='col-movie-btm'>
                  {/* <h3>{movie.duration}</h3> */}
                  <h3>{movie.kind}</h3>
                  {/* {movie.imdb !== undefined && <h3>IMDB:⭐ {movie.imdb}</h3>} */}
                </div>

                <div className='col-movie-card-buttons'>
                  <button className='col-favorite-status' disabled={isBusy} onClick={() => handleUnFavorite(movie)}>
                    <h4>{isBusy ? 'Removing…' : 'Remove from Favorites'}</h4>
                  </button>
                </div>
              </li>
              )
            })}
          </ul>
          </>
          )}
        </div>
      </div> 
    </div>
  )
}


export default MyCollectionPage
