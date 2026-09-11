import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search inputs)
 * @param {any} value - The input value to debounce
 * @param {number} delayMs - Debounce delay in milliseconds (default: 300ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
