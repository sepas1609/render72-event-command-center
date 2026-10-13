"use client";

import { useEffect, useState } from "react";

/**
 * useDebounce hook to delay value updates by specified delay (default 300ms).
 * Eliminates unnecessary CPU rendering and search filtering under high concurrency.
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
