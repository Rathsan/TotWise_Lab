/**
 * POST /api/checkout/month-unlock
 *
 * Creates a Razorpay order for unlocking an additional month.
 * Requires an active session (paid user).
 *
 * Body: { planId: 'age_2_3_m1' | 'age_2_3_3m' | 'age_2_3_12m' | 'age_2_3_family' }
 * Returns: Razorpay order details for the frontend modal.
 */
import { razorpay } from '../../../../lib/razorpay';
import { PLANS, VALID_PLAN_IDS } from '../../../../lib/validate';
import { requirePaidUser } from '../../../../lib/authGuard';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const guard = await requirePaidUser(req);
  if (!guard.ok) {
    return res.status(guard.status).json({ error: guard.message });
  }

  const { planId } = req.body || {};

  if (!planId || !VALID_PLAN_IDS.includes(planId)) {
    return res.status(400).json({
      error: `Invalid planId. Must be one of: ${VALID_PLAN_IDS.join(', ')}`,
    });
  }

  const plan = PLANS[planId];

  try {
    const order = await razorpay.orders.create({
      amount:   plan.amountPaise,
      currency: 'INR',
      receipt:  `tw_unlock_${Date.now()}`,
      notes: {
        email:          guard.user.email,
        user_id:        guard.user.id,
        plan:           planId,
        amount:         String(plan.amount),
        purchase_type:  'month_unlock',
      },
    });

    return res.status(200).json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
      email:    guard.user.email,
      plan:     planId,
      label:    plan.label,
      months:   plan.months,
    });
  } catch (error) {
    console.error('[checkout/month-unlock] Razorpay order error', error);
    return res.status(500).json({ error: 'Unable to create order' });
  }
}
