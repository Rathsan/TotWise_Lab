import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getUserByEmail, getActiveSubscription } from '../../../lib/subscription';
import { setSessionCookie, signSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email } = req.body || {};
  if (!token || !email) {
    return res.status(400).json({ error: 'Missing token or email' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid link' });
    }

    const { data: tokenRow, error: tokenError } = await supabaseAdmin
      .from('auth_tokens')
      .select('*')
      .eq('token', token)
      .eq('user_id', user.id)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return res.status(401).json({ error: 'Invalid link' });
    }

    if (tokenRow.used) {
      return res.status(401).json({ error: 'Link already used' });
    }

    if (new Date(tokenRow.expires_at).getTime() < Date.now()) {
      return res.status(401).json({ error: 'Link expired' });
    }

    const activeSub = await getActiveSubscription(user.id);
    if (!activeSub) {
      return res.status(403).json({ error: 'No active subscription' });
    }

    const { error: updateTokenError } = await supabaseAdmin
      .from('auth_tokens')
      .update({ used: true })
      .eq('token', token)
      .eq('user_id', user.id);

    if (updateTokenError) {
      console.error('[auth] token update error', updateTokenError);
    }

    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    const sessionToken = signSession({ userId: user.id, email: user.email });
    setSessionCookie(res, sessionToken);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[auth] verify error', error);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
