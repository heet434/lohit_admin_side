import {configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './slices/authSlice';

const authPersistConfig = {
    key: 'auth',
    storage: storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        }
    }),
});

export const persistor = persistStore(store);