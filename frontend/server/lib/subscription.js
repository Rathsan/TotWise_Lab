import { supabaseAdmin } from './supabaseAdmin';
import { PLAN_ID } from './validate';

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

export async function hasActiveSubscription(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .eq('plan', PLAN_ID)
    .gt('expiry_date', new Date().toISOString())
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function getActiveSubscription(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .eq('plan', PLAN_ID)
    .gt('expiry_date', new Date().toISOString())
    .order('expiry_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}
