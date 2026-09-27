import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createReviewSchema } from '../validators/review.validator.js';
import * as reviewService from '../services/review.service.js';

export async function createReview(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';

  const parseResult = createReviewSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const review = await reviewService.createReview(userId, parseResult.data);
    sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Conflict error';
    const statusCode = msg.startsWith('Conflict') ? 409 : 400;
    sendError(res, msg, [], statusCode);
  }
}

export async function getWorkerReviews(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const reviews = await reviewService.getReviewsByWorkerId(id);
  sendSuccess(res, reviews, 'Worker reviews fetched successfully');
}
