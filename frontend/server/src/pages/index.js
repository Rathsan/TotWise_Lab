import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(html);
  res.end();

  // Next.js requires returning an object, but the response has already been sent.
  return {
    props: {},
  };
}

export default function Home() {
  return null;
}
