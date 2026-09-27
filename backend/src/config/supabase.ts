import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || 'placeholder-publishable-key';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || 'placeholder-secret-key';

// Check if database is configured and available (not placeholder and not unit test mode)
export const isDbAvailable = Boolean(
  process.env.SUPABASE_URL &&
  !process.env.SUPABASE_URL.includes('placeholder') &&
  process.env.NODE_ENV !== 'test'
);

// Standard client with publishable key (subject to RLS when user token passed)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Administrative service-role client (bypasses RLS, for server-side admin ops only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
