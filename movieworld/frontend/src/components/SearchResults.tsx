// src/components/SearchResults.tsx
import React from 'react';
import MovieCard from './MovieCard';
import './SearchResults.css';
import type { SearchParams } from './SearchBar';
import {
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
  useGetMoviesByGenreQuery,
  useGetSeriesByGenreQuery,
} from '../store/api/tmdbApi';

type Props = {
  search: SearchParams;
  onClear?: () => void;
};

const SearchResults: React.FC<Props> = ({ search, onClear }) => {
  const q = search.query.trim();

  // Helper to render a grid of MovieCard
  const renderCards = (items?: any[], kind: 'Movie' | 'Series' = 'Movie') =>
    items?.map((m) => {
      const title = (m.title ?? m.name) ?? 'Untitled';
      const year = (m.release_date ?? m.first_air_date)?.slice(0, 4) ?? 'N/A';
      const img = m.poster_path
        ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
        : '/no-poster.png';
      return (
        <MovieCard
          key={m.id}
          img={img}
          title={title}
          year={year}
          kind={kind}
          watched={false}
        />
      );
    });

  // --- Mode: title ----------------------------------------------------------
  const { data: foundMoviesByTitle, isLoading: loadingMoviesByTitle } =
    useSearchMoviesByTitleQuery({ q }, { skip: search.mode !== 'title' || !q });

  const { data: foundSeriesByTitle, isLoading: loadingSeriesByTitle } =
    useSearchSeriesByTitleQuery({ q }, { skip: search.mode !== 'title' || !q });

  // --- Mode: person (actor/creator) ----------------------------------------
  const { data: people, isLoading: loadingPeople } =
    useSearchPeopleQuery({ q }, { skip: search.mode !== 'person' || !q });
  const firstPersonId = people?.[0]?.id;

  const { data: moviesByPerson, isLoading: loadingMoviesByPerson } =
    useDiscoverMoviesByPersonQuery(
      { personId: firstPersonId as number },
      { skip: search.mode !== 'person' || !firstPersonId }
    );
  const { data: seriesByPerson, isLoading: loadingSeriesByPerson } =
    useDiscoverSeriesByPersonQuery(
      { personId: firstPersonId as number },
      { skip: search.mode !== 'person' || !firstPersonId }
    );

  // --- Mode: company (publisher) -------------------------------------------
  const { data: companies, isLoading: loadingCompanies } =
    useSearchCompaniesQuery({ q }, { skip: search.mode !== 'company' || !q });
  const firstCompanyId = companies?.[0]?.id;

  const { data: moviesByCompany, isLoading: loadingMoviesByCompany } =
    useDiscoverMoviesByCompanyQuery(
      { companyId: firstCompanyId as number },
      { skip: search.mode !== 'company' || !firstCompanyId }
    );
  const { data: seriesByCompany, isLoading: loadingSeriesByCompany } =
    useDiscoverSeriesByCompanyQuery(
      { companyId: firstCompanyId as number },
      { skip: search.mode !== 'company' || !firstCompanyId }
    );

  // --- Mode: genre (by name -> id) -----------------------------------------
  const { data: movieGenres } = useGetMovieGenresQuery(undefined, {
    skip: search.mode !== 'genre',
  });
  const { data: tvGenres } = useGetTvGenresQuery(undefined, {
    skip: search.mode !== 'genre',
  });

  const movieGenreId = React.useMemo(
    () => movieGenres?.find((g) => g.name.toLowerCase() === q.toLowerCase())?.id,
    [movieGenres, q]
  );
  const tvGenreId = React.useMemo(
    () => tvGenres?.find((g) => g.name.toLowerCase() === q.toLowerCase())?.id,
    [tvGenres, q]
  );

  const { data: searchedMoviesByGenre, isLoading: loadingMoviesByGenre } =
    useGetMoviesByGenreQuery(
      { genreId: movieGenreId as number },
      { skip: search.mode !== 'genre' || !movieGenreId }
    );

  const { data: searchedSeriesByGenre, isLoading: loadingSeriesByGenre } =
    useGetSeriesByGenreQuery(
      { genreId: tvGenreId as number },
      { skip: search.mode !== 'genre' || !tvGenreId }
    );

  // Loading state helper
  const Loading = ({ text }: { text: string }) => (
    <p style={{ opacity: 0.8 }}>{text}</p>
  );

  return (
    <div className="search-results">
      <div className="trending-header" style={{ alignItems: 'center' }}>
        <h1>
          Search — {search.mode.charAt(0).toUpperCase() + search.mode.slice(1)}:{' '}
          “{search.query}”
        </h1>
        {onClear && (
          <button className="clear-btn" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      {search.mode === 'title' && (
        <>
          {loadingMoviesByTitle ? (
            <Loading text="Loading movies…" />
          ) : (
            <>
              <h2 className="sr-subtitle">Movies</h2>
              <div className="trending-watch">{renderCards(foundMoviesByTitle, 'Movie')}</div>
            </>
          )}

          {loadingSeriesByTitle ? (
            <Loading text="Loading series…" />
          ) : (
            <>
              <h2 className="sr-subtitle" style={{ marginTop: 24 }}>Series</h2>
              <div className="trending-watch">{renderCards(foundSeriesByTitle, 'Series')}</div>
            </>
          )}
        </>
      )}

      {search.mode === 'person' && (
        <>
          {loadingPeople && <Loading text="Finding person…" />}
          {loadingMoviesByPerson ? (
            <Loading text="Loading movies…" />
          ) : (
            <>
              <h2 className="sr-subtitle">Movies</h2>
              <div className="trending-watch">{renderCards(moviesByPerson, 'Movie')}</div>
            </>
          )}
          {loadingSeriesByPerson ? (
            <Loading text="Loading series…" />
          ) : (
            <>
              <h2 className="sr-subtitle" style={{ marginTop: 24 }}>Series</h2>
              <div className="trending-watch">{renderCards(seriesByPerson, 'Series')}</div>
            </>
          )}
        </>
      )}

      {search.mode === 'company' && (
        <>
          {loadingCompanies && <Loading text="Finding company…" />}
          {loadingMoviesByCompany ? (
            <Loading text="Loading movies…" />
          ) : (
            <>
              <h2 className="sr-subtitle">Movies</h2>
              <div className="trending-watch">{renderCards(moviesByCompany, 'Movie')}</div>
            </>
          )}
          {loadingSeriesByCompany ? (
            <Loading text="Loading series…" />
          ) : (
            <>
              <h2 className="sr-subtitle" style={{ marginTop: 24 }}>Series</h2>
              <div className="trending-watch">{renderCards(seriesByCompany, 'Series')}</div>
            </>
          )}
        </>
      )}

      {search.mode === 'genre' && (
        <>
          {loadingMoviesByGenre ? (
            <Loading text="Loading movies…" />
          ) : (
            <>
              <h2 className="sr-subtitle">Movies</h2>
              <div className="trending-watch">{renderCards(searchedMoviesByGenre, 'Movie')}</div>
            </>
          )}

          {loadingSeriesByGenre ? (
            <Loading text="Loading series…" />
          ) : (
            <>
              <h2 className="sr-subtitle" style={{ marginTop: 24 }}>Series</h2>
              <div className="trending-watch">{renderCards(searchedSeriesByGenre, 'Series')}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
