import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { getUserByEmail, getActiveSubscription } from '../../../../lib/subscription';
import { setSessionCookie, signSession } from '../../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, email } = req.body || {};
  if (!token || !email) {
    return res.status(400).json({ error: 'Unable to sign in' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Unable to sign in' });
    }

    const { data: tokenRow } = await supabaseAdmin
      .from('auth_tokens')
      .select('*')
      .eq('token', token)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!tokenRow || tokenRow.used || new Date(tokenRow.expires_at).getTime() < Date.now()) {
      return res.status(401).json({ error: 'Unable to sign in' });
    }

    const activeSub = await getActiveSubscription(user.id);
    if (!activeSub) {
      const { data: freeGuide } = await supabaseAdmin
        .from('free_guide_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!freeGuide) {
        await supabaseAdmin
          .from('free_guide_users')
          .insert({ user_id: user.id, email, signup_date: new Date().toISOString(), current_day: 1 });
      }
    }

    await supabaseAdmin
      .from('auth_tokens')
      .update({ used: true })
      .eq('token', token)
      .eq('user_id', user.id);

    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    const sessionToken = signSession({ userId: user.id, email: user.email });
    setSessionCookie(res, sessionToken);

    if (activeSub) {
      return res.status(200).json({ status: 'paid' });
    }

    return res.status(200).json({ status: 'free' });
  } catch (error) {
    console.error('[free-guide] verify error', error);
    return res.status(500).json({ error: 'Unable to sign in' });
  }
}
