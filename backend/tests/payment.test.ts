import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Zero-Cost Payment Foundation API', () => {
  it('1. Unauthenticated payment order creation returns 401', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .send({ booking_id: 'bk-101' });

    expect(res.status).toBe(401);
  });

  it('2. Empty booking_id returns 400', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ booking_id: '' });

    expect(res.status).toBe(400);
  });

  it('3. Valid payment order creation returns 201', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ booking_id: 'bk-101' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('amount');
    expect(res.body.data.status).toBe('pending');
  });

  it('4. Duplicate payment order creation returns 409', async () => {
    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ booking_id: 'bk-101' });

    expect(res.status).toBe(409);
  });

  it('5. Valid payment verification returns 200', async () => {
    const res = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-101',
        provider_payment_id: 'pay_mock_101',
        provider_signature: 'sig_mock_101'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');
  });
});
