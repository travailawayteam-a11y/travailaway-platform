"use client";

import { useEffect, useState } from "react";

// Like useState, but remembers the value on this phone or computer.
// If the browser blocks storage, it simply works without saving.
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Ignore.
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore.
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
