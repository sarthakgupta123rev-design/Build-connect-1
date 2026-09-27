import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { updateLocationSchema } from '../validators/location.validator.js';
import * as locationService from '../services/location.service.js';

export async function publishLocation(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const parseResult = updateLocationSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error: invalid coordinates', parseResult.error.errors, 400);
    return;
  }

  try {
    const location = await locationService.updateWorkerLocation(req.user.id, parseResult.data);
    sendSuccess(res, location, 'Worker location updated successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to update location', [], 500);
    }
  }
}

export async function getWorkerLocation(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const { id } = req.params;
  const bookingId = req.query.booking_id as string | undefined;

  try {
    const location = await locationService.getWorkerLocation(req.user.id, id, bookingId);
    if (!location) {
      sendError(res, 'Worker location not found', [], 404);
      return;
    }
    sendSuccess(res, location, 'Worker location retrieved successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to retrieve worker location', [], 500);
    }
  }
}
