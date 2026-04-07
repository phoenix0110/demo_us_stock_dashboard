import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { fetchAllStocks } from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { formatNumber, formatPercent } from '../../utils/formatters';

interface StockListProps {
  selectedSymbol: string;
  onSelectStock: (symbol: string) => void;
  onMetricPick: (prompt: string) => void;
}

export function StockList({ selectedSymbol, onSelectStock, onMetricPick }: StockListProps) {
  const [symbolInput, setSymbolInput] = useState('');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'NVDA', 'TSLA']);
  const [inputError, setInputError] = useState('');
  const { data: stocks, isLoading } = useQuery({
    queryKey: ['allStocks'],
    queryFn: fetchAllStocks,
    refetchInterval: 30000,
  });

  const availableStocks = useMemo(() => stocks ?? [], [stocks]);
  const watchlistStocks = useMemo(() => {
    const stockMap = new Map(availableStocks.map((item) => [item.symbol, item]));
    return watchlistSymbols
      .map((symbol) => stockMap.get(symbol))
      .filter((item): item is (typeof availableStocks)[number] => item !== undefined);
  }, [availableStocks, watchlistSymbols]);
  const dailyHotTechStocks = useMemo(() => {
    return [...availableStocks]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 100)
      .sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent))
      .slice(0, 3);
  }, [availableStocks]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex justify-between items-center animate-pulse">
              <div className="flex flex-col space-y-2">
                <div className="h-4 w-12 rounded bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-800/50" />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="h-4 w-16 rounded bg-slate-800" />
                <div className="h-3 w-12 rounded bg-slate-800/50" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const addSymbolToWatchlist = (symbol: string) => {
    const stock = availableStocks.find((item) => item.symbol === symbol);
    if (!stock) {
      setInputError('Ticker not found in the current sample universe.');
      return;
    }
    if (watchlistSymbols.includes(symbol)) {
      setInputError('This ticker is already in your watchlist.');
      return;
    }
    setWatchlistSymbols((prev) => [...prev, symbol]);
    setInputError('');
    onSelectStock(symbol);
    onMetricPick(`What is this stock overview for ${symbol}?`);
  };
  const addToWatchlist = () => {
    const symbol = symbolInput.trim().toUpperCase();
    if (!symbol) {
      return;
    }
    addSymbolToWatchlist(symbol);
    setSymbolInput('');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Daily Nasdaq Tech Hot Stocks
          </div>
          <div className="space-y-2">
            {dailyHotTechStocks.map((stock) => {
              const isInWatchlist = watchlistSymbols.includes(stock.symbol);
              return (
                <div key={stock.symbol} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/70 px-2 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStock(stock.symbol);
                      onMetricPick(`What is this stock overview for ${stock.symbol}?`);
                    }}
                    className="text-left"
                  >
                    <div className="text-sm font-semibold text-white">{stock.symbol}</div>
                    <div className="text-xs text-slate-400">{stock.name}</div>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-green-400">{formatPercent(parseFloat(stock.changePercent))}</div>
                    <button
                      type="button"
                      onClick={() => addSymbolToWatchlist(stock.symbol)}
                      disabled={isInWatchlist}
                      className="inline-flex items-center gap-1 rounded-md border border-blue-500/40 bg-blue-500/15 px-2 py-1 text-xs font-semibold text-blue-200 transition enabled:hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {isInWatchlist ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={symbolInput}
                onChange={(event) => {
                  setSymbolInput(event.target.value.toUpperCase());
                  if (inputError) {
                    setInputError('');
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    addToWatchlist();
                  }
                }}
                placeholder="Enter ticker, e.g. TSLA"
                className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none ring-blue-500/40 placeholder:text-slate-500 focus:ring-2"
              />
            </div>
            <button
              type="button"
              onClick={addToWatchlist}
              className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {inputError && <div className="text-xs text-red-400">{inputError}</div>}
        </div>

        <div className="divide-y divide-slate-800">
          {watchlistStocks.map((stock) => {
            if (!stock) {
              return null;
            }
            const isSelected = selectedSymbol === stock.symbol;
            const isPositive = stock.change >= 0;

            return (
              <button
                key={stock.symbol}
                onClick={() => {
                  onSelectStock(stock.symbol);
                  onMetricPick(
                    `What is this stock overview for ${stock.symbol}?`
                  );
                }}
                className={`flex w-full items-center justify-between border-l-4 px-2 py-4 text-left transition-colors hover:bg-slate-800/50
                  ${isSelected ? 'border-blue-500 bg-blue-900/10' : 'border-transparent'}
                `}
              >
                <div>
                  <div className="font-bold text-white">{stock.symbol}</div>
                  <div className="text-xs text-slate-400">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">
                    {formatNumber(stock.price)}
                  </div>
                  <div className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}
                    {stock.change.toFixed(2)} ({formatPercent(parseFloat(stock.changePercent))})
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {watchlistStocks.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-6 text-center text-sm text-slate-400">
            No stocks in your watchlist yet. Add a ticker to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
