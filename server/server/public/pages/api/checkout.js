import { razorpay } from '../../lib/razorpay';
import { isValidEmail, PLAN_ID, PLAN_AMOUNT_INR, PLAN_AMOUNT_PAISE } from '../../lib/validate';

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
    const order = await razorpay.orders.create({
      amount: PLAN_AMOUNT_PAISE,
      currency: 'INR',
      receipt: `tw_${Date.now()}`,
      notes: {
        email,
        plan: PLAN_ID,
        amount: String(PLAN_AMOUNT_INR)
      }
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      email,
      plan: PLAN_ID
    });
  } catch (error) {
    console.error('[checkout] Razorpay order error', error);
    return res.status(500).json({ error: 'Unable to create order' });
  }
}
