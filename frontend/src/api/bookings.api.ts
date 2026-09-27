import { apiRequest, ApiResponse } from './client';

export type BackendBookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BackendBooking {
  id: string;
  customer_id: string;
  worker_id: string;
  service_type: string;
  problem_description?: string;
  status: BackendBookingStatus;
  booking_date: string;
  time_slot: string;
  agreed_price: number;
  platform_fee: number;
  total_cost: number;
  customer_address: string;
  city: string;
  created_at?: string;
  updated_at?: string;
  worker_name?: string;
  worker_profession?: string;
  worker_avatar?: string;
  worker_phone?: string;
  customer_name?: string;
  customer_phone?: string;
}

export async function createBooking(
  token: string,
  bookingData: {
    worker_id: string;
    service_type: string;
    problem_description?: string;
    booking_date: string;
    time_slot: string;
    agreed_price: number;
    customer_address: string;
    city: string;
  }
): Promise<ApiResponse<BackendBooking>> {
  return apiRequest<BackendBooking>('/bookings', {
    method: 'POST',
    token,
    body: bookingData
  });
}

export async function fetchBookings(token: string): Promise<ApiResponse<BackendBooking[]>> {
  return apiRequest<BackendBooking[]>('/bookings', {
    method: 'GET',
    token
  });
}

export async function fetchBookingById(token: string, id: string): Promise<ApiResponse<BackendBooking>> {
  return apiRequest<BackendBooking>(`/bookings/${id}`, {
    method: 'GET',
    token
  });
}

export async function updateBookingStatus(
  token: string,
  id: string,
  status: BackendBookingStatus
): Promise<ApiResponse<BackendBooking>> {
  return apiRequest<BackendBooking>(`/bookings/${id}/status`, {
    method: 'PATCH',
    token,
    body: { status }
  });
}
