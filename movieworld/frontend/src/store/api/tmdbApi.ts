import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY; 

export interface MediaItem {
  id: number;
  title?: string;        // movies
  name?: string;         // tv shows
  release_date?: string; // movies
  first_air_date?: string; // tv shows
  poster_path: string | null;
  vote_average?: number; // rating
}

type Paged<T> = { results: T[] };

type Genre = { id: number; name: string };
type GenreResp = { genres: Genre[] };

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3" }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<MediaItem[], void>({
      query: () => `/trending/movie/day?api_key=${API_KEY}`,
      transformResponse: (response: { results: MediaItem[] }) =>
        response.results,
    }),
    getTrendingSeries: builder.query<MediaItem[], void>({
      query: () => `/trending/tv/day?api_key=${API_KEY}`,
      transformResponse: (response: { results: MediaItem[] }) =>
        response.results,
    }),

    // NEW: fetch genre name lists (movie + tv)
    getMovieGenres: builder.query<Genre[], void>({
      query: () => `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      transformResponse: (r: GenreResp) => r.genres,
    }),
    getTvGenres: builder.query<Genre[], void>({
      query: () => `/genre/tv/list?api_key=${API_KEY}&language=en-US`,
      transformResponse: (r: GenreResp) => r.genres,
    }),

    // Discover by genre id (movie or tv)
    getMoviesByGenre: builder.query<MediaItem[], { genreId: number; page?: number }>({
      query: ({ genreId, page = 1 }) =>
        `/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: { results: any[] }) => r.results,
    }),
    getSeriesByGenre: builder.query<MediaItem[], { genreId: number; page?: number }>({
      query: ({ genreId, page = 1 }) =>
        `/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: { results: any[] }) => r.results,
    }),

    // --- Search endpoints ---

    // Title searches
    searchMoviesByTitle: builder.query<MediaItem[], { q: string; page?: number }>({
      query: ({ q, page = 1 }) =>
        `/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          q
        )}&page=${page}&include_adult=false`,
      transformResponse: (r: Paged<any>) => r.results,
    }),
    searchSeriesByTitle: builder.query<MediaItem[], { q: string; page?: number }>({
      query: ({ q, page = 1 }) =>
        `/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          q
        )}&page=${page}&include_adult=false`,
      transformResponse: (r: Paged<any>) => r.results,
    }),

    // People (actors/directors/creators). We’ll search to get the person ID,
    // then use discover with with_people to fetch their works.
    searchPeople: builder.query<{ id: number; name: string }[], { q: string }>({
      query: ({ q }) =>
        `/search/person?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          q
        )}&page=1&include_adult=false`,
      transformResponse: (r: Paged<any>) =>
        r.results.map((p: any) => ({ id: p.id, name: p.name })),
    }),
    discoverMoviesByPerson: builder.query<MediaItem[], { personId: number; page?: number }>({
      query: ({ personId, page = 1 }) =>
        `/discover/movie?api_key=${API_KEY}&language=en-US&with_people=${personId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: Paged<any>) => r.results,
    }),
    discoverSeriesByPerson: builder.query<MediaItem[], { personId: number; page?: number }>({
      query: ({ personId, page = 1 }) =>
        `/discover/tv?api_key=${API_KEY}&language=en-US&with_people=${personId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: Paged<any>) => r.results,
    }),

    // Companies (publisher). We search company by name → id, then discover.
    searchCompanies: builder.query<{ id: number; name: string }[], { q: string }>({
      query: ({ q }) =>
        `/search/company?api_key=${API_KEY}&query=${encodeURIComponent(q)}&page=1`,
      transformResponse: (r: Paged<any>) =>
        r.results.map((c: any) => ({ id: c.id, name: c.name })),
    }),
    discoverMoviesByCompany: builder.query<MediaItem[], { companyId: number; page?: number }>({
      query: ({ companyId, page = 1 }) =>
        `/discover/movie?api_key=${API_KEY}&language=en-US&with_companies=${companyId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: Paged<any>) => r.results,
    }),
    discoverSeriesByCompany: builder.query<MediaItem[], { companyId: number; page?: number }>({
      query: ({ companyId, page = 1 }) =>
        `/discover/tv?api_key=${API_KEY}&language=en-US&with_companies=${companyId}&sort_by=popularity.desc&page=${page}`,
      transformResponse: (r: Paged<any>) => r.results,
    }),
  }),
});

export const { useGetTrendingMoviesQuery, useGetTrendingSeriesQuery, useGetMoviesByGenreQuery, useGetSeriesByGenreQuery, useGetMovieGenresQuery, useGetTvGenresQuery, useSearchMoviesByTitleQuery, useSearchSeriesByTitleQuery, useSearchPeopleQuery, useDiscoverMoviesByPersonQuery, useDiscoverSeriesByPersonQuery, useSearchCompaniesQuery, useDiscoverMoviesByCompanyQuery, useDiscoverSeriesByCompanyQuery } = tmdbApi;
