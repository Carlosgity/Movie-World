// src/Pages/HomePage/HomePage.tsx
import React from 'react';
import './HomePage.css';
import NavBar from '../../components/NavBar';
import '../../components/NavBar.css';
import HeroCarousel, { HeroSlide } from '../../components/HeroCarousel';
import MovieCard from '../../components/MovieCard';
import AboutMovie from '../../components/AboutMovieCard';

import {
  useGetTrendingMoviesQuery,
  useGetTrendingSeriesQuery,
  useGetMoviesByGenreQuery,
  useGetSeriesByGenreQuery,
  useSearchMoviesByTitleQuery,
  useSearchSeriesByTitleQuery,
  useSearchPeopleQuery,
  useDiscoverMoviesByPersonQuery,
  useDiscoverSeriesByPersonQuery,
  useSearchCompaniesQuery,
  useDiscoverMoviesByCompanyQuery,
  useDiscoverSeriesByCompanyQuery,
  useGetMovieGenresQuery,
  useGetTvGenresQuery,
} from '../../store/api/tmdbApi';

import {
  useAddFavoriteMutation,
  useAddWatchedMutation,
  useGetFavoriteMoviesQuery,
  useGetFavoriteSeriesQuery,
  useGetWatchedMoviesQuery,
  useGetWatchedSeriesQuery,
  useRemoveFavoriteMutation,
  useRemoveWatchedMutation,
} from '../../store/api/libraryApi';

import type { SearchParams } from '../../components/SearchBar';

// --------------------------------------------------
// Types
// --------------------------------------------------
type SelectedGenre = { name: string; movieId?: number; tvId?: number } | null;
type View = 'home' | 'genre' | 'search';
type AboutData = React.ComponentProps<typeof AboutMovie>;

// --------------------------------------------------
// Small utilities (pure functions)
// --------------------------------------------------
function itemKey(kind: 'Movie' | 'Series', id: number) {
  return `${kind}:${id}`;
}

function posterUrl(path?: string | null): string {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : '/no-poster.png';
}

function heroBackdropUrl(backdrop_path?: string | null, poster_path?: string | null): string {
  return backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${backdrop_path}`
    : poster_path
    ? `https://image.tmdb.org/t/p/w780${poster_path}`
    : '/poster/picture1.jpg';
}

