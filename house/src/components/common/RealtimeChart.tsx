import React, { useEffect, useState, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface EstimatePoint {
  time: string;
  value: number;
  change: number;
}

interface RealtimeChartProps {
  fundCode: string;
  fundName?: string;
  currentValue: number;
  baseValue: number;  // 昨日净值
  estimatedGrowth: number;
}

const RealtimeChart: React.FC<RealtimeChartProps> = ({
  fundCode,
  fundName,
  currentValue,
  baseValue,
  estimatedGrowth,
}) => {
  const [chartData, setChartData] = useState<EstimatePoint[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 生成当日分时估值数据
  const generateIntradayData = (): EstimatePoint[] => {
    const data: EstimatePoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // 交易时间：9:30-11:30, 13:00-15:00
    const tradingPeriods = [
      { start: 9 * 60 + 30, end: 11 * 60 + 30 },  // 上午
      { start: 13 * 60, end: 15 * 60 },           // 下午
    ];
    
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // 生成从开盘到当前时间的数据点
    for (const period of tradingPeriods) {
      const endTime = Math.min(period.end, currentTimeInMinutes);
      if (period.start > currentTimeInMinutes) break;
      
      for (let t = period.start; t <= endTime; t += 5) { // 每5分钟一个点
        const hour = Math.floor(t / 60);
        const minute = t % 60;
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // 模拟估值波动
        const progress = (t - 9 * 60 - 30) / (5.5 * 60); // 交易进度
        const noise = (Math.random() - 0.5) * 0.3;
        const trendFactor = estimatedGrowth * progress + noise;
        
        const value = baseValue * (1 + trendFactor / 100);
        const change = ((value - baseValue) / baseValue) * 100;
        
        data.push({
          time: timeStr,
          value: Number(value.toFixed(4)),
          change: Number(change.toFixed(2)),
        });
      }
    }
    
    // 如果没有生成数据（非交易时间），生成模拟全天数据
    if (data.length === 0) {
      const periods = [
        { start: 9 * 60 + 30, end: 11 * 60 + 30 },
        { start: 13 * 60, end: 15 * 60 },
      ];
      
      for (const period of periods) {
        for (let t = period.start; t <= period.end; t += 5) {
          const hour = Math.floor(t / 60);
          const minute = t % 60;
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          const totalMinutes = (11.5 - 9.5) * 60 + (15 - 13) * 60;
          const elapsedMinutes = t <= 11 * 60 + 30 
            ? t - (9 * 60 + 30) 
            : (11.5 - 9.5) * 60 + (t - 13 * 60);
          const progress = elapsedMinutes / totalMinutes;
          
          const noise = (Math.random() - 0.5) * 0.2 * (1 - progress * 0.5);
          const trendFactor = estimatedGrowth * progress + noise;
          
          const value = baseValue * (1 + trendFactor / 100);
          const change = ((value - baseValue) / baseValue) * 100;
          
          data.push({
            time: timeStr,
            value: Number(value.toFixed(4)),
            change: Number(change.toFixed(2)),
          });
        }
      }
    }
    
    // 确保最后一个点是当前估值
    if (data.length > 0) {
      data[data.length - 1] = {
        time: data[data.length - 1].time,
        value: currentValue,
        change: estimatedGrowth,
      };
    }
    
    return data;
  };

  useEffect(() => {
    setChartData(generateIntradayData());
    
    // 每30秒更新一次
    intervalRef.current = setInterval(() => {
      setChartData(generateIntradayData());
    }, 30000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fundCode, currentValue, baseValue, estimatedGrowth]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>暂无估值数据</p>
        </div>
      </div>
    );
  }

  // 计算Y轴范围
  const values = chartData.map(d => d.value);
  const minValue = Math.min(...values, baseValue);
  const maxValue = Math.max(...values, baseValue);
  const padding = (maxValue - minValue) * 0.15 || 0.01;

  // 根据涨跌确定颜色
  const isUp = estimatedGrowth >= 0;
  const lineColor = isUp ? '#ef4444' : '#22c55e';
  const fillColor = isUp ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span>当日实时估值走势</span>
          {fundName && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              - {fundName}
            </span>
          )}
        </h3>
      </div>

      {/* 图表区域 */}
      <div className="p-4">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minValue - padding, maxValue + padding]}
                tick={{ fontSize: 11, fill: '#666' }}
                tickFormatter={(value) => value.toFixed(4)}
                width={60}
              />
              <ReferenceLine
                y={baseValue}
                stroke="#9ca3af"
                strokeDasharray="5 5"
                label={{ value: '昨收', fontSize: 10, fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any, name: any, props: any) => {
                  if (name === 'value') {
                    const change = props?.payload?.change;
                    const changeStr = change !== undefined 
                      ? (change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`)
                      : '';
                    return [
                      `${Number(value).toFixed(4)} ${changeStr ? `(${changeStr})` : ''}`,
                      '估值'
                    ];
                  }
                  return [Number(value).toFixed(2) + '%', '涨跌'];
                }}
                labelFormatter={(label) => `时间: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                fill={fillColor}
                dot={false}
                activeDot={{ r: 4, fill: lineColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 底部统计 */}
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">昨日净值</p>
            <p className="text-base font-bold text-gray-900">{baseValue.toFixed(4)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">当前估值</p>
            <p className={`text-base font-bold ${isUp ? 'text-red-600' : 'text-green-600'}`}>
              {currentValue.toFixed(4)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">估算涨跌</p>
            <p className={`text-base font-bold ${isUp ? 'text-red-600' : 'text-green-600'}`}>
              {isUp ? '+' : ''}{estimatedGrowth.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChart;
