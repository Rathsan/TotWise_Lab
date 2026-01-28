import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useSubscription } from '../../utils/useSubscription';
import { useUser } from '../../utils/useUser';

export default function AuthLogin() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { data: subscription } = useSubscription(user?.id, user?.email ?? null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [autoSent, setAutoSent] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && subscription) {
      router.replace('/paid');
    }
    if (user && !subscription) {
      router.replace('/free-guide');
    }
  }, [loading, user, subscription, router]);

  useEffect(() => {
    if (!router.isReady || autoSent) return;
    const emailParam = typeof router.query.email === 'string' ? router.query.email : '';
    if (emailParam) {
      setEmail(emailParam);
      setAutoSent(true);
      setSubmitting(true);
      setMessage('We’ll check your access and sign you in.');
      supabase.auth.signInWithOtp({
        email: emailParam,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      }).then(() => {
        setMessage('Check your email — your secure login link is on its way 💛');
        setSubmitting(false);
      });
    }
  }, [router.isReady, router.query.email, autoSent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage('We’ll check your access and sign you in.');
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    setMessage('Check your email — your secure login link is on its way 💛');
    setSubmitting(false);
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
            <p className="login-message">{message}</p>
            <p className="login-helper">No passwords. Secure link sent only if needed.</p>
          </div>
        </main>
      </div>
    </>
  );
}
