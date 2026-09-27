import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Supabase Auth Token Validation Middleware', () => {
  it('GET /api/me without Authorization header should return HTTP 401', async () => {
    const res = await request(app).get('/api/me');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      success: false,
      message: 'Authentication required: missing Bearer token',
      errors: [],
    });
  });

  it('GET /api/me with invalid Bearer token should return HTTP 401', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer invalid-token-123');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid token');
  });

  it('GET /api/me with valid Bearer token should return HTTP 200 and user profile', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('full_name');
  });
});
