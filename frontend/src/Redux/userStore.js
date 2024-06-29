import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authenticationSliceReducer from "./Authentication/authenticationSlice";
import workspaceReducer from "./WorkspaceID/workspaceSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";

// Configure the encryption transform for workspace
const encryptor = encryptTransform({ 
  secretKey: process.env.REACT_APP_SECRET_KEY,
  onError: function (error) {
    console.error("Encryption error:", error);
  },
});

// Persist configuration for workspace with encryption
const workspacePersistConfig = {
  key: "workspace",
  storage,
  transforms: [encryptor],
};

// Persisted workspace reducer
const persistedWorkspaceReducer = persistReducer(workspacePersistConfig, workspaceReducer);

// Create a root reducer combining persisted and non-persisted reducers
const rootReducer = combineReducers({
  authenticationUser: authenticationSliceReducer, // Non-persisted
  workspace: persistedWorkspaceReducer, // Persisted with encryption
});

// Create store with combined reducer
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export the store
export default store;

// Optionally, export the persistor if you need to control the rehydration manually
export const persistor = persistStore(store);
