import React, { useEffect, useState, useCallback } from 'react';
import type { FundPositionWithChange } from '@/types';
import { formatPercent, formatNumber, getGrowthColorClass } from '@/utils/formatter';
import { fetchStockRealtime } from '@/services/fund';

interface FundPositionsProps {
  positions: FundPositionWithChange[];
  fundName?: string;
}

const FundPositions: React.FC<FundPositionsProps> = ({ positions: initialPositions, fundName }) => {
  const [positions, setPositions] = useState<FundPositionWithChange[]>(initialPositions);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // 刷新持仓涨跌数据
  const refreshStockData = useCallback(async () => {
    if (!positions || positions.length === 0) return;
    
    setRefreshing(true);
    try {
      const stockCodes = positions.map(p => p.stockCode);
      const stockData = await fetchStockRealtime(stockCodes);
      
      if (Object.keys(stockData).length > 0) {
        const updatedPositions = positions.map(pos => ({
          ...pos,
          changePercent: stockData[pos.stockCode] ?? pos.changePercent,
        }));
        setPositions(updatedPositions);
        setLastUpdate(new Date());
        console.log('[FundPositions] Stock data refreshed');
      }
    } catch (error) {
      console.error('[FundPositions] Failed to refresh stock data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [positions]);

  // 每分钟自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStockData();
    }, 60000); // 60秒

    return () => clearInterval(interval);
  }, [refreshStockData]);

  // 初始加载时刷新一次涨跌数据
  useEffect(() => {
    if (initialPositions && initialPositions.length > 0) {
      refreshStockData();
    }
  }, []); // 只在组件挂载时执行一次

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>暂无持仓数据</p>
        <p className="text-sm mt-2">该基金可能未披露最新持仓信息</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl">💼</span>
            <span>持仓明细</span>
            {fundName && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {fundName}
              </span>
            )}
          </h3>
          <button
            onClick={refreshStockData}
            disabled={refreshing}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
          >
            {refreshing ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                刷新中...
              </>
            ) : (
              <>
                <span>⟳</span>
                刷新涨跌
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          最后更新：{lastUpdate.toLocaleTimeString()}
        </p>
      </div>

      {/* 表格头部 */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">股票名称</div>
        <div className="col-span-3 text-right">持仓占比</div>
        <div className="col-span-4 text-right">实时涨跌</div>
      </div>

      {/* 持仓列表 */}
      <div className="divide-y divide-gray-100">
        {positions.slice(0, 10).map((position, index) => (
          <div
            key={position.stockCode}
            className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            {/* 序号 */}
            <div className="col-span-1 flex items-center justify-center">
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                index < 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </span>
            </div>

            {/* 股票名称和代码 */}
            <div className="col-span-4 flex flex-col justify-center">
              <span className="text-sm font-medium text-gray-900">{position.stockName}</span>
              <span className="text-xs text-gray-400 font-mono">{position.stockCode}</span>
            </div>

            {/* 仓位占比 */}
            <div className="col-span-3 flex items-center justify-end">
              <span className="text-sm font-semibold text-gray-900">
                {formatNumber(position.weight)}%
              </span>
            </div>

            {/* 实时涨跌 */}
            <div className="col-span-4 flex items-center justify-end">
              <span className={`text-sm font-bold ${getGrowthColorClass(position.changePercent)}`}>
                {formatPercent(position.changePercent)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          持仓数据来源于基金定期报告，实时涨跌每分钟自动刷新
        </p>
      </div>
    </div>
  );
};

export default FundPositions;
