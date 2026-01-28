import Link from 'next/link';
import { useSubscription } from '../utils/useSubscription';
import { useUser } from '../utils/useUser';

interface HeaderProps {
  showFreeGuide?: boolean;
}

export function Header({ showFreeGuide = true }: HeaderProps) {
  const { user } = useUser();
  const { data: subscription } = useSubscription(user?.id, user?.email ?? null);

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link href="/" className="site-logo">
          TotWise Lab
        </Link>
        <div className="site-nav-links">
          {subscription ? (
            <>
              <Link href="/paid">Paid Dashboard</Link>
              <a href="/index.html#pricing">Pricing</a>
            </>
          ) : (
            <>
              {showFreeGuide ? (
                <Link href="/free-guide">Free Guide</Link>
              ) : null}
              <a href="/index.html#pricing">Upgrade</a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
