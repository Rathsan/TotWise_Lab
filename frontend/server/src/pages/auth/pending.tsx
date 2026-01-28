import Head from 'next/head';
import Link from 'next/link';

export default function AuthPending() {
  return (
    <>
      <Head>
        <title>Check your email — TotWise Lab</title>
        <link rel="stylesheet" href="/login/login.css" />
      </Head>
      <div className="login-container">
        <header className="login-header">
          <div className="brand">
            <span className="brand-name">TotWise Lab</span>
          </div>
          <p className="brand-subtitle">Parent Toolkit Access</p>
        </header>
        <main className="login-main">
          <div className="login-card">
            <h1>Check your email <span className="emoji">📩</span></h1>
            <p className="welcome-text">Your secure login link is on its way.</p>
            <p className="login-helper">If you’ve requested a link before, open the latest email to continue.</p>
            <p className="login-helper">Not seeing it yet? Give it a minute, check spam, or enter your email again.</p>
            <Link href="/auth/login" className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex' }}>
              Back to email entry
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
