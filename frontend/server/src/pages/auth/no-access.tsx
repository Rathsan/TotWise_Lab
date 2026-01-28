import Head from 'next/head';
import Link from 'next/link';

export default function AuthNoAccess() {
  return (
    <>
      <Head>
        <title>Access not found — TotWise Lab</title>
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
            <h1>We couldn’t find active access for this email</h1>
            <p className="welcome-text">If you meant to start the free guide, you can try again with another email.</p>
            <Link href="/auth/login" className="btn btn-outline" style={{ marginTop: '16px', display: 'inline-flex' }}>
              Back to email entry
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
