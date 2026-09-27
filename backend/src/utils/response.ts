import type { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
  };
  if (message !== undefined) response.message = message;
  if (data !== undefined) response.data = data;

  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  errors: unknown[] = [],
  statusCode: number = 500
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
}
