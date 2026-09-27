import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createProfileSchema, updateProfileSchema } from '../validators/user.validator.js';
import * as userService from '../services/user.service.js';

export async function getMe(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';
  const profile = await userService.getProfileById(userId);
  sendSuccess(res, profile, 'User profile fetched successfully');
}

export async function createMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';
  const email = req.user?.email || 'user@example.com';

  const parseResult = createProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  const profile = await userService.createProfile(userId, email, parseResult.data);
  sendSuccess(res, profile, 'Profile created successfully', 201);
}

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';

  const parseResult = updateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  const updated = await userService.updateProfile(userId, parseResult.data);
  sendSuccess(res, updated, 'Profile updated successfully');
}

export async function getMyRole(req: Request, res: Response): Promise<void> {
  const role = req.user?.role || 'customer';
  sendSuccess(res, { role }, 'User role fetched');
}
