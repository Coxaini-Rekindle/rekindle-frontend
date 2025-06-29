import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import groupsReducer from "./slices/groupsSlice";
import memoriesReducer from "./slices/memoriesSlice";
import userReducer from "./slices/userSlice";
import activitiesReducer from "./slices/activitiesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    memories: memoriesReducer,
    user: userReducer,
    activities: activitiesReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values like functions or complex objects
        ignoredActions: ["payload"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
