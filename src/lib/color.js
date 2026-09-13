/* ------------------------------------------------------------------
   Color helpers: normalization + contrast checks for scan reliability.
   Pure functions (no DOM).
   ------------------------------------------------------------------ */

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalize user input to a 6-digit lowercase hex color, or null. */
export function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  let v = value.trim().toLowerCase();
  if (!v.startsWith('#')) v = `#${v}`;
  if (!HEX_RE.test(v)) return null;
  if (v.length === 4) {
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}

function channelLuminance(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a normalized hex color (0–1). */
export function luminance(hex) {
  const n = normalizeHex(hex) ?? '#000000';
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG-style contrast ratio between two hex colors (1–21). */
export function contrastRatio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Scan-reliability advice for a foreground/background pair.
 * Returns a warning string or null.
 */
export function contrastWarning(foreground, background) {
  const fg = normalizeHex(foreground);
  const bg = normalizeHex(background);
  if (!fg || !bg) return null;
  const ratio = contrastRatio(fg, bg);
  if (ratio < 1.8) {
    return 'Very low contrast — this code may not scan. Pick colors that stand apart.';
  }
  if (luminance(fg) > luminance(bg)) {
    return 'Light codes on dark backgrounds don’t scan on some phones. Dark on light is safest.';
  }
  if (ratio < 3) {
    return 'Contrast is a little low — test-scan the code before printing it.';
  }
  return null;
}
