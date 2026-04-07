import { useQuery } from '@tanstack/react-query';
import { fetchIndices } from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { MiniChart } from '../common/MiniChart';
import { formatNumber, formatPercent } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface IndexCardsProps {
  onMetricPick: (prompt: string) => void;
}

export function IndexCards({ onMetricPick }: IndexCardsProps) {
  const { data: indices, isLoading } = useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndices,
    refetchInterval: 30000,
  });

  if (isLoading || !indices) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            </CardHeader>
            <CardContent>
              <div className="mb-2 h-8 w-32 rounded bg-slate-800" />
              <div className="h-16 w-full rounded bg-slate-800/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {indices.map((index) => {
        const isPositive = index.change >= 0;
        
        return (
          <Card
            key={index.symbol}
            className="cursor-pointer transition hover:border-blue-500/50 hover:bg-slate-900/80"
            onClick={() =>
              onMetricPick(
                `What does ${index.name} mean for the market right now?`
              )
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                {index.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatNumber(index.price)}</div>
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    <span>
                      {Math.abs(index.change).toFixed(2)} ({formatPercent(parseFloat(index.changePercent))})
                    </span>
                  </div>
                </div>
              </div>
              <MiniChart data={index.trend} isPositive={isPositive} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
