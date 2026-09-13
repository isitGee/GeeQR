/* ------------------------------------------------------------------
   Content encoding + validation for each QR input type.
   Pure functions (no DOM) so they can be unit-tested in Node.
   ------------------------------------------------------------------ */

export const CONTENT_TYPES = ['url', 'text', 'wifi', 'email', 'phone'];

export const CONTENT_TYPE_META = {
  url: { label: 'URL', hint: 'Link to a website or page' },
  text: { label: 'Text', hint: 'Any plain text message' },
  wifi: { label: 'Wi-Fi', hint: 'Share network credentials' },
  email: { label: 'Email', hint: 'Open a new email draft' },
  phone: { label: 'Phone', hint: 'Start a phone call' },
};

export const WIFI_SECURITY = ['WPA', 'WEP', 'nopass'];

/** Escape reserved characters in Wi-Fi SSID / password fields. */
export function escapeWifiField(value) {
  return String(value).replace(/([\\;,":])/g, '\\$1');
}

function hasScheme(value) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);
}

/**
 * Normalize a URL: trim whitespace and add https:// when no scheme given.
 * Returns the normalized string (may still be invalid — see validateUrl).
 */
export function normalizeUrl(value) {
  const trimmed = String(value).trim();
  if (!trimmed || hasScheme(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Friendly validation for URLs. Returns an error string or null. */
export function validateUrl(value) {
  const raw = String(value).trim();
  if (!raw) return null;
  if (/\s/.test(raw)) {
    return 'URLs can’t contain spaces. Check it and try again.';
  }
  let candidate = raw;
  if (!hasScheme(candidate)) candidate = `https://${candidate}`;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return 'That doesn’t look like a valid URL. Check it and try again.';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Only http and https links are supported for URL codes.';
  }
  const host = parsed.hostname;
  if (!host || (!host.includes('.') && host !== 'localhost')) {
    return 'That doesn’t look like a valid URL. Check it and try again.';
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Friendly validation for email addresses. Returns an error string or null. */
export function validateEmail(value) {
  const raw = String(value).trim();
  if (!raw) return null;
  if (!EMAIL_RE.test(raw)) {
    return 'That doesn’t look like a valid email address. Check it and try again.';
  }
  return null;
}

/** Friendly validation for phone numbers. Returns an error string or null. */
export function validatePhone(value) {
  const raw = String(value).trim();
  if (!raw) return null;
  if (!/^[+()\-.\s\d]+$/.test(raw)) {
    return 'Phone numbers can only contain digits, spaces and + - ( ) .';
  }
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 3) {
    return 'That phone number looks too short. Check it and try again.';
  }
  if (digits.length > 15) {
    return 'That phone number looks too long. Check it and try again.';
  }
  return null;
}

/**
 * Build the encoded QR payload for a content type.
 * `fields` shape depends on type:
 *  - url/text/email/phone: { value }
 *  - wifi: { ssid, password, security, hidden }
 * Returns { payload, error } — payload is '' when empty/invalid.
 */
export function buildPayload(type, fields = {}) {
  switch (type) {
    case 'url': {
      const value = String(fields.value ?? '').trim();
      if (!value) return { payload: '', error: null };
      const error = validateUrl(value);
      if (error) return { payload: '', error };
      return { payload: normalizeUrl(value), error: null };
    }
    case 'text': {
      const value = String(fields.value ?? '');
      if (!value.trim()) return { payload: '', error: null };
      return { payload: value, error: null };
    }
    case 'email': {
      const value = String(fields.value ?? '').trim();
      if (!value) return { payload: '', error: null };
      const error = validateEmail(value);
      if (error) return { payload: '', error };
      return { payload: `mailto:${value}`, error: null };
    }
    case 'phone': {
      const value = String(fields.value ?? '').trim();
      if (!value) return { payload: '', error: null };
      const error = validatePhone(value);
      if (error) return { payload: '', error };
      return { payload: `tel:${value.replace(/[\s\-().]/g, '')}`, error: null };
    }
    case 'wifi': {
      const ssid = String(fields.ssid ?? '').trim();
      const password = String(fields.password ?? '');
      const security = WIFI_SECURITY.includes(fields.security)
        ? fields.security
        : 'WPA';
      const hidden = Boolean(fields.hidden);
      if (!ssid && !password) return { payload: '', error: null };
      if (!ssid) {
        return { payload: '', error: 'Enter the Wi-Fi network name (SSID).', field: 'ssid' };
      }
      if (security !== 'nopass' && !password) {
        return {
          payload: '',
          error: 'Enter the Wi-Fi password, or choose “No password”.',
          field: 'password',
        };
      }
      const parts = [
        `T:${security}`,
        `S:${escapeWifiField(ssid)}`,
        security === 'nopass' ? '' : `P:${escapeWifiField(password)}`,
        hidden ? 'H:true' : '',
      ].filter(Boolean);
      return { payload: `WIFI:${parts.join(';')};`, error: null };
    }
    default:
      return { payload: '', error: null };
  }
}

/** Rough capacity guard: max binary bytes a QR code can hold (v40-L). */
export function isOversized(payload) {
  try {
    return new TextEncoder().encode(payload).length > 2953;
  } catch {
    return payload.length > 2953;
  }
}
