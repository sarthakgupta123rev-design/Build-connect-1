import type { Request, Response } from 'express';
import { z } from 'zod';
import { sendSuccess, sendError } from '../utils/response.js';
import * as workerService from '../services/worker.service.js';

const recommendSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long'),
  city: z.string().optional()
});

export async function recommendWorkers(req: Request, res: Response): Promise<void> {
  const parseResult = recommendSchema.safeParse(req.body);

  if (!parseResult.success) {
    sendError(res, 'Validation error: prompt must be at least 3 characters long', parseResult.error.errors, 400);
    return;
  }

  const { prompt, city } = parseResult.data;
  const promptLower = prompt.toLowerCase();
  const promptWords = promptLower.split(/\s+/).filter(w => w.length > 2);

  const allWorkers = await workerService.getWorkers({ limit: 50, page: 1 });

  const recommendations = allWorkers.map(worker => {
    let score = 50;
    const matchedSkills: string[] = [];

    // Profession match
    if (promptLower.includes(worker.profession.toLowerCase())) {
      score += 25;
    }

    // Skills match
    if (worker.skills && Array.isArray(worker.skills)) {
      worker.skills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (promptWords.some(w => skillLower.includes(w))) {
          score += 15;
          if (!matchedSkills.includes(skill)) {
            matchedSkills.push(skill);
          }
        }
      });
    }

    // Bio match
    if (worker.bio) {
      const bioLower = worker.bio.toLowerCase();
      if (promptWords.some(w => bioLower.includes(w))) {
        score += 10;
      }
    }

    // City match
    if (city && worker.city.toLowerCase() === city.toLowerCase()) {
      score += 10;
    }

    const matchScore = Math.min(Math.max(score, 10), 99);

    const reasoning = matchedSkills.length > 0
      ? 'Matches ' + worker.profession + ' trade with skills: ' + matchedSkills.join(', ')
      : 'Top-rated ' + worker.profession + ' in ' + worker.city + ' matching your prompt.';

    return {
      worker,
      matchScore,
      matchedSkills,
      reasoning
    };
  });

  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  sendSuccess(res, recommendations, 'Worker recommendations generated successfully');
}
