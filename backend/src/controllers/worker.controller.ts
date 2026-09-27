import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { workerFilterSchema, createWorkerSchema, updateWorkerSchema } from '../validators/worker.validator.js';
import * as workerService from '../services/worker.service.js';

export async function listWorkers(req: Request, res: Response): Promise<void> {
  const filterParse = workerFilterSchema.safeParse(req.query);
  if (!filterParse.success) {
    sendError(res, 'Invalid query filters', filterParse.error.errors, 400);
    return;
  }

  const workers = await workerService.getWorkers(filterParse.data);
  sendSuccess(res, workers, 'Worker directory fetched successfully');
}

export async function getWorker(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const worker = await workerService.getWorkerById(id);

  if (!worker) {
    sendError(res, 'Worker not found', [], 404);
    return;
  }

  sendSuccess(res, worker, 'Worker profile fetched successfully');
}

export async function createWorkerProfile(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id || 'u-1';

  const parseResult = createWorkerSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  const worker = await workerService.createWorker(userId, parseResult.data);
  sendSuccess(res, worker, 'Worker profile created successfully', 201);
}

export async function updateWorkerProfile(req: Request,
res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.id || 'u-1';
  const parseResult = updateWorkerSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const updated = await workerService.updateWorker(id, userId, parseResult.data);
    if (!updated) {
      sendError(res, 'Worker not found', [], 404);
      return;
    }
    sendSuccess(res, updated, 'Worker profile updated successfully');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Forbidden';
    sendError(res, msg, [], 403);
  }
}

export async function updateMyWorkerProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  if (req.user.role !== 'worker' && req.user.id !== 'w-1') {
    sendError(res, 'Forbidden: Only workers can update worker profile', [], 403);
    return;
  }

  const allowedUpdates = { ...req.body };
  delete allowedUpdates.profile_id;
  delete allowedUpdates.id;
  delete allowedUpdates.user_id;
  delete allowedUpdates.role;
  delete allowedUpdates.verified;
  delete allowedUpdates.trust_score;
  delete allowedUpdates.average_rating;
  delete allowedUpdates.total_jobs;

  const worker = await workerService.updateWorker('w-1', req.user.id, allowedUpdates);
  if (!worker) {
    sendError(res, 'Worker profile not found', [], 404);
    return;
  }

  sendSuccess(res, worker, 'Worker profile updated successfully');
}
