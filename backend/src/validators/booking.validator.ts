import { z } from 'zod';

export const bookingStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
  'in_progress',
  'completed',
  'cancelled',
]);

export const createBookingSchema = z.object({
  worker_id: z.string().min(1, 'Worker ID is required'),
  service_type: z.string().min(2, 'Service type is required'),
  problem_description: z.string().optional(),
  booking_date: z.string().min(1, 'Booking date is required'),
  time_slot: z.string().min(1, 'Time slot is required'),
  agreed_price: z.number().min(0).default(0),
  customer_address: z.string().min(5, 'Customer address is required'),
  city: z.string().default('Jaipur'),
});

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
