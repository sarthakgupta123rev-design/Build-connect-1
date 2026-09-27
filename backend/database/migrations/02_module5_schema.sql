-- BUILDCONNECT MODULE 5 MIGRATION: MESSAGES & DISPUTES
-- Disclaimer: Migration created locally; live Supabase migration not yet applied.

-- 1. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(100) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their bookings"
  ON messages FOR SELECT
  USING (
    auth.uid()::text = sender_id OR auth.uid()::text = recipient_id
  );

CREATE POLICY "Users can insert messages for their bookings"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid()::text = sender_id
  );

-- 2. DISPUTES ENUM AND TABLE
DO $$ BEGIN
  CREATE TYPE dispute_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(100) NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  raised_by VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  status dispute_status DEFAULT 'pending',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputes_booking_id ON disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON disputes(raised_by);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view disputes for their bookings"
  ON disputes FOR SELECT
  USING (
    auth.uid()::text = raised_by OR 
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = disputes.booking_id 
      AND (bookings.customer_id = auth.uid()::text OR bookings.worker_id = auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert disputes for their bookings"
  ON disputes FOR INSERT
  WITH CHECK (
    auth.uid()::text = raised_by
  );
