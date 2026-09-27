import { z } from 'zod';

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  accuracy: z.number().min(0, 'Accuracy must be non-negative').optional(),
  booking_id: z.string().optional()
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
