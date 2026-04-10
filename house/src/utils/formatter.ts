import dayjs from 'dayjs';

/**
 * 格式化涨跌幅百分比
 */
export const formatPercent = (value: number): string => {
  if (value === 0) return '0.00%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * 格式化数值（保留两位小数）
 */
export const formatNumber= (value: number): string => {
  return value.toFixed(2);
};

/**
 * 格式化金额
 */
export const formatAmount = (value: number): string => {
  return `¥${value.toFixed(2)}`;
};

/**
 * 格式化时间
 */
export const formatTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

/**
 * 格式化基金代码（添加后缀）
 */
export const formatFundCode= (code: string): string => {
  return code.padStart(6, '0');
};

/**
 * 判断是否为交易时间
 */
export const isTradingTime = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const day = now.getDay();
  
  // 周末不交易
  if (day === 0 || day === 6) return false;
  
  // 判断是否在交易时段 (9:30-11:30, 13:00-15:00)
  const morningStart = hour === 9 && minute >= 30;
  const morningEnd = hour < 11 || (hour === 11 && minute <= 30);
  const afternoonStart = hour >= 13;
  const afternoonEnd = hour < 15;
  
  return (morningStart && morningEnd) || (afternoonStart && afternoonEnd && hour !== 15);
};

/**
 * 计算涨跌金额
 */
export const calculateGrowthAmount = (currentValue: number, previousValue: number): number => {
  return currentValue - previousValue;
};

/**
 * 计算涨跌幅百分比
 */
export const calculateGrowthRate = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * 计算 LOF 溢价率
 */
export const calculatePremiumRate = (innerPrice: number, estimatedValue: number): number => {
  if (estimatedValue === 0) return 0;
  return ((innerPrice - estimatedValue) / estimatedValue) * 100;
};

/**
 * 获取涨跌幅颜色类名
 */
export const getGrowthColorClass = (value: number): string => {
  if (value > 0) return 'text-red-500';
  if (value < 0) return 'text-green-500';
  return 'text-gray-500';
};

/**
 * 获取涨跌幅背景色类名
 */
export const getGrowthBgClass = (value: number): string => {
  if (value > 0) return 'bg-red-50';
  if (value < 0) return 'bg-green-50';
  return 'bg-gray-50';
};
