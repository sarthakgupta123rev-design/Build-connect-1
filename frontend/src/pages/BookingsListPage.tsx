import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, XCircle, Search, ArrowRight } from 'lucide-react';
import { Booking } from '../types';
import { getBookings, updateBookingStatus } from '../services/api';
import { BookingCard } from '../components/BookingCard';

export const BookingsListPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'>('All');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
    fetchBookings();
  };

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">My Customer Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track active service dispatches, schedule dates, and leave verified ratings.
          </p>
        </div>

        <Link
          to="/workers"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
        >
          <span>Book Another Worker</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
                isSelected
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onUpdateStatus={handleStatusUpdate}
              isWorkerSide={false}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
            <Calendar className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
          <p className="text-xs text-gray-400">You don't have any bookings matching the "{activeTab}" status filter.</p>
          <Link
            to="/workers"
            className="inline-block px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Find a Worker
          </Link>
        </div>
      )}
    </div>
  );
};
