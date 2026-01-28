import Head from 'next/head';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export default function HelpCenter() {
  return (
    <>
      <Head>
        <title>Help Center — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header showFreeGuide={false} />
      <main className="company-page">
        <div className="container">
          <div className="company-shell">
            <header className="company-hero">
              <div className="company-hero-grid">
                <div className="company-hero-copy">
                  <h1>Help Center</h1>
                </div>
              </div>
            </header>

            <section className="company-section company-card-block">
              <h2>We’re here to help</h2>
              <p>
                If you have a question about your subscription, login, or toolkit access, we’re happy to guide you.
                Share as much detail as you can and we’ll respond as soon as possible.
              </p>
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
                TotWise Lab is built with care — and we’re always here to support you.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
