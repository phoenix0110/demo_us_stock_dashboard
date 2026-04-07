import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
}

export function MiniChart({ data, isPositive }: MiniChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  const color = isPositive ? '#22c55e' : '#ef4444'; // green-500 : red-500

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
