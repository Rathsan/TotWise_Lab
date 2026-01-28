import { getSessionToken, verifySession, signSession, setSessionCookie } from '../../../../lib/session';
import { getActiveSubscription } from '../../../../lib/subscription';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    const payload = verifySession(token);
    const activeSub = await getActiveSubscription(payload.userId);
    if (!activeSub) {
      return res.status(403).json({ error: 'Subscription inactive' });
    }
    const refreshedToken = signSession({ userId: payload.userId, email: payload.email });
    setSessionCookie(res, refreshedToken);
    return res.status(200).json({
      authenticated: true,
      email: payload.email,
      userId: payload.userId
    });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
}
