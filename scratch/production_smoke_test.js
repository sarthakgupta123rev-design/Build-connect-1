import http from 'http';

const BASE_URL = 'http://localhost:5000/api';

async function makeRequest(path, method = 'GET', body = null, headers = {}) {
  const url = new URL(BASE_URL + path);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runSmokeTests() {
  console.log('--- STARTING PRODUCTION SMOKE TESTS ---\n');

  // 1. Health Check
  const health = await makeRequest('/health');
  console.log('1. Health Check status:', health.status, 'Body:', health.body);

  // 2. Auth protection check (unauthenticated GET /me)
  const unauthMe = await makeRequest('/me');
  console.log('2. Unauthenticated /me status:', unauthMe.status);

  // 3. Authenticated /me check
  const authMe = await makeRequest('/me', 'GET', null, { Authorization: 'Bearer valid-test-token' });
  console.log('3. Authenticated /me status:', authMe.status, 'Body:', authMe.body?.data?.email);

  // 4. Worker Directory
  const workers = await makeRequest('/workers');
  console.log('4. Worker directory status:', workers.status, 'Workers count:', workers.body?.data?.length);

  // 5. Worker Profile
  const workerDetail = await makeRequest('/workers/w-1');
  console.log('5. Worker detail status:', workerDetail.status, 'Name:', workerDetail.body?.data?.name);

  // 6. AI Recommendation
  const aiRec = await makeRequest('/workers/recommend', 'POST', { prompt: 'Electrician for short circuit', city: 'Jaipur' });
  console.log('6. AI Recommendation status:', aiRec.status, 'Top match score:', aiRec.body?.data?.[0]?.matchScore);

  // 7. Booking Creation
  const bookingData = {
    worker_id: 'w-1',
    service_type: 'Electrical Wiring',
    problem_description: 'Main board trip issue',
    booking_date: '2026-10-01',
    time_slot: '10:00 AM - 11:30 AM',
    agreed_price: 600,
    customer_address: '12 Malviya Nagar',
    city: 'Jaipur'
  };
  const createBk = await makeRequest('/bookings', 'POST', bookingData, { Authorization: 'Bearer valid-test-token' });
  console.log('7. Create Booking status:', createBk.status, 'Booking ID:', createBk.body?.data?.id);
  const newBkId = createBk.body?.data?.id || 'bk-1';

  // 8. Booking Status Update
  const updateBk = await makeRequest(`/bookings/${newBkId}/status`, 'PATCH', { status: 'accepted' }, { Authorization: 'Bearer valid-test-token' });
  console.log('8. Update Booking status:', updateBk.status, 'New status:', updateBk.body?.data?.status);

  // 9. Send Chat Message
  const sendMsg = await makeRequest('/messages', 'POST', { booking_id: newBkId, recipient_id: 'u-w1', content: 'Worker arriving soon?' }, { Authorization: 'Bearer valid-test-token' });
  console.log('9. Send Message status:', sendMsg.status, 'Message content:', sendMsg.body?.data?.content);

  // 10. Fetch Chat Messages
  const getMsgs = await makeRequest(`/messages/${newBkId}`, 'GET', null, { Authorization: 'Bearer valid-test-token' });
  console.log('10. Get Messages status:', getMsgs.status, 'Message count:', getMsgs.body?.data?.length);

  // 11. Fetch Worker Reviews
  const getReviews = await makeRequest('/reviews/w-1');
  console.log('11. Get Reviews status:', getReviews.status, 'Review count:', getReviews.body?.data?.length);

  // 12. Submit Review
  const submitRev = await makeRequest('/reviews', 'POST', { booking_id: newBkId, worker_id: 'w-1', rating: 5, comment: 'Great job!' }, { Authorization: 'Bearer valid-test-token' });
  console.log('12. Submit Review status:', submitRev.status, 'Review ID:', submitRev.body?.data?.id);

  // 13. Create Payment Order
  const createPay = await makeRequest('/payments/create-order', 'POST', { booking_id: newBkId, amount: 600 }, { Authorization: 'Bearer valid-test-token' });
  console.log('13. Create Payment Order status:', createPay.status, 'Order ID:', createPay.body?.data?.orderId);

  // 14. Worker Earnings & Jobs
  const getEarnings = await makeRequest('/worker/earnings', 'GET', null, { Authorization: 'Bearer valid-test-token' });
  console.log('14. Worker Earnings status:', getEarnings.status, 'Total earnings:', getEarnings.body?.data?.totalEarnings);

  // 15. File Dispute
  const fileDisp = await makeRequest('/disputes', 'POST', { booking_id: newBkId, reason: 'Late arrival', description: 'Worker arrived 30 mins late' }, { Authorization: 'Bearer valid-test-token' });
  console.log('15. File Dispute status:', fileDisp.status, 'Dispute status:', fileDisp.body?.data?.status);

  console.log('\n--- PRODUCTION SMOKE TESTS COMPLETE ---');
}

runSmokeTests();
