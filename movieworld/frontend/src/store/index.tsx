import { configureStore } from '@reduxjs/toolkit'
import { tmdbApi } from './api/tmdbApi';
import { libraryApi } from './api/libraryApi';

export const store = configureStore({

    reducer: {
        [tmdbApi.reducerPath]: tmdbApi.reducer,
         [libraryApi.reducerPath]: libraryApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware).concat(libraryApi.middleware),

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
