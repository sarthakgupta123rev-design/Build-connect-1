import { z } from 'zod';

export const createProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  city: z.string().default('Jaipur'),
  area: z.string().optional(),
  role: z.enum(['customer', 'worker']).default('customer'),
  avatar_url: z.string().url().optional(),
});

// Explicitly EXCLUDES role so user cannot self-promote via PATCH
export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
