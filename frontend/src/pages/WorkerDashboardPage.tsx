import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Zap } from 'lucide-react';
import type { Booking, WorkerEarnings } from '../types';
import { getWorkerJobs, getWorkerEarnings, updateBookingStatus } from '../services/api';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const WorkerDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<WorkerEarnings | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [jData, eData] = await Promise.all([getWorkerJobs('w-1'), getWorkerEarnings()]);
      setJobs(jData);
      setEarnings(eData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleJobAction = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
    loadDashboardData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
            alt="Rajesh Kumar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Rajesh Kumar Dashboard</h1>
              <VerifiedBadge size="sm" showText={true} />
            </div>
            <p className="text-xs font-semibold text-cyan-400">Master Industrial Electrician • Jaipur Hub</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs text-gray-300 font-semibold pl-2">Job Dispatch Status:</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              isAvailable
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-gray-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-slate-950 animate-ping' : 'bg-gray-500'}`} />
            <span>{isAvailable ? 'Available Today' : 'Busy / On Break'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-1">
          <span className="text-[11px] text-gray-400 uppercase font-semibold">Today's Payout</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">₹{earnings?.todayEarnings}</div>
          <div className="text-[11px] text-gray-500">2 Completed Dispatches</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-1">
          <span className="text-[11px] text-gray-400 uppercase font-semibold">Monthly Income</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400">₹{earnings?.monthlyEarnings}</div>
          <div className="text-[11px] text-gray-500">28 Jobs Done this Month</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-1">
          <span className="text-[11px] text-gray-400 uppercase font-semibold">Average Rating</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div className="text-[11px] text-gray-500">From 142 Reviews</div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-1">
          <span className="text-[11px] text-gray-400 uppercase font-semibold">Trust Score</span>
          <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            96/100
          </div>
          <div className="text-[11px] text-gray-500">Aadhaar & Skill Verified</div>
        </div>
      </div>

      {/* Incoming Job Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Incoming Customer Requests ({jobs.length})</span>
          </h2>
          <Link to="/worker/jobs" className="text-xs text-cyan-400 hover:underline">
            View All Jobs
          </Link>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-cyan-400">#{job.id}</span>
                  <h3 className="font-bold text-white text-base">{job.serviceType}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-emerald-400">₹{job.totalCost}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    {job.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300">
                <div>
                  <span className="text-[10px] text-gray-400 block">Customer Name</span>
                  <span className="font-bold text-white">{job.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Date & Time Slot</span>
                  <span className="font-bold text-gray-200">{job.bookingDate} ({job.timeSlot})</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Service Address</span>
                  <span className="font-medium text-gray-300 truncate block">{job.customerAddress}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {job.status === 'Confirmed' && (
                  <button
                    onClick={() => handleJobAction(job.id, 'In Progress')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                  >
                    Accept & Dispatch
                  </button>
                )}

                {job.status === 'In Progress' && (
                  <button
                    onClick={() => handleJobAction(job.id, 'Completed')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    Complete Job
                  </button>
                )}

                <button
                  onClick={() => handleJobAction(job.id, 'Cancelled')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-gray-400 hover:text-rose-400 text-xs font-semibold transition"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
