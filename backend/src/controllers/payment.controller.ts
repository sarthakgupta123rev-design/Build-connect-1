import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../validators/payment.validator.js';
import * as paymentService from '../services/payment.service.js';

export async function createOrder(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const parseResult = createPaymentOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const payment = await paymentService.createPaymentOrder(req.user.id, parseResult.data);
    sendSuccess(res, payment, 'Payment order created successfully', 201);
  } catch (err: any) {
    if (err.message?.includes('Conflict')) {
      sendError(res, err.message, [], 409);
    } else if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to create payment order', [], 500);
    }
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const parseResult = verifyPaymentSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const verified = await paymentService.verifyPayment(req.user.id, parseResult.data);
    sendSuccess(res, verified, 'Payment verified successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else if (err.message?.includes('NotFound')) {
      sendError(res, err.message, [], 404);
    } else {
      sendError(res, err.message || 'Payment verification failed', [], 500);
    }
  }
}

export async function getPayment(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const { id } = req.params;
  try {
    const payment = await paymentService.getPaymentById(id, req.user.id);
    if (!payment) {
      sendError(res, 'Payment not found', [], 404);
      return;
    }
    sendSuccess(res, payment, 'Payment details retrieved successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to fetch payment', [], 500);
    }
  }
}

export async function listPayments(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const payments = await paymentService.getUserPayments(req.user.id);
  sendSuccess(res, payments, 'Payments retrieved successfully');
}
