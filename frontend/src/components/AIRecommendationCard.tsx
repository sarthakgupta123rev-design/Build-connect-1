import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowRight, Star, MapPin } from 'lucide-react';
import type { AIMatchResult } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { useBooking } from '../context/BookingContext';

interface AIRecommendationCardProps {
  match: AIMatchResult;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ match }) => {
  const { worker, matchScore, reasons } = match;
  const { selectWorkerForBooking } = useBooking();
  const navigate = useNavigate();

  const handleHire = () => {
    selectWorkerForBooking(worker);
    navigate('/booking');
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-6 relative overflow-hidden border border-cyan-500/40">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm tracking-wide">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>BUILDCONNECT AI MATCH ENGINE</span>
        </div>

        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20">
          {matchScore}% Match Score
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Worker Info */}
        <div className="flex items-center gap-4">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-lg text-white">{worker.name}</h4>
              <VerifiedBadge showText={false} />
            </div>
            <p className="text-xs font-semibold text-cyan-400">{worker.profession}</p>

            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{worker.rating}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{worker.distanceKm} km away</span>
              </span>
            </div>
          </div>
        </div>

        {/* AI Reasons Checklist */}
        <div className="space-y-1.5 text-xs text-gray-300">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        {/* Action Call */}
        <div className="flex flex-col md:items-end justify-center gap-2">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-gray-400 uppercase font-semibold">Estimated Price</span>
            <div className="text-lg font-extrabold text-white">₹{worker.fixedRateMin} - ₹{worker.fixedRateMax}</div>
          </div>

          <button
            onClick={handleHire}
            className="w-full md:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Book Recommended Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
