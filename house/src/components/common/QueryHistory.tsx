import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { removeQueryHistory, clearQueryHistory } from '@/store/slices/queryHistorySlice';
import { formatPercent, getGrowthColorClass } from '@/utils/formatter';

interface QueryHistoryProps {
  onSelectFund: (code: string) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({ onSelectFund }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.queryHistory);

  if (items.length === 0) {
    return null;
  }

  const handleRemove = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    dispatch(removeQueryHistory(code));
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      dispatch(clearQueryHistory());
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span>历史查询</span>
          <span className="text-sm font-normal text-gray-500">({items.length})</span>
        </h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          清空
        </button>
      </div>

      {/* 历史记录列表 */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div
            key={item.code}
            onClick={() => onSelectFund(item.code)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            {/* 左侧：基金信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-gray-900">
                  {item.code}
                </span>
                {item.name && (
                  <span className="text-sm text-gray-600 truncate">
                    {item.name}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                查询于 {new Date(item.queryTime).toLocaleString()}
              </div>
            </div>

            {/* 中间：涨跌幅 */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-lg font-bold ${getGrowthColorClass(item.estimatedGrowth)}`}>
                  {formatPercent(item.estimatedGrowth)}
                </div>
                <div className="text-xs text-gray-500">
                  估值 {item.estimatedValue.toFixed(4)}
                </div>
              </div>

              {/* 删除按钮 */}
              <button
                onClick={(e) => handleRemove(e, item.code)}
                className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          点击可重新查询，最多保留 10 条记录
        </p>
      </div>
    </div>
  );
};

export default QueryHistory;
