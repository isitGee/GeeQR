import { useRef } from 'react';
import { EC_LEVELS, QR_SIZES } from '../lib/qr.js';
import { ColorField } from './ColorField.jsx';
import { SegmentedControl } from './SegmentedControl.jsx';
import { ImageIcon, TrashIcon, InfoIcon, AlertIcon } from './Icons.jsx';

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AppearancePanel({
  foreground,
  onForegroundChange,
  background,
  onBackgroundChange,
  size,
  onSizeChange,
  ecLevel,
  onEcChange,
  logo,
  onLogoSelect,
  onLogoRemove,
  contrastNotice,
  logoEcNotice,
}) {
  const fileRef = useRef(null);

  return (
    <div className="panel-block">
      <h2 className="panel-title">Appearance</h2>

      <div className="appearance-grid">
        <ColorField
          id="fg-color"
          label="Foreground"
          value={foreground}
          onChange={onForegroundChange}
          hint="The dark modules of the code."
        />
        <ColorField
          id="bg-color"
          label="Background"
          value={background}
          onChange={onBackgroundChange}
          hint="The light area around the modules."
        />
      </div>

      {contrastNotice ? (
        <div className="notice notice-warning" role="status">
          <AlertIcon />
          <span>{contrastNotice}</span>
        </div>
      ) : null}

      <div className="appearance-grid">
        <SegmentedControl
          label="Export size"
          labelId="qr-size-label"
          value={String(size)}
          onChange={(v) => onSizeChange(Number(v))}
          options={QR_SIZES.map((s) => ({
            value: String(s),
            label: `${s}px`,
            title: `Download a ${s} by ${s} pixel PNG`,
          }))}
        />
        <div className="option-group">
          <span className="field-label" id="qr-ec-label">
            Error correction
            <span
              className="help-dot"
              title="QR codes can survive damage or a centered logo. Higher levels store less data but scan more reliably."
            >
              ?
            </span>
          </span>
          <div className="segmented" role="group" aria-labelledby="qr-ec-label">
            {EC_LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="segmented-btn"
                aria-pressed={ecLevel === l.id}
                title={`${l.label}: ${l.hint}`}
                onClick={() => onEcChange(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {logoEcNotice ? (
        <div className="notice notice-info" role="status">
          <InfoIcon />
          <span>{logoEcNotice}</span>
        </div>
      ) : null}

      <div className="field">
        <span className="field-label" id="logo-label">
          Center logo <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span>
        </span>
        {logo ? (
          <div className="logo-preview-row">
            <img className="logo-thumb" src={logo.objectUrl} alt="Uploaded logo preview" />
            <div className="logo-meta">
              <strong>{logo.name}</strong>
              <span>{formatBytes(logo.size)} · processed on your device</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onLogoRemove}
              aria-label="Remove logo"
            >
              <TrashIcon />
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="dropzone"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => fileRef.current?.click()}
            aria-labelledby="logo-label dropzone-text"
          >
            <span className="dropzone-icon" aria-hidden="true">
              <ImageIcon />
            </span>
            <span className="dropzone-text" id="dropzone-text">
              <strong>Upload a logo</strong>
              <span>PNG, JPG, WebP or SVG · max 2 MB · stays on your device</span>
            </span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          aria-label="Upload a center logo"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) onLogoSelect(file);
          }}
        />
      </div>
    </div>
  );
}
