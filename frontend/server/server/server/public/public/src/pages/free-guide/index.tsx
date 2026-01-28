import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DayCard } from '../../components/free-guide/DayCard';
import { Header } from '../../components/Header';
import { ProgressTracker } from '../../components/free-guide/ProgressTracker';
import { supabase } from '../../utils/supabaseClient';
import { useSubscription } from '../../utils/useSubscription';
import { useUser } from '../../utils/useUser';

function daysSince(dateString?: string) {
  if (!dateString) return 0;
  const start = new Date(dateString).getTime();
  const now = Date.now();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}

export default function FreeGuideHome() {
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
        const { data: inserted } = await supabase
          .from('free_guide_users')
          .insert({ user_id: user.id, email: user.email, signup_date: new Date().toISOString(), current_day: 1 })
          .select('*')
          .single();
        setFreeGuide(inserted);
        await supabase.auth.signInWithOtp({ email: user.email, options: { emailRedirectTo: `${window.location.origin}/free-guide` } });
        return;
      }

      const elapsedDays = daysSince(data.signup_date);
      const currentDay = Math.min(3, Math.max(1, elapsedDays + 1));
      if (currentDay > (data.current_day || 1)) {
        await supabase
          .from('free_guide_users')
          .update({ current_day: currentDay })
          .eq('user_id', user.id);
        await supabase.auth.signInWithOtp({ email: user.email, options: { emailRedirectTo: `${window.location.origin}/free-guide` } });
        setFreeGuide({ ...data, current_day: currentDay });
        return;
      }

      setFreeGuide(data);
    };
    load();
  }, [loading, user, subscription, router]);

  if (!freeGuide) {
    return null;
  }

  const currentDay = freeGuide.current_day || 1;
  const completedDays = [1, 2, 3].filter((day) => freeGuide[`day_${day}_completed`]);

  return (
    <>
      <Head>
        <title>Free 3-Day Guide — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header />
      <main className="content" style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 64px' }}>
        <h1>Welcome to your Free 3-Day Toddler Guide</h1>
        <p className="section-subtitle">Start gently. Each day opens with space to breathe.</p>
        <ProgressTracker currentDay={currentDay} completedDays={completedDays} />
        <div style={{ marginTop: '32px' }}>
          <DayCard
            day={1}
            title="Brain Boost Through Play"
            description="Simple play ideas that build focus and curiosity."
            unlocked={true}
            completed={completedDays.includes(1)}
          />
          <DayCard
            day={2}
            title="Emotional Growth & Bonding"
            description="Connection‑first activities that help big feelings feel safe."
            unlocked={currentDay >= 2}
            completed={completedDays.includes(2)}
          />
          <DayCard
            day={3}
            title="Confidence & Independence"
            description="Gentle routines that strengthen courage and independence."
            unlocked={currentDay >= 3}
            completed={completedDays.includes(3)}
          />
        </div>
        <div className="pricing-guarantee" style={{ marginTop: '32px' }}>
          <div className="guarantee-text">
            <strong>Love this experience?</strong>
            <p>Upgrade to the complete 30‑Day Toolkit for your full journey.</p>
            <a href="/index.html#pricing" className="btn btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>Upgrade to the full toolkit</a>
          </div>
        </div>
      </main>
    </>
  );
}
