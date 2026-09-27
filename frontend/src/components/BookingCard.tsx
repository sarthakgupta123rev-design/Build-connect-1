import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, CheckCircle2, AlertCircle, XCircle, Star } from 'lucide-react';
import type { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
  onUpdateStatus?: (id: string, status: Booking['status']) => void;
  isWorkerSide?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onUpdateStatus,
  isWorkerSide = false
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] text-gray-400 font-mono">ID: #{booking.id}</span>
          <h4 className="font-bold text-white text-base mt-0.5">{booking.serviceType}</h4>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Person info */}
        <div className="flex items-center gap-3">
          <img
            src={booking.workerAvatar}
            alt={booking.workerName}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
          />
          <div>
            <div className="text-[10px] text-gray-400">{isWorkerSide ? 'Customer' : 'Assigned Worker'}</div>
            <div className="font-bold text-white text-sm">
              {isWorkerSide ? booking.customerName : booking.workerName}
            </div>
            <div className="text-gray-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{isWorkerSide ? booking.customerPhone : booking.workerPhone}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Address */}
        <div className="space-y-1.5 text-gray-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{booking.bookingDate} ({booking.timeSlot})</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{booking.customerAddress}</span>
          </div>
        </div>

        {/* Price & Payment */}
        <div className="md:text-right flex flex-col md:items-end justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Amount</span>
          <div className="text-lg font-extrabold text-white">₹{booking.totalCost}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">{booking.paymentStatus}</span>
        </div>
      </div>

      {/* Problem note */}
      {booking.problemDescription && (
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-gray-300">
          <span className="font-semibold text-gray-400 block mb-0.5">Note from customer:</span>
          {booking.problemDescription}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="text-[11px] text-gray-500">Booked on {booking.createdAt}</div>

        <div className="flex items-center gap-2">
          {booking.status === 'Confirmed' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(booking.id, 'In Progress')}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
            >
              Start Service
            </button>
          )}

          {booking.status === 'In Progress' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(booking.id, 'Completed')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Mark Completed
            </button>
          )}

          {booking.status === 'Completed' && !isWorkerSide && (
            <button
              onClick={() => navigate('/reviews')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Leave Review</span>
            </button>
          )}

          {booking.status !== 'Completed' && booking.status !== 'Cancelled' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
              className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 hover:bg-rose-900 text-xs font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
