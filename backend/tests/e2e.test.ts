import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('End-to-End Integration & User Journey Suite', () => {
  const customerToken = 'valid-test-token';
  let createdBookingId = '';

  // 1. System Health Check
  it('E2E Flow 1: System Health Endpoint returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 2. Customer Auth & Profile Check
  it('E2E Flow 2: Authenticated user fetches profile via GET /api/me', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('full_name');
    expect(res.body.data).toHaveProperty('role');
  });

  // 3. Worker Search & Discovery
  it('E2E Flow 3: Customer searches worker directory via GET /api/workers', async () => {
    const res = await request(app)
      .get('/api/workers')
      .query({ profession: 'Electrician', city: 'Jaipur' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    if (res.body.data.length > 0) {
      const worker = res.body.data[0];
      expect(worker).toHaveProperty('id');
      expect(worker).toHaveProperty('profession');
      expect(worker).toHaveProperty('hourly_rate');
      expect(worker).toHaveProperty('fixed_rate_min');
    }
  });

  // 4. Worker Details Lookup
  it('E2E Flow 4: Customer views individual worker details via GET /api/workers/:id', async () => {
    const res = await request(app).get('/api/workers/w-1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('w-1');
    expect(res.body.data.profession).toBe('Electrician');
  });

  // 5. AI Smart Recommendation Matching
  it('E2E Flow 5: Customer requests AI Smart Matching via POST /api/workers/recommend', async () => {
    const res = await request(app)
      .post('/api/workers/recommend')
      .send({
        prompt: 'Need urgent electrician for short circuit repair in Malviya Nagar',
        city: 'Jaipur'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('matchScore');
    expect(res.body.data[0]).toHaveProperty('reasoning');
    expect(res.body.data[0].worker.profession).toBe('Electrician');
  });

  // 6. Booking Creation
  it('E2E Flow 6: Customer creates service booking via POST /api/bookings', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        worker_id: 'w-1',
        service_type: 'Electrical Wiring Repair',
        problem_description: 'Tripping main switch board',
        booking_date: '2026-09-30',
        time_slot: '10:00 AM - 11:30 AM',
        agreed_price: 500,
        customer_address: 'House 42, Malviya Nagar',
        city: 'Jaipur'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.agreed_price).toBe(500);
    expect(res.body.data.platform_fee).toBe(50);
    expect(res.body.data.total_cost).toBe(550);

    createdBookingId = res.body.data.id;
  });

  // 7. Booking List Retrieval
  it('E2E Flow 7: User retrieves bookings list via GET /api/bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((b: any) => b.id === createdBookingId)).toBe(true);
  });

  // 8. Booking Status Transitions
  it('E2E Flow 8: Worker accepts booking via PATCH /api/bookings/:id/status', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'accepted' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('accepted');
  });

  it('E2E Flow 9: Worker transitions job to in_progress and then completed', async () => {
    const inProgressRes = await request(app)
      .patch(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'in_progress' });

    expect(inProgressRes.status).toBe(200);
    expect(inProgressRes.body.data.status).toBe('in_progress');

    const completedRes = await request(app)
      .patch(`/api/bookings/${createdBookingId}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ status: 'completed' });

    expect(completedRes.status).toBe(200);
    expect(completedRes.body.data.status).toBe('completed');
  });

  // 9. Payment Workflow
  it('E2E Flow 10: Payment order creation & verification', async () => {
    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ booking_id: createdBookingId });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.data.booking_id).toBe(createdBookingId);
    expect(orderRes.body.data.status).toBe('pending');

    const verifyRes = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        booking_id: createdBookingId,
        provider_payment_id: 'pay_e2e_9988',
        provider_signature: 'sig_e2e_verified'
      });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.status).toBe('completed');
  });

  // 10. Review Submission
  it('E2E Flow 11: Customer submits review for completed booking via POST /api/reviews', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        booking_id: createdBookingId,
        worker_id: 'w-1',
        rating: 5,
        quality_rating: 5,
        punctuality_rating: 5,
        professionalism_rating: 5,
        comment: 'Outstanding E2E service!'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.booking_id).toBe(createdBookingId);
    expect(res.body.data.rating).toBe(5);
  });

  // 11. Worker Realtime Location & Messaging
  it('E2E Flow 12: Worker updates location & sends chat message', async () => {
    const locRes = await request(app)
      .post('/api/workers/me/location')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        latitude: 26.8522,
        longitude: 75.8052,
        booking_id: createdBookingId
      });

    expect(locRes.status).toBe(200);
    expect(locRes.body.success).toBe(true);

    const msgRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        booking_id: createdBookingId,
        recipient_id: 'w-1',
        content: 'E2E test message: Arrived at location.'
      });

    expect(msgRes.status).toBe(201);
    expect(msgRes.body.success).toBe(true);
    expect(msgRes.body.data.content).toContain('Arrived at location');
  });

  // 12. Worker Analytics & Jobs Dashboard
  it('E2E Flow 13: Worker views dashboard jobs & earnings', async () => {
    const jobsRes = await request(app)
      .get('/api/workers/me/jobs')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(jobsRes.status).toBe(200);
    expect(jobsRes.body.success).toBe(true);

    const earningsRes = await request(app)
      .get('/api/workers/me/earnings')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(earningsRes.status).toBe(200);
    expect(earningsRes.body.success).toBe(true);
    expect(earningsRes.body.data).toHaveProperty('totalEarnings');
  });
});
