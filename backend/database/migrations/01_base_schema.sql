-- BUILDCONNECT BASE MIGRATION: PROFILES, WORKERS, BOOKINGS, REVIEWS
-- Idempotent and non-destructive base schema setup.

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(100) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  city VARCHAR(100) DEFAULT 'Jaipur',
  area VARCHAR(100) DEFAULT 'Central',
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'worker')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. WORKERS TABLE
CREATE TABLE IF NOT EXISTS workers (
  id VARCHAR(100) PRIMARY KEY,
  profile_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255),
  profession VARCHAR(100) NOT NULL,
  bio TEXT,
  experience_years INT DEFAULT 0,
  hourly_rate NUMERIC(10,2) DEFAULT 0,
  fixed_rate_min NUMERIC(10,2) DEFAULT 0,
  fixed_rate_max NUMERIC(10,2) DEFAULT 0,
  availability VARCHAR(50) DEFAULT 'Available Today',
  verified BOOLEAN DEFAULT false,
  average_rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  total_jobs INT DEFAULT 0,
  trust_score INT DEFAULT 85,
  skills TEXT[] DEFAULT '{}',
  city VARCHAR(100) DEFAULT 'Jaipur',
  area VARCHAR(100) DEFAULT 'Central',
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workers_profile_id ON workers(profile_id);
CREATE INDEX IF NOT EXISTS idx_workers_profession ON workers(profession);
CREATE INDEX IF NOT EXISTS idx_workers_city ON workers(city);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(100) PRIMARY KEY,
  customer_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id VARCHAR(100) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  service_type VARCHAR(255) NOT NULL,
  problem_description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  booking_date VARCHAR(50) NOT NULL,
  time_slot VARCHAR(100) NOT NULL,
  agreed_price NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_cost NUMERIC(10,2) NOT NULL,
  customer_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker_id ON bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(100) PRIMARY KEY,
  booking_id VARCHAR(100) NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id VARCHAR(100) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
  punctuality_rating INT CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  professionalism_rating INT CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_worker_id ON reviews(worker_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
