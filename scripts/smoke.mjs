/* Node smoke tests for GeeQR's pure logic (encode.js, color.js).
   Run with: npm test */

import {
  buildPayload,
  escapeWifiField,
  isOversized,
  normalizeUrl,
  validateEmail,
  validatePhone,
  validateUrl,
} from '../src/lib/encode.js';
import { contrastRatio, contrastWarning, normalizeHex } from '../src/lib/color.js';

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL: ${name}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  }
}

function checkTruthy(name, value) {
  if (value) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL: ${name} — expected truthy, got ${JSON.stringify(value)}`);
  }
}

// --- URL ---
check('url: empty', buildPayload('url', { value: '' }), { payload: '', error: null });
check('url: scheme added', buildPayload('url', { value: 'example.com' }).payload, 'https://example.com');
check('url: keeps http', buildPayload('url', { value: 'http://example.com/x' }).payload, 'http://example.com/x');
check('url: trims', buildPayload('url', { value: '  https://a.co  ' }).payload, 'https://a.co');
checkTruthy('url: rejects garbage', validateUrl('not a url'));
checkTruthy('url: rejects no-tld', validateUrl('notaurl'));
check('url: accepts localhost', validateUrl('http://localhost:3000'), null);
check('url: rejects ftp', validateUrl('ftp://example.com'), 'Only http and https links are supported for URL codes.');
check('normalizeUrl passthrough', normalizeUrl('https://x.io'), 'https://x.io');

// --- Text ---
check('text: payload', buildPayload('text', { value: 'Hello!' }), { payload: 'Hello!', error: null });
check('text: blank', buildPayload('text', { value: '   ' }), { payload: '', error: null });

// --- Email ---
check('email: payload', buildPayload('email', { value: 'a@b.co' }).payload, 'mailto:a@b.co');
checkTruthy('email: rejects bad', validateEmail('nope@'));
check('email: accepts valid', validateEmail('you@example.com'), null);

// --- Phone ---
check('phone: payload', buildPayload('phone', { value: '+1 (555) 123-4567' }).payload, 'tel:+15551234567');
checkTruthy('phone: rejects letters', validatePhone('abc'));
checkTruthy('phone: rejects short', validatePhone('12'));
check('phone: accepts plain', validatePhone('5551234567'), null);

// --- Wi-Fi ---
check('wifi: empty', buildPayload('wifi', { ssid: '', password: '' }), { payload: '', error: null });
check(
  'wifi: wpa payload',
  buildPayload('wifi', { ssid: 'Home', password: 'secret12', security: 'WPA', hidden: false }).payload,
  'WIFI:T:WPA;S:Home;P:secret12;',
);
check(
  'wifi: hidden flag',
  buildPayload('wifi', { ssid: 'H', password: 'p', security: 'WPA', hidden: true }).payload,
  'WIFI:T:WPA;S:H;P:p;H:true;',
);
check(
  'wifi: nopass omits password',
  buildPayload('wifi', { ssid: 'Cafe', password: '', security: 'nopass' }).payload,
  'WIFI:T:nopass;S:Cafe;',
);
check('wifi: escaping', escapeWifiField('a;b\\c:d,e"f'), 'a\\;b\\\\c\\:d\\,e\\"f');
checkTruthy('wifi: ssid required', buildPayload('wifi', { ssid: '', password: 'x' }).error);
checkTruthy('wifi: password required', buildPayload('wifi', { ssid: 'H', password: '', security: 'WPA' }).error);

// --- Oversize guard ---
check('oversize: small ok', isOversized('hello'), false);
check('oversize: huge flagged', isOversized('x'.repeat(4000)), true);

// --- Color ---
check('hex: expands shorthand', normalizeHex('#abc'), '#aabbcc');
check('hex: adds hash', normalizeHex('FFFFFF'), '#ffffff');
check('hex: rejects bad', normalizeHex('zzzz'), null);
checkTruthy('contrast: black/white high', contrastRatio('#000000', '#ffffff') > 15);
checkTruthy('contrast: same color warns', contrastWarning('#ffffff', '#ffffff'));
checkTruthy('contrast: inverted warns', contrastWarning('#ffffff', '#000000'));
check('contrast: dark-on-light ok', contrastWarning('#111111', '#ffffff'), null);

console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);
