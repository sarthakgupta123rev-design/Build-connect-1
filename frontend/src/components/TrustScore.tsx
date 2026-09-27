import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Star, Award, Zap } from 'lucide-react';
import { Worker } from '../types';

interface TrustScoreProps {
  worker: Worker;
  compact?: boolean;
}

export const TrustScore: React.FC<TrustScoreProps> = ({ worker, compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold">{worker.trustScore}/100 Trust Score</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">BuildConnect Trust Profile</h4>
            <p className="text-xs text-gray-400">Cryptographically & Peer-verified worker reputation</p>
          </div>
        </div>

        {/* Score Badge Ring */}
        <div className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-lg shadow-cyan-500/10">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            {worker.trustScore}
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Score</span>
        </div>
      </div>

      {/* Trust Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-gray-200">Identity Verified</div>
            <div className="text-[10px] text-gray-400">Aadhaar / ID Checked</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <Award className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="font-semibold text-gray-200">{worker.completedJobs} Jobs Done</div>
            <div className="text-[10px] text-gray-400">100% Platform Tracked</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-blue-400 shrink-0" />
          <div>
            <div className="font-semibold text-gray-200">{worker.onTimePercentage}% On-Time</div>
            <div className="text-[10px] text-gray-400">Punctuality Score</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          <div>
            <div className="font-semibold text-gray-200">{worker.rating}/5.0 Rating</div>
            <div className="text-[10px] text-gray-400">{worker.reviewCount} Verified Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};
