import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FundRealtimeData } from '@/types';

// 历史查询记录项
export interface QueryHistoryItem {
  code: string;
  name: string;
  estimatedGrowth: number;
  netValue: number;
  estimatedValue: number;
  updateTime: string;
  queryTime: string;  // 查询时间
}

interface QueryHistoryState {
  items: QueryHistoryItem[];
  maxItems: number;
}

// 从 localStorage 加载历史记录
const loadFromStorage = (): QueryHistoryItem[] => {
  try {
    const saved = localStorage.getItem('fund-query-history');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load query history from localStorage:', e);
  }
  return [];
};

// 保存到 localStorage
const saveToStorage = (items: QueryHistoryItem[]) => {
  try {
    localStorage.setItem('fund-query-history', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save query history to localStorage:', e);
  }
};

const initialState: QueryHistoryState = {
  items: loadFromStorage(),
  maxItems: 10, // 最多保留10条历史记录
};

const queryHistorySlice = createSlice({
  name: 'queryHistory',
  initialState,
  reducers: {
    // 添加查询记录
    addQueryHistory: (state, action: PayloadAction<FundRealtimeData>) => {
      const fund = action.payload;
      const newItem: QueryHistoryItem = {
        code: fund.code,
        name: fund.name || '',
        estimatedGrowth: fund.estimatedGrowth,
        netValue: fund.netValue,
        estimatedValue: fund.estimatedValue,
        updateTime: fund.updateTime,
        queryTime: new Date().toISOString(),
      };

      // 移除已存在的相同基金记录
      state.items = state.items.filter(item => item.code !== fund.code);
      
      // 添加到开头
      state.items.unshift(newItem);
      
      // 限制数量
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
      
      // 保存到 localStorage
      saveToStorage(state.items);
    },

    // 移除某条历史记录
    removeQueryHistory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.code !== action.payload);
      saveToStorage(state.items);
    },

    // 清空所有历史记录
    clearQueryHistory: (state) => {
      state.items = [];
      saveToStorage([]);
    },

    // 更新历史记录中的某条数据
    updateQueryHistory: (state, action: PayloadAction<FundRealtimeData>) => {
      const fund = action.payload;
      const index = state.items.findIndex(item => item.code === fund.code);
      
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          name: fund.name || state.items[index].name,
          estimatedGrowth: fund.estimatedGrowth,
          netValue: fund.netValue,
          estimatedValue: fund.estimatedValue,
          updateTime: fund.updateTime,
          queryTime: new Date().toISOString(),
        };
        saveToStorage(state.items);
      }
    },
  },
});

export const {
  addQueryHistory,
  removeQueryHistory,
  clearQueryHistory,
  updateQueryHistory,
} = queryHistorySlice.actions;

export default queryHistorySlice.reducer;
