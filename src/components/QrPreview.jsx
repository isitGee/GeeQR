import { forwardRef } from 'react';
import { CONTENT_TYPE_META } from '../lib/encode.js';
import {
  QrIcon,
  AlertIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  ResetIcon,
} from './Icons.jsx';

/**
 * Live preview pane: empty / error / ready states plus
 * download, copy and reset actions.
 */
export const QrPreview = forwardRef(function QrPreview(
  {
    status,
    error,
    payload,
    contentType,
    size,
    copied,
    downloading,
    onDownload,
    onCopy,
    onReset,
  },
  canvasRef,
) {
  const ready = status === 'ready';

  return (
    <div className="preview-pane" aria-label="QR code preview">
      <div className="preview-frame">
        {/* One persistent canvas: it keeps its bitmap while hidden so
            downloads always use the latest render. */}
        <canvas
          ref={canvasRef}
          className="qr-canvas"
          hidden={status !== 'ready'}
          role={status === 'ready' ? 'img' : undefined}
          aria-hidden={status !== 'ready'}
          aria-label={
            status === 'ready'
              ? `QR code containing your ${CONTENT_TYPE_META[contentType].label.toLowerCase()} content`
              : undefined
          }
        />
        {status === 'error' ? (
          <div className="preview-error">
            <span className="preview-error-icon" aria-hidden="true">
              <AlertIcon />
            </span>
            <p role="alert">{error}</p>
          </div>
        ) : null}
        {status === 'empty' ? (
          <div className="preview-empty">
            <span className="preview-empty-icon" aria-hidden="true">
              <QrIcon />
            </span>
            <strong>Your QR code will appear here</strong>
            <p>Enter a URL or text to generate your code.</p>
          </div>
        ) : null}
      </div>

      <div className="preview-meta">
        <span>
          {ready ? (
            <>
              {CONTENT_TYPE_META[contentType].label} · <code>{size}×{size}px</code>
            </>
          ) : (
            'Nothing to preview yet'
          )}
        </span>
      </div>

      {ready ? (
        <div className="content-readout" title={payload}>
          <span>{payload}</span>
        </div>
      ) : null}

      <div className="preview-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!ready || downloading}
          onClick={onDownload}
        >
          <DownloadIcon />
          {downloading ? 'Saving…' : 'Download PNG'}
        </button>
        <button
          type="button"
          className={`btn btn-secondary${copied ? ' btn-success-flash' : ''}`}
          disabled={!ready}
          onClick={onCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy content'}
        </button>
      </div>

      <button type="button" className="btn btn-ghost" onClick={onReset}>
        <ResetIcon />
        Reset everything
      </button>
    </div>
  );
});
