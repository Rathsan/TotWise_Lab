export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="/index.html" className="logo">
              <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#E8B4A0" />
                <circle cx="14" cy="16" r="3" fill="#2D3B3A" />
                <circle cx="26" cy="16" r="3" fill="#2D3B3A" />
                <path d="M14 26 Q20 32 26 26" stroke="#2D3B3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="8" cy="20" r="4" fill="#F5D5C8" />
                <circle cx="32" cy="20" r="4" fill="#F5D5C8" />
              </svg>
              <span>TotWise Lab</span>
            </a>
            <p>Tiny Steps. Wise Growth.</p>
            <p className="footer-tagline">Helping parents nurture happy, healthy toddlers through science-backed play.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="/index.html#toolkits">Toolkits</a></li>
                <li><a href="/index.html#whats-inside">How It Works</a></li>
                <li><a href="/index.html#pricing">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="/company/about-us">About Us</a></li>
                <li><a href="/company/our-story">Our Story</a></li>
                <li><a href="/company/contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="/index.html#faq">FAQ</a></li>
                <li><a href="/auth/login">Member Login</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" aria-label="Instagram" className="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Pinterest" className="social-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6c-2.5 0-5 2-5 5 0 2 1 3 2 3.5-.2 1-1 3-1 4l3-2c.5.2 1 .5 2 .5 3 0 5-2.5 5-5.5S15 6 12 6z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TotWise Lab. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
