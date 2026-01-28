import Head from 'next/head';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export default function OurStory() {
  return (
    <>
      <Head>
        <title>Our Story — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header showFreeGuide={false} />
      <main className="company-page">
        <div className="container">
          <div className="company-shell">
            <header className="company-hero">
              <div className="company-hero-grid">
                <div className="company-hero-copy">
                  <h1>Our Story</h1>
                </div>
                <div className="company-hero-visual" aria-hidden="true">
                  <svg viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="110" cy="80" r="60" fill="#F5D5C8" />
                    <rect x="60" y="110" width="100" height="42" rx="18" fill="#A8C5A0" />
                    <circle cx="85" cy="80" r="10" fill="#2D3B3A" />
                    <circle cx="135" cy="80" r="10" fill="#2D3B3A" />
                  </svg>
                </div>
              </div>
            </header>

            <section className="company-section company-card-block">
              <h2>The Beginning</h2>
              <p>
                TotWise Lab started with a simple realization: parenting advice is everywhere — but clear, calm guidance is rare.
              </p>
              <p>
                As parents and builders, we noticed how confusing early childhood information can feel, especially during the
                toddler years.
              </p>
            </section>

            <section className="company-section company-card-block">
              <h2>The Problem We Saw</h2>
              <p>Parents don’t lack love or effort. They lack clarity and confidence.</p>
              <p>Most resources either:</p>
              <ul className="company-list">
                <li>overwhelm with information, or</li>
                <li>oversimplify what toddlers truly need.</li>
              </ul>
            </section>

            <section className="company-section company-card-block">
              <h2>Why TotWise Exists</h2>
              <p>TotWise was created to bridge that gap.</p>
              <p>We wanted to build something that feels like:</p>
              <ul className="company-list">
                <li>a calm guide</li>
                <li>a trusted friend</li>
                <li>a steady hand during uncertain moments</li>
              </ul>
              <p>No noise. No pressure. Just thoughtful guidance.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
