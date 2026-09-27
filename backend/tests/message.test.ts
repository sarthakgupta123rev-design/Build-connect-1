import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Real-Time Messaging API', () => {
  it('1. Unauthenticated message creation returns 401', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({
        booking_id: 'bk-101',
        recipient_id: 'w-1',
        content: 'Test message'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('2. Empty content returns 400', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-101',
        recipient_id: 'w-1',
        content: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('3. Valid participant message creation returns 201', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        booking_id: 'bk-101',
        recipient_id: 'w-1',
        content: 'Bringing extension board for DB assembly.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.content).toBe('Bringing extension board for DB assembly.');
  });

  it('4. Unauthorized conversation access returns 401 for unauthenticated user', async () => {
    const res = await request(app).get('/api/messages/booking/bk-101');
    expect(res.status).toBe(401);
  });

  it('5. Valid conversation retrieval returns 200', async () => {
    const res = await request(app)
      .get('/api/messages/booking/bk-101')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
