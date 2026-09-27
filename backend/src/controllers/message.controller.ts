import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createMessageSchema } from '../validators/message.validator.js';
import * as messageService from '../services/message.service.js';

export async function sendMessage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const parseResult = createMessageSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const message = await messageService.createMessage(req.user.id, parseResult.data);
    sendSuccess(res, message, 'Message sent successfully', 201);
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to send message', [], 500);
    }
  }
}

export async function getBookingMessages(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const { bookingId } = req.params;
  try {
    const messages = await messageService.getBookingMessages(req.user.id, bookingId);
    sendSuccess(res, messages, 'Messages fetched successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to fetch messages', [], 500);
    }
  }
}
