import { useEffect, useState } from 'react';
import { GithubIcon, MenuIcon, CloseIcon, MoonIcon, SunIcon } from './Icons.jsx';

const NAV_LINKS = [
  { href: '#generator', label: 'Generator' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export function Header({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="GeeQR — back to top">
            <img className="brand-mark" src="./favicon.svg" alt="" width="28" height="28" />
            <span className="brand-name">
              Gee<em>QR</em>
            </span>
          </a>

          <nav className="nav" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              className="icon-btn"
              href="https://github.com/isitGee/GeeQR"
              target="_blank"
              rel="noreferrer"
              aria-label="GeeQR on GitHub (opens in a new tab)"
              title="GeeQR on GitHub"
            >
              <GithubIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            </a>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
