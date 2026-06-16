import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay = 300,
) {
  /*
   =========================
   DEBOUNCED VALUE
   =========================
  */

  const [debouncedValue, setDebouncedValue] =
    useState(value);

  /*
   =========================
   UPDATE WITH DELAY
   =========================
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    /*
     =========================
     CLEANUP
     =========================
    */

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}