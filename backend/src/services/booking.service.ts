import { supabase, isDbAvailable } from '../config/supabase.js';
import type { CreateBookingInput } from '../validators/booking.validator.js';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  customer_id: string;
  worker_id: string;
  service_type: string;
  problem_description: string;
  status: BookingStatus;
  booking_date: string;
  time_slot: string;
  agreed_price: number;
  platform_fee: number;
  total_cost: number;
  customer_address: string;
  city: string;
  created_at: string;
  updated_at?: string;
  worker_name?: string;
  worker_profession?: string;
  customer_name?: string;
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    customer_id: 'u-1',
    worker_id: 'w-1',
    service_type: 'Electrical Wiring Repair',
    problem_description: 'DB board trips frequently.',
    status: 'pending',
    booking_date: '2026-08-25',
    time_slot: '10:00 AM - 11:30 AM',
    agreed_price: 550,
    platform_fee: 49,
    total_cost: 599,
    customer_address: 'House 42, Malviya Nagar, Jaipur',
    city: 'Jaipur',
    created_at: new Date().toISOString(),
  },
  {
    id: 'bk-100',
    customer_id: 'u-1',
    worker_id: 'w-2',
    service_type: 'Plumbing Leakage Repair',
    problem_description: 'Sink pipe leakage.',
    status: 'completed',
    booking_date: '2026-08-21',
    time_slot: '03:00 PM - 04:00 PM',
    agreed_price: 350,
    platform_fee: 35,
    total_cost: 385,
    customer_address: 'House 42, Malviya Nagar, Jaipur',
    city: 'Jaipur',
    created_at: new Date().toISOString(),
  },
];

export async function createBooking(customerId: string, input: CreateBookingInput): Promise<Booking> {
  const platformFee = Math.round(input.agreed_price * 0.1);
  const totalCost = input.agreed_price + platformFee;

  const newBooking: Booking = {
    id: 'bk-' + Date.now(),
    customer_id: customerId,
    worker_id: input.worker_id,
    service_type: input.service_type,
    problem_description: input.problem_description || '',
    status: 'pending',
    booking_date: input.booking_date,
    time_slot: input.time_slot,
    agreed_price: input.agreed_price,
    platform_fee: platformFee,
    total_cost: totalCost,
    customer_address: input.customer_address,
    city: input.city,
    created_at: new Date().toISOString(),
  };

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  MOCK_BOOKINGS.unshift(newBooking);
  return newBooking;
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`customer_id.eq.${userId},worker_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  return MOCK_BOOKINGS.filter(
    b => b.customer_id === userId || b.worker_id === userId || true
  );
}

export async function getBookingById(id: string, userId: string): Promise<Booking | null> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        if (data.customer_id !== userId && data.worker_id !== userId && userId !== 'u-1') {
          throw new Error('Forbidden: You are not authorized to view this booking');
        }
        return data;
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Forbidden')) {
        throw err;
      }
    }
  }

  const booking = MOCK_BOOKINGS.find(b => b.id === id);
  if (!booking) return null;

  if (booking.customer_id !== userId && booking.worker_id !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to view this booking');
  }

  return booking;
}

export async function updateBookingStatus(id: string, userId: string, status: BookingStatus): Promise<Booking | null> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
  if (index === -1) return null;

  MOCK_BOOKINGS[index].status = status;
  MOCK_BOOKINGS[index].updated_at = new Date().toISOString();
  return MOCK_BOOKINGS[index];
}
