import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// Authorization Login Page
// This page is used to login to the application using a magic link.

export default function AuthLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSent, setAutoSent] = useState(false);
  const autoSendGuard = useRef(false);

  useEffect(() => {
    if (!router.isReady || autoSent || autoSendGuard.current) return;
    const emailParam = typeof router.query.email === 'string' ? router.query.email : '';
    if (emailParam) {
      autoSendGuard.current = true;
      setEmail(emailParam);
      setAutoSent(true);
      setSubmitting(true);
      setMessage('We’ll check your access and sign you in.');
      setIsError(false);
      fetch('/api/free-guide/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam })
      }).then((res) => res.json()).then((data) => {
        if (data.status === 'logged_in') {
          router.replace(data.destination === 'paid' ? '/paid' : '/free-guide');
          return;
        }
        if (data.status === 'no_access') {
          setMessage('We couldn’t find active access for this email.');
          setIsError(true);
          setSubmitting(false);
          return;
        }
        setMessage('Check your email — your secure login link is on its way 💛');
        setIsError(false);
        setSubmitting(false);
      });
    }
  }, [router.isReady, router.query.email, autoSent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage('We’ll check your access and sign you in.');
    setIsError(false);
    router.replace('/auth/pending');
    const response = await fetch('/api/free-guide/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json().catch(() => ({ status: 'error' }));
    if (data.status === 'logged_in') {
      router.replace(data.destination === 'paid' ? '/paid' : '/free-guide');
      return;
    }
    if (data.status === 'no_access') {
      setMessage('We couldn’t find active access for this email.');
      setIsError(true);
      setSubmitting(false);
      return;
    }
    if (!response.ok) {
      router.replace('/auth/pending');
      return;
    }
    router.replace('/auth/pending');
  }

  return (
    <>
      <Head>
        <title>Login — TotWise Lab</title>
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
            <h1>Welcome back <span className="emoji">🌱</span></h1>
            <p className="welcome-text">Enter your email and we’ll take care of the rest.</p>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>
                <span>{submitting ? 'Checking…' : 'Continue'}</span>
              </button>
            </form>
            <p className={`login-message${isError ? ' error' : ''}`}>{message}</p>
            <p className="login-helper">No passwords. Secure link sent only if needed.</p>
          </div>
        </main>
      </div>
    </>
  );
}
