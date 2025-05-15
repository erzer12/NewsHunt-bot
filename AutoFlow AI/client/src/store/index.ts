import { configureStore } from "@reduxjs/toolkit";
import workflowReducer from "./workflowStore";

export const store = configureStore({
  reducer: {
    workflow: workflowReducer
  }
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
