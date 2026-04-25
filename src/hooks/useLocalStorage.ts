import { useEffect, useState, useCallback } from "react";

// Tiny global event bus so multiple hook instances stay in sync.
const listeners = new Map<string, Set<() => void>>();
function notify(key: string) {
  listeners.get(key)?.forEach(fn => fn());
}

export function useLocalStorage<T>(key: string, initial: T) {
  const read = useCallback((): T => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  }, [key, initial]);

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    const set = listeners.get(key) ?? new Set();
    const fn = () => setValue(read());
    set.add(fn);
    listeners.set(key, set);
    const onStorage = (e: StorageEvent) => { if (e.key === key) fn(); };
    window.addEventListener("storage", onStorage);
    return () => {
      set.delete(fn);
      window.removeEventListener("storage", onStorage);
    };
  }, [key, read]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* noop */ }
      notify(key);
      return v;
    });
  }, [key]);

  return [value, update] as const;
}
