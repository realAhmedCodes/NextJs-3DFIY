// redux/store.js
/*
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage for web
import userReducer from "./features/userSlice";
import uploadReducer from "./features/uploadSlice";

// Persist config for userSlice
const persistConfig = {
  key: "user",
  storage,
};

// Create a persisted reducer for userSlice
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create and export the store with persisted reducer and default middleware
const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user state
    upload: uploadReducer, // Non-persisted upload state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevent errors with non-serializable data
    }),
});

export const persistor = persistStore(store);
export default store;
*/

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage for web
import userReducer from "./features/userSlice";
import uploadReducer from "./features/uploadSlice";

const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user state
    upload: uploadReducer, // Non-persisted upload state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevent errors with non-serializable data
    }),
});

export const persistor = persistStore(store);
export default store;

// Export the RootState type
export type RootState = ReturnType<typeof store.getState>;
