import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import type { WorkerEarnings } from '../types';
import { getWorkerEarnings } from '../services/api';

export const WorkerEarningsPage: React.FC = () => {
  const [earnings, setEarnings] = useState<WorkerEarnings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWorkerEarnings().then((data) => {
      setEarnings(data);
      setLoading(false);
    });
  }, []);

  if (loading || !earnings) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading earnings analytics...</p>
      </div>
    );
  }

  const maxWeekly = Math.max(...earnings.weeklyHistory.map((h) => h.amount));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>DIRECT BANK PAYOUTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Worker Earnings & Financials</h1>
        <p className="text-sm text-gray-400 mt-1">
          Transparent view of your service income, daily payouts, and BuildConnect platform fees.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">Today's Earnings</span>
          <div className="text-3xl font-black text-emerald-400">₹{earnings.todayEarnings}</div>
          <span className="text-[11px] text-gray-500">Instant UPI Transferred</span>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">This Week</span>
          <div className="text-3xl font-black text-cyan-400">₹{earnings.weeklyEarnings}</div>
          <span className="text-[11px] text-gray-500">7 Dispatches Completed</span>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">This Month</span>
          <div className="text-3xl font-black text-white">₹{earnings.monthlyEarnings}</div>
          <span className="text-[11px] text-gray-500">28 Total Completed Jobs</span>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <span className="text-xs text-gray-400 uppercase font-semibold">Pending Settlement</span>
          <div className="text-3xl font-black text-amber-400">₹{earnings.pendingPayouts}</div>
          <span className="text-[11px] text-gray-500">Processing to Bank</span>
        </div>
      </div>

      {/* Weekly Income Bar Chart */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg">Weekly Earnings Breakdown</h3>
          <span className="text-xs text-cyan-400 font-semibold">Aug 17 - Aug 23</span>
        </div>

        <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-6">
          {earnings.weeklyHistory.map((item) => {
            const heightPercent = maxWeekly > 0 ? (item.amount / maxWeekly) * 100 : 0;
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[11px] text-gray-300 font-bold">₹{item.amount}</span>
                <div className="w-full max-w-[40px] bg-slate-800 rounded-t-xl h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-emerald-400 rounded-t-xl transition-all duration-500"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-400">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Fee Breakdown */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">BuildConnect Platform Fee Policy</h3>
        <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
          BuildConnect charges a flat <span className="text-cyan-400 font-bold">₹49 per completed job</span> to maintain identity verification, free emergency insurance coverage, and 24/7 dispatch support.
        </p>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-semibold">Total Platform Fees Contribution:</span>
          <span className="font-extrabold text-cyan-400">₹{earnings.platformFeePaid}</span>
        </div>
      </div>
    </div>
  );
};
