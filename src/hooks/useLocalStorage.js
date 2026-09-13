import { useCallback, useState } from 'react';

/** useState persisted to localStorage (fails soft when unavailable). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* ignore — fall through to default */
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage full or blocked — keep in-memory value */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set];
}
