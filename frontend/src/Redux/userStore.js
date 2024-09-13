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
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import groupReducer from "../Redux/Groups/GroupSlice";
import userProfileReducer from "./UserProfile/userProfileSlice";
import SelectedUser from "./SelectedUser/SelectedUser";

// Configure the encryption transform for workspace
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_ENCRYPTION_KEY,
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

// persist configuraton for group with encryption
const groupPersistConfig = {
  key: "group",
  storage,
  transforms: [encryptor],
};

const userProfilePersistConfig = {
  key: "userProfile",
  storage,
  transforms: [encryptor],
};

const selectedUserPersistConfig = {
  key: "selectedUser",
  storage,
  transforms: [encryptor],
};

// Persisted reducers
const persistedWorkspaceReducer = persistReducer(
  workspacePersistConfig,
  workspaceReducer
);
const persistedGroupReducer = persistReducer(groupPersistConfig, groupReducer);
const persistedUserProfileReducer = persistReducer(
  userProfilePersistConfig,
  userProfileReducer
);

const persistedSelectedUser = persistReducer(
  selectedUserPersistConfig,
  SelectedUser
);

// Create a root reducer combining persisted and non-persisted reducers
const rootReducer = combineReducers({
  authenticationUser: authenticationSliceReducer, // Non-persisted
  workspace: persistedWorkspaceReducer, // Persisted with encryption
  group: persistedGroupReducer,
  userProfile: persistedUserProfileReducer,
  selectedUser: persistedSelectedUser,
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
