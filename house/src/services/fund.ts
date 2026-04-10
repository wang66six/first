import axios from 'axios';
import type { FundRealtimeData, FundHistory, FundPositionWithChange } from '@/types';
import { MarketStatus } from '@/types';

// 创建 axios 实例
const request = axios.create({
  baseURL: '',
  timeout: 10000,
});

/**
 * 解析天天基金 API 返回的 JSONP 数据
 */
const parseTiantianData = (data: string): any => {
  const match = data.match(/jsonpgz\((.*)\)/);
  if (!match || !match[1]) {
    throw new Error('Invalid data format');
  }
  return JSON.parse(match[1]);
};

/**
 * 获取基金实时数据（天天基金 API）
 */
export const fetchFundRealtimeData = async (code: string): Promise<FundRealtimeData> => {
  try {
    // 使用 Vite 本地代理
    const targetUrl = `/api/fundgz/js/${code}.js`;
    
    const response = await request.get(targetUrl, {
      headers: {
        'Accept': '*/*',
      },
      timeout: 10000,
    });
    
    if (response.data) {
      const data = parseTiantianData(response.data);
        
      const estimatedValue = parseFloat(data.gsz);
      const netValue = parseFloat(data.dwjz);
      const estimatedGrowth = parseFloat(data.gszzl);
        
      return {
        code: data.fundcode,
        name: data.name || '',  // 从 API 获取基金名称
        netValue: netValue,
        accumulatedNetValue: netValue,
        estimatedValue: estimatedValue,
        estimatedGrowth: estimatedGrowth,
        growthAmount: estimatedValue - netValue,
        updateTime: data.gztime,
        marketStatus: MarketStatus.CLOSED,
      };
    }
    throw new Error('No data in response');
  } catch (error) {
    console.error(`Failed to fetch fund ${code}, using mock data:`, error);
    // 返回模拟数据用于测试
    const baseValue = 1.0 + Math.random() * 2;
    const growthRate = (Math.random() - 0.5) * 5;
    const estimatedValue = baseValue * (1 + growthRate / 100);
    
    return {
      code,
      name: '测试基金',
      netValue: Number(baseValue.toFixed(4)),
      accumulatedNetValue: Number(baseValue.toFixed(4)),
      estimatedValue: Number(estimatedValue.toFixed(4)),
      estimatedGrowth: Number(growthRate.toFixed(4)),
      growthAmount: Number((estimatedValue - baseValue).toFixed(4)),
      updateTime: new Date().toISOString(),
      marketStatus: MarketStatus.CLOSED,
    };
  }
};

/**
 * 获取基金持仓数据（天天基金 API）
 * 如果无法获取数据，返回空数组（不显示持仓）
 */
export const fetchFundPositions = async (code: string): Promise<FundPositionWithChange[]> => {
  try {
    console.log(`[Positions] Fetching positions for fund ${code}...`);
    
    // 使用天天基金持仓 API
    const targetUrl = `/api/fundf10/FundArchivesDatas.aspx?type=jjcc&code=${code}&topline=10`;
    
    const response = await request.get(targetUrl, {
      headers: {
        'Accept': '*/*',
      },
      timeout: 8000,
    });
    
    const data = response.data;
    console.log('[Positions] Raw response length:', data?.length);
    
    // 解析 HTML 格式的持仓数据
    if (data && typeof data === 'string') {
      const positions = parsePositionsFromHtml(data);
      if (positions.length > 0) {
        console.log('[Positions] Successfully parsed positions:', positions.length);
        return positions;
      }
    }
    
    console.warn('[Positions] No positions data available');
    return [];
  } catch (error) {
    console.error(`[Positions] Error fetching fund ${code} positions:`, error);
    // 返回空数组，不显示持仓
    return [];
  }
};

/**
 * 从 HTML 响应中解析持仓数据
 */
const parsePositionsFromHtml = (html: string): FundPositionWithChange[] => {
  const positions: FundPositionWithChange[] = [];
  
  try {
    // 匹配表格行数据：<td>序号</td><td><a>股票代码</a></td><td><a>股票名称</a></td><td>占比</td>
    const rowRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?<td[^>]*><a[^>]*>(\d+)<\/a><\/td>[\s\S]*?<td[^>]*><a[^>]*>([^<]+)<\/a><\/td>[\s\S]*?<td[^>]*class='tor'>([^<]+)%<\/td>/g;
    
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const [, , stockCode, stockName, weightStr] = match;
      const weight = parseFloat(weightStr);
      
      if (stockCode && stockName && !isNaN(weight)) {
        positions.push({
          stockCode: stockCode.trim(),
          stockName: stockName.trim(),
          weight,
          changePercent: 0,
          industry: '',
        });
      }
    }
    
    // 如果正则没匹配到，尝试简单匹配
    if (positions.length === 0) {
      // 备用正则：匹配股票代码和名称
      const simpleRegex = /href="[^"]*stock[^"]*"[^>]*>(\d{6})<\/a>[\s\S]*?href="[^"]*stock[^"]*"[^>]*>([^<]+)<\/a>[\s\S]*?class='tor[^']*'>([0-9.]+)%/g;
      
      while ((match = simpleRegex.exec(html)) !== null) {
        const [, stockCode, stockName, weightStr] = match;
        const weight = parseFloat(weightStr);
        
        if (stockCode && stockName && !isNaN(weight)) {
          positions.push({
            stockCode: stockCode.trim(),
            stockName: stockName.trim(),
            weight,
            changePercent: 0,
            industry: '',
          });
        }
      }
    }
  } catch (e) {
    console.error('[Positions] Error parsing HTML:', e);
  }
  
  return positions.slice(0, 10);  // 只返回前10条持仓
};

