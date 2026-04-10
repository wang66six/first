import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import FundSearch from '@/components/common/FundSearch';
import FundCard from '@/components/common/FundCard';
import FundPositions from '@/components/common/FundPositions';
import RealtimeChart from '@/components/common/RealtimeChart';
import QueryHistory from '@/components/common/QueryHistory';
import { addQueryHistory } from '@/store/slices/queryHistorySlice';
import { fetchFundWithPositions } from '@/services/fund';
import type { FundRealtimeData } from '@/types';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  
  // 搜索相关状态
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<FundRealtimeData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 搜索基金
  const handleSearch = async (code: string) => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      setSearchResult(null);
      
      console.log('[Search] Searching for fund:', code);
      const data = await fetchFundWithPositions(code);
      
      console.log('[Search] Search result:', data);
      setSearchResult(data);
      
      // 添加到历史记录
      dispatch(addQueryHistory(data));
    } catch (err) {
      setSearchError('查询失败，请检查基金代码是否正确');
      console.error('[Search] Error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // 关闭搜索结果
  const handleCloseSearch = () => {
    setSearchResult(null);
    setSearchError(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">基金实时估值查询</h1>
        <p className="text-gray-600">输入基金代码，查询实时估值、净值走势和持仓明细</p>
      </div>

      {/* 搜索框 */}
      <div className="mb-8 flex justify-center">
        <FundSearch onSearch={handleSearch} loading={searchLoading} />
      </div>

      {/* 加载状态 */}
      {searchLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">正在查询基金数据...</p>
        </div>
      )}

      {/* 错误提示 */}
      {searchError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{searchError}</p>
          <p className="text-sm text-red-500 mt-2">请检查基金代码是否正确，或稍后重试</p>
        </div>
      )}

      {/* 查询结果 */}
      {searchResult && (
        <div className="space-y-6 mb-8">
          {/* 关闭按钮 */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">查询结果</h2>
            <button
              onClick={handleCloseSearch}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 基金基本信息卡片 */}
          <FundCard data={searchResult} />

          {/* 当日实时估值走势 */}
          <RealtimeChart
            fundCode={searchResult.code}
            fundName={searchResult.name}
            currentValue={searchResult.estimatedValue}
            baseValue={searchResult.netValue}
            estimatedGrowth={searchResult.estimatedGrowth}
          />

          {/* 持仓信息 */}
          {searchResult.positions && searchResult.positions.length > 0 && (
            <FundPositions
              positions={searchResult.positions}
              fundName={searchResult.name}
            />
          )}
        </div>
      )}

      {/* 历史查询记录 */}
      <div className="mb-8">
        <QueryHistory onSelectFund={handleSearch} />
      </div>

      {/* 免责声明 */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <strong>⚠️ 免责声明：</strong>本估算数据基于基金定期报告披露的持仓计算，实际净值以基金公司公布为准。
        估算数据仅供参考，不构成投资建议。
      </div>
    </div>
  );
};

export default Home;
