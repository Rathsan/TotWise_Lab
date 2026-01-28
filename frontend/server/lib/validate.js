export const PLAN_ID = 'age_2_3';
export const PLAN_AMOUNT_INR = 199;
export const PLAN_AMOUNT_PAISE = PLAN_AMOUNT_INR * 100;
export const SUBSCRIPTION_DAYS = 45;

export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}
