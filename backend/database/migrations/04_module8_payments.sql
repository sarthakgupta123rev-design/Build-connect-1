-- BUILDCONNECT MODULE 8 MIGRATION: PAYMENTS
-- Disclaimer: Migration created locally; live Supabase migration not yet applied.

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(100) NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id VARCHAR(100) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id VARCHAR(100) NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  worker_amount NUMERIC(10,2) NOT NULL CHECK (worker_amount >= 0),
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider VARCHAR(20) DEFAULT 'razorpay',
  provider_order_id VARCHAR(100),
  provider_payment_id VARCHAR(100),
  provider_signature VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON payments(worker_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view payments for their bookings"
    ON payments FOR SELECT
    USING (
      auth.uid()::text = customer_id OR auth.uid()::text = worker_id
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Customers can insert payments for their bookings"
    ON payments FOR INSERT
    WITH CHECK (
      auth.uid()::text = customer_id
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
