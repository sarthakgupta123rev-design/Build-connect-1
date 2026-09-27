import { z } from 'zod';

export const createMessageSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  recipient_id: z.string().min(1, 'Recipient ID is required'),
  content: z.string().min(1, 'Message content cannot be empty')
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
