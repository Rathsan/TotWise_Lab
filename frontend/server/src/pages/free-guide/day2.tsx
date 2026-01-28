import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';

export default function FreeGuideDay2() {
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
      body: JSON.stringify({ day: 2 })
    });
    setShowToast(true);
    setTimeout(() => router.replace('/free-guide'), 1200);
  }

  if (!freeGuide) return null;

  const isLocked = (freeGuide.current_day || 1) < 2;

  return (
    <>
      <Head>
        <title>Free Guide Day 2 — TotWise Lab</title>
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
            <div className="free-guide-breadcrumb">Free Guide → Day 2</div>
            <h1>Day 2: Emotional Growth & Bonding</h1>
            <p className="section-subtitle">20–30 minutes · No special toys needed</p>

            <section className="free-guide-cards">
              <div className="free-guide-card">
                <h3>Feelings Mirror</h3>
                <span className="free-guide-duration">10 minutes</span>
                <ul>
                  <li>Make a face together and name the feeling.</li>
                  <li>Let your toddler copy and choose the next one.</li>
                  <li>Say, “It’s okay to feel that.”</li>
                </ul>
                <p className="free-guide-why">Why this helps: supports emotional naming and safety.</p>
              </div>
              <div className="free-guide-card">
                <h3>Cozy Corner</h3>
                <span className="free-guide-duration">10 minutes</span>
                <ul>
                  <li>Build a pillow corner together.</li>
                  <li>Offer a hug or a deep breath together.</li>
                  <li>Let them choose a soft toy to “guard” the spot.</li>
                </ul>
                <p className="free-guide-why">Why this helps: creates comfort and calm routines.</p>
              </div>
              <div className="free-guide-card">
                <h3>Kind Words Game</h3>
                <span className="free-guide-duration">5–10 minutes</span>
                <ul>
                  <li>Say one kind word to each other.</li>
                  <li>Smile and repeat the word together.</li>
                  <li>End with a high‑five or hug.</li>
                </ul>
                <p className="free-guide-why">Why this helps: builds connection and reassurance.</p>
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
              Mark Day 2 as Complete
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
