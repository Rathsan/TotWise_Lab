import Head from 'next/head';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Header showFreeGuide={false} />
      <main className="company-page company-pdf-page">
        <div className="container">
          <div className="company-pdf-layout">
            <div className="company-pdf-content">
              <h1 className="company-pdf-title">About Us</h1>

              <div className="company-pdf-section">
                <h2>Who We Are</h2>
                <p>
                  TotWise Lab is built for parents who want to do the right things for their toddlers — but don’t want overwhelming
                  advice, rigid routines, or screen-heavy solutions.
                </p>
                <p>
                  We focus on tiny, meaningful steps that support healthy brain development, emotional balance, and confident
                  behavior during the most important early years.
                </p>
              </div>

              <div className="company-pdf-section">
                <h2>What We Believe</h2>
                <p>Every child develops at their own pace</p>
                <p>Small daily moments matter more than perfection</p>
                <p>Calm parents raise confident children</p>
                <p>Guidance should feel supportive, not judgmental</p>
              </div>

              <div className="company-pdf-section">
                <h2>What We Do</h2>
                <p>
                  TotWise Lab creates structured, science-informed toolkits that guide parents day by day — so they always know what
                  to do next.
                </p>
                <p>Our tools are designed to fit into real family life, not ideal schedules.</p>
              </div>

              <div className="company-pdf-divider" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
