import { razorpay } from '../../../lib/razorpay';
import { isValidEmail, PLANS, VALID_PLAN_IDS } from '../../../lib/validate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, planId = 'age_2_3' } = req.body || {};

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!VALID_PLAN_IDS.includes(planId)) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  const plan = PLANS[planId];

  try {
    const order = await razorpay.orders.create({
      amount: plan.amountPaise,
      currency: 'INR',
      receipt: `tw_${Date.now()}`,
      notes: {
        email,
        plan: planId,
        amount: String(plan.amount)
      }
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      email,
      plan: planId
    });
  } catch (error) {
    console.error('[checkout] Razorpay order error', error);
    return res.status(500).json({ error: 'Unable to create order' });
  }
}
