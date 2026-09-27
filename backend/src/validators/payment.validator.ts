import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required')
});

export const verifyPaymentSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  provider_payment_id: z.string().min(1, 'Payment ID is required'),
  provider_signature: z.string().optional()
});

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
