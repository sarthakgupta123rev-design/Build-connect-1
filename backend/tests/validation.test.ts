import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Zod API Input Validation', () => {
  it('POST /api/bookings with invalid payload should return HTTP 400', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        agreed_price: -50,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Validation error');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('POST /api/reviews with invalid rating (>5) should return HTTP 400', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-100',
        worker_id: 'w-1',
        rating: 6,
        comment: 'Great service!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Validation error');
  });
});
