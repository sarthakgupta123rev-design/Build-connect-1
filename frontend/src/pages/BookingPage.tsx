import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, 
  ArrowRight, AlertCircle, FileText, User, Phone, Sparkles 
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';
import { VerifiedBadge } from '../components/VerifiedBadge';

const TIME_SLOTS = [
  '09:00 AM - 10:30 AM',
  '11:00 AM - 12:30 PM',
  '02:00 PM - 03:30 PM',
  '04:30 PM - 06:00 PM',
  '06:30 PM - 08:00 PM'
];

export const BookingPage: React.FC = () => {
  const { draft, setDraft, setLatestBooking } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const worker = draft.worker;
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Inputs
  const [serviceType, setServiceType] = useState(draft.serviceType || 'Electrical Repair & Inspection');
  const [bookingDate, setBookingDate] = useState(draft.bookingDate || new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(draft.timeSlot || TIME_SLOTS[0]);
  const [customerAddress, setCustomerAddress] = useState(draft.customerAddress || 'House 42, Sector 3, Malviya Nagar, Jaipur');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [problemDescription, setProblemDescription] = useState(draft.problemDescription || '');

  if (!worker) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-cyan-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Worker Selected for Booking</h3>
        <p className="text-xs text-gray-400">Please select a verified worker from the marketplace first.</p>
        <Link
          to="/workers"
          className="inline-block px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Select a Worker
        </Link>
      </div>
    );
  }

  const baseCost = worker.fixedRateMin;
  const platformFee = 49;
  const totalCost = baseCost + platformFee;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerAddress.trim()) {
      setFormError('Please enter your service address.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const newBooking = await createBooking({
        workerId: worker.id,
        workerName: worker.name,
        workerProfession: worker.profession,
        workerAvatar: worker.avatar,
        workerPhone: worker.phone || '+91 98290 12345',
        customerName: user?.name || 'Aarav Sharma',
        customerPhone,
        customerAddress,
        city: worker.city,
        serviceType,
        bookingDate,
        timeSlot,
        problemDescription,
        serviceCost: baseCost,
        platformFee,
        totalCost
      });

      setLatestBooking(newBooking);
      navigate('/booking/success');
    } catch (err) {
      setFormError('Failed to process booking request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SECURE DIRECT BOOKING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Complete Your Booking</h1>
        <p className="text-sm text-gray-400 mt-1">
          Lock in your preferred time slot with verified worker <span className="text-white font-bold">{worker.name}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (7 cols) */}
        <form onSubmit={handleSubmitBooking} className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Service Schedule & Address</span>
            </h3>

            {formError && (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            {/* Service Type */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Service Type</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                placeholder="e.g. Electrical Short Circuit Repair"
                required
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Preferred Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Address */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Service Address ({worker.city})</label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                placeholder="House no, Building, Street, Area..."
                required
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Contact Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                required
              />
            </div>

            {/* Problem Description */}
            <div>
              <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Problem Description (Optional)</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-500"
                placeholder="Describe the issue (e.g. main switch tripping when AC turns on)..."
              />
            </div>
          </div>
        </form>

        {/* Right Summary Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selected Worker Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm text-gray-400 uppercase tracking-wider">Assigned Worker</h4>
            <div className="flex items-center gap-4">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
              />
              <div>
                <div className="font-bold text-white text-base">{worker.name}</div>
                <div className="text-xs font-semibold text-cyan-400">{worker.profession}</div>
                <div className="mt-1">
                  <VerifiedBadge size="sm" showText={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-4">
            <h4 className="font-bold text-white text-base pb-3 border-b border-slate-800">Payment Breakdown</h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Labor / Service Base Charge</span>
                <span className="font-bold text-white">₹{baseCost}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>BuildConnect Platform & Warranty Fee</span>
                <span className="font-bold text-cyan-400">₹{platformFee}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm font-black text-white">
                <span>Total Amount Payable</span>
                <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  ₹{totalCost}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 text-[11px] text-gray-400 space-y-1">
              <div className="font-semibold text-gray-200">🔒 Pay After Work Guarantee</div>
              <div>No advance required. Pay worker directly after service completion.</div>
            </div>

            <button
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <span>Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
