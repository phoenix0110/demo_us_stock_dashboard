import React, { useState } from 'react';
import { IndexCards } from '../dashboard/IndexCards';
import { NewsTicker } from '../dashboard/NewsTicker';
import { StockList } from '../dashboard/StockList';
import { StockDetailPanel } from '../dashboard/StockDetailPanel';
import { DashboardCopilot } from '../dashboard/DashboardCopilot';
import { LineChart } from 'lucide-react';

export function DashboardLayout() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [seededPrompt, setSeededPrompt] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50">
      <header className="bg-slate-900/95 border-b border-slate-800 px-6 py-4 flex items-center shadow-sm backdrop-blur">
        <LineChart className="h-6 w-6 text-blue-400 mr-2" />
        <h1 className="text-xl font-bold tracking-tight">nomici US stock dashboard</h1>
      </header>

      <NewsTicker onMetricPick={setSeededPrompt} />

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-200">Market Overview</h2>
          <IndexCards onMetricPick={setSeededPrompt} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          <div className="lg:col-span-4 xl:col-span-3">
            <StockList
              selectedSymbol={selectedSymbol}
              onSelectStock={setSelectedSymbol}
              onMetricPick={setSeededPrompt}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <StockDetailPanel symbol={selectedSymbol} onMetricPick={setSeededPrompt} />
          </div>
        </section>

        <section className="pt-2">
          <DashboardCopilot seededPrompt={seededPrompt} />
        </section>
      </main>
    </div>
  );
}
