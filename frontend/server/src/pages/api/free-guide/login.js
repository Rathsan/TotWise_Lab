import crypto from 'crypto';
import { getSessionToken, verifySession } from '../../../../lib/session';
import { getActiveSubscription, getUserByEmail } from '../../../../lib/subscription';
import { isValidEmail } from '../../../../lib/validate';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { postmarkClient, postmarkSender } from '../../../../lib/postmark';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function buildLoginEmail(loginLink) {
  const emailHtml = `
    <div style="background:#FFF8F5;padding:24px 0;font-family:'DM Sans',Arial,sans-serif;color:#2D3B3A;">
      <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;padding:28px;box-shadow:0 12px 30px rgba(45,59,58,0.12);">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#E8B4A0;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2D3B3A;">TW</div>
          <div style="font-family:'Nunito',Arial,sans-serif;font-weight:800;font-size:18px;">TotWise Lab</div>
        </div>
        <h1 style="font-family:'Nunito',Arial,sans-serif;font-size:22px;margin:0 0 12px;">Your free 3‑day guide is ready</h1>
        <p style="margin:0 0 18px;line-height:1.6;color:#4A5857;">Use the button below to open Day 1 and start with a calm, simple activity.</p>
        <a href="${loginLink}" style="display:inline-block;background:#A8C5A0;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">Access Dashboard</a>
        <p style="margin:18px 0 10px;line-height:1.6;color:#4A5857;font-size:14px;">This login link expires in 30 minutes and can only be used once. You can request a new link any time while your subscription is active.</p>
        <div style="margin-top:14px;padding:14px 16px;border-radius:14px;background:#FFF8F5;color:#4A5857;font-size:14px;line-height:1.6;">
          If you’re enjoying this experience and feel it’s helping your toddler, the full 30‑Day Toolkit unlocks deeper activities, printables, and guidance for every day.
          <br /><strong>Upgrade anytime when you’re ready.</strong>
        </div>
      </div>
      <div style="max-width:560px;margin:12px auto 0;text-align:center;color:#7A8A89;font-size:12px;">© 2026 TotWise Lab. Tiny Steps. Wise Growth.</div>
    </div>
  `;
  const emailText = `Your free 3-day guide is ready.\n\nOpen Day 1 here: ${loginLink}\n\nThis login link expires in 30 minutes and can only be used once. You can request a new link any time while your subscription is active.\n\nIf you’re enjoying this experience and feel it’s helping your toddler, the full 30-Day Toolkit unlocks deeper activities, printables, and guidance for every day. Upgrade anytime when you’re ready.`;
  return { emailHtml, emailText };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const sessionToken = getSessionToken(req);
  if (sessionToken) {
    try {
      const payload = verifySession(sessionToken);
      const activeSub = await getActiveSubscription(payload.userId);
      if (activeSub) {
        return res.status(200).json({ status: 'logged_in', destination: 'paid' });
      }
      return res.status(200).json({ status: 'logged_in', destination: 'free-guide' });
    } catch (_error) {
      // fall through to email login
    }
  }

  try {
    let user = await getUserByEmail(email);
    if (!user) {
      const { data: created } = await supabaseAdmin
        .from('users')
        .insert({ email })
        .select('*')
        .single();
      user = created;
    }

    if (!user) {
      return res.status(200).json({ status: 'no_access' });
    }

    const activeSub = await getActiveSubscription(user.id);
    if (activeSub) {
      return res.status(200).json({ status: 'logged_in', destination: 'paid' });
    }

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

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from('auth_tokens')
      .select('token', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since);

    if (countError) {
      console.warn('[free-guide] rate limit count error', countError);
    }

    if (countError || (count && count >= 3)) {
      console.warn('[free-guide] rate limit reached', { email, count });
      return res.status(200).json({ status: 'link_sent' });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from('auth_tokens')
      .insert({ token, user_id: user.id, expires_at: expiresAt.toISOString(), used: false });

    if (tokenError) {
      console.error('[free-guide] token insert error', tokenError);
      return res.status(500).json({ error: 'Unable to send login link' });
    }

    const appBaseUrl = process.env.APP_BASE_URL;
    if (!appBaseUrl) {
      return res.status(500).json({ error: 'Missing APP_BASE_URL' });
    }

    const loginLink = `${appBaseUrl}/free-guide/callback?token=${token}&email=${encodeURIComponent(email)}`;
    const { emailHtml, emailText } = buildLoginEmail(loginLink);

    const postmarkResponse = await postmarkClient.sendEmail({
      From: postmarkSender,
      To: email,
      Subject: 'Your secure TotWise login link',
      HtmlBody: emailHtml,
      TextBody: emailText
    });

    console.log('[free-guide] postmark response', postmarkResponse);

    return res.status(200).json({ status: 'link_sent' });
  } catch (error) {
    console.error('[free-guide] login error', error);
    return res.status(500).json({ error: 'Unable to sign in' });
  }
}
