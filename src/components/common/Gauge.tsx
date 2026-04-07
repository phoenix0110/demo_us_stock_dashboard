import React from 'react';
import GaugeChart from 'react-gauge-chart';

interface GaugeProps {
  value: number;
  title: string;
}

export function Gauge({ value, title }: GaugeProps) {
  const percent = value / 100;
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  const getStatus = (val: number) => {
    if (val < 20) return 'Very Bearish';
    if (val < 40) return 'Bearish';
    if (val < 60) return 'Neutral';
    if (val < 80) return 'Bullish';
    return 'Very Bullish';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h4 className="mb-2 text-sm font-medium text-slate-400">{title}</h4>
      <div className="w-full max-w-[250px]">
        <GaugeChart
          id={`gauge-chart-${title.replace(/\s+/g, '-')}`}
          nrOfLevels={5}
          colors={colors}
          arcWidth={0.3}
          percent={percent}
          textColor="currentColor"
          formatTextValue={() => `${value}`}
          needleColor="#94a3b8"
          needleBaseColor="#94a3b8"
        />
      </div>
      <div className="mt-2 text-lg font-semibold text-slate-200">
        Status: <span className="text-blue-400">{getStatus(value)}</span>
      </div>
    </div>
  );
}
