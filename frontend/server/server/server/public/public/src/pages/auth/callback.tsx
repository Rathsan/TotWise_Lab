import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useSubscription } from '../../utils/useSubscription';
import { useUser } from '../../utils/useUser';

export default function AuthCallback() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { data: subscription } = useSubscription(user?.id, user?.email ?? null);

  useEffect(() => {
    async function finalize() {
      await supabase.auth.getSession();
      if (loading) return;
      if (user && subscription) {
        router.replace('/paid');
        return;
      }
      if (user) {
        router.replace('/free-guide');
        return;
      }
      router.replace('/auth/login');
    }
    finalize();
  }, [loading, user, subscription, router]);

  return (
    <>
      <Head>
        <title>Signing you in — TotWise Lab</title>
      </Head>
      <main style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1>Signing you in…</h1>
      </main>
    </>
  );
}
