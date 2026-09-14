import { QrIcon, GithubIcon } from './Icons.jsx';

export function Hero() {
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <p className="hero-badge">
        <span className="dot" aria-hidden="true" />
        100% free no account, no uploads
      </p>
      <h1 className="hero-title" id="hero-title">
        Create. <span className="accent">Customize.</span> Scan.
      </h1>
      <p className="hero-sub">
        Generate beautiful QR codes instantly free, fast, and entirely in
        your browser.
      </p>
      <div className="hero-cta">
        <a className="btn btn-primary btn-lg" href="#generator">
          <QrIcon />
          Create QR Code
        </a>
        <a
          className="btn btn-secondary btn-lg"
          href="https://github.com/isitGee/GeeQR"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon style={{ width: '1.125rem', height: '1.125rem' }} />
          View on GitHub
        </a>
      </div>
      <p className="hero-meta">Your content never leaves your device.</p>
    </section>
  );
}
