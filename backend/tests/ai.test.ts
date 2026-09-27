import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('AI Worker Recommendation API', () => {
  it('POST /api/workers/recommend returns recommendations for valid prompt', async () => {
    const res = await request(app)
      .post('/api/workers/recommend')
      .send({
        prompt: 'Emergency electrician for short circuit repair',
        city: 'Jaipur'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      expect(res.body.data[0]).toHaveProperty('worker');
      expect(res.body.data[0]).toHaveProperty('matchScore');
      expect(res.body.data[0]).toHaveProperty('reasoning');
    }
  });

  it('POST /api/workers/recommend returns 400 if prompt is less than 3 characters', async () => {
    const res = await request(app)
      .post('/api/workers/recommend')
      .send({
        prompt: 'ab'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
