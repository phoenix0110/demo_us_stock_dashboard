import { useQuery } from '@tanstack/react-query';
import { fetchStockDetails } from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Gauge } from '../common/Gauge';
import { CandlestickChart as DailyStockPriceChart } from '../common/CandlestickChart';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface StockDetailPanelProps {
  symbol: string;
  onMetricPick: (prompt: string) => void;
}

export function StockDetailPanel({ symbol, onMetricPick }: StockDetailPanelProps) {
  const { data: stock, isLoading } = useQuery({
    queryKey: ['stockDetails', symbol],
    queryFn: () => fetchStockDetails(symbol),
    refetchInterval: 30000,
  });

  if (isLoading || !stock) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="mb-4 h-8 w-32 rounded bg-slate-800" />
          <div className="h-4 w-24 rounded bg-slate-800/50" />
        </div>
      </Card>
    );
  }

  const isPositive = stock.change >= 0;
  const averageClose = (window: number, endOffset = 0) => {
    const endIndex = stock.dailyCandles.length - endOffset;
    const startIndex = Math.max(0, endIndex - window);
    const segment = stock.dailyCandles.slice(startIndex, endIndex);
    if (segment.length === 0) {
      return stock.price;
    }
    return segment.reduce((sum, candle) => sum + candle.close, 0) / segment.length;
  };
  const ma5 = averageClose(5);
  const ma10 = averageClose(10);
  const ma20 = averageClose(20);
  const ma5Prev = averageClose(5, 5);
  const ma20Prev = averageClose(20, 5);
  const movingAverage20 = stock.dailyCandles.reduce((sum, candle) => sum + candle.close, 0) / stock.dailyCandles.length;
  const ema12 = stock.dailyCandles.reduce((ema, candle, index) => {
    if (index === 0) {
      return candle.close;
    }
    const multiplier = 2 / (12 + 1);
    return candle.close * multiplier + ema * (1 - multiplier);
  }, 0);
  const atr14 = stock.dailyCandles.reduce((sum, candle, index) => {
    if (index === 0) {
      return sum + (candle.high - candle.low);
    }
    const prevClose = stock.dailyCandles[index - 1].close;
    const highLow = candle.high - candle.low;
    const highPrevClose = Math.abs(candle.high - prevClose);
    const lowPrevClose = Math.abs(candle.low - prevClose);
    return sum + Math.max(highLow, highPrevClose, lowPrevClose);
  }, 0) / stock.dailyCandles.length;
  const dailyReturns = stock.dailyCandles.slice(1).map((candle, index) => {
    const prevClose = stock.dailyCandles[index].close;
    return (candle.close - prevClose) / prevClose;
  });
  const averageReturn = dailyReturns.reduce((sum, value) => sum + value, 0) / Math.max(dailyReturns.length, 1);
  const variance = dailyReturns.reduce((sum, value) => sum + (value - averageReturn) ** 2, 0) / Math.max(dailyReturns.length, 1);
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100;
  const macdSignal =
    stock.price > stock.technical.macd.buySignal
      ? 'Bullish'
      : stock.price < stock.technical.macd.sellSignal
        ? 'Bearish'
        : 'Neutral';
  const trendStatus = ma5 > ma10 && ma10 > ma20
    ? 'strong_bull'
    : ma5 > ma10 && ma10 <= ma20
      ? 'weak_bull'
      : ma5 < ma10 && ma10 < ma20
        ? 'strong_bear'
        : ma5 < ma10 && ma10 >= ma20
          ? 'weak_bear'
          : 'consolidation';
  const currentSpread = ma20 > 0 ? ((ma5 - ma20) / ma20) * 100 : 0;
  const prevSpread = ma20Prev > 0 ? ((ma5Prev - ma20Prev) / ma20Prev) * 100 : 0;
  const isStrongBull = trendStatus === 'strong_bull' && currentSpread > prevSpread && currentSpread > 5;
  const biasMa5 = ma5 > 0 ? ((stock.price - ma5) / ma5) * 100 : 0;
  const baseBiasThreshold = 5;
  const effectiveBiasThreshold = isStrongBull ? baseBiasThreshold * 1.5 : baseBiasThreshold;
  const volumeRatio = stock.volume / 30000000;
  const supportMa5 = ma5 > 0 && Math.abs(stock.price - ma5) / ma5 <= 0.01 && stock.price >= ma5;
  const supportMa10 = ma10 > 0 && Math.abs(stock.price - ma10) / ma10 <= 0.02 && stock.price >= ma10;
  const trendScoreMap: Record<string, number> = {
    strong_bull: isStrongBull ? 30 : 26,
    weak_bull: 18,
    consolidation: 12,
    weak_bear: 8,
    strong_bear: 0,
  };
  const trendScore = trendScoreMap[trendStatus] ?? 12;
  let biasScore = 4;
  if (biasMa5 < 0) {
    if (biasMa5 > -3) {
      biasScore = 20;
    } else if (biasMa5 > -5) {
      biasScore = 16;
    } else {
      biasScore = 8;
    }
  } else if (biasMa5 < 2) {
    biasScore = 18;
  } else if (biasMa5 < baseBiasThreshold) {
    biasScore = 14;
  } else if (biasMa5 > baseBiasThreshold && biasMa5 <= effectiveBiasThreshold && isStrongBull) {
    biasScore = 10;
  }
  const volumeScore = volumeRatio <= 0.7 ? 15 : volumeRatio >= 2 ? 12 : volumeRatio <= 1 ? 10 : 6;
  const supportScore = (supportMa5 ? 5 : 0) + (supportMa10 ? 5 : 0);
  const macdScore = macdSignal === 'Bullish' ? 12 : macdSignal === 'Neutral' ? 8 : 2;
  const rsiValue = stock.technical.rsi;
  const rsiScore = rsiValue < 30 ? 10 : rsiValue <= 60 ? 8 : rsiValue <= 70 ? 5 : 0;
  const overallScore = Math.max(0, Math.min(100, trendScore + biasScore + volumeScore + supportScore + macdScore + rsiScore));
  const overallSignal =
    overallScore >= 75 && (trendStatus === 'strong_bull' || trendStatus === 'weak_bull')
      ? 'STRONG BUY'
      : overallScore >= 60 && (trendStatus === 'strong_bull' || trendStatus === 'weak_bull' || trendStatus === 'consolidation')
        ? 'BUY'
        : overallScore >= 45
          ? 'HOLD'
          : overallScore >= 30
            ? 'WAIT'
            : trendStatus === 'strong_bear' || trendStatus === 'weak_bear'
              ? 'STRONG SELL'
              : 'SELL';
  const overallSignalClass =
    overallSignal === 'STRONG BUY'
      ? 'text-emerald-300'
      : overallSignal === 'BUY'
        ? 'text-green-300'
        : overallSignal === 'HOLD'
          ? 'text-sky-300'
          : overallSignal === 'WAIT'
            ? 'text-amber-300'
            : overallSignal === 'SELL'
              ? 'text-orange-300'
              : 'text-red-300';
  const stockProfiles: Record<string, { industry: string; country: string; exchange: string }> = {
    AAPL: { industry: 'Consumer Electronics', country: 'US', exchange: 'NASDAQ' },
    MSFT: { industry: 'Software - Infrastructure', country: 'US', exchange: 'NASDAQ' },
    AMZN: { industry: 'Internet Retail', country: 'US', exchange: 'NASDAQ' },
    GOOGL: { industry: 'Internet Content & Information', country: 'US', exchange: 'NASDAQ' },
    META: { industry: 'Internet Content & Information', country: 'US', exchange: 'NASDAQ' },
    NVDA: { industry: 'Semiconductors', country: 'US', exchange: 'NASDAQ' },
    TSLA: { industry: 'Auto - Manufacturers', country: 'US', exchange: 'NASDAQ' },
  };
  const profile = stockProfiles[stock.symbol] ?? { industry: 'Unknown Industry', country: 'US', exchange: 'NASDAQ' };
  const commonIndicators = [
    { label: 'Volatility (30D)', value: `${volatility.toFixed(2)}%` },
    { label: 'MACD', value: macdSignal },
    { label: 'Volume', value: formatNumber(stock.volume) },
    { label: 'SMA (20)', value: formatNumber(movingAverage20) },
    { label: 'EMA (12)', value: formatNumber(ema12) },
    { label: 'ATR (14)', value: formatNumber(atr14) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="flex items-center text-3xl font-bold text-white">
            {stock.name} <span className="ml-2 text-lg font-normal text-slate-400">({stock.symbol})</span>
          </h2>
          <div className="mt-2 flex items-end">
            <span className="mr-4 text-4xl font-extrabold text-white">
              ${formatNumber(stock.price)}
            </span>
            <div className={`flex items-center text-lg font-medium mb-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-5 w-5 mr-1" /> : <ArrowDownRight className="h-5 w-5 mr-1" />}
              {isPositive ? '+' : ''}
              {stock.change.toFixed(2)} ({formatPercent(parseFloat(stock.changePercent))})
            </div>
          </div>
          <div className="mt-2 space-y-1 text-sm">
            <div className="text-slate-300">
              <span className="text-slate-400">Volume:</span> {formatNumber(stock.volume)}
            </div>
            <div className="text-slate-400">{profile.industry} | {profile.country} | {profile.exchange}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onMetricPick(`Ask financials for ${stock.symbol}: summarize revenue growth, margins, and valuation multiples.`)}
            className="rounded-md border border-blue-900/40 bg-blue-950/40 px-2.5 py-1.5 text-xs font-medium text-blue-100 transition hover:border-blue-500/60 hover:bg-blue-900/40"
          >
            Ask Financials
          </button>
          <button
            type="button"
            onClick={() => onMetricPick(`Ask comparison companies for ${stock.symbol}: compare with major peers on growth, profitability, and valuation.`)}
            className="rounded-md border border-blue-900/40 bg-blue-950/40 px-2.5 py-1.5 text-xs font-medium text-blue-100 transition hover:border-blue-500/60 hover:bg-blue-900/40"
          >
            Ask Comparison Companies
          </button>
          <button
            type="button"
            onClick={() => onMetricPick(`Ask equity reports for ${stock.symbol}: summarize recent analyst reports and key rating changes.`)}
            className="rounded-md border border-blue-900/40 bg-blue-950/40 px-2.5 py-1.5 text-xs font-medium text-blue-100 transition hover:border-blue-500/60 hover:bg-blue-900/40"
          >
            Ask Equity Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer transition hover:border-blue-500/50"
          onClick={() =>
            onMetricPick(
              `What is this market sentiment for ${stock.symbol}?`
            )
          }
        >
          <CardHeader>
            <CardTitle>Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <Gauge value={stock.technical.rsi} title="Sentiment Score (0-100)" />
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer transition hover:border-blue-500/50"
          onClick={() =>
            onMetricPick(
              `What is this daily stock price trend for ${stock.symbol}?`
            )
          }
        >
          <CardHeader>
            <CardTitle>Daily Stock Price</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyStockPriceChart data={stock.dailyCandles} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 items-stretch">
        <Card
          className="h-full cursor-pointer transition hover:border-blue-500/50"
          onClick={() =>
            onMetricPick(
              `What is this trade setup for ${stock.symbol}?`
            )
          }
        >
          <CardHeader>
            <CardTitle>Trade Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-violet-900/40 bg-violet-950/20 p-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-violet-300">
                    Overall Score
                  </div>
                  <div className="text-xl font-bold text-white">{overallScore}/100</div>
                  <div className={`mt-1 text-sm font-semibold ${overallSignalClass}`}>{overallSignal}</div>
                </div>
                <div className="rounded-lg border border-blue-900/40 bg-blue-950/30 p-3">
                  <div className="mb-2 flex items-center">
                    <div className="mr-2 rounded-full bg-blue-500/20 p-2">
                      <Target className="h-4 w-4 text-blue-300" />
                    </div>
                    <div className="text-sm font-medium text-blue-300">Suggested Entry</div>
                  </div>
                  <div className="text-xl font-bold text-white">${formatNumber(stock.recommendation.buyPrice)}</div>
                </div>
                <div className="rounded-lg border border-green-900/40 bg-green-950/20 p-3">
                  <div className="mb-1 flex items-center text-xs font-medium text-green-300">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500 opacity-80" />
                    Take Profit
                  </div>
                  <div className="text-xl font-bold text-white">${formatNumber(stock.recommendation.takeProfit)}</div>
                </div>
                <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-3">
                  <div className="mb-1 flex items-center text-xs font-medium text-red-300">
                    <TrendingDown className="mr-2 h-4 w-4 text-red-500 opacity-80" />
                    Stop Loss
                  </div>
                  <div className="text-xl font-bold text-white">${formatNumber(stock.recommendation.stopLoss)}</div>
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 pt-1">
                Confidence: {(stock.recommendation.confidence * 100).toFixed(0)}%
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {commonIndicators.map((indicator) => (
                  <button
                    key={indicator.label}
                    type="button"
                    onClick={() =>
                      onMetricPick(
                        `How should I interpret ${indicator.label} for ${stock.symbol} right now? Current reading: ${indicator.value}.`
                      )
                    }
                    className="rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-left transition hover:border-blue-500/40 hover:bg-slate-900"
                  >
                    <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{indicator.label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">{indicator.value}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Related News</CardTitle>
          </CardHeader>
          <CardContent>
            {stock.news.length > 0 ? (
              <div className="space-y-4">
                {stock.news.map((newsItem) => (
                  <div key={newsItem.id} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() =>
                        onMetricPick(
                          `What does this news mean for ${stock.symbol}: "${newsItem.title}"?`
                        )
                      }
                      className="group block text-left"
                    >
                      <h4 className="mb-1 text-lg font-medium text-white transition-colors group-hover:text-blue-400">
                        {newsItem.title}
                      </h4>
                      <p className="mb-2 line-clamp-2 text-sm text-slate-300">
                        {newsItem.description}
                      </p>
                      <div className="flex items-center text-xs text-slate-500">
                        <span className="mr-2 font-medium">{newsItem.source}</span>
                        <span>{new Date(newsItem.publishedAt).toLocaleString('en-US')}</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No related headlines available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
