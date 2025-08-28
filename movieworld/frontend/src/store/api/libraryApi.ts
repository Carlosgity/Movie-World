// frontend/src/store/api/libraryApi.ts
// This file defines the API endpoints for managing library items such as watched and favorite movies/series
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Kind = 'Movie' | 'Series';
export type LibraryItem = {
  tmdb_id: number;
  kind: Kind;
  title?: string;
  poster_path?: string | null;
};

export const libraryApi = createApi({
  reducerPath: 'libraryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  tagTypes: ['Watched', 'Favorite'],
  endpoints: (builder) => ({
    // WATCHED
    // Queries to get watched movies and series, mutations to add/remove watched items
    getWatchedMovies: builder.query<LibraryItem[], void>({
      query: () => `/watched/movies`,
      providesTags: (res) => [
        { type: 'Watched', id: 'LIST' },
        ...(res ?? []).map(r => ({ type: 'Watched' as const, id: `Movie:${r.tmdb_id}` })),
      ],
    }),
    // Queries to get watched series
    getWatchedSeries: builder.query<LibraryItem[], void>({
      query: () => `/watched/series`,
      providesTags: (res) => [
        { type: 'Watched', id: 'LIST' },
        ...(res ?? []).map(r => ({ type: 'Watched' as const, id: `Series:${r.tmdb_id}` })),
      ],
    }),
    // Mutation to add a watched item 
    addWatched: builder.mutation<{ tmdb_id: number; kind: Kind }, LibraryItem>({
      query: (body) => ({ url: `/watched`, method: 'POST', body }),
      invalidatesTags: (res) => [
        { type: 'Watched', id: 'LIST' },
        ...(res ? [{ type: 'Watched' as const, id: `${res.kind}:${res.tmdb_id}` }] : []),
      ],
    }),
    // Mutation to remove a watched item
    removeWatched: builder.mutation<{ removed: true }, { kind: Kind; tmdb_id: number }>({
      query: ({ kind, tmdb_id }) => ({ url: `/watched/${kind}/${tmdb_id}`, method: 'DELETE' }),
      invalidatesTags: (res, err, args) => [
        { type: 'Watched', id: 'LIST' },
        { type: 'Watched', id: `${args.kind}:${args.tmdb_id}` },
      ],
    }),

    // FAVORITES
    // Queries to get favorite movies and series, mutations to add/remove favorites
    getFavoriteMovies: builder.query<LibraryItem[], void>({
      query: () => `/favorites/movies`,
      providesTags: (res) => [
        { type: 'Favorite', id: 'LIST' },
        ...(res ?? []).map(r => ({ type: 'Favorite' as const, id: `Movie:${r.tmdb_id}` })),
      ],
    }),
    getFavoriteSeries: builder.query<LibraryItem[], void>({
      query: () => `/favorites/series`,
      providesTags: (res) => [
        { type: 'Favorite', id: 'LIST' },
        ...(res ?? []).map(r => ({ type: 'Favorite' as const, id: `Series:${r.tmdb_id}` })),
      ],
    }),
    addFavorite: builder.mutation<{ tmdb_id: number; kind: Kind }, LibraryItem>({
      query: (body) => ({ url: `/favorites`, method: 'POST', body }),
      invalidatesTags: (res) => [
        { type: 'Favorite', id: 'LIST' },
        ...(res ? [{ type: 'Favorite' as const, id: `${res.kind}:${res.tmdb_id}` }] : []),
      ],
    }),
    removeFavorite: builder.mutation<{ removed: true }, { kind: Kind; tmdb_id: number }>({
      query: ({ kind, tmdb_id }) => ({ url: `/favorites/${kind}/${tmdb_id}`, method: 'DELETE' }),
      invalidatesTags: (res, err, args) => [
        { type: 'Favorite', id: 'LIST' },
        { type: 'Favorite', id: `${args.kind}:${args.tmdb_id}` },
      ],
    }),
  }),
});

export const {
  useGetWatchedMoviesQuery,
  useGetWatchedSeriesQuery,
  useAddWatchedMutation,
  useRemoveWatchedMutation,
  useGetFavoriteMoviesQuery,
  useGetFavoriteSeriesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = libraryApi;
