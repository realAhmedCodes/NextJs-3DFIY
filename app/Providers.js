"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Create a persistor instance
let persistor = persistStore(store);

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until the persisted state has been loaded */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
