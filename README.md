# GeeQR — Free QR Code Generator

Create. Customize. Scan.

GeeQR is a free, privacy-friendly QR code generator that runs entirely in the
browser. Enter content, customize the look, preview live and download a crisp
PNG — no account, no paywall, no uploads.

**Live demo:** https://isitgee.github.io/GeeQR/

## Features

- **Live QR generation** — URLs, plain text, Wi-Fi credentials, email and phone
- **Full customization** — foreground/background colors, export size
  (256 / 512 / 1024px), error correction level (L / M / Q / H)
- **Center logo support** — upload a PNG, JPG, WebP or SVG (max 2 MB),
  processed locally with transparency handling
- **Instant PNG download** — correct size, colors and logo baked in
- **Copy content** — one-click copy with success feedback
- **Smart validation** — friendly, human-readable error messages
- **Scan-reliability hints** — contrast and error-correction guidance
- **Light & dark themes** — system preference detection + persisted choice
- **Responsive & accessible** — mobile-first layout, keyboard navigation,
  screen-reader announcements, reduced-motion support
- **Private by design** — generation is 100% client-side; only theme and
  appearance preferences are stored in `localStorage`

## Tech stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [qrcode](https://www.npmjs.com/package/qrcode) (open-source, MIT) for
  client-side QR matrix generation; logo compositing and PNG export are
  hand-rolled on `<canvas>`
- Modern CSS with design tokens (CSS variables), no UI framework
- Zero runtime network calls for core functionality

## Screenshots

> Screenshots coming soon. Run the project locally (below) to see it in action.

| Generator (light) | Generator (dark) |
| ----------------- | ---------------- |
| _placeholder_     | _placeholder_    |

## Getting started

Requires Node.js 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/isitGee/GeeQR.git
cd GeeQR

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the Vite dev server                |
| `npm run build` | Build the static site into `dist/`       |
| `npm run preview` | Preview the production build locally   |
| `npm test`      | Run logic smoke tests (no browser needed) |

## Deployment

The app is a fully static frontend — any static host works.

- **GitHub Pages:** pushing to `main` triggers the workflow in
  `.github/workflows/deploy.yml`, which builds and publishes `dist/`.
  The Vite `base` is relative (`./`), so the same build also works on
  root domains.
- **Vercel / Netlify:** import the repo, framework preset “Vite”, build
  command `npm run build`, output directory `dist`. No environment
  variables required.

## Project structure

```text
geeqr/
├── public/
│   └── favicon.svg
├── scripts/
│   └── smoke.mjs          # Node smoke tests for pure logic
├── src/
│   ├── components/        # Header, Hero, Generator, ContentForm,
│   │                      # AppearancePanel, QrPreview, Features,
│   │                      # HowItWorks, Faq, Footer, Toasts, …
│   ├── hooks/             # useTheme, useLocalStorage, useDebouncedValue
│   ├── lib/               # encode.js (payloads + validation)
│   │                      # color.js (contrast checks)
│   │                      # qr.js (render, logo, download)
│   ├── styles/            # tokens, base, ui, layout, generator
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Privacy

GeeQR generates QR codes locally with JavaScript. Content you type and logos
you upload never leave your device — there is no backend and no analytics.
The only things persisted are your theme choice and appearance preferences,
stored in your own browser via `localStorage`. Clearing site data removes
them.

## License

MIT — see [LICENSE](LICENSE) for details.

## Author

Built by **George Mwanga**

- GitHub: https://github.com/isitGee
- Portfolio: https://isitgee.github.io/portfolio/
