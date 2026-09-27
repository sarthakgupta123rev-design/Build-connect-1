import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createBookingSchema, updateBookingStatusSchema } from '../validators/booking.validator.js';
import * as bookingService from '../services/booking.service.js';

export async function createBooking(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';

  const parseResult = createBookingSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  const booking = await bookingService.createBooking(userId, parseResult.data);
  sendSuccess(res, booking, 'Booking created successfully', 201);
}

export async function listBookings(req: Request,
res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';
  const bookings = await bookingService.getBookingsForUser(userId);
  sendSuccess(res, bookings, 'Bookings fetched successfully');
}

export async function getBooking(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.id || 'u-1';

  try {
    const booking = await bookingService.getBookingById(id, userId);
    if (!booking) {
      sendError(res, 'Booking not found', [], 404);
      return;
    }
    sendSuccess(res, booking, 'Booking details fetched successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Forbidden';
    sendError(res, msg, [], 403);
  }
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.id || 'u-1';

  const parseResult = updateBookingStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  const updated = await bookingService.updateBookingStatus(id, userId, parseResult.data.status);
  if (!updated) {
    sendError(res, 'Booking not found', [], 404);
    return;
  }

  sendSuccess(res, updated, 'Booking status updated successfully');
}