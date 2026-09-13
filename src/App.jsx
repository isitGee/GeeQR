import { useTheme } from './hooks/useTheme.js';
import { useToasts, Toasts } from './components/Toasts.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { Generator } from './components/Generator.jsx';
import { Features } from './components/Features.jsx';
import { HowItWorks } from './components/HowItWorks.jsx';
import { Faq } from './components/Faq.jsx';
import { Footer } from './components/Footer.jsx';

export function App() {
  const { theme, toggle } = useTheme();
  const { toasts, push } = useToasts();

  return (
    <div id="top">
      <a className="skip-link" href="#generator">
        Skip to QR generator
      </a>
      <Header theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <Generator notify={push} />
        <Features />
        <HowItWorks />
        <Faq />
      </main>
      <Footer />
      <Toasts toasts={toasts} />
    </div>
  );
}
