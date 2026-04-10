// 基金类型枚举
export enum FundType {
  STOCK = 'STOCK',           // 股票型
  MIXED = 'MIXED',           // 混合型
  BOND = 'BOND',             // 债券型
  MONEY = 'MONEY',           // 货币型
  QDII = 'QDII',             // QDII 型
  LOF = 'LOF',               // LOF 型
  ETF_LINK = 'ETF_LINK',     // ETF 联接
  INDEX = 'INDEX'            // 指数型
}

// 市场状态
export enum MarketStatus {
  OPEN = 'OPEN',             // 交易中
  CLOSED = 'CLOSED',         // 已收盘
  CALL_AUCTION = 'CALL_AUCTION' // 集合竞价
}

// 基金基本信息
export interface Fund {
  code: string;           // 基金代码
  name: string;           // 基金名称
  type: FundType;         // 基金类型
  fullName?: string;      // 基金全称
  manager?: string;       // 基金经理
  company?: string;       // 基金公司
  establishedDate?: string;// 成立日期
}

// 基金实时数据（增强版）
export interface FundRealtimeData {
 code: string;           // 基金代码
  name?: string;          // 基金名称
  netValue: number;       // 单位净值 (最新)
  accumulatedNetValue: number; // 累计净值
  estimatedValue: number; // 实时估值
  estimatedGrowth: number;// 实时涨跌幅 (%)
  growthAmount: number;   // 涨跌金额
  updateTime: string;     // 更新时间 (ISO 8601)
  marketStatus: MarketStatus; // 市场状态
  positions?: FundPositionWithChange[]; // 持仓数据（增强）
}

// 基金持仓信息（带当日涨幅）
export interface FundPositionWithChange {
  stockCode: string;      // 股票代码
  stockName: string;      // 股票名称
  weight: number;         // 占比 (%)
  marketValue?: number;   // 市值 (万元)
  changePercent: number;  // 个股涨跌幅 (%)
  industry?: string;      // 所属行业
  latestPrice?: number;   // 最新价
  openPrice?: number;     // 开盘价
  highPrice?: number;     // 最高价
  lowPrice?: number;      // 最低价
}

// 基金持仓信息
export interface FundPosition {
  stockCode: string;      // 股票代码
  stockName: string;      // 股票名称
  weight: number;         // 占比 (%)
  marketValue?: number;   // 市值 (万元)
  changePercent: number;  // 个股涨跌幅 (%)
  industry?: string;      // 所属行业
}

// 基金历史数据
export interface FundHistory {
  date: string;           // 日期
  netValue: number;       // 单位净值
  accumulatedNetValue: number; // 累计净值
  dailyGrowth: number;    // 日涨跌幅 (%)
  estimatedValue?: number;// 估值 (如有)
}

// LOF 基金套利数据
export interface LOFArbitrageData {
  fundCode: string;       // 基金代码
  estimatedValue: number; // 基金估值
  innerPrice: number;     // 场内价格
  premiumRate: number;    // 溢价率 (%)
  arbitrageSpace: number; // 套利空间 (%)
  volume: number;         // 成交量
  turnover: number;       // 成交额 (万元)
}

// 用户自选基金项
export interface FundItem {
  fund: Fund;             // 基金信息
  addTime: string;        // 添加时间
  tags?: string[];        // 标签
  note?: string;          // 备注
}

// 提醒配置
export interface AlertConfig {
  id: string;             // 提醒 ID
  fundCode: string;       // 基金代码
  type: 'GROWTH' | 'DROP' | 'VALUE_BREAK'; // 提醒类型
  threshold: number;      // 阈值
  enabled: boolean;       // 是否启用
  notifyMethod: ('BROWSER' | 'EMAIL' | 'SMS')[]; // 通知方式
  createTime: string;     // 创建时间
}

// API 响应格式
export interface ApiResponse<T> {
  code: number;             // 状态码
  message: string;          // 提示信息
  data: T;                  // 数据内容
  timestamp: number;        // 时间戳
}
