import { GiftIcon, ShieldIcon, PaletteIcon, DownloadIcon } from './Icons.jsx';

const FEATURES = [
  {
    icon: <GiftIcon />,
    title: 'Free forever',
    text: 'No subscriptions, no paid API, no watermarks. Every feature is available to everyone.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Private by design',
    text: 'QR generation happens directly in your browser. Your content is never uploaded anywhere.',
  },
  {
    icon: <PaletteIcon />,
    title: 'Fully customizable',
    text: 'Change colors, export size, error correction — even add your own center logo.',
  },
  {
    icon: <DownloadIcon />,
    title: 'Instant download',
    text: 'Export your QR code as a crisp PNG in seconds, ready for print or screen.',
  },
];

export function Features() {
  return (
    <section className="section container" id="features" aria-labelledby="features-title">
      <div className="section-head">
        <span className="eyebrow">Why GeeQR</span>
        <h2 className="section-title" id="features-title">
          Everything you need, nothing you don’t
        </h2>
        <p className="section-lead">
          A focused utility that does one job well — without accounts,
          paywalls or tracking.
        </p>
      </div>
      <div className="feature-grid">
        {FEATURES.map((f) => (
          <article className="feature-card" key={f.title}>
            <span className="feature-icon" aria-hidden="true">
              {f.icon}
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
