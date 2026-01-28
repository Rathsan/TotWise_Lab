import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';

export default function FreeGuideDay1() {
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
      body: JSON.stringify({ day: 1 })
    });
    setShowToast(true);
    setTimeout(() => router.replace('/free-guide'), 1200);
  }

  if (!freeGuide) return null;

  return (
    <>
      <Head>
        <title>Free Guide Day 1 — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header />
      <main className="content" style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 64px' }}>
        <div className="free-guide-breadcrumb">Free Guide → Day 1</div>
        <h1>Day 1: Brain Boost Through Play</h1>
        <p className="section-subtitle">20–30 minutes · No special toys needed</p>

        <section className="free-guide-cards">
          <div className="free-guide-card">
            <h3>Talk & Drop</h3>
            <span className="free-guide-duration">10 minutes</span>
            <ul>
              <li>Place 5–6 safe items in a basket.</li>
              <li>Name each item as you drop it in.</li>
              <li>Invite your toddler to repeat or choose.</li>
            </ul>
            <p className="free-guide-why">Why this helps: builds focus and early language.</p>
          </div>
          <div className="free-guide-card">
            <h3>Copy Me Corner</h3>
            <span className="free-guide-duration">10 minutes</span>
            <ul>
              <li>Do a simple action: clap, tap, stretch.</li>
              <li>Pause and let them copy.</li>
              <li>Celebrate every try, even tiny ones.</li>
            </ul>
            <p className="free-guide-why">Why this helps: strengthens attention and confidence.</p>
          </div>
          <div className="free-guide-card">
            <h3>Story Pause</h3>
            <span className="free-guide-duration">5–10 minutes</span>
            <ul>
              <li>Read a short story slowly.</li>
              <li>Pause to ask, “What do you see?”</li>
              <li>Let them point or make sounds.</li>
            </ul>
            <p className="free-guide-why">Why this helps: builds curiosity and connection.</p>
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
          Mark Day 1 as Complete
        </button>
        <div style={{ marginTop: '16px' }}>
          <a href="/free-guide" className="btn btn-outline">Back to Dashboard</a>
        </div>
      </main>
      {showToast ? <div className="free-guide-toast">Great job! See you tomorrow 💛</div> : null}
    </>
  );
}
