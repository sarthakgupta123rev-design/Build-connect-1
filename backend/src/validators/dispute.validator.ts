import { z } from 'zod';

export const disputeStatusEnum = z.enum(['pending', 'under_review', 'resolved', 'dismissed']);

export const createDisputeSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  reason: z.string().min(1, 'Dispute reason is required'),
  description: z.string().min(3, 'Dispute description must be at least 3 characters long')
});

export const updateDisputeStatusSchema = z.object({
  status: disputeStatusEnum,
  resolution_notes: z.string().optional()
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
export type UpdateDisputeStatusInput = z.infer<typeof updateDisputeStatusSchema>;
