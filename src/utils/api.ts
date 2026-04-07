import { DetailedStock, MarketNews, StockIndex } from '../types/stock';

// Mock data generation
const generateTrend = (base: number, points: number = 20) => {
  let current = base;
  return Array.from({ length: points }).map(() => {
    current += (Math.random() - 0.5) * (base * 0.02); // 2% max change per point
    return current;
  });
};

const generateDailyCandles = (base: number, days: number = 30) => {
  const result: { date: string; open: number; high: number; low: number; close: number }[] = [];
  let previousClose = base;

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const open = previousClose * (1 + (Math.random() - 0.5) * 0.015);
    const close = open * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    previousClose = close;

    result.push({
      date: date.toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
    });
  }

  return result;
};

const INDICES: StockIndex[] = [
  {
    symbol: '^DJI',
    name: 'Dow',
    fullName: 'Dow Jones Industrial Average',
    price: 39150.33,
    change: 125.08,
    changePercent: '+0.32%',
    volume: 320000000,
    timestamp: new Date().toISOString(),
    trend: generateTrend(39000),
  },
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    fullName: 'S&P 500 Index',
    price: 5088.80,
    change: -2.43,
    changePercent: '-0.05%',
    volume: 2400000000,
    timestamp: new Date().toISOString(),
    trend: generateTrend(5000),
  },
  {
    symbol: '^IXIC',
    name: 'Nasdaq',
    fullName: 'Nasdaq Composite',
    price: 15996.82,
    change: -44.80,
    changePercent: '-0.28%',
    volume: 4500000000,
    timestamp: new Date().toISOString(),
    trend: generateTrend(16000),
  },
  {
    symbol: '^RUT',
    name: 'Russell 2000',
    fullName: 'Russell 2000 Index',
    price: 2016.69,
    change: 2.75,
    changePercent: '+0.14%',
    volume: 800000000,
    timestamp: new Date().toISOString(),
    trend: generateTrend(2000),
  }
];

