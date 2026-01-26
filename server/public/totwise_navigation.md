TotWise Lab Navigation

Overview
- The project has a static frontend at the repo root and a Next.js backend under `server/`.
- For single‑endpoint hosting (ngrok), the frontend is synced into `server/public/` so the Next.js server can serve both UI and API.

Top‑Level Structure
- `index.html` — Landing page with pricing and subscription entry point.
- `styles.css` — Global styles for the landing page and shared UI elements (including the subscription email modal styles).
- `js/subscribe.js` — Email capture + Razorpay checkout for the monthly plan.
- `payment-success.html` — Post‑payment confirmation screen.
- `Dashboard/` — Member dashboard UI.
- `member_Day1/` … `member_Day30/` — Daily activity pages and worksheets.
- `login/` — Email‑based login UI for magic link entry/verification.
- `auth/` — Frontend auth helper that checks backend session + subscription.
- `soft-day-lock.js` — Day soft‑lock UI/guard logic.
- `reassurance-nudges.js` — Week 1/2/4 nudge modal logic.
- `server/` — Next.js backend for payments, auth, and API enforcement.

Backend (Next.js) Structure
- `server/pages/api/checkout.js`
  - Creates Razorpay order for ₹199 and stores metadata (email, plan, amount).
- `server/pages/api/webhooks/razorpay.js`
  - Verifies Razorpay webhook.
  - Creates subscription (45 days) and magic login token.
  - Sends branded login email via Postmark.
- `server/pages/api/auth/request-link.js`
  - Sends a new magic login link (30 min, single‑use) if subscription is active.
- `server/pages/api/auth/verify.js`
  - Validates magic link (token + email), marks token used, sets session cookie.
- `server/pages/api/auth/session.js`
  - Confirms active session + subscription.
  - Refreshes session cookie (sliding 45‑day session).
- `server/pages/api/auth/logout.js`
  - Clears session cookie.
- `server/lib/`
  - `validate.js` — Plan constants and validation helpers.
  - `session.js` — JWT session cookie handling.
  - `supabaseAdmin.js` — Supabase service‑role client.
  - `razorpay.js` — Razorpay client.
  - `postmark.js` — Postmark client.
  - `subscription.js` — Subscription lookup helpers.
- `server/pages/index.js`
  - Redirects `/` to `/index.html` so static UI loads at root.

Syncing Frontend to Next.js Public
When running a single endpoint (ngrok), sync root files into `server/public/`:
- `rsync -av --delete --exclude 'server' --exclude 'node_modules' --exclude '.git' ./ server/public/`

Key User Flows
- Subscribe (Monthly):
  - `index.html` → email capture modal (`js/subscribe.js`) → `/api/checkout` → Razorpay checkout.
  - Webhook (`/api/webhooks/razorpay`) creates subscription + sends login link.
- Login:
  - Email link → `/login/login.html` → `/api/auth/verify` → sets session cookie → dashboard.
  - From login page, user can request a new link (`/api/auth/request-link`).
- Access Control:
  - Dashboard + day pages call `TotWiseAuth.initAuth()` which enforces backend session + active subscription.

