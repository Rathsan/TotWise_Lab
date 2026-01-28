import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    async function verify() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const email = params.get('email');
      if (!token || !email) {\n        router.replace('/auth/login');\n        return;\n      }\n      const response = await fetch('/api/free-guide/verify', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ token, email })\n      });\n      const data = await response.json().catch(() => ({}));\n      if (data.status === 'paid') {\n        router.replace('/paid');\n        return;\n      }\n      if (data.status === 'free') {\n        router.replace('/free-guide');\n        return;\n      }\n      router.replace('/auth/login');\n    }\n    verify();\n  }, [router]);

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
