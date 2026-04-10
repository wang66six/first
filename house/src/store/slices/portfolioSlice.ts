import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FundItem } from '@/types';

interface PortfolioState {
  funds: FundItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  funds: [],
  loading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addFund(state, action: PayloadAction<FundItem>) {
      // 检查是否已存在
     const exists = state.funds.find(item => item.fund.code === action.payload.fund.code);
      if (!exists) {
       state.funds.push(action.payload);
      }
    },
   removeFund(state, action: PayloadAction<string>) {
     state.funds = state.funds.filter(item => item.fund.code !== action.payload);
    },
    updateFunds(state, action: PayloadAction<FundItem[]>) {
     state.funds = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
     state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
     state.error = action.payload;
    },
  },
});

export const {
  addFund,
  removeFund,
  updateFunds,
  setLoading,
  setError,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
