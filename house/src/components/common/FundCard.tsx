import React from 'react';
import type { FundRealtimeData } from '@/types';
import { formatPercent, formatNumber, getGrowthColorClass, getGrowthBgClass } from '@/utils/formatter';

interface FundCardProps {
  data: FundRealtimeData;
  onAddToPortfolio?: (code: string) => void;
}

const FundCard: React.FC<FundCardProps> = ({ data, onAddToPortfolio }) => {
  const growthRate = data.estimatedGrowth;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* 基金头部信息 */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{data.code}</h3>
          {data.name && <p className="text-sm text-gray-700 mt-0.5 font-medium">{data.name}</p>}
          <p className="text-xs text-gray-500 mt-1">更新时间：{new Date(data.updateTime).toLocaleString()}</p>
        </div>
        {onAddToPortfolio && (
          <button
            onClick={() => onAddToPortfolio(data.code)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            + 自选
          </button>
        )}
      </div>

      {/* 涨跌幅显示 */}
      <div className={`mb-4 p-3 rounded-lg ${getGrowthBgClass(growthRate)}`}>
        <div className={`text-2xl font-bold ${getGrowthColorClass(growthRate)}`}>
          {formatPercent(growthRate)}
        </div>
        <div className={`text-sm mt-1 ${getGrowthColorClass(growthRate)}`}>
          涨跌：{formatNumber(data.growthAmount)}
        </div>
      </div>

      {/* 净值信息 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">估算净值</span>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            ¥{formatNumber(data.estimatedValue)}
          </p>
        </div>
        <div>
          <span className="text-gray-500">单位净值</span>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            ¥{formatNumber(data.netValue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