const SEVEN_SISTERS: Record<string, DetailedStock> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple',
    price: 182.52,
    change: 1.34,
    changePercent: '+0.74%',
    volume: 45678900,
    timestamp: new Date().toISOString(),
    trend: generateTrend(180),
    technical: {
      rsi: 45, // Neutral
      macd: { buySignal: 178, sellSignal: 190 }
    },
    recommendation: {
      buyPrice: 180.00,
      stopLoss: 175.50,
      takeProfit: 195.00,
      confidence: 0.85
    },
    dailyCandles: generateDailyCandles(180),
    news: [
      {
        id: 'n1',
        title: 'Vision Pro demand beats expectations as analysts raise unit forecast',
        description: 'Supply-chain checks indicate strong pre-orders for Apple Vision Pro in core markets.',
        url: '#',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'TechCrunch',
        relatedStocks: ['AAPL']
      },
      {
        id: 'n2',
        title: 'Apple reportedly ends decade-long EV effort and reallocates talent to AI',
        description: 'The company is said to shift engineering resources from EV development toward generative AI.',
        url: '#',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'Bloomberg',
        relatedStocks: ['AAPL']
      }
    ]
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft',
    price: 410.34,
    change: -2.15,
    changePercent: '-0.52%',
    volume: 23456700,
    timestamp: new Date().toISOString(),
    trend: generateTrend(415),
    technical: {
      rsi: 68, // Slightly strong
      macd: { buySignal: 405, sellSignal: 420 }
    },
    recommendation: {
      buyPrice: 405.50,
      stopLoss: 395.00,
      takeProfit: 430.00,
      confidence: 0.75
    },
    dailyCandles: generateDailyCandles(415),
    news: [
      {
        id: 'n3',
        title: 'Microsoft expands Copilot capabilities for enterprise workflows',
        description: 'New AI features are expected to increase productivity and strengthen enterprise upsell.',
        url: '#',
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        source: 'The Verge',
        relatedStocks: ['MSFT']
      }
    ]
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon',
    price: 174.58,
    change: 1.12,
    changePercent: '+0.65%',
    volume: 34567800,
    timestamp: new Date().toISOString(),
    trend: generateTrend(170),
    technical: {
      rsi: 55, // Neutral
      macd: { buySignal: 170, sellSignal: 180 }
    },
    recommendation: {
      buyPrice: 172.00,
      stopLoss: 165.00,
      takeProfit: 185.00,
      confidence: 0.8
    },
    dailyCandles: generateDailyCandles(170),
    news: []
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet',
    price: 138.75,
    change: -0.85,
    changePercent: '-0.61%',
    volume: 21345600,
    timestamp: new Date().toISOString(),
    trend: generateTrend(140),
    technical: {
      rsi: 35, // Slightly weak
      macd: { buySignal: 135, sellSignal: 145 }
    },
    recommendation: {
      buyPrice: 135.00,
      stopLoss: 130.00,
      takeProfit: 150.00,
      confidence: 0.7
    },
    dailyCandles: generateDailyCandles(140),
    news: []
  },
  META: {
    symbol: 'META',
    name: 'Meta',
    price: 485.58,
    change: 4.25,
    changePercent: '+0.88%',
    volume: 18765400,
    timestamp: new Date().toISOString(),
    trend: generateTrend(480),
    technical: {
      rsi: 75, // Strong
      macd: { buySignal: 470, sellSignal: 500 }
    },
    recommendation: {
      buyPrice: 475.00,
      stopLoss: 450.00,
      takeProfit: 520.00,
      confidence: 0.9
    },
    dailyCandles: generateDailyCandles(480),
    news: []
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 788.17,
    change: 15.34,
    changePercent: '+1.98%',
    volume: 56789000,
    timestamp: new Date().toISOString(),
    trend: generateTrend(770),
    technical: {
      rsi: 85, // Overbought
      macd: { buySignal: 750, sellSignal: 820 }
    },
    recommendation: {
      buyPrice: 760.00,
      stopLoss: 720.00,
      takeProfit: 850.00,
      confidence: 0.65
    },
    dailyCandles: generateDailyCandles(770),
    news: [
      {
        id: 'n4',
        title: 'NVIDIA unveils next-gen AI architecture with major performance gains',
        description: 'The Blackwell platform announcement at GTC triggered strong market reaction.',
        url: '#',
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        source: 'Reuters',
        relatedStocks: ['NVDA']
      }
    ]
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla',
    price: 202.64,
    change: -3.56,
    changePercent: '-1.73%',
    volume: 87654300,
    timestamp: new Date().toISOString(),
    trend: generateTrend(210),
    technical: {
      rsi: 25, // Oversold
      macd: { buySignal: 195, sellSignal: 215 }
    },
    recommendation: {
      buyPrice: 198.00,
      stopLoss: 185.00,
      takeProfit: 230.00,
      confidence: 0.6
    },
    dailyCandles: generateDailyCandles(210),
    news: []
  }
};

const MARKET_NEWS: MarketNews[] = [
  {
    id: 'm1',
    title: 'Fed Chair signals potential rate cuts later this year',
    description: 'The Fed indicates easing could begin if inflation continues to trend toward target.',
    url: '#',
    publishedAt: new Date(Date.now() - 1200000).toISOString(),
    source: 'WSJ',
    relatedStocks: []
  },
  {
    id: 'm2',
    title: 'US payrolls beat expectations, labor market remains resilient',
    description: 'Latest labor report shows stronger-than-expected hiring with unemployment near cycle lows.',
    url: '#',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: 'CNBC',
    relatedStocks: []
  },
  {
    id: 'm3',
    title: 'OPEC+ extends production cuts, supporting crude prices',
    description: 'Major producers agreed to maintain voluntary cuts through quarter-end.',
    url: '#',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: 'Bloomberg',
    relatedStocks: []
  },
  {
    id: 'm4',
    title: 'Megacap tech leads gains as Nasdaq pushes to fresh highs',
    description: 'AI momentum continues to support large-cap technology valuations.',
    url: '#',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: 'Financial Times',
    relatedStocks: []
  }
];

// API Functions
export const fetchIndices = async (): Promise<StockIndex[]> => {
  // Simulate network delay
  return new Promise(resolve => setTimeout(() => resolve(INDICES), 500));
};

export const fetchStockDetails = async (symbol: string): Promise<DetailedStock> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stock = SEVEN_SISTERS[symbol];
      if (stock) {
        resolve(stock);
      } else {
        reject(new Error(`Stock ${symbol} not found`));
      }
    }, 500);
  });
};

export const fetchAllStocks = async (): Promise<DetailedStock[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(Object.values(SEVEN_SISTERS)), 500);
  });
};

export const fetchMarketNews = async (): Promise<MarketNews[]> => {
  return new Promise(resolve => setTimeout(() => resolve(MARKET_NEWS), 500));
};
