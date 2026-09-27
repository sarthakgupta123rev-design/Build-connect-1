import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import { createDisputeSchema, updateDisputeStatusSchema } from '../validators/dispute.validator.js';
import * as disputeService from '../services/dispute.service.js';

export async function createDispute(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const parseResult = createDisputeSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error', parseResult.error.errors, 400);
    return;
  }

  try {
    const dispute = await disputeService.createDispute(req.user.id, parseResult.data);
    sendSuccess(res, dispute, 'Dispute filed successfully', 201);
  } catch (err: any) {
    if (err.message?.includes('Conflict')) {
      sendError(res, err.message, [], 409);
    } else if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to file dispute', [], 500);
    }
  }
}

export async function listDisputes(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const disputes = await disputeService.getUserDisputes(req.user.id);
  sendSuccess(res, disputes, 'Disputes fetched successfully');
}

export async function getDispute(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const { id } = req.params;
  try {
    const dispute = await disputeService.getDisputeById(id, req.user.id);
    if (!dispute) {
      sendError(res, 'Dispute not found', [], 404);
      return;
    }
    sendSuccess(res, dispute, 'Dispute details fetched successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to fetch dispute', [], 500);
    }
  }
}

export async function updateDisputeStatus(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    sendError(res, 'Unauthorized access', [], 401);
    return;
  }

  const { id } = req.params;
  const parseResult = updateDisputeStatusSchema.safeParse(req.body);
  if (!parseResult.success) {
    sendError(res, 'Validation error: invalid dispute status', parseResult.error.errors, 400);
    return;
  }

  try {
    const updated = await disputeService.updateDisputeStatus(id, req.user.id, parseResult.data);
    if (!updated) {
      sendError(res, 'Dispute not found', [], 404);
      return;
    }
    sendSuccess(res, updated, 'Dispute status updated successfully');
  } catch (err: any) {
    if (err.message?.includes('Forbidden')) {
      sendError(res, err.message, [], 403);
    } else {
      sendError(res, err.message || 'Failed to update dispute status', [], 500);
    }
  }
}
