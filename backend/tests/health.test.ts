import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('BuildConnect Health API & Core Middleware', () => {
  it('GET /api/health should return HTTP 200 with success status and message', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: 'BuildConnect backend is running',
    });
  });

  it('GET /api/unknown-endpoint should return HTTP 404 with error response structure', async () => {
    const res = await request(app).get('/api/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Route not found');
  });
});
