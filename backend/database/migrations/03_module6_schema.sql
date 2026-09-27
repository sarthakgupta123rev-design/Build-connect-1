-- BUILDCONNECT MODULE 6 MIGRATION: WORKER LOCATIONS
-- Disclaimer: Migration created locally; live Supabase migration not yet applied.

CREATE TABLE IF NOT EXISTS worker_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id VARCHAR(100) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  booking_id VARCHAR(100) REFERENCES bookings(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  accuracy DOUBLE PRECISION CHECK (accuracy IS NULL OR accuracy >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_locations_worker_id ON worker_locations(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_locations_booking_id ON worker_locations(booking_id);

ALTER TABLE worker_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can update their own location"
  ON worker_locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workers 
      WHERE workers.id = worker_locations.worker_id 
      AND workers.profile_id = auth.uid()::text
    )
  );

CREATE POLICY "Participants can view active job worker location"
  ON worker_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workers 
      WHERE workers.id = worker_locations.worker_id 
      AND workers.profile_id = auth.uid()::text
    )
    OR
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = worker_locations.booking_id 
      AND (bookings.customer_id = auth.uid()::text OR bookings.worker_id = auth.uid()::text)
    )
  );
