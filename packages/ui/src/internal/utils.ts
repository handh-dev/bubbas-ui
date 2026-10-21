import { useCallback, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...values: (string | false | null | undefined)[]) {
  return twMerge(values.filter(Boolean).join(' '));
}

export const focusRing = 'web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-offset-2 web:focus-visible:outline-ui-focus';

/** Controlled values are never silently copied into local state. */
export function useControllableState<T>({ value, defaultValue, onChange }: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [local, setLocal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : local;
  const currentRef = useRef(current);
  currentRef.current = current;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const setValue = useCallback((next: T) => {
    if (Object.is(currentRef.current, next)) return;
    if (!controlled) {
      currentRef.current = next;
      setLocal(next);
    }
    onChangeRef.current?.(next);
  }, [controlled]);
  return [current, setValue] as const;
}
