// ── Plan catalogue ──────────────────────────────────────────────────────────
// Each entry defines: months unlocked, price (INR), Razorpay amount (paise),
// subscription duration in days, and a human label.
export const PLANS = {
  'age_2_3':        { months: 1,  amount: 199,  amountPaise: 199  * 100, days: 45,  label: 'Month 1' },
  'age_2_3_m1':     { months: 1,  amount: 199,  amountPaise: 199  * 100, days: 45,  label: 'Month 1' },
  'age_2_3_3m':     { months: 3,  amount: 449,  amountPaise: 449  * 100, days: 135, label: '3-Month Bundle' },
  'age_2_3_12m':    { months: 12, amount: 999,  amountPaise: 999  * 100, days: 365, label: 'Full Year' },
  'age_2_3_family': { months: 12, amount: 1299, amountPaise: 1299 * 100, days: 365, label: 'Family Plan' },
};

export const VALID_PLAN_IDS = Object.keys(PLANS);

// ── Backward-compat exports (used by existing code) ─────────────────────────
export const PLAN_ID           = 'age_2_3';
export const PLAN_AMOUNT_INR   = 199;
export const PLAN_AMOUNT_PAISE = 199 * 100;
export const SUBSCRIPTION_DAYS = 45;

// ── New plan ID constants ────────────────────────────────────────────────────
export const PLAN_MONTH_1 = 'age_2_3_m1';
export const PLAN_3_MONTH = 'age_2_3_3m';
export const PLAN_ANNUAL  = 'age_2_3_12m';
export const PLAN_FAMILY  = 'age_2_3_family';

// ── Helpers ──────────────────────────────────────────────────────────────────
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

/** Resolve a plan object from its ID. Returns null for unknown plans. */
export function resolvePlan(planId) {
  return PLANS[planId] || null;
}

/** Return the paise amount for any valid plan, or null if unknown. */
export function planAmountPaise(planId) {
  return PLANS[planId]?.amountPaise ?? null;
}
