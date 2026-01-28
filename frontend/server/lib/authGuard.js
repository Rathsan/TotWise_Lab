import { getSessionToken, verifySession } from './session';
import { hasActiveSubscription } from './subscription';

/**
 * Centralized paid-user guard for Next.js Pages API routes.
 * Uses the existing session cookie (totwise_session) and subscription table.
 */
export async function requirePaidUser(req) {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return { ok: false, status: 401, message: 'Missing auth token' };
    }

    const payload = verifySession(token);
    const hasPaidAccess = await hasActiveSubscription(payload.userId);
    if (!hasPaidAccess) {
      return { ok: false, status: 403, message: 'Payment required' };
    }

    return {
      ok: true,
      user: {
        id: payload.userId,
        email: payload.email
      }
    };
  } catch (error) {
    console.error('[authGuard] error', error);
    return { ok: false, status: 401, message: 'Auth check failed' };
  }
}
