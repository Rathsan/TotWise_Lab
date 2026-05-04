import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { ensureUser, unlockAdditionalMonths } from '../../../../lib/subscription';
import { PLANS, VALID_PLAN_IDS } from '../../../../lib/validate';
import { postmarkClient, postmarkSender } from '../../../../lib/postmark';

export const config = {
  api: { bodyParser: false }
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', (err) => reject(err));
  });
}

function verifySignature(rawBody, signature, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const rawBody        = await getRawBody(req);
  const signature      = req.headers['x-razorpay-signature'];
  const webhookSecret  = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).end('Missing webhook signature');
  }
  if (!verifySignature(rawBody, signature, webhookSecret)) {
    return res.status(401).end('Invalid signature');
  }

  const event = JSON.parse(rawBody);
  console.log('[webhook] event received:', event.event);

  if (event.event !== 'payment.captured') {
    return res.status(200).json({ received: true });
  }

  const payment   = event.payload?.payment?.entity;
  const email     = payment?.notes?.email || payment?.email;
  const amount    = payment?.amount;
  const paymentId = payment?.id;
  const planId    = payment?.notes?.plan || 'age_2_3';
  const purchaseType = payment?.notes?.purchase_type || 'new_sub';

  console.log('[webhook] payment captured:', { paymentId, amount, email, planId, purchaseType });

  if (!email || !paymentId) {
    return res.status(400).end('Missing payment data');
  }

  // Resolve plan — fall back to legacy single-month plan if planId is unknown
  const plan = PLANS[planId] || PLANS['age_2_3'];

  // Verify amount matches expected plan amount (within ±1 paise for rounding tolerance)
  if (Math.abs(amount - plan.amountPaise) > 1) {
    console.error('[webhook] amount mismatch:', { received: amount, expected: plan.amountPaise });
    return res.status(400).end('Amount mismatch');
  }

  try {
    const user = await ensureUser(email);

    // ── Month Unlock Purchase ─────────────────────────────────────────────
    if (purchaseType === 'month_unlock') {
      console.log('[webhook] processing month unlock for user:', user.id, 'months:', plan.months);
      await unlockAdditionalMonths(user.id, plan.months, paymentId, plan.amount);

      await sendUnlockEmail(email, plan, paymentId);
      return res.status(200).json({ received: true });
    }

    // ── New Subscription Purchase ─────────────────────────────────────────
    const startDate  = new Date();
    const expiryDate = new Date(startDate.getTime());
    expiryDate.setDate(expiryDate.getDate() + plan.days);

    const { error: insertError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id:         user.id,
        plan:            planId,
        amount:          plan.amount,
        status:          'ACTIVE',
        payment_id:      paymentId,
        start_date:      startDate.toISOString(),
        expiry_date:     expiryDate.toISOString(),
        months_unlocked: plan.months,
        current_month:   1,
      });

    if (insertError) {
      console.error('[webhook] subscription insert error', insertError);
      return res.status(500).end('Subscription insert failed');
    }

    // Create a one-time login token (30 min TTL) so user can access immediately
    const token     = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const { error: tokenError } = await supabaseAdmin
      .from('auth_tokens')
      .insert({ token, user_id: user.id, expires_at: expiresAt.toISOString(), used: false });

    if (tokenError) {
      console.error('[webhook] auth token insert error', tokenError);
      return res.status(500).end('Auth token insert failed');
    }

    const appBaseUrl = process.env.APP_BASE_URL;
    if (!appBaseUrl) return res.status(500).end('Missing APP_BASE_URL');

    const loginLink = `${appBaseUrl}/login/login.html?token=${token}&email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <div style="background:#FFF8F5;padding:24px 0;font-family:'DM Sans',Arial,sans-serif;color:#2D3B3A;">
        <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;padding:28px;box-shadow:0 12px 30px rgba(45,59,58,0.12);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;border-radius:50%;background:#E8B4A0;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2D3B3A;">TW</div>
            <div style="font-family:'Nunito',Arial,sans-serif;font-weight:800;font-size:18px;">TotWise Lab</div>
          </div>
          <h1 style="font-family:'Nunito',Arial,sans-serif;font-size:22px;margin:0 0 12px;">Payment successful — ${plan.label} unlocked.</h1>
          <p style="margin:0 0 18px;line-height:1.6;color:#4A5857;">Your <strong>${plan.label}</strong> subscription is active. Use the button below to access your dashboard.</p>
          <a href="${loginLink}" style="display:inline-block;background:#A8C5A0;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">Access your dashboard</a>
          <p style="margin:18px 0 0;line-height:1.6;color:#4A5857;font-size:14px;">This login link expires in 30 minutes and can only be used once.</p>
        </div>
        <div style="max-width:560px;margin:12px auto 0;text-align:center;color:#7A8A89;font-size:12px;">
          © 2026 TotWise Lab. Tiny Steps. Wise Growth.
        </div>
      </div>
    `;

    const emailText = `Payment successful — ${plan.label} unlocked.\n\nAccess your dashboard: ${loginLink}\n\nThis login link expires in 30 minutes.`;

    const postmarkResult = await postmarkClient.sendEmail({
      From:     postmarkSender,
      To:       email,
      Subject:  `Your TotWise ${plan.label} is ready`,
      HtmlBody: emailHtml,
      TextBody: emailText,
    });
    console.log('[webhook] postmark response:', postmarkResult);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[webhook] error', error);
    return res.status(500).end('Webhook error');
  }
}

async function sendUnlockEmail(email, plan, paymentId) {
  const appBaseUrl = process.env.APP_BASE_URL;
  if (!appBaseUrl) return;

  const dashboardLink = `${appBaseUrl}/Dashboard/dashboard.html`;

  const emailHtml = `
    <div style="background:#FFF8F5;padding:24px 0;font-family:'DM Sans',Arial,sans-serif;color:#2D3B3A;">
      <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:20px;padding:28px;box-shadow:0 12px 30px rgba(45,59,58,0.12);">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#E8B4A0;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2D3B3A;">TW</div>
          <div style="font-family:'Nunito',Arial,sans-serif;font-weight:800;font-size:18px;">TotWise Lab</div>
        </div>
        <h1 style="font-family:'Nunito',Arial,sans-serif;font-size:22px;margin:0 0 12px;">${plan.label} unlocked!</h1>
        <p style="margin:0 0 18px;line-height:1.6;color:#4A5857;">Your next month of content is now available on your dashboard.</p>
        <a href="${dashboardLink}" style="display:inline-block;background:#A8C5A0;color:#FFFFFF;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:'Nunito',Arial,sans-serif;font-weight:700;">Go to Dashboard</a>
      </div>
      <div style="max-width:560px;margin:12px auto 0;text-align:center;color:#7A8A89;font-size:12px;">
        © 2026 TotWise Lab. Tiny Steps. Wise Growth.
      </div>
    </div>
  `;

  try {
    await postmarkClient.sendEmail({
      From:     postmarkSender,
      To:       email,
      Subject:  `${plan.label} is now available — TotWise`,
      HtmlBody: emailHtml,
      TextBody: `${plan.label} unlocked! Go to your dashboard: ${dashboardLink}`,
    });
  } catch (err) {
    console.error('[webhook] sendUnlockEmail error', err);
  }
}
