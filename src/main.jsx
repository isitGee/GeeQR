import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/layout.css';
import './styles/generator.css';
import { App } from './App.jsx';

// Apply the saved/system theme before first paint to avoid a flash.
try {
  const saved = window.localStorage.getItem('geeqr:theme');
  const dark =
    saved === 'dark' ||
    (saved !== 'light' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
} catch {
  /* ignore */
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
