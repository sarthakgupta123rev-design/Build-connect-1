import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Check, MapPin, Clock, Award, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Worker } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { useCompare } from '../context/CompareContext';
import { useBooking } from '../context/BookingContext';

interface CompareTableProps {
  workers: Worker[];
}

export const CompareTable: React.FC<CompareTableProps> = ({ workers }) => {
  const { removeWorker } = useCompare();
  const { selectWorkerForBooking } = useBooking();
  const navigate = useNavigate();

  if (workers.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Workers Added to Compare</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
          Add 2 or 3 local professionals from the marketplace to compare ratings, pricing, distance, and verified trust scores side-by-side.
        </p>
        <Link
          to="/workers"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
        >
          <span>Browse Marketplace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Calculate winner highlights
  const highestRatingId = [...workers].sort((a, b) => b.rating - a.rating)[0]?.id;
  const lowestPriceId = [...workers].sort((a, b) => a.fixedRateMin - b.fixedRateMin)[0]?.id;
  const nearestId = [...workers].sort((a, b) => a.distanceKm - b.distanceKm)[0]?.id;
  const highestTrustId = [...workers].sort((a, b) => b.trustScore - a.trustScore)[0]?.id;

  const handleHire = (worker: Worker) => {
    selectWorkerForBooking(worker);
    navigate('/booking');
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-slate-800 glass-card">
      <table className="w-full text-left border-collapse min-w-[700px]">
        {/* Table Header: Worker Profiles */}
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80">
            <th className="p-5 text-sm font-bold text-gray-400 w-1/4">Comparison Parameters</th>
            {workers.map((w) => (
              <th key={w.id} className="p-5 text-center border-l border-slate-800 relative group">
                <button
                  onClick={() => removeWorker(w.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Remove from comparison"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-500/40 mb-3 shadow-lg"
                  />
                  <h4 className="font-extrabold text-white text-base leading-tight">{w.name}</h4>
                  <p className="text-xs font-semibold text-cyan-400 mt-0.5">{w.profession}</p>
                  <div className="mt-2">
                    <VerifiedBadge showText={true} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800 text-sm">
          {/* Row 1: Key Winner Highlights */}
          <tr className="bg-slate-900/30">
            <td className="p-5 font-bold text-gray-300">Highlight Badge</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                {w.id === highestTrustId && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500 text-slate-950 shadow-md">
                    ★ Best Overall Match
                  </span>
                )}
                {w.id === lowestPriceId && w.id !== highestTrustId && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-md">
                    ⚡ Best Price Value
                  </span>
                )}
                {w.id === nearestId && w.id !== highestTrustId && w.id !== lowestPriceId && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500 text-white shadow-md">
                    📍 Nearest to You
                  </span>
                )}
                {w.id !== highestTrustId && w.id !== lowestPriceId && w.id !== nearestId && (
                  <span className="text-xs text-gray-500 font-medium">Verified Local Pro</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 2: Customer Rating */}
          <tr>
            <td className="p-5 font-semibold text-gray-300">Rating & Reviews</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="flex items-center justify-center gap-1 font-extrabold text-amber-400 text-base">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{w.rating}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{w.reviewCount} customer reviews</div>
                {w.id === highestRatingId && (
                  <span className="mt-1 inline-block text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Highest Rated
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 3: Transparent Pricing */}
          <tr className="bg-slate-900/20">
            <td className="p-5 font-semibold text-gray-300">Estimated Price Range</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="font-extrabold text-white text-base">
                  ₹{w.fixedRateMin} - ₹{w.fixedRateMax}
                </div>
                <div className="text-xs text-gray-400 font-normal">Approx ₹{w.hourlyRate}/hr</div>
                {w.id === lowestPriceId && (
                  <span className="mt-1 inline-block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Lowest Rate
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 4: Distance */}
          <tr>
            <td className="p-5 font-semibold text-gray-300">Proximity Distance</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="font-bold text-gray-200 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{w.distanceKm} km</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{w.area}, {w.city}</div>
                {w.id === nearestId && (
                  <span className="mt-1 inline-block text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    Fastest Reach
                  </span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 5: Experience & Jobs */}
          <tr className="bg-slate-900/20">
            <td className="p-5 font-semibold text-gray-300">Experience & Jobs</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="font-bold text-gray-200">{w.experienceYears} Years Exp.</div>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5">{w.completedJobs}+ Completed Jobs</div>
              </td>
            ))}
          </tr>

          {/* Row 6: On-Time Arrival */}
          <tr>
            <td className="p-5 font-semibold text-gray-300">On-Time Arrival Rate</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="font-bold text-blue-400 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{w.onTimePercentage}%</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Row 7: Digital Trust Score */}
          <tr className="bg-slate-900/20">
            <td className="p-5 font-semibold text-gray-300">Digital Trust Score</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <div className="font-extrabold text-cyan-400 text-lg">{w.trustScore}/100</div>
                <div className="text-[10px] text-gray-400">Background Checked</div>
              </td>
            ))}
          </tr>

          {/* Row 8: Action Buttons */}
          <tr className="bg-slate-950">
            <td className="p-5 font-bold text-white">Action</td>
            {workers.map((w) => (
              <td key={w.id} className="p-5 text-center border-l border-slate-800">
                <button
                  onClick={() => handleHire(w)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-1.5"
                >
                  <span>Hire {w.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
