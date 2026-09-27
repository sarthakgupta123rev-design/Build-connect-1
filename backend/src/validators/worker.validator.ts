import { z } from 'zod';

export const workerFilterSchema = z.object({
  profession: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  min_rating: z.coerce.number().min(0).max(5).optional(),
  max_price: z.coerce.number().min(0).optional(),
  availability: z.enum(['Available Today', 'Available Tomorrow', 'Busy']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  page: z.coerce.number().int().min(1).default(1),
});

export const createWorkerSchema = z.object({
  profession: z.string().min(2, 'Profession is required'),
  bio: z.string().optional(),
  experience_years: z.number().int().min(0).default(0),
  hourly_rate: z.number().min(0).default(0),
  fixed_rate_min: z.number().min(0).default(0),
  fixed_rate_max: z.number().min(0).default(0),
  skills: z.array(z.string()).optional(),
  availability: z.enum(['Available Today', 'Available Tomorrow', 'Busy']).default('Available Today'),
});

export const updateWorkerSchema = createWorkerSchema.partial();

export type WorkerFilterInput = z.infer<typeof workerFilterSchema>;
export type CreateWorkerInput = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>;
