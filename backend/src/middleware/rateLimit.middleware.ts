import rateLimit from 'express-rate-limit';

// General API Rate Limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === 'test' ? 10000 : 1000, // Limit each IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    errors: [],
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Strict Rate Limiter for Sensitive / High-Cost Routes (Recommendation, Payments, Auth)
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === 'test' ? 10000 : 100, // Strict limit for sensitive APIs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded for sensitive operations. Please try again later.',
    errors: [],
  },
  skip: () => process.env.NODE_ENV === 'test',
});
