import { useCallback, useRef, useState } from 'react';

let nextId = 0;

/** Minimal toast store: push(type, message), auto-dismiss after 3.2s. */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) =>
      list.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 220);
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++nextId;
      setToasts((list) => [...list.slice(-2), { id, type, message, leaving: false }]);
      timers.current.set(id, window.setTimeout(() => dismiss(id), 3200));
    },
    [dismiss],
  );

  return { toasts, push };
}

const ICONS = {
  success: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m7 10.2 2.2 2.2L13 8.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M10 6.4v4.4m0 2.8v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M10 9.2v4m0-7.6v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function Toasts({ toasts }) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`toast toast-${t.type}${t.leaving ? ' toast-leaving' : ''}`}
        >
          {ICONS[t.type] ?? ICONS.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
