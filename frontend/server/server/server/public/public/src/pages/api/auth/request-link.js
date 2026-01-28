import crypto from 'crypto';
import { postmarkClient, postmarkSender } from '../../../../lib/postmark';
import { getUserByEmail, getActiveSubscription } from '../../../../lib/subscription';
import { isValidEmail } from '../../../../lib/validate';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
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

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(403).json({ error: 'No active subscription' });
    }

    const activeSub = await getActiveSubscription(user.id);
    if (!activeSub) {
      return res.status(403).json({ error: 'No active subscription' });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from('auth_tokens')
      .insert({
        token,
        user_id: user.id,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (tokenError) {
      console.error('[auth] token insert error', tokenError);
      return res.status(500).json({ error: 'Could not create login link' });
    }

    const appBaseUrl = process.env.APP_BASE_URL;
    if (!appBaseUrl) {
      return res.status(500).json({ error: 'Missing APP_BASE_URL' });
    }

    const loginLink = `${appBaseUrl}/login/login.html?token=${token}&email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <div style="background:#FFF8F5;padding:24px 0;font-family:'DM Sans',Arial,sans-serif;color:#2D3B3A;">
        <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;padding:28px;box-shadow:0 12px 30px rgba(45,59,58,0.12);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;border-radius:50%;background:#E8B4A0;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2D3B3A;">TW</div>
            <div style="font-family:'Nunito',Arial,sans-serif;font-weight:800;font-size:18px;">TotWise Lab</div>
          </div>
          <h1 style="font-family:'Nunito',Arial,sans-serif;font-size:22px;margin:0 0 12px;">Your secure login link</h1>
          <p style="margin:0 0 18px;line-height:1.6;color:#4A5857;">Use the button below to access your TotWise Lab dashboard.</p>
          <a href="${loginLink}" style="display:inline-block;background:#A8C5A0;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">Access Dashboard</a>
          <p style="margin:18px 0 0;line-height:1.6;color:#4A5857;font-size:14px;">This login link expires in 30 minutes and can only be used once. You can request a new link any time while your subscription is active.</p>
        </div>
        <div style="max-width:560px;margin:12px auto 0;text-align:center;color:#7A8A89;font-size:12px;">
          © 2026 TotWise Lab. Tiny Steps. Wise Growth.
        </div>
      </div>
    `;

    const emailText = `Use this link to access your TotWise Lab dashboard: ${loginLink}\n\nThis login link expires in 30 minutes and can only be used once. You can request a new link any time while your subscription is active.`;

    await postmarkClient.sendEmail({
      From: postmarkSender,
      To: email,
      Subject: 'Your secure TotWise login link',
      HtmlBody: emailHtml,
      TextBody: emailText
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[auth] request-link error', error);
    return res.status(500).json({ error: 'Unable to send login link' });
  }
}
