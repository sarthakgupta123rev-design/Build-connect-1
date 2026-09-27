import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Worker Real-Time Location API', () => {
  it('1. Unauthenticated location update returns 401', async () => {
    const res = await request(app)
      .post('/api/workers/me/location')
      .send({
        latitude: 26.8522,
        longitude: 75.8052,
        accuracy: 10
      });

    expect(res.status).toBe(401);
  });

  it('2. Invalid coordinates return 400', async () => {
    const res = await request(app)
      .post('/api/workers/me/location')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        latitude: 195.0,
        longitude: 75.8052
      });

    expect(res.status).toBe(400);
  });

  it('3. Valid location update returns 200', async () => {
    const res = await request(app)
      .post('/api/workers/me/location')
      .set('Authorization', 'Bearer valid-test-token')
      .send({
        latitude: 26.8522,
        longitude: 75.8052,
        accuracy: 10,
        booking_id: 'bk-101'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('latitude', 26.8522);
    expect(res.body.data).toHaveProperty('longitude', 75.8052);
  });

  it('4. Unauthenticated worker location fetch returns 401', async () => {
    const res = await request(app).get('/api/workers/w-1/location');
    expect(res.status).toBe(401);
  });

  it('5. Authorized booking participant location retrieval returns 200', async () => {
    const res = await request(app)
      .get('/api/workers/w-1/location?booking_id=bk-101')
      .set('Authorization', 'Bearer valid-test-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('latitude');
  });
});
