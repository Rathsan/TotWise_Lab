import { getSessionToken, verifySession } from '../../../../lib/session';
import { getActiveSubscription } from '../../../../lib/subscription';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { postmarkClient, postmarkSender } from '../../../../lib/postmark';

function daysSince(dateString) {
  if (!dateString) return 0;
  const start = new Date(dateString).getTime();
  const now = Date.now();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

async function sendUnlockEmail(email, day, appBaseUrl) {
  const loginLink = `${appBaseUrl}/free-guide`;
  const subject = `Day ${day} of your free guide is ready`;
  const html = `<p>Your Day ${day} guide is ready.</p><p><a href="${loginLink}">Open your guide</a></p>`;
  const text = `Your Day ${day} guide is ready: ${loginLink}`;
  await postmarkClient.sendEmail({ From: postmarkSender, To: email, Subject: subject, HtmlBody: html, TextBody: text });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getSessionToken(req);
  if (!token) {
    return res.status(401).json({ status: 'unauthenticated' });
  }

  try {
    const payload = verifySession(token);
    const activeSub = await getActiveSubscription(payload.userId);
    if (activeSub) {
      return res.status(200).json({ status: 'paid' });
    }

    const { data: freeGuide } = await supabaseAdmin
      .from('free_guide_users')
      .select('*')
      .eq('user_id', payload.userId)
      .maybeSingle();

    if (!freeGuide) {
      return res.status(200).json({ status: 'no_access' });
    }

    const elapsed = daysSince(freeGuide.signup_date);
    const currentDay = Math.min(3, Math.max(1, elapsed + 1));

    if (currentDay > (freeGuide.current_day || 1)) {
      await supabaseAdmin
        .from('free_guide_users')
        .update({ current_day: currentDay })
        .eq('user_id', payload.userId);

      const appBaseUrl = process.env.APP_BASE_URL;
      if (appBaseUrl) {
        if (currentDay >= 2 && (freeGuide.current_day || 1) < 2) {
          await sendUnlockEmail(payload.email, 2, appBaseUrl);
        }
        if (currentDay >= 3 && (freeGuide.current_day || 1) < 3) {
          await sendUnlockEmail(payload.email, 3, appBaseUrl);
        }
      }
    }

    const refreshed = { ...freeGuide, current_day: currentDay };
    return res.status(200).json({ status: 'free', data: refreshed });
  } catch (error) {
    return res.status(401).json({ status: 'unauthenticated' });
  }
}
