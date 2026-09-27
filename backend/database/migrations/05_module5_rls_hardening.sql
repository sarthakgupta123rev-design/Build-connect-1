-- BUILDCONNECT MODULE 5 MIGRATION: RLS POLICIES FOR BASE SCHEMA
-- Enables Row Level Security on base tables (profiles, workers, bookings, reviews) and defines granular security policies.

-- 1. PROFILES TABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid()::text = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid()::text = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. WORKERS TABLE RLS
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Worker directory is viewable by everyone"
    ON workers FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Workers can insert their own worker profile"
    ON workers FOR INSERT
    WITH CHECK (auth.uid()::text = profile_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Workers can update their own worker profile"
    ON workers FOR UPDATE
    USING (auth.uid()::text = profile_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. BOOKINGS TABLE RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view bookings where they are customer or worker"
    ON bookings FOR SELECT
    USING (
      auth.uid()::text = customer_id OR
      EXISTS (
        SELECT 1 FROM workers
        WHERE workers.id = bookings.worker_id
        AND workers.profile_id = auth.uid()::text
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Customers can create bookings for themselves"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid()::text = customer_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Participants can update their bookings"
    ON bookings FOR UPDATE
    USING (
      auth.uid()::text = customer_id OR
      EXISTS (
        SELECT 1 FROM workers
        WHERE workers.id = bookings.worker_id
        AND workers.profile_id = auth.uid()::text
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. REVIEWS TABLE RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Customers can create reviews for their completed bookings"
    ON reviews FOR INSERT
    WITH CHECK (
      auth.uid()::text = customer_id AND
      EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.id = reviews.booking_id
        AND bookings.customer_id = auth.uid()::text
        AND bookings.status = 'completed'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
