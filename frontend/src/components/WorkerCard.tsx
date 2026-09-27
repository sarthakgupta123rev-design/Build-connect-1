import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, Clock, Scale, Check, ArrowRight } from 'lucide-react';
import { Worker } from '../types';
import { VerifiedBadge } from './VerifiedBadge';
import { useCompare } from '../context/CompareContext';
import { useBooking } from '../context/BookingContext';

interface WorkerCardProps {
  worker: Worker;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const { isInCompare, addWorker, removeWorker } = useCompare();
  const { selectWorkerForBooking } = useBooking();
  const navigate = useNavigate();

  const isCompared = isInCompare(worker.id);

  const handleHireClick = () => {
    selectWorkerForBooking(worker);
    navigate('/booking');
  };

  const handleCompareClick = () => {
    if (isCompared) {
      removeWorker(worker.id);
    } else {
      addWorker(worker.id);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between relative group hover:border-cyan-500/50 transition-all duration-300">
      {/* Top Header: Badge / Availability */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            {worker.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md">
                {worker.badge}
              </span>
            )}
            {worker.verified && <VerifiedBadge showText={true} />}
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${
              worker.availability === 'Available Today'
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                worker.availability === 'Available Today' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {worker.availability}
          </span>
        </div>

        {/* Profile Info Row */}
        <div className="flex items-start gap-4 mb-4">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-400 transition-colors shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <Link to={`/workers/${worker.id}`} className="hover:underline">
              <h3 className="font-bold text-lg text-white truncate leading-tight group-hover:text-cyan-300 transition-colors">
                {worker.name}
              </h3>
            </Link>
            <p className="text-xs font-semibold text-cyan-400 mt-0.5">{worker.profession}</p>

            <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{worker.rating}</span>
                <span className="text-gray-500 font-normal">({worker.reviewCount})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{worker.distanceKm} km away</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs mb-4">
          <div>
            <span className="text-gray-400 block text-[10px]">Experience</span>
            <span className="font-bold text-gray-200">{worker.experienceYears} Years</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">Jobs Completed</span>
            <span className="font-bold text-emerald-400">{worker.completedJobs}+ Done</span>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-gray-300 text-[11px] font-medium border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-800/50 text-gray-400 text-[11px]">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Price & Action Buttons */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-semibold">Pricing</span>
            <span className="text-base font-extrabold text-white">
              ₹{worker.fixedRateMin} - ₹{worker.fixedRateMax}
            </span>
            <span className="text-[10px] text-gray-400 ml-1">/ job</span>
          </div>

          <button
            onClick={handleCompareClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isCompared
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                : 'bg-slate-800 text-gray-300 hover:text-white border border-slate-700'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Scale className="w-3.5 h-3.5 text-gray-400" />}
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/workers/${worker.id}`}
            className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-center text-xs font-semibold text-gray-200 transition flex items-center justify-center gap-1"
          >
            Profile
          </Link>
          <button
            onClick={handleHireClick}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-1"
          >
            <span>Hire Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
