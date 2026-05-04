import { supabaseAdmin } from './supabaseAdmin';
import { PLAN_ID, VALID_PLAN_IDS } from './validate';

export async function getUserByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function ensureUser(email) {
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ email })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Returns true if the user has any active subscription (any plan).
 * Accepts an optional minimumMonth to check whether that month is unlocked.
 */
export async function hasActiveSubscription(userId, minimumMonth = 1) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('id, months_unlocked')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .in('plan', VALID_PLAN_IDS)
    .gt('expiry_date', new Date().toISOString())
    .gte('months_unlocked', minimumMonth)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

/**
 * Returns the active subscription row, or null.
 * The row will contain months_unlocked and current_month.
 */
export async function getActiveSubscription(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .in('plan', VALID_PLAN_IDS)
    .gt('expiry_date', new Date().toISOString())
    .order('expiry_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

/**
 * Advance current_month by 1, capped at months_unlocked.
 * Called when a user actively navigates into the next month.
 */
export async function advanceCurrentMonth(subscriptionId) {
  const { data: sub, error: fetchErr } = await supabaseAdmin
    .from('subscriptions')
    .select('current_month, months_unlocked')
    .eq('id', subscriptionId)
    .single();
  if (fetchErr) throw fetchErr;

  const nextMonth = Math.min(sub.current_month + 1, sub.months_unlocked);
  if (nextMonth === sub.current_month) return sub; // already at max

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({ current_month: nextMonth })
    .eq('id', subscriptionId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Unlock additional months on an existing active subscription.
 * Used when a user purchases a month-unlock add-on.
 * @param {string} userId
 * @param {number} additionalMonths  Number of months to add
 * @param {string} paymentId         Razorpay payment ID for the add-on
 * @param {number} addOnAmount       Amount paid (INR)
 */
export async function unlockAdditionalMonths(userId, additionalMonths, paymentId, addOnAmount) {
  const activeSub = await getActiveSubscription(userId);
  if (!activeSub) throw new Error('No active subscription found for user');

  const newMonthsUnlocked = Math.min(activeSub.months_unlocked + additionalMonths, 12);

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({ months_unlocked: newMonthsUnlocked })
    .eq('id', activeSub.id)
    .select('*')
    .single();
  if (error) throw error;

  // Log the unlock event for audit
  await supabaseAdmin.from('subscription_unlock_log').insert({
    subscription_id: activeSub.id,
    user_id: userId,
    months_added: additionalMonths,
    months_unlocked_after: newMonthsUnlocked,
    payment_id: paymentId,
    amount: addOnAmount,
    created_at: new Date().toISOString(),
  }).select('id'); // ignore errors on this optional audit table

  return data;
}
