import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main className="content" style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <h1>Privacy Policy</h1>
        <p className="section-subtitle">We respect your privacy and keep your information safe.</p>
        <p>
          TotWise Lab collects your email to deliver your guide and provide access to your dashboard. We do not sell your personal
          information. You can unsubscribe at any time.
        </p>
      </main>
    </>
  );
}
