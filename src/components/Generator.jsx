import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildPayload, isOversized, CONTENT_TYPES } from '../lib/encode.js';
import { contrastWarning, normalizeHex } from '../lib/color.js';
import {
  DEFAULT_BG,
  DEFAULT_EC,
  DEFAULT_FG,
  DEFAULT_SIZE,
  EC_LEVELS,
  QR_SIZES,
  copyText,
  downloadCanvasAsPng,
  loadLogoImage,
  renderQrCanvas,
  validateLogoFile,
} from '../lib/qr.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { ContentForm } from './ContentForm.jsx';
import { AppearancePanel } from './AppearancePanel.jsx';
import { QrPreview } from './QrPreview.jsx';
import { ShieldIcon } from './Icons.jsx';

const SETTINGS_KEY = 'geeqr:settings';

const DEFAULT_FIELDS = {
  value: '',
  ssid: '',
  password: '',
  security: 'WPA',
  hidden: false,
};

function sanitizeSettings(saved) {
  if (!saved || typeof saved !== 'object') return {};
  const out = {};
  if (CONTENT_TYPES.includes(saved.contentType)) out.contentType = saved.contentType;
  if (normalizeHex(saved.foreground)) out.foreground = normalizeHex(saved.foreground);
  if (normalizeHex(saved.background)) out.background = normalizeHex(saved.background);
  if (QR_SIZES.includes(saved.size)) out.size = saved.size;
  if (EC_LEVELS.some((l) => l.id === saved.ecLevel)) out.ecLevel = saved.ecLevel;
  return out;
}

