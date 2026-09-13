import { useEffect, useState } from 'react';
import { normalizeHex } from '../lib/color.js';

/**
 * Color picker = native swatch + hex text field, kept in sync.
 * Commits valid hex upstream; tolerates in-progress typing.
 */
export function ColorField({ id, label, value, onChange, hint }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const commit = (raw) => {
    const normalized = normalizeHex(raw);
    if (normalized) onChange(normalized);
  };

  return (
    <div className="field">
      <label className="field-label" htmlFor={`${id}-hex`}>
        {label}
      </label>
      <div className="color-field">
        <span className="color-swatch">
          <input
            type="color"
            id={id}
            aria-label={`${label} color picker`}
            value={normalizeHex(value) ?? '#000000'}
            onChange={(e) => onChange(normalizeHex(e.target.value) ?? value)}
          />
        </span>
        <input
          id={`${id}-hex`}
          className="hex-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (normalizeHex(e.target.value)) commit(e.target.value);
          }}
          onBlur={(e) => {
            const normalized = normalizeHex(e.target.value);
            setText(normalized ?? value);
            if (normalized) onChange(normalized);
          }}
        />
      </div>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
