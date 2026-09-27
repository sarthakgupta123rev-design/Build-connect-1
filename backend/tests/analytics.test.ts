import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Worker Analytics & Jobs API', () => {
  it('GET /api/worker/earnings fails without auth token', async () => {
    const res = await request(app).get('/api/worker/earnings');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/worker/earnings succeeds with valid auth token', async () => {
    const res = await request(app)
      .get('/api/worker/earnings')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalEarnings');
    expect(res.body.data).toHaveProperty('netEarnings');
    expect(res.body.data).toHaveProperty('completedJobs');
  });

  it('GET /api/workers/me/jobs fails without auth token', async () => {
    const res = await request(app).get('/api/workers/me/jobs');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/workers/me/jobs succeeds with valid auth token', async () => {
    const res = await request(app)
      .get('/api/workers/me/jobs')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
