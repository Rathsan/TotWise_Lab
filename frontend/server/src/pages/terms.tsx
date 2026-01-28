import Head from 'next/head';

export default function TermsOfUse() {
  return (
    <>
      <Head>
        <title>Terms of Use — TotWise Lab</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main className="content" style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <h1>Terms of Use</h1>
        <p className="section-subtitle">By using TotWise Lab, you agree to these terms.</p>
        <p>
          TotWise Lab provides educational activities and guidance for parents. The content is for informational purposes only and
          is not a substitute for professional advice. Access may change as the product evolves.
        </p>
      </main>
    </>
  );
}
