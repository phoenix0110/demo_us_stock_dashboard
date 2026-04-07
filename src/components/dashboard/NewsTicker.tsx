import { useQuery } from '@tanstack/react-query';
import { fetchMarketNews } from '../../utils/api';
import { Rss } from 'lucide-react';

interface NewsTickerProps {
  onMetricPick: (prompt: string) => void;
}

export function NewsTicker({ onMetricPick }: NewsTickerProps) {
  const { data: news, isLoading } = useQuery({
    queryKey: ['marketNews'],
    queryFn: fetchMarketNews,
    refetchInterval: 300000,
  });

  if (isLoading || !news || news.length === 0) {
    return (
      <div className="w-full bg-slate-900 text-white flex items-center h-10 px-4">
        <Rss className="h-4 w-4 mr-2 text-blue-400 shrink-0" />
        <span className="text-sm">Loading latest market headlines...</span>
      </div>
    );
  }

  const tickerItems = [...news, ...news];

  return (
    <div className="w-full bg-slate-900 text-white flex items-center h-10 overflow-hidden relative">
      <div className="absolute left-0 bg-slate-900 z-10 px-4 h-full flex items-center shadow-[10px_0_10px_-5px_rgba(15,23,42,1)]">
        <Rss className="h-4 w-4 mr-2 text-blue-400 shrink-0" />
        <span className="text-sm font-semibold whitespace-nowrap">Market Wire</span>
      </div>
      
      <div className="flex animate-ticker whitespace-nowrap ml-32 hover:[animation-play-state:paused]">
        {tickerItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center mx-8">
            <span className="text-sm text-slate-300 mr-2">
              {new Date(item.publishedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              type="button"
              onClick={() =>
                onMetricPick(
                  `What does this market news mean: "${item.title}"?`
                )
              }
              className="text-sm hover:text-blue-400 transition-colors"
            >
              {item.title}
            </button>
            {item.source && (
              <span className="text-xs text-slate-500 ml-2">({item.source})</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
