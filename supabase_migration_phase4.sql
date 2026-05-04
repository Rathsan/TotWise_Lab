-- ============================================================
-- TotWise Lab — Phase 4 Multi-Month Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Add multi-month columns to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS months_unlocked INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS current_month   INTEGER NOT NULL DEFAULT 1;

-- 2. Backfill existing active subscriptions: they all bought Month 1
UPDATE subscriptions
SET months_unlocked = 1,
    current_month   = 1
WHERE months_unlocked IS NULL OR months_unlocked = 0;

-- 3. Update plan column: existing 'age_2_3' rows map to Month 1 single plan.
--    No rename needed — 'age_2_3' remains valid and treated as 1-month.
--    New plan IDs that will appear in future rows:
--      age_2_3_m1      → 1 month  (₹199)
--      age_2_3_3m      → 3 months (₹449)
--      age_2_3_12m     → 12 months (₹999)
--      age_2_3_family  → 12 months (₹1,299)

-- 4. Add index for faster lookups by user_id + status
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON subscriptions (user_id, status);

-- 5. Verify the schema looks correct
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;
