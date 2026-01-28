import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProgressTracker } from '../../components/free-guide/ProgressTracker';

export default function FreeGuideHome() {
  const router = useRouter();
  const [freeGuide, setFreeGuide] = useState<any | null>(null);
  const [status, setStatus] = useState<'loading' | 'public' | 'free'>('loading');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/free-guide/session');
      const data = await response.json().catch(() => ({}));
      if (data.status === 'paid') {
        router.replace('/paid');
        return;
      }
      if (data.status === 'free') {
        setFreeGuide(data.data);
        setStatus('free');
        return;
      }
      setStatus('public');
    };
    load();
  }, [router]);

  useEffect(() => {
    if (status !== 'public' || typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'free_guide_landing_view' });
  }, [status]);

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage('Sending your secure login link...');
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'free_guide_email_submit' });
    }
    const response = await fetch('/api/free-guide/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json().catch(() => ({}));
    if (data.status === 'logged_in') {
      router.replace(data.destination === 'paid' ? '/paid' : '/free-guide');
      return;
    }
    if (data.status === 'no_access') {
      setMessage('We couldn’t find access for that email. Try again or use a different email.');
      setSubmitting(false);
      return;
    }
    router.replace('/auth/pending');
  }

  if (status === 'loading') {
    return null;
  }

  if (status === 'public') {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    return (
      <>
        <Head>
          <title>Free 3-Day Toddler Development Guide — TotWise Lab</title>
          <meta
            name="description"
            content="Get a free 3-day toddler development guide with simple daily activities to boost learning, emotions, and confidence at home."
          />
          <link rel="stylesheet" href="/styles.css" />
        </Head>
        {gtmId ? (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        ) : null}
        <div className="free-guide-landing">
          <header className="free-guide-landing-header">
            <div className="brand">
              <span className="brand-name">TotWise Lab</span>
            </div>
          </header>
          <main>
            <section className="free-guide-hero">
              <div className="free-guide-hero-copy">
                <span className="free-guide-pill">Free Guide</span>
                <h1>Free 3-Day Toddler Development Guide (Ages 2–3)</h1>
                <p className="free-guide-hero-sub">
                  Simple, science-backed daily activities that help your toddler grow smarter, calmer, and more confident — without
                  screens or pressure.
                </p>
                <ul className="free-guide-hero-bullets">
                  <li>⏱ Just 20–30 minutes a day</li>
                  <li>🏡 Works at home with everyday items</li>
                  <li>❤️ Designed for real parents, real toddlers</li>
                </ul>
                <a className="btn btn-primary" href="#free-guide-form">
                  Start My Free 3-Day Guide
                </a>
                <p className="free-guide-hero-micro">No credit card required · Instant access</p>
              </div>
              <div className="free-guide-hero-visual" aria-hidden="true">
                <svg viewBox="0 0 360 360" role="img" aria-label="Parent and toddler illustration">
                  <defs>
                    <linearGradient id="warmGlow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5D5C8" />
                      <stop offset="100%" stopColor="#C8DBC4" />
                    </linearGradient>
                  </defs>
                  <circle cx="180" cy="180" r="160" fill="url(#warmGlow)" opacity="0.6" />
                  <circle cx="140" cy="150" r="46" fill="#E8B4A0" />
                  <circle cx="220" cy="170" r="34" fill="#A8C5A0" />
                  <path d="M110 240c30-40 70-40 100 0" stroke="#2D3B3A" strokeWidth="12" strokeLinecap="round" fill="none" />
                </svg>
                <div className="free-guide-hero-card">
                  <span>3 days · Guided activities</span>
                  <strong>Calm, playful progress</strong>
                </div>
              </div>
            </section>

            <section className="free-guide-trust">
              <div>
                <h2>Why thousands of parents start here</h2>
                <p>
                  The first three years shape your child’s brain, emotions, and behavior for life. This free guide gives you clear,
                  daily direction — so you never wonder “Am I doing this right?”
                </p>
              </div>
              <div className="free-guide-trust-grid">
                <div className="free-guide-trust-card">Built using early childhood development principles</div>
                <div className="free-guide-trust-card">Designed for busy parents, not experts</div>
                <div className="free-guide-trust-card">Calm, practical, and easy to follow</div>
              </div>
            </section>

            <section className="free-guide-value">
              <h2>What’s inside the free 3-day guide?</h2>
              <div className="free-guide-value-grid">
                <div className="free-guide-value-card">
                  <h3>Day 1: Brain Boost Through Play</h3>
                  <p>Simple play activities that strengthen focus, memory, and learning.</p>
                </div>
                <div className="free-guide-value-card">
                  <h3>Day 2: Emotional Growth & Bonding</h3>
                  <p>Activities that help reduce tantrums and build emotional safety.</p>
                </div>
                <div className="free-guide-value-card">
                  <h3>Day 3: Confidence & Independence</h3>
                  <p>Gentle habits that encourage cooperation and self-confidence.</p>
                </div>
              </div>
              <p className="free-guide-reassurance">
                No worksheets. No pressure. No complicated routines. Just meaningful moments that actually work.
              </p>
            </section>

            <section className="free-guide-steps">
              <h2>How the free guide works</h2>
              <div className="free-guide-steps-grid">
                <div className="free-guide-step">
                  <span>Step 1</span>
                  <p>Sign up with your email (takes less than 30 seconds)</p>
                </div>
                <div className="free-guide-step">
                  <span>Step 2</span>
                  <p>Get daily guided activities inside your dashboard</p>
                </div>
                <div className="free-guide-step">
                  <span>Step 3</span>
                  <p>See positive changes in your child — and in your confidence as a parent</p>
                </div>
              </div>
            </section>

            <section className="free-guide-form-section" id="free-guide-form">
              <div className="free-guide-form-card">
                <h2>Start your free 3-day toddler guide</h2>
                <p>Join parents who want calm, connection, and clarity — without overwhelm.</p>
                <form className="free-guide-form" onSubmit={handleLeadSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Get My Free Guide'}
                  </button>
                </form>
                <p className="free-guide-form-note">We respect your privacy. No spam. Unsubscribe anytime.</p>
                {message ? <p className="free-guide-form-message">{message}</p> : null}
              </div>
            </section>

            <section className="free-guide-emotion">
              <p>
                You don’t need to be a perfect parent. You just need the right guidance at the right time. This guide is designed
                to support you — not judge you.
              </p>
            </section>

            <section className="free-guide-testimonials">
              <h2>Parents feel the difference fast</h2>
              <div className="free-guide-testimonial-grid">
                <div className="free-guide-testimonial-card">
                  “I felt lost before this. After just a few days, my toddler was calmer — and I felt more confident.”
                  <span>— Parent of a 2.5-year-old</span>
                </div>
                <div className="free-guide-testimonial-card">
                  “The activities were simple, but the connection we felt was huge. I looked forward to each day.”
                  <span>— Parent of a 3-year-old</span>
                </div>
              </div>
            </section>
          </main>
          <footer className="free-guide-footer">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </footer>
        </div>
      </>
    );
  }

  if (!freeGuide) {
    return null;
  }

  const currentDay = freeGuide.current_day || 1;
  const completedDays = [1, 2, 3].filter((day) => freeGuide[`day_${day}_completed`]);
  const signupDate = freeGuide.signup_date ? new Date(freeGuide.signup_date) : new Date();

  function hoursUntil(day: number) {
    const target = new Date(signupDate.getTime());
    target.setDate(target.getDate() + (day - 1));
    const diff = target.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
  }

  const unlockInHours = {
    1: 0,
    2: hoursUntil(2),
    3: hoursUntil(3)
  };

  const todayDay = currentDay;

  return (
    <>
      <Head>
        <title>Free 3-Day Guide — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header />
      <main className="content" style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 64px' }}>
        <div className="free-guide-header">
          <h1>3-Day Toddler Development Guide</h1>
          <span className="free-guide-badge">🎁 Free Guide</span>
        </div>
        <p className="section-subtitle">Simple daily activities for calm, learning & bonding</p>
        <ProgressTracker currentDay={currentDay} completedDays={completedDays} unlockInHours={unlockInHours} />
        {completedDays.includes(3) ? (
          <div className="free-guide-completion">
            <h2>🎉 You completed the 3‑Day Guide!</h2>
            <p className="section-subtitle">You’ve already taken a powerful step for your child’s growth.</p>
            <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
              <div className="free-guide-summary">Brain Development ✔</div>
              <div className="free-guide-summary">Emotional Bonding ✔</div>
              <div className="free-guide-summary">Confidence Building ✔</div>
            </div>
            <div className="free-guide-upgrade">
              <h3>Imagine 30 days of calm, guided growth — without confusion.</h3>
              <a href="/index.html#pricing" className="btn btn-primary">Unlock Full 30‑Day Toolkit</a>
              <a href="/free-guide" className="btn btn-outline">Continue with free access</a>
            </div>
          </div>
        ) : (
          <>
            <div className="today-card" style={{ marginTop: '28px' }}>
              <div className="today-header">
                <div className="day-indicator">
                  <span className="day-label">Day</span>
                  <span className="day-number">{todayDay}</span>
                  <span className="day-total">of 3</span>
                </div>
              </div>
              <div className="today-activity">
                <div className="activity-preview">
                  <span className="activity-emoji">🌿</span>
                  <div className="activity-info">
                    <h3>
                      {todayDay === 1 && 'Day 1: Brain Boost Through Play'}
                      {todayDay === 2 && 'Day 2: Emotional Growth & Bonding'}
                      {todayDay === 3 && 'Day 3: Confidence & Independence'}
                    </h3>
                    <p>
                      {todayDay === 1 && 'Simple play ideas that build focus and curiosity.'}
                      {todayDay === 2 && 'Connection‑first activities that help big feelings feel safe.'}
                      {todayDay === 3 && 'Gentle routines that strengthen courage and independence.'}
                    </p>
                  </div>
                </div>
              </div>
              <a href={`/free-guide/day${todayDay}`} className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                Start Today’s Activities
              </a>
            </div>
            <div className="free-guide-trust">
              You don’t need perfect routines. Small, loving moments shape your child’s brain.
            </div>
            <div className="free-guide-banner">
              <div>
                <strong>This is just the beginning 🌱</strong>
                <p>Unlock the full 30‑Day Growth Toolkit anytime.</p>
              </div>
              <a href="/index.html#pricing" className="btn btn-outline">View Full Toolkit</a>
            </div>
            <section className="free-guide-mini">
              <div className="free-guide-mini-header">
                <h2>Your 3‑Day Path</h2>
                <p className="section-subtitle">A calm, guided journey — one simple day at a time.</p>
              </div>
              <div className="free-guide-mini-grid">
                {[1, 2, 3].map((day) => {
                  const isComplete = completedDays.includes(day);
                  const isUnlocked = currentDay >= day;
                  const unlockCopy = day === 2 ? `Unlocks in ${unlockInHours[2]} hours` : `Unlocks in ${unlockInHours[3]} hours`;
                  return (
                    <div key={day} className={`free-guide-mini-card ${isComplete ? 'complete' : isUnlocked ? 'unlocked' : 'locked'}`}>
                      <div className="free-guide-mini-top">
                        <span className="free-guide-mini-day">Day {day}</span>
                        <span className="free-guide-mini-chip">
                          {isComplete ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <h3>
                        {day === 1 && 'Brain Boost Through Play'}
                        {day === 2 && 'Emotional Growth & Bonding'}
                        {day === 3 && 'Confidence & Independence'}
                      </h3>
                      <p>
                        {day === 1 && 'Simple play ideas that build focus and curiosity.'}
                        {day === 2 && 'Connection‑first activities that help big feelings feel safe.'}
                        {day === 3 && 'Gentle routines that strengthen courage and independence.'}
                      </p>
                      {!isUnlocked ? <span className="free-guide-mini-lock">{unlockCopy}</span> : null}
                      {isUnlocked ? (
                        <a href={`/free-guide/day${day}`} className="btn btn-outline free-guide-mini-cta">
                          Start Day {day}
                        </a>
                      ) : (
                        <button className="btn btn-outline free-guide-mini-cta" disabled>
                          Locked
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
