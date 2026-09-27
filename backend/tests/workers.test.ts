import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Worker Directory API', () => {
  it('GET /api/workers should return HTTP 200 with directory listing', async () => {
    const res = await request(app).get('/api/workers');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('profession');
  });

  it('GET /api/workers/nonexistent-id should return HTTP 404', async () => {
    const res = await request(app).get('/api/workers/nonexistent-id');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });

  it('GET /api/workers/w-1 should return HTTP 200 with worker details', async () => {
    const res = await request(app).get('/api/workers/w-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('w-1');
  });
});
