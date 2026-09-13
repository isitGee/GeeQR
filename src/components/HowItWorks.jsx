const STEPS = [
  {
    title: 'Enter',
    text: 'Add your URL, text, Wi-Fi details, email or phone number.',
  },
  {
    title: 'Customize',
    text: 'Choose colors, size, error correction — and optionally a logo.',
  },
  {
    title: 'Download',
    text: 'Save your QR code as PNG and use it anywhere.',
  },
];

export function HowItWorks() {
  return (
    <section className="section container" id="how-it-works" aria-labelledby="how-title">
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <h2 className="section-title" id="how-title">
          From idea to QR code in seconds
        </h2>
      </div>
      <ol className="steps" style={{ listStyle: 'none' }}>
        {STEPS.map((s, i) => (
          <li className="step" key={s.title}>
            <span className="step-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
