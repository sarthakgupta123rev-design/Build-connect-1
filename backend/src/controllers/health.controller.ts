import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/response.js';

export function getHealth(_req: Request, res: Response): void {
  sendSuccess(res, undefined, 'BuildConnect backend is running', 200);
}
