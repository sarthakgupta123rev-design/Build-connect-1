import type { Request, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/response.js';
import * as workerService from '../services/worker.service.js';
import { evaluateRecommendations } from '../services/ai_recommendation.service.js';

const recommendSchema = z.object({
  prompt: z.string().optional(),
  query: z.string().optional(),
  profession: z.string().optional(),
  service_type: z.string().optional(),
  skills: z.array(z.string()).optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  user_latitude: z.number().min(-90).max(90).optional(),
  user_longitude: z.number().min(-180).max(180).optional(),
  max_distance_km: z.number().positive().optional(),
  preferred_availability: z.enum(['Available Today', 'Available Tomorrow', 'Busy']).optional(),
  min_rating: z.number().min(0).max(5).optional(),
  max_price: z.number().positive().optional(),
  min_experience: z.number().min(0).optional(),
  limit: z.number().positive().optional().default(10)
});

export async function recommendWorkers(req: Request, res: Response): Promise<void> {
  const parseResult = recommendSchema.safeParse(req.body);

  if (!parseResult.success) {
    sendError(
      res,
      'Validation error: Please enter a valid recommendation prompt or criteria',
      parseResult.error.errors.map(e => e.message),
      400
    );
    return;
  }

  const input = parseResult.data;
  const promptText = (input.prompt || input.query || input.service_type || input.profession || '').trim();

  if (!promptText && !input.profession && !input.skills) {
    sendError(res, 'Validation error: prompt must be at least 3 characters long', ['Missing prompt or criteria'], 400);
    return;
  }

  if (promptText && promptText.length < 3) {
    sendError(res, 'Validation error: prompt must be at least 3 characters long', ['Prompt too short'], 400);
    return;
  }

  try {
    const startTime = Date.now();
    const allWorkers = await workerService.getWorkers({
      limit: input.limit || 50,
      page: 1,
      profession: input.profession,
      city: input.city,
      min_rating: input.min_rating,
      availability: input.preferred_availability
    });

    const recommendations = evaluateRecommendations(allWorkers, {
      ...input,
      prompt: input.prompt || promptText
    });

    const durationMs = Date.now() - startTime;

    res.setHeader('X-AI-Execution-Time-MS', durationMs.toString());
    sendSuccess(res, recommendations, `Worker recommendations generated in ${durationMs}ms`);
  } catch (err: any) {
    sendError(res, 'Failed to generate worker recommendations: ' + err.message, [], 500);
  }
}