export function Generator({ notify }) {
  const [savedSettings, setSavedSettings] = useLocalStorage(SETTINGS_KEY, {});
  const initial = useMemo(() => sanitizeSettings(savedSettings), []); // eslint-disable-line

  const [contentType, setContentType] = useState(initial.contentType ?? 'url');
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [foreground, setForeground] = useState(initial.foreground ?? DEFAULT_FG);
  const [background, setBackground] = useState(initial.background ?? DEFAULT_BG);
  const [size, setSize] = useState(initial.size ?? DEFAULT_SIZE);
  const [ecLevel, setEcLevel] = useState(initial.ecLevel ?? DEFAULT_EC);
  const [logo, setLogo] = useState(null);

  const [status, setStatus] = useState('empty');
  const [renderError, setRenderError] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef(null);
  const copyTimer = useRef(0);
  const prevStatus = useRef('empty');
  const [announcement, setAnnouncement] = useState('');

  // Persist customization (never the user's content).
  useEffect(() => {
    setSavedSettings({ contentType, foreground, background, size, ecLevel });
  }, [contentType, foreground, background, size, ecLevel, setSavedSettings]);

  // Revoke logo object URLs on change / unmount.
  useEffect(() => {
    return () => {
      if (logo?.objectUrl) URL.revokeObjectURL(logo.objectUrl);
    };
  }, [logo]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const updateField = useCallback((name, value) => {
    setFields((f) => ({ ...f, [name]: value }));
  }, []);

  // Debounce content so validation + render settle while typing.
  const debouncedType = useDebouncedValue(contentType, 200);
  const debouncedFields = useDebouncedValue(fields, 250);

  const { payload, error: contentError, field: errorField } = useMemo(
    () => buildPayload(debouncedType, debouncedFields),
    [debouncedType, debouncedFields],
  );

  // Live preview render.
  const renderId = useRef(0);
  useEffect(() => {
    const id = ++renderId.current;
    const canvas = canvasRef.current;

    if (!payload) {
      setStatus(contentError ? 'error' : 'empty');
      setRenderError(contentError ?? '');
      return;
    }
    if (isOversized(payload)) {
      setStatus('error');
      setRenderError(
        'This content is too long to fit in a QR code. Try shortening it.',
      );
      return;
    }
    if (!canvas) return;

    renderQrCanvas(canvas, {
      payload,
      size,
      foreground,
      background,
      ecLevel,
      logoImage: logo?.image ?? null,
    })
      .then(() => {
        if (renderId.current !== id) return;
        setStatus('ready');
        setRenderError('');
      })
      .catch((err) => {
        if (renderId.current !== id) return;
        setStatus('error');
        setRenderError(err.message || 'Couldn’t generate the QR code. Try again.');
      });
  }, [payload, contentError, size, foreground, background, ecLevel, logo]);

  // Screen-reader announcements on state transitions only (no per-keystroke chatter).
  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;
    if (status === 'ready') setAnnouncement('QR code updated and ready to download.');
    else if (status === 'error') setAnnouncement(`QR code error: ${renderError}`);
    else setAnnouncement('');
  }, [status, renderError]);

  const handleLogoSelect = useCallback(
    async (file) => {
      const invalid = validateLogoFile(file);
      if (invalid) {
        notify('error', invalid);
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      try {
        const image = await loadLogoImage(objectUrl);
        setLogo((prev) => {
          if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
          return { objectUrl, image, name: file.name, size: file.size };
        });
        notify('success', 'Logo added — it stays on your device.');
      } catch {
        URL.revokeObjectURL(objectUrl);
        notify('error', 'That image couldn’t be read. Try a different file.');
      }
    },
    [notify],
  );

  const handleLogoRemove = useCallback(() => {
    setLogo((prev) => {
      if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      return null;
    });
  }, []);

  const handleDownload = useCallback(async () => {
    if (status !== 'ready') return;
    setDownloading(true);
    try {
      await downloadCanvasAsPng(canvasRef.current, 'geeqr-qr-code.png');
      notify('success', `QR code downloaded as PNG (${size}×${size}px).`);
    } catch (err) {
      notify('error', err.message || 'Download failed. Try again.');
    } finally {
      setDownloading(false);
    }
  }, [status, size, notify]);

  const handleCopy = useCallback(async () => {
    if (status !== 'ready') return;
    try {
      await copyText(payload);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify('error', 'Copy failed. Select the text and copy it manually.');
    }
  }, [status, payload, notify]);

  const handleReset = useCallback(() => {
    setContentType('url');
    setFields(DEFAULT_FIELDS);
    setForeground(DEFAULT_FG);
    setBackground(DEFAULT_BG);
    setSize(DEFAULT_SIZE);
    setEcLevel(DEFAULT_EC);
    handleLogoRemove();
    notify('info', 'Everything reset to defaults.');
  }, [handleLogoRemove, notify]);

  const contrastNotice = useMemo(
    () => contrastWarning(foreground, background),
    [foreground, background],
  );

  const logoEcNotice =
    logo && ecLevel !== 'H'
      ? 'Tip: “High” error correction keeps codes with a logo scannable.'
      : null;

  return (
    <section className="generator-section container" id="generator" aria-labelledby="generator-title">
      <h2 id="generator-title" className="sr-only">
        QR code generator
      </h2>
      <div className="generator-card">
        <div className="generator-grid">
          <div className="generator-main">
            <ContentForm
              type={contentType}
              onTypeChange={setContentType}
              fields={fields}
              onFieldChange={updateField}
              error={contentError}
              errorField={errorField}
            />

            <hr className="panel-divider" />

            <AppearancePanel
              foreground={foreground}
              onForegroundChange={setForeground}
              background={background}
              onBackgroundChange={setBackground}
              size={size}
              onSizeChange={setSize}
              ecLevel={ecLevel}
              onEcChange={setEcLevel}
              logo={logo}
              onLogoSelect={handleLogoSelect}
              onLogoRemove={handleLogoRemove}
              contrastNotice={contrastNotice}
              logoEcNotice={logoEcNotice}
            />
          </div>

          <QrPreview
            ref={canvasRef}
            status={status}
            error={renderError}
            payload={payload}
            contentType={debouncedType}
            size={size}
            copied={copied}
            downloading={downloading}
            onDownload={handleDownload}
            onCopy={handleCopy}
            onReset={handleReset}
          />
        </div>
      </div>

      <div className="privacy-strip">
        <ShieldIcon />
        <p>
          <strong>Private by design.</strong> Your content stays on your
          device. GeeQR doesn’t need an account or a server to generate your
          QR code.
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
