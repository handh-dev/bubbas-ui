import { useCallback, useRef, useState } from 'react';
import { extendTailwindMerge } from 'tailwind-merge';

// Named foundation sizes are font sizes, not text colors. Keep both classes.
const twMerge = extendTailwindMerge({ extend: { classGroups: {
  'font-size': [{ text: ['bubba-display', 'bubba-display-wide', 'bubba-page', 'bubba-page-wide',
    'bubba-section', 'bubba-section-wide', 'bubba-body', 'bubba-body-wide', 'bubba-label',
    'bubba-label-wide', 'bubba-supporting', 'bubba-supporting-wide'] }],
} } });

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
