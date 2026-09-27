import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Dispute Management API', () => {
  it('1. Unauthenticated dispute creation returns 401', async () => {
    const res = await request(app)
      .post('/api/disputes')
      .send({
        booking_id: 'bk-100',
        reason: 'Incomplete Work',
        description: 'Wiring was left incomplete.'
      });

    expect(res.status).toBe(401);
  });

  it('2. Valid dispute creation returns 201', async () => {
    const res = await request(app)
      .post('/api/disputes')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-101',
        reason: 'Incomplete Work',
        description: 'Wiring was left incomplete in bedroom 2.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');
  });

  it('3. Duplicate dispute returns 409', async () => {
    const res = await request(app)
      .post('/api/disputes')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-101',
        reason: 'Duplicate dispute',
        description: 'Trying to file another dispute.'
      });

    expect(res.status).toBe(409);
  });

  it('4. Valid dispute detail retrieval returns 200', async () => {
    const res = await request(app)
      .get('/api/disputes/disp-101')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('5. Invalid status update returns 400', async () => {
    const res = await request(app)
      .patch('/api/disputes/disp-101/status')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        status: 'invalid_status_value'
      });

    expect(res.status).toBe(400);
  });

  it('6. Authorized status update returns 200', async () => {
    const res = await request(app)
      .patch('/api/disputes/disp-101/status')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        status: 'under_review',
        resolution_notes: 'Support team initiated inquiry with worker.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('under_review');
  });
});
