import { z } from 'zod';

export const createReviewSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  worker_id: z.string().min(1, 'Worker ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  quality_rating: z.number().int().min(1).max(5).optional(),
  punctuality_rating: z.number().int().min(1).max(5).optional(),
  professionalism_rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5, 'Comment must be at least 5 characters'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
