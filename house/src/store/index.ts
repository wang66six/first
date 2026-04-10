import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './slices/portfolioSlice';
import queryHistoryReducer from './slices/queryHistorySlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    queryHistory: queryHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
