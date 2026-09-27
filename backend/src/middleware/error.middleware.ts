import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, [], 404);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Unhandled Error]:', err);
  sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    [],
    500
  );
}