/**
 * 获取股票实时行情并更新持仓数据
 */
export const updatePositionsWithStockData = async (
  positions: FundPositionWithChange[]
): Promise<FundPositionWithChange[]> => {
  if (positions.length === 0) {
    console.log('[Stock] No positions to update');
    return positions;
  }
  
  try {
    console.log('[Stock] Updating positions with stock data for', positions.length, 'stocks...');
    const stockCodes = positions.map(pos => pos.stockCode);
    console.log('[Stock] Stock codes:', stockCodes);
    
    const stockData = await fetchStockRealtime(stockCodes);
    console.log('[Stock] Stock data fetched:', stockData);
    
    const updatedPositions = positions.map(pos => ({
      ...pos,
      changePercent: stockData[pos.stockCode] || 0,
    }));
    
    console.log('[Stock] Updated positions:', updatedPositions);
    return updatedPositions;
  } catch (error) {
    console.error('[Stock] Failed to update positions with stock data:', error);
    return positions;
  }
};

/**
 * 获取完整的基金数据（包含持仓）
 */
export const fetchFundWithPositions = async (code: string): Promise<FundRealtimeData> => {
  try {
    console.log(`[API] Starting to fetch fund ${code} with positions...`);
    
    // 1. 获取基金实时数据
    console.log('[API] Step 1: Fetching fund realtime data...');
    const fundData = await fetchFundRealtimeData(code);
    console.log('[API] Fund data fetched:', fundData);
    
    // 2. 获取持仓数据
    console.log('[API] Step 2: Fetching fund positions...');
    const positions = await fetchFundPositions(code);
    console.log('[API] Positions fetched:', positions?.length || 0);
    
    // 3. 如果有持仓数据，获取股票行情并更新
    let updatedPositions = positions;
    if (positions && positions.length > 0) {
      console.log('[API] Step 3: Updating positions with stock data...');
      updatedPositions = await updatePositionsWithStockData(positions);
      console.log('[API] Updated positions:', updatedPositions);
    }
    
    // 4. 合并数据
    const result = {
      ...fundData,
      positions: updatedPositions,
    };
    
    console.log('[API] Final result:', result);
    return result;
  } catch (error) {
    console.error(`[API] Failed to fetch fund ${code} with positions:`, error);
    // 返回基础数据（无持仓）
    const basicData = await fetchFundRealtimeData(code);
    return {
      ...basicData,
      positions: [],
    };
  }
};

/**
 * 获取基金历史净值数据
 */
export const fetchFundHistory = async (code: string, pageSize = 30): Promise<FundHistory[]> => {
  try {
    const targetUrl = `/api/eastmoney/f10_lsjz?fundCode=${code}&pageIndex=1&pageSize=${pageSize}`;
    
    const response = await request.get(targetUrl);
    const data = response.data;
    
    if (!data || !data.Data || !data.Data.LSJZ) {
      return [];
    }
    
    return data.Data.LSJZ.map((item: any) => ({
      date: item.FSRQ,
      netValue: parseFloat(item.DWJZ),
      accumulatedNetValue: parseFloat(item.LJJZ),
      dailyGrowth: parseFloat(item.JZZZL),
    }));
  } catch (error) {
    console.error(`Failed to fetch fund ${code} history:`, error);
    throw error;
  }
};

/**
 * 获取股票实时行情（腾讯股票 API）
 * 返回股票代码到涨跌幅的映射
 */
export const fetchStockRealtime = async (stockCodes: string[]): Promise<Record<string, number>> => {
  if (!stockCodes || stockCodes.length === 0) {
    return {};
  }
  
  try {
    console.log('[Stock API] Fetching stock data for codes:', stockCodes);
    
    // 添加市场前缀：沪市sh，深市sz
    const codes = stockCodes.map(code => {
      if (code.startsWith('6')) {
        return `sh${code}`;
      }
      return `sz${code}`;
    }).join(',');
    
    // 使用腾讯股票 API
    const targetUrl = `/api/tencent/q=${codes}`;
    console.log('[Stock API] Request URL:', targetUrl);
    
    const response = await request.get(targetUrl, { timeout: 8000 });
    const data = response.data;
    
    console.log('[Stock API] Raw response:', data.substring(0, 300));
    
    const result: Record<string, number> = {};
    
    // 解析腾讯股票数据格式
    // v_sh600519="1~贵州茅台~600519~当前价~昨收~今开~..."
    const regex = /v_([a-z]+(\d+))="([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(data)) !== null) {
      const [, , stockCode, stockData] = match;
      const parts = stockData.split('~');
      
      if (parts.length >= 5) {
        const currentPrice = parseFloat(parts[3]);  // 当前价格
        const prevClose = parseFloat(parts[4]);      // 昨收价
        
        if (prevClose > 0) {
          const changePercent = ((currentPrice - prevClose) / prevClose) * 100;
          result[stockCode] = Number(changePercent.toFixed(2));
          console.log(`[Stock API] ${stockCode}: 当前=${currentPrice}, 昨收=${prevClose}, 涨跌=${changePercent.toFixed(2)}%`);
        }
      }
    }
    
    console.log('[Stock API] Final result:', result);
    return result;
  } catch (error) {
    console.error('[Stock API] Failed to fetch stock realtime data:', error);
    return {};
  }
};

/**
 * 批量获取基金数据
 */
export const fetchFundsBatch = async (codes: string[]): Promise<FundRealtimeData[]> => {
  const promises = codes.map(code => fetchFundRealtimeData(code));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<FundRealtimeData> => result.status === 'fulfilled')
    .map(result => result.value);
};
