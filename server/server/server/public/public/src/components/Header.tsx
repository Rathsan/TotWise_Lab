import Link from 'next/link';
import { useSubscription } from '../utils/useSubscription';
import { useUser } from '../utils/useUser';

export function Header() {
  const { user } = useUser();
  const { data: subscription } = useSubscription(user?.id, user?.email ?? null);

  return (
    <header style={{ padding: '24px 24px 0', maxWidth: 1100, margin: '0 auto' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, color: '#2D3B3A', textDecoration: 'none' }}>
          TotWise Lab
        </Link>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.95rem' }}>
          {subscription ? (
            <>
              <Link href="/paid" style={{ color: '#4A5857', textDecoration: 'none' }}>Paid Dashboard</Link>
              <a href="/index.html#pricing" style={{ color: '#4A5857', textDecoration: 'none' }}>Pricing</a>
            </>
          ) : (
            <>
              <Link href="/free-guide" style={{ color: '#4A5857', textDecoration: 'none' }}>Free Guide</Link>
              <a href="/index.html#pricing" style={{ color: '#4A5857', textDecoration: 'none' }}>Upgrade</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
