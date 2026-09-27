import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import type { Booking } from '../types';
import { getWorkerJobs, updateBookingStatus } from '../services/api';
import { BookingCard } from '../components/BookingCard';

export const WorkerJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const fetchJobs = async () => {
    setLoading(true);
    const data = await getWorkerJobs('w-1');
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    await updateBookingStatus(bookingId, status);
    fetchJobs();
  };

  const filteredJobs = filterStatus === 'All'
    ? jobs
    : jobs.filter((j) => j.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>WORKER DISPATCH CONTROL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Worker Jobs & Orders</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage incoming dispatch requests, active customer jobs, and completion payouts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
              filterStatus === tab
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <BookingCard
              key={job.id}
              booking={job}
              onUpdateStatus={handleStatusUpdate}
              isWorkerSide={true}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400">There are currently no job orders in the "{filterStatus}" state.</p>
        </div>
      )}
    </div>
  );
};
