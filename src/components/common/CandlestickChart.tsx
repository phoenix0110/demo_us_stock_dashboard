import { useState } from 'react';

interface DailyCandle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: DailyCandle[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 920;
  const height = 300;
  const padding = { top: 18, right: 24, bottom: 28, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full rounded-lg border border-slate-800 bg-slate-950/40" />
    );
  }

  const highs = data.map((item) => item.high);
  const lows = data.map((item) => item.low);
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const range = Math.max(maxPrice - minPrice, 0.0001);

  const xStep = innerWidth / data.length;
  const bodyWidth = Math.max(3, xStep * 0.55);

  const yScale = (value: number) => padding.top + ((maxPrice - value) / range) * innerHeight;
  const xScale = (index: number) => padding.left + xStep * index + xStep / 2;

  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks }, (_, i) => maxPrice - (range * i) / (yTicks - 1));
  const xTicks = [0, Math.floor(data.length / 2), data.length - 1];
  const hoveredCandle = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredChangePercent = hoveredCandle
    ? ((hoveredCandle.close - hoveredCandle.open) / hoveredCandle.open) * 100
    : null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50 p-2">
      {hoveredCandle && hoveredChangePercent !== null && (
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-md border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-100 shadow-lg">
          <div className="mb-1 font-semibold text-slate-200">
            {new Date(hoveredCandle.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div>Open: {hoveredCandle.open.toFixed(2)}</div>
          <div>High: {hoveredCandle.high.toFixed(2)}</div>
          <div>Low: {hoveredCandle.low.toFixed(2)}</div>
          <div>Close: {hoveredCandle.close.toFixed(2)}</div>
          <div className={hoveredChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
            Change: {hoveredChangePercent >= 0 ? '+' : ''}
            {hoveredChangePercent.toFixed(2)}%
          </div>
        </div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[300px] w-full"
        onMouseLeave={() => setHoveredIndex(null)}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const relativeX = ((event.clientX - bounds.left) / bounds.width) * width;
          const chartX = relativeX - padding.left;
          if (chartX < 0 || chartX > innerWidth) {
            setHoveredIndex(null);
            return;
          }
          const nextIndex = Math.min(data.length - 1, Math.max(0, Math.floor(chartX / xStep)));
          setHoveredIndex(nextIndex);
        }}
      >
        <rect x={0} y={0} width={width} height={height} fill="transparent" />

        {tickValues.map((tick) => {
          const y = yScale(tick);
          return (
            <g key={tick.toFixed(2)}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeWidth={1} />
              <text x={padding.left - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize={11}>
                {tick.toFixed(2)}
              </text>
            </g>
          );
        })}

        {data.map((item, index) => {
          const x = xScale(index);
          const openY = yScale(item.open);
          const closeY = yScale(item.close);
          const highY = yScale(item.high);
          const lowY = yScale(item.low);
          const isBull = item.close >= item.open;
          const candleColor = isBull ? '#22c55e' : '#ef4444';
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(openY - closeY), 2);

          return (
            <g key={`${item.date}-${index}`}>
              {hoveredIndex === index && (
                <rect
                  x={x - xStep / 2}
                  y={padding.top}
                  width={xStep}
                  height={innerHeight}
                  fill="rgba(59, 130, 246, 0.08)"
                />
              )}
              <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth={1.2} />
              <rect
                x={x - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={bodyHeight}
                fill={isBull ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)'}
                stroke={candleColor}
                strokeWidth={1.2}
              />
            </g>
          );
        })}
        {hoveredIndex !== null && (
          <line
            x1={xScale(hoveredIndex)}
            y1={padding.top}
            x2={xScale(hoveredIndex)}
            y2={height - padding.bottom}
            stroke="#60a5fa"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
        )}

        {xTicks.map((tickIndex) => {
          const x = xScale(tickIndex);
          const label = new Date(data[tickIndex].date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          return (
            <text key={`${label}-${tickIndex}`} x={x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize={11}>
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
