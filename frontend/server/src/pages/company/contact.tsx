import Head from 'next/head';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header showFreeGuide={false} />
      <main className="company-page">
        <div className="container">
          <div className="company-shell">
            <header className="company-hero">
              <div className="company-hero-grid">
                <div className="company-hero-copy">
                  <h1>Contact Us</h1>
                </div>
                <div className="company-hero-visual" aria-hidden="true">
                  <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="60" width="120" height="80" rx="18" fill="#FFE5D9" />
                    <path d="M60 80l50 32 50-32" stroke="#2D3B3A" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <circle cx="170" cy="60" r="18" fill="#A8C5A0" />
                  </svg>
                </div>
              </div>
            </header>

            <section className="company-section company-card-block">
              <h2>Reach Out</h2>
              <p>We’d love to hear from you.</p>
              <p>Whether you have a question, feedback, or just want to share your experience — we’re listening.</p>
            </section>

            <section className="company-section company-card-block">
              <h2>Contact Details</h2>
              <div className="company-contact-card">
                <p>📧 Email: founder@totwise.in</p>
                <p>🕒 We typically respond within 24–48 hours</p>
              </div>
            </section>

            <section className="company-section company-card-block">
              <p className="company-closing">
                TotWise Lab is built with care — and we value every parent who places their trust in us.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