function genreNamesFromIds(
  ids: number[] | undefined,
  allGenres?: Array<{ id: number; name: string }>
): string {
  if (!ids || !allGenres) return '—';
  const names = ids
    .map((id) => allGenres.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[];
  return names.slice(0, 2).join(', ') || '—';
}

// --------------------------------------------------
// Component
// --------------------------------------------------
const HomePage: React.FC = () => {
  // UI view state
  const [view, setView] = React.useState<View>('home');
  const [selectedGenre, setSelectedGenre] = React.useState<SelectedGenre>(null);
  const [search, setSearch] = React.useState<SearchParams | null>(null);
  const [searchInput, setSearchInput] = React.useState('');

  // Toggle maps + saving flags
  const [watchedMap, setWatchedMap] = React.useState<Record<string, boolean>>({});
  const [favoriteMap, setFavoriteMap] = React.useState<Record<string, boolean>>({});
  const [savingWatchedKey, setSavingWatchedKey] = React.useState<string | null>(null);
  const [savingFavoriteKey, setSavingFavoriteKey] = React.useState<string | null>(null);

  // Details widget state
  const [selectedAbout, setSelectedAbout] = React.useState<AboutData | null>(null);

  // --------------------------------------------------
  // TMDB: Default (Trending)
  // --------------------------------------------------
  const { data: trendingMovies } = useGetTrendingMoviesQuery();
  const { data: trendingSeries } = useGetTrendingSeriesQuery();

  // --------------------------------------------------
  // TMDB: Genre flow (explicit pick)
  // --------------------------------------------------
  const movieGenreId = selectedGenre?.movieId;
  const tvGenreId = selectedGenre?.tvId;

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(
    { genreId: movieGenreId as number },
    { skip: !movieGenreId }
  );
  const { data: seriesByGenre } = useGetSeriesByGenreQuery(
    { genreId: tvGenreId as number },
    { skip: !tvGenreId }
  );

  // --------------------------------------------------
  // TMDB: Search flows (title / person / company / genre-name)
  // --------------------------------------------------
  const { data: foundMoviesByTitle } = useSearchMoviesByTitleQuery(
    { q: search?.query ?? '' },
    { skip: search?.mode !== 'title' || !search?.query }
  );
  const { data: foundSeriesByTitle } = useSearchSeriesByTitleQuery(
    { q: search?.query ?? '' },
    { skip: search?.mode !== 'title' || !search?.query }
  );

  // person
  const { data: people } = useSearchPeopleQuery(
    { q: search?.query ?? '' },
    { skip: search?.mode !== 'person' || !search?.query }
  );
  const firstPersonId = people?.[0]?.id;
  const { data: moviesByPerson } = useDiscoverMoviesByPersonQuery(
    { personId: firstPersonId as number },
    { skip: search?.mode !== 'person' || !firstPersonId }
  );
  const { data: seriesByPerson } = useDiscoverSeriesByPersonQuery(
    { personId: firstPersonId as number },
    { skip: search?.mode !== 'person' || !firstPersonId }
  );

  // company
  const { data: companies } = useSearchCompaniesQuery(
    { q: search?.query ?? '' },
    { skip: search?.mode !== 'company' || !search?.query }
  );
  const firstCompanyId = companies?.[0]?.id;
  const { data: moviesByCompany } = useDiscoverMoviesByCompanyQuery(
    { companyId: firstCompanyId as number },
    { skip: search?.mode !== 'company' || !firstCompanyId }
  );
  const { data: seriesByCompany } = useDiscoverSeriesByCompanyQuery(
    { companyId: firstCompanyId as number },
    { skip: search?.mode !== 'company' || !firstCompanyId }
  );

  // search by genre NAME -> id lookup
  const { data: movieGenres } = useGetMovieGenresQuery();
  const { data: tvGenres } = useGetTvGenresQuery();

  const searchedMovieGenreId = React.useMemo(
    () =>
      movieGenres?.find(
        (g) => g.name.toLowerCase() === (search?.query ?? '').toLowerCase()
      )?.id,
    [movieGenres, search]
  );
  const searchedTvGenreId = React.useMemo(
    () =>
      tvGenres?.find(
        (g) => g.name.toLowerCase() === (search?.query ?? '').toLowerCase()
      )?.id,
    [tvGenres, search]
  );

  const { data: searchedMoviesByGenre } = useGetMoviesByGenreQuery(
    { genreId: searchedMovieGenreId as number },
    { skip: !(search?.mode === 'genre' && searchedMovieGenreId) }
  );
  const { data: searchedSeriesByGenre } = useGetSeriesByGenreQuery(
    { genreId: searchedTvGenreId as number },
    { skip: !(search?.mode === 'genre' && searchedTvGenreId) }
  );

  // --------------------------------------------------
  // Library: Hydrate watched/favorites + mutations
  // --------------------------------------------------
  const { data: watchedMovies = [] } = useGetWatchedMoviesQuery();
  const { data: watchedSeries = [] } = useGetWatchedSeriesQuery();
  const { data: favoriteMovies = [] } = useGetFavoriteMoviesQuery();
  const { data: favoriteSeries = [] } = useGetFavoriteSeriesQuery();

  const [addWatched] = useAddWatchedMutation();
  const [removeWatched] = useRemoveWatchedMutation();
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  React.useEffect(() => {
    const flags: Record<string, boolean> = {};
    for (let i = 0; i < watchedMovies.length; i++) {
      const w = watchedMovies[i];
      flags[`Movie:${w.tmdb_id}`] = true;
    }
    for (let i = 0; i < watchedSeries.length; i++) {
      const w = watchedSeries[i];
      flags[`Series:${w.tmdb_id}`] = true;
    }
    setWatchedMap(flags);
  }, [watchedMovies, watchedSeries]);

  React.useEffect(() => {
    const flags: Record<string, boolean> = {};
    for (let i = 0; i < favoriteMovies.length; i++) {
      const f = favoriteMovies[i];
      flags[`Movie:${f.tmdb_id}`] = true;
    }
    for (let i = 0; i < favoriteSeries.length; i++) {
      const f = favoriteSeries[i];
      flags[`Series:${f.tmdb_id}`] = true;
    }
    setFavoriteMap(flags);
  }, [favoriteMovies, favoriteSeries]);

  // --------------------------------------------------
  // Handlers (NavBar)
  // --------------------------------------------------
  function resetView() {
    setView('home');
    setSelectedGenre(null);
    setSearch(null);
    setSearchInput('');
  }
  function onSearch(params: SearchParams) {
    setView('search');
    setSelectedGenre(null);
    setSearch(params);
  }
  function onPickGenre(g: SelectedGenre) {
    setView('genre');
    setSearch(null);
    setSearchInput('');
    setSelectedGenre(g);
  }

  // --------------------------------------------------
  // Handlers (Watched/Favorite toggles)
  // --------------------------------------------------
  async function handleToggleWatched(mediaItem: any, kind: 'Movie' | 'Series') {
    const key = itemKey(kind, mediaItem.id);
    const prev = !!watchedMap[key];

    setWatchedMap((s) => ({ ...s, [key]: !prev }));
    setSavingWatchedKey(key);

    try {
      if (!prev) {
        await addWatched({
          tmdb_id: mediaItem.id,
          kind,
          title: (mediaItem.title ?? mediaItem.name) ?? 'Untitled',
          poster_path: mediaItem.poster_path ?? null,
        }).unwrap();
      } else {
        await removeWatched({ kind, tmdb_id: mediaItem.id }).unwrap();
      }
    } catch (e) {
      setWatchedMap((s) => ({ ...s, [key]: prev })); // rollback
      console.error(e);
    } finally {
      setSavingWatchedKey(null);
    }
  }

  async function handleToggleFavorite(mediaItem: any, kind: 'Movie' | 'Series') {
    const key = itemKey(kind, mediaItem.id);
    const prev = !!favoriteMap[key];

    setFavoriteMap((s) => ({ ...s, [key]: !prev }));
    setSavingFavoriteKey(key);

    try {
      if (!prev) {
        await addFavorite({
          tmdb_id: mediaItem.id,
          kind,
          title: (mediaItem.title ?? mediaItem.name) ?? 'Untitled',
          poster_path: mediaItem.poster_path ?? null,
        }).unwrap();
      } else {
        await removeFavorite({ kind, tmdb_id: mediaItem.id }).unwrap();
      }
    } catch (e) {
      setFavoriteMap((s) => ({ ...s, [key]: prev })); // rollback
      console.error(e);
    } finally {
      setSavingFavoriteKey(null);
    }
  }

  // --------------------------------------------------
  // Details widget helpers
  // --------------------------------------------------
  function toAboutProps(kind: 'Movie' | 'Series', m: any): AboutData {
    const genres = kind === 'Movie' ? movieGenres : tvGenres;
    return {
      title: (m.title ?? m.name) ?? 'Untitled',
      genreText: genreNamesFromIds(m.genre_ids, genres),
      duration: '—',
      imdb: m.vote_average != null ? m.vote_average.toFixed(1) : '—',
      overview: m.overview ?? '',
      posterUrl: posterUrl(m.poster_path),
      backdropUrl: heroBackdropUrl(m.backdrop_path, m.poster_path),
    };
  }
  function openAbout(m: any, kind: 'Movie' | 'Series') {
    setSelectedAbout(toAboutProps(kind, m));
  }
  function closeAbout() {
    setSelectedAbout(null);
  }

  React.useEffect(() => {
  document.body.classList.toggle('body-no-scroll', !!selectedAbout);
  return () => {
    document.body.classList.remove('body-no-scroll');
  };
}, [selectedAbout]);



  // --------------------------------------------------
  // Derived UI: hero slides + card renderer
  // --------------------------------------------------
  const heroSlides = React.useMemo<HeroSlide[]>(() => {
    if (!trendingMovies?.length) return [];
    return trendingMovies.slice(0, 5).map((m: any) => ({
      id: m.id,
      title: (m.title ?? m.name) ?? 'Untitled',
      genre: genreNamesFromIds(m.genre_ids, movieGenres),
      duration: '—', // not available in trending response
      imdb: m.vote_average != null ? m.vote_average.toFixed(1) : '—',
      overview: m.overview ?? '',
      backdropUrl: heroBackdropUrl(m.backdrop_path, m.poster_path),
    }));
  }, [trendingMovies, movieGenres]);

  function renderCards(items?: any[], kind: 'Movie' | 'Series' = 'Movie') {
    return items?.map((m) => {
      const title = (m.title ?? m.name) ?? 'Untitled';
      const year = (m.release_date ?? m.first_air_date)?.slice(0, 4) ?? 'N/A';
      const img = m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : '/no-poster.png';
      const key = itemKey(kind, m.id);

      return (
        <MovieCard
          key={m.id}
          img={img}
          title={title}
          year={year}
          kind={kind}
          rating={m.vote_average}
          watched={!!watchedMap[key]}
          favorite={!!favoriteMap[key]}
          savingWatched={savingWatchedKey === key}
          savingFavorite={savingFavoriteKey === key}
          onToggleWatched={() => handleToggleWatched(m, kind)}
          onToggleFavorite={() => handleToggleFavorite(m, kind)}
          onOpenDetails={() => openAbout(m, kind)}
        />
      );
    });
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="home-page">
      <NavBar
        overlay
        onGenreSelect={onPickGenre}
        onSearch={onSearch}
        onReset={resetView}
        searchValue={searchInput}
        onSearchValueChange={setSearchInput}
      />

      <section className="home-hero">
        <HeroCarousel slides={heroSlides} autoMs={4500} />
      </section>

      <div className="genre-section">

        <div className="trending-section">
          
          {view === 'search' ? (
            <>
              {search?.mode === 'title' && (
                <>
                  <div className="trending-header"><h1>Search: “{search.query}” — Movies</h1></div>
                  <div className="trending-watch">{renderCards(foundMoviesByTitle, 'Movie')}</div>

                  <div className="trending-header" style={{ marginTop: 24 }}><h1>Search: “{search.query}” — Series</h1></div>
                  <div className="trending-watch">{renderCards(foundSeriesByTitle, 'Series')}</div>
                </>
              )}

              {search?.mode === 'person' && (
                <>
                  <div className="trending-header"><h1>Works by “{search.query}” — Movies</h1></div>
                  <div className="trending-watch">{renderCards(moviesByPerson, 'Movie')}</div>

                  <div className="trending-header" style={{ marginTop: 24 }}><h1>Works by “{search.query}” — Series</h1></div>
                  <div className="trending-watch">{renderCards(seriesByPerson, 'Series')}</div>
                </>
              )}

              {search?.mode === 'company' && (
                <>
                  <div className="trending-header"><h1>Published by “{search.query}” — Movies</h1></div>
                  <div className="trending-watch">{renderCards(moviesByCompany, 'Movie')}</div>

                  <div className="trending-header" style={{ marginTop: 24 }}><h1>Published by “{search.query}” — Series</h1></div>
                  <div className="trending-watch">{renderCards(seriesByCompany, 'Series')}</div>
                </>
              )}

              {search?.mode === 'genre' && (
                <>
                  <div className="trending-header"><h1>Genre: “{search.query}” — Movies</h1></div>
                  <div className="trending-watch">{renderCards(searchedMoviesByGenre, 'Movie')}</div>

                  <div className="trending-header" style={{ marginTop: 24 }}><h1>Genre: “{search.query}” — Series</h1></div>
                  <div className="trending-watch">{renderCards(searchedSeriesByGenre, 'Series')}</div>
                </>
              )}
            </>
          ) : view === 'genre' ? (
            <>
              <div className="trending-header"><h1>{selectedGenre?.name} — Movies</h1></div>
              <div className="trending-watch">{renderCards(moviesByGenre, 'Movie')}</div>

              <div className="trending-header" style={{ marginTop: 24 }}><h1>{selectedGenre?.name} — Series</h1></div>
              <div className="trending-watch">{renderCards(seriesByGenre, 'Series')}</div>
            </>
          ) : (
            <>
              <div className="trending-header"><h1>Trending Movies</h1></div>
              <div className="trending-watch">{renderCards(trendingMovies, 'Movie')}</div>

              <div className="trending-header" style={{ marginTop: 24 }}><h1>Trending Series</h1></div>
              <div className="trending-watch">{renderCards(trendingSeries, 'Series')}</div>

              
            </>
          )}

          {selectedAbout && ( 
              <div className="about-overlay" onClick={closeAbout}>
                <div className="about-overlay__center" onClick={(e) => e.stopPropagation()}>
                <AboutMovie 
                  title={selectedAbout.title} 
                  genreText={selectedAbout.genreText} 
                  duration={selectedAbout.duration} 
                  imdb={selectedAbout.imdb} 
                  overview={selectedAbout.overview} 
                  posterUrl={selectedAbout.posterUrl} 
                  backdropUrl={selectedAbout.backdropUrl} 
                  onClose={closeAbout} 
                  />
                  </div>
              </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
