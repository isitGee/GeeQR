import { useState } from 'react';
import { ChevronDownIcon } from './Icons.jsx';

const ITEMS = [
  {
    q: 'Is GeeQR free?',
    a: 'Yes. QR generation is performed client-side in your browser and does not require a paid API, so every feature is free with no limits or watermarks.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There are no accounts, no sign-up and no sign-in. Open the page and start generating.',
  },
  {
    q: 'Does GeeQR store my QR content?',
    a: 'No. Your content is processed locally on your device and is never sent to a server. Only your theme and appearance preferences are saved in your own browser’s local storage.',
  },
  {
    q: 'Can I download my QR code?',
    a: 'Yes — as a PNG in 256, 512 or 1024 pixels, with your colors, error correction and logo baked in.',
  },
  {
    q: 'Can I use the QR codes commercially?',
    a: 'QR codes generated here are standard, open QR symbols encoding your own content, and GeeQR claims no rights over them. That said, this isn’t legal advice — if your use case has specific requirements, check with a professional.',
  },
  {
    q: 'Why won’t my code scan?',
    a: 'The usual culprits are low contrast between foreground and background, a logo that covers too much of the code, or printing too small. Use dark-on-light colors, High error correction with logos, and test-scan before printing.',
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section container" id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <span className="eyebrow">FAQ</span>
        <h2 className="section-title" id="faq-title">
          Questions, answered
        </h2>
      </div>
      <div className="faq-list">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className="faq-item" key={item.q} data-open={isOpen}>
              <h3>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {item.q}
                  <ChevronDownIcon className="faq-chevron" />
                </button>
              </h3>
              <div
                className="faq-answer"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                hidden={!isOpen}
              >
                <div className="faq-answer-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
