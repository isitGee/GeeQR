/* ------------------------------------------------------------------
   QR rendering engine: client-side generation, logo compositing,
   file validation and PNG download.
   ------------------------------------------------------------------ */

import QRCode from 'qrcode';

export const QR_SIZES = [256, 512, 1024];
export const DEFAULT_SIZE = 512;

export const EC_LEVELS = [
  { id: 'L', label: 'Low', hint: 'Smallest code. Best for clean screens and print.' },
  { id: 'M', label: 'Medium', hint: 'Balanced size and damage tolerance.' },
  { id: 'Q', label: 'Quartile', hint: 'Survives logos and partial damage well.' },
  { id: 'H', label: 'High', hint: 'Maximum damage tolerance. Recommended with a logo.' },
];

export const DEFAULT_EC = 'M';
export const DEFAULT_FG = '#111111';
export const DEFAULT_BG = '#ffffff';

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_LOGO_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
];

/** Validate a user-uploaded logo file. Returns an error string or null. */
export function validateLogoFile(file) {
  if (!file) return 'Choose an image file first.';
  if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
    return 'That file type isn’t supported. Use PNG, JPG, WebP or SVG.';
  }
  if (file.size > MAX_LOGO_BYTES) {
    return 'That logo is larger than 2 MB. Try a smaller image.';
  }
  return null;
}

/** Load an image element from an object URL (resolves when decoded). */
export function loadLogoImage(objectUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) {
        reject(new Error('undecodable'));
        return;
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error('undecodable'));
    img.src = objectUrl;
  });
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draw a logo centered on the QR canvas with a solid backing plate so
 * transparent logos stay readable and modules stay covered cleanly.
 */
export function drawLogoOnCanvas(canvas, logoImage) {
  const size = canvas.width;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Backing plate covers ~26% of the code width — safe with EC Q/H.
  const plate = Math.round(size * 0.26);
  const pad = Math.round(size * 0.018);
  const x = (size - plate) / 2;
  const y = (size - plate) / 2;

  ctx.save();
  roundedRectPath(ctx, x, y, plate, plate, Math.round(size * 0.02));
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Contain the logo inside the plate, preserving aspect ratio.
  const iw = logoImage.naturalWidth;
  const ih = logoImage.naturalHeight;
  const inner = plate - pad * 2;
  const scale = Math.min(inner / iw, inner / ih);
  const dw = Math.round(iw * scale);
  const dh = Math.round(ih * scale);
  ctx.drawImage(logoImage, (size - dw) / 2, (size - dh) / 2, dw, dh);
  ctx.restore();
}

/**
 * Render a QR code onto `canvas`. Resolves on success, rejects with a
 * user-friendly message on failure.
 */
export async function renderQrCanvas(
  canvas,
  { payload, size, foreground, background, ecLevel, logoImage },
) {
  try {
    await QRCode.toCanvas(canvas, payload, {
      width: size,
      margin: 4,
      errorCorrectionLevel: ecLevel,
      color: { dark: foreground, light: background },
    });
  } catch {
    throw new Error(
      'This content is too long to fit in a QR code. Try shortening it or lowering error correction.',
    );
  }
  if (logoImage) {
    drawLogoOnCanvas(canvas, logoImage);
  }
}

/** Trigger a PNG download of the canvas contents. */
export function downloadCanvasAsPng(canvas, filename = 'geeqr-qr-code.png') {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Nothing to download yet.'));
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Couldn’t create the PNG file. Try again.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      resolve();
    }, 'image/png');
  });
}

/** Copy text with a fallback for older browsers / non-secure contexts. */
export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}
