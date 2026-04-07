export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  timestamp: string;
}

export interface StockIndex extends StockQuote {
  name: string;
  fullName: string;
  trend: number[]; // Added to support mini chart
}

export interface TechnicalIndicator {
  rsi: number;
  macd: {
    buySignal: number;
    sellSignal: number;
  };
}

export interface StockRecommendation {
  buyPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
}

export interface DailyCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketNews {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  relatedStocks: string[];
}

export interface DetailedStock extends StockQuote {
  name: string;
  technical: TechnicalIndicator;
  recommendation: StockRecommendation;
  news: MarketNews[];
  trend: number[];
  dailyCandles: DailyCandle[];
}
