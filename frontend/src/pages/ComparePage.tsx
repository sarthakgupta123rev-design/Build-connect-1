import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, Plus } from 'lucide-react';
import type { Worker } from '../types';
import { useCompare } from '../context/CompareContext';
import { compareWorkers } from '../services/api';
import { CompareTable } from '../components/CompareTable';

export const ComparePage: React.FC = () => {
  const { compareList, clearCompare } = useCompare();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    compareWorkers(compareList).then((data) => {
      setWorkers(data);
      setLoading(false);
    });
  }, [compareList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>TRANSPARENT SELECTION MATRIX</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Compare Workers Side-by-Side</h1>
          <p className="text-sm text-gray-400 mt-1">
            Evaluating {workers.length} {workers.length === 1 ? 'professional' : 'professionals'} on rating, pricing, distance, on-time percentage & digital trust score.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              to="/workers"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-gray-200 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add More Workers</span>
            </Link>
            <button
              onClick={clearCompare}
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Compare Matrix */}
      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      ) : (
        <CompareTable workers={workers} />
      )}
    </div>
  );
};
