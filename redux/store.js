import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage for web
import userReducer from "./features/userSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// Create and export the store with persisted reducer and default middleware
const store = configureStore({
  reducer: {
    user: persistedReducer, // Ensure reducer is nested under user
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This prevents errors with non-serializable data, such as functions
    }),
});

export const persistor = persistStore(store);
export default store;
