import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function FreeGuideCallback() {
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const email = params.get('email');
      if (!token || !email) {
        router.replace('/auth/login');
        return;
      }
      const response = await fetch('/api/free-guide/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email })
      });
      const data = await response.json().catch(() => ({}));
      if (data.status === 'paid') {
        router.replace('/paid');
        return;
      }
      if (data.status === 'free') {
        router.replace('/free-guide');
        return;
      }
      router.replace('/auth/login');
    }
    verify();
  }, [router]);

  return (
    <>
      <Head>
        <title>Signing you in — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h1>Signing you in…</h1>
        <p className="section-subtitle">One moment while we open your guide.</p>
      </main>
    </>
  );
}
