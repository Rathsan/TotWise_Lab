import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';

export default function FreeGuideDay3() {
  const router = useRouter();
  const [freeGuide, setFreeGuide] = useState<any | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/free-guide/session');
      const data = await response.json().catch(() => ({}));
      if (data.status === 'paid') {
        router.replace('/paid');
        return;
      }
      if (data.status === 'unauthenticated' || data.status === 'no_access') {
        router.replace('/auth/login');
        return;
      }
      if (data.status === 'free') {
        setFreeGuide(data.data);
      }
    };
    load();
  }, [router]);

  async function markComplete() {
    await fetch('/api/free-guide/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: 3 })
    });
    setShowToast(true);
    setTimeout(() => router.replace('/free-guide'), 1200);
  }

  if (!freeGuide) return null;

  const isLocked = (freeGuide.current_day || 1) < 3;

  return (
    <>
      <Head>
        <title>Free Guide Day 3 — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header />
      <main className="content" style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 64px' }}>
        {isLocked ? (
          <div className="free-guide-lock">
            <div className="free-guide-lock-icon">🔒</div>
            <h1>This day unlocks tomorrow</h1>
            <p>Toddlers learn best with daily spacing. Come back soon 💛</p>
            <a href="/free-guide" className="btn btn-outline">Back to Dashboard</a>
          </div>
        ) : (
          <>
            <div className="free-guide-breadcrumb">Free Guide → Day 3</div>
            <h1>Day 3: Confidence & Independence</h1>
            <p className="section-subtitle">20–30 minutes · No special toys needed</p>

            <section className="free-guide-cards">
              <div className="free-guide-card">
                <h3>Little Helper</h3>
                <span className="free-guide-duration">10 minutes</span>
                <ul>
                  <li>Invite your toddler to carry a safe item.</li>
                  <li>Say “Thank you, helper!” and smile.</li>
                  <li>Let them choose where it goes.</li>
                </ul>
                <p className="free-guide-why">Why this helps: builds confidence and independence.</p>
              </div>
              <div className="free-guide-card">
                <h3>Choice Time</h3>
                <span className="free-guide-duration">10 minutes</span>
                <ul>
                  <li>Offer two safe options.</li>
                  <li>Let your toddler pick.</li>
                  <li>Praise the choice, not the outcome.</li>
                </ul>
                <p className="free-guide-why">Why this helps: supports decision‑making skills.</p>
              </div>
              <div className="free-guide-card">
                <h3>Quiet Wrap‑Up</h3>
                <span className="free-guide-duration">5–10 minutes</span>
                <ul>
                  <li>Sit together and breathe slowly.</li>
                  <li>Thank them for trying.</li>
                  <li>End with a gentle hug.</li>
                </ul>
                <p className="free-guide-why">Why this helps: reinforces calm and connection.</p>
              </div>
            </section>

            <div className="free-guide-tip">
              💡 <strong>Parent Tip</strong>
              <span>There’s no right or wrong. Celebrate effort, not perfection.</span>
            </div>

            <div className="free-guide-reflection">
              <h3>What did your child enjoy the most today?</h3>
              <textarea placeholder="Write a quick note (optional)"></textarea>
              <button className="btn btn-outline">Skip for now</button>
            </div>

            <button className="btn btn-primary" style={{ marginTop: '18px' }} onClick={markComplete}>
              Mark Day 3 as Complete
            </button>
            <div style={{ marginTop: '16px' }}>
              <a href="/free-guide" className="btn btn-outline">Back to Dashboard</a>
            </div>
          </>
        )}
      </main>
      {showToast ? <div className="free-guide-toast">Great job! See you tomorrow 💛</div> : null}
    </>
  );
}
