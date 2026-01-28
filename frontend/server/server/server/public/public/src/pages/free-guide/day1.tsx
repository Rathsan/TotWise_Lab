import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { supabase } from '../../utils/supabaseClient';
import { useSubscription } from '../../utils/useSubscription';
import { useUser } from '../../utils/useUser';

export default function FreeGuideDay1() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { data: subscription } = useSubscription(user?.id, user?.email ?? null);
  const [freeGuide, setFreeGuide] = useState<any | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (subscription) {
      router.replace('/paid');
      return;
    }
    const load = async () => {
      const { data } = await supabase
        .from('free_guide_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!data) {
        router.replace('/auth/login');
        return;
      }
      setFreeGuide(data);
    };
    load();
  }, [loading, user, subscription, router]);

  async function markComplete() {
    if (!user) return;
    await supabase
      .from('free_guide_users')
      .update({ day_1_completed: true })
      .eq('user_id', user.id);
    router.replace('/free-guide');
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
        <h1>Day 1: Brain Boost Through Play</h1>
        <p className="section-subtitle">Simple play ideas that build focus and curiosity.</p>
        <section className="today-card" style={{ marginTop: '24px' }}>
          <div className="today-activity">
            <div className="activity-preview">
              <span className="activity-emoji">🧸</span>
              <div className="activity-info">
                <h3>Talk & Drop</h3>
                <p>Describe each item as you drop it into a basket. Let your toddler imitate the words.</p>
              </div>
            </div>
          </div>
        </section>
        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={markComplete}>
          Mark Day 1 Complete
        </button>
        <div style={{ marginTop: '24px' }}>
          <a href="/free-guide" className="btn btn-outline">Back to Free Guide</a>
        </div>
      </main>
    </>
  );
}
