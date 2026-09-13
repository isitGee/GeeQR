import { GithubIcon, LinkedinIcon, GlobeIcon } from './Icons.jsx';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="GeeQR — back to top">
            <img className="brand-mark" src="./favicon.svg" alt="" width="28" height="28" />
            <span className="brand-name">
              Gee<em>QR</em>
            </span>
          </a>
          <p>Create. Customize. Scan. Free QR codes, generated entirely in your browser.</p>
        </div>
        <div className="footer-links">
          <nav aria-label="Product">
            <h4>Product</h4>
            <a href="#generator">Generator</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
          </nav>
          <nav aria-label="George Mwanga">
            <h4>George Mwanga</h4>
            <a href="https://isitgee.github.io/portfolio/" target="_blank" rel="noreferrer">
              <GlobeIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              Portfolio
            </a>
            <a href="https://github.com/isitGee" target="_blank" rel="noreferrer">
              <GithubIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/isitgee"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedinIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
      <div className="container footer-base">
        <span>© 2026 George Mwanga. All rights reserved.</span>
        <span>Built by George Mwanga</span>
      </div>
    </footer>
  );
}
