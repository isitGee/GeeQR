import { useState } from 'react';
import { CONTENT_TYPE_META, CONTENT_TYPES } from '../lib/encode.js';
import { SegmentedControl } from './SegmentedControl.jsx';

const PLACEHOLDERS = {
  url: 'https://example.com',
  text: 'Hello from GeeQR!',
  email: 'you@example.com',
  phone: '+1 555 123 4567',
};

const FIELD_LABELS = {
  url: 'Website URL',
  text: 'Text',
  email: 'Email address',
  phone: 'Phone number',
};

export function ContentForm({
  type,
  onTypeChange,
  fields,
  onFieldChange,
  error,
  errorField,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const singleValue = fields.value ?? '';
  const wifiSecurity = fields.security ?? 'WPA';

  return (
    <div className="panel-block">
      <h2 className="panel-title">Content</h2>

      <SegmentedControl
        label="Content type"
        labelId="content-type-label"
        value={type}
        onChange={onTypeChange}
        options={CONTENT_TYPES.map((t) => ({
          value: t,
          label: CONTENT_TYPE_META[t].label,
          title: CONTENT_TYPE_META[t].hint,
        }))}
      />

      {type === 'wifi' ? (
        <div className="field-row" style={{ gap: 'var(--space-3)' }}>
          <div className="field-row two">
            <div className="field">
              <label className="field-label" htmlFor="wifi-ssid">
                Network name (SSID)
              </label>
              <input
                id="wifi-ssid"
                className={`text-input${errorField === 'ssid' ? ' input-invalid' : ''}`}
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="MyHomeWiFi"
                value={fields.ssid ?? ''}
                onChange={(e) => onFieldChange('ssid', e.target.value)}
                aria-invalid={errorField === 'ssid'}
                aria-describedby={errorField === 'ssid' ? 'content-error' : undefined}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="wifi-password">
                Password
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <input
                  id="wifi-password"
                  className={`text-input${errorField === 'password' ? ' input-invalid' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  spellCheck={false}
                  placeholder={
                    wifiSecurity === 'nopass' ? 'No password needed' : '••••••••'
                  }
                  disabled={wifiSecurity === 'nopass'}
                  value={fields.password ?? ''}
                  onChange={(e) => onFieldChange('password', e.target.value)}
                  aria-invalid={errorField === 'password'}
                  aria-describedby={errorField === 'password' ? 'content-error' : undefined}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flexShrink: 0, paddingInline: 'var(--space-3)' }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide Wi-Fi password' : 'Show Wi-Fi password'}
                  disabled={wifiSecurity === 'nopass'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          <div className="field-row two" style={{ alignItems: 'end' }}>
            <div className="field">
              <label className="field-label" htmlFor="wifi-security">
                Security
              </label>
              <select
                id="wifi-security"
                className="select-input"
                value={wifiSecurity}
                onChange={(e) => onFieldChange('security', e.target.value)}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No password</option>
              </select>
            </div>
            <label className="check-row" style={{ minHeight: '2.625rem' }}>
              <input
                type="checkbox"
                checked={Boolean(fields.hidden)}
                onChange={(e) => onFieldChange('hidden', e.target.checked)}
              />
              Hidden network
            </label>
          </div>

          {error ? (
            <p className="field-error" id="content-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="field-hint">
              Phones join the network as soon as they scan the code.
            </p>
          )}
        </div>
      ) : type === 'text' ? (
        <div className="field">
          <label className="field-label" htmlFor="content-input">
            {FIELD_LABELS[type]}
          </label>
          <textarea
            id="content-input"
            className={`text-area${error ? ' input-invalid' : ''}`}
            placeholder={PLACEHOLDERS[type]}
            value={singleValue}
            onChange={(e) => onFieldChange('value', e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'content-error' : 'content-count'}
            rows={3}
          />
          {error ? (
            <p className="field-error" id="content-error" role="alert">
              {error}
            </p>
          ) : (
            <p className="char-count" id="content-count">
              {singleValue.length} character{singleValue.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
      ) : (
        <div className="field">
          <label className="field-label" htmlFor="content-input">
            {FIELD_LABELS[type]}
          </label>
          <input
            id="content-input"
            className={`text-input${error ? ' input-invalid' : ''}`}
            type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'url'}
            inputMode={type === 'phone' ? 'tel' : type === 'email' ? 'email' : 'url'}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={PLACEHOLDERS[type]}
            value={singleValue}
            onChange={(e) => onFieldChange('value', e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'content-error' : undefined}
          />
          {error ? (
            <p className="field-error" id="content-error" role="alert">
              {error}
            </p>
          ) : type === 'url' ? (
            <p className="field-hint">“example.com” works too — https:// is added for you.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
