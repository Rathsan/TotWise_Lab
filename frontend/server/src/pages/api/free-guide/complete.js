import { getSessionToken, verifySession } from '../../../../lib/session';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { postmarkClient, postmarkSender } from '../../../../lib/postmark';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { day } = req.body || {};
  if (![1, 2, 3].includes(Number(day))) {
    return res.status(400).json({ error: 'Invalid day' });
  }

  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  try {
    const payload = verifySession(token);
    const field = `day_${day}_completed`;

    await supabaseAdmin
      .from('free_guide_users')
      .update({ [field]: true })
      .eq('user_id', payload.userId);

    if (Number(day) === 3) {
      const appBaseUrl = process.env.APP_BASE_URL;
      if (appBaseUrl) {
        const subject = 'Ready for the full 30‑Day Toolkit?';
        const html = `<p>You finished your free guide. Ready for the complete 30‑Day Toolkit?</p><p><a href="${appBaseUrl}/index.html#pricing">Upgrade now</a></p>`;
        const text = `You finished your free guide. Upgrade here: ${appBaseUrl}/index.html#pricing`;
        await postmarkClient.sendEmail({ From: postmarkSender, To: payload.email, Subject: subject, HtmlBody: html, TextBody: text });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to update' });
  }
}
