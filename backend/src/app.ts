import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import userRoutes from './routes/user.routes.js';
import workerRoutes from './routes/worker.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reviewRoutes from './routes/review.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import messageRoutes from './routes/message.routes.js';
import disputeRoutes from './routes/dispute.routes.js';
import locationRoutes from './routes/location.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

import { apiLimiter, sensitiveLimiter } from './middleware/rateLimit.middleware.js';

dotenv.config();

const app = express();

// Security middleware: Helmet HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by frontend hosting/reverse proxy in prod
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API Rate Limiter
app.use('/api', apiLimiter);

// CORS configuration supporting dynamic Vite dev server ports
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.netlify.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('CORS origin blocked'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing with strict payload limits (prevent DOS via large payloads)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Sensitive endpoint rate limiting
app.use('/api/me', sensitiveLimiter);
app.use('/api/payments', sensitiveLimiter);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/me', userRoutes);
app.use('/api/workers', locationRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker', analyticsRoutes);
app.use('/api/workers/me', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
