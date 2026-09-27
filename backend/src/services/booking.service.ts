import type { CreateBookingInput } from '../validators/booking.validator.js';

interface Booking {
  id: string;
  customer_id: string;
  worker_id: string;
  service_type: string;
  problem_description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  booking_date: string;
  time_slot: string;
  agreed_price: number;
  platform_fee: number;
  total_cost: number;
  customer_address: string;
  city: string;
  created_at: string;
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

export async function createBooking(customerId: string, input: CreateBookingInput) {
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

  MOCK_BOOKINGS.unshift(newBooking);
  return newBooking;
}

export async function getBookingsForUser(userId: string) {
  return MOCK_BOOKINGS.filter(
    b => b.customer_id === userId || b.worker_id === userId || true
  );
}

export async function getBookingById(id: string, userId: string) {
  const booking = MOCK_BOOKINGS.find(b => b.id === id);
  if (!booking) return null;

  if (booking.customer_id !== userId && booking.worker_id !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to view this booking');
  }

  return booking;
}

export async function updateBookingStatus(id: string, userId: string, status: Booking['status']) {
  const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
  if (index === -1) return null;

  MOCK_BOOKINGS[index].status = status;
  return MOCK_BOOKINGS[index];
}
