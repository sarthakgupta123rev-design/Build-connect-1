import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, MapPin, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const BookingSuccessPage: React.FC = () => {
  const { latestBooking } = useBooking();

  const booking = latestBooking || {
    id: 'bk-101',
    workerName: 'Rajesh Kumar',
    workerProfession: 'Electrician',
    workerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    workerPhone: '+91 98290 12345',
    serviceType: 'AC Heavy Wiring & DB Board Fix',
    bookingDate: '2026-08-25',
    timeSlot: '10:00 AM - 11:30 AM',
    customerAddress: 'House 42, Sector 3, Malviya Nagar, Jaipur',
    totalCost: 599,
    status: 'Confirmed'
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Animated Checkmark Icon */}
      <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 shadow-2xl shadow-cyan-500/30 animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
          BOOKING CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Your Service is Scheduled!</h1>
        <p className="text-sm text-gray-400">
          Booking Reference ID: <span className="font-mono text-cyan-300 font-bold">#{booking.id}</span>
        </p>
      </div>

      {/* Confirmed Details Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 text-left border border-cyan-500/30 space-y-6">
        {/* Assigned Worker */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <img
            src={booking.workerAvatar}
            alt={booking.workerName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
          />
          <div>
            <div className="font-bold text-white text-lg">{booking.workerName}</div>
            <div className="text-xs font-semibold text-cyan-400">{booking.workerProfession}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{booking.workerPhone}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Service Type</span>
            <div className="font-bold text-white text-sm">{booking.serviceType}</div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Scheduled Date & Time</span>
            <div className="font-bold text-gray-200 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{booking.bookingDate} ({booking.timeSlot})</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Location Address</span>
            <div className="font-medium text-gray-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{booking.customerAddress}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Total Payable</span>
            <div className="font-black text-cyan-400 text-base">₹{booking.totalCost}</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/bookings"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <span>View My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-gray-300 font-bold text-xs hover:bg-slate-800 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};
