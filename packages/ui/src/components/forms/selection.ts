'use client';

import { useRef, type ElementRef } from 'react';
import { Platform, Pressable } from 'react-native';

interface SelectionKeyEvent {
  key?: string;
  nativeEvent?: { key?: string };
  repeat?: boolean;
  preventDefault(): void;
}

/** One tab stop, native touch activation, and actual focus movement on web. */
export function useSelectionNavigation<T extends { value: string; disabled?: boolean }>(
  items: readonly T[], value: string | undefined, onSelect: (value: string) => void,
  orientation: 'horizontal' | 'vertical', disabled = false, onActivate = onSelect,
) {
  const refs = useRef<Array<ElementRef<typeof Pressable> | null>>([]);
  const enabled = items.map((item, index) => !disabled && !item.disabled ? index : -1).filter((index) => index !== -1);
  const selectedIndex = items.findIndex((item) => item.value === value && !item.disabled);
  const tabStop = selectedIndex >= 0 && !disabled ? selectedIndex : enabled[0];

  return (index: number) => ({
    ref: (node: ElementRef<typeof Pressable> | null) => { refs.current[index] = node; },
    tabIndex: (Platform.OS === 'web' && index !== tabStop ? -1 : 0) as 0 | -1,
    ...(Platform.OS === 'web' ? {
      onKeyDown(event: SelectionKeyEvent) {
        if (disabled || items[index]?.disabled) return;
        const key = event.key ?? event.nativeEvent?.key;
        if (key === ' ' || key === 'Spacebar') {
          event.preventDefault();
          if (!event.repeat) onActivate(items[index].value);
          return;
        }
        const forward = key === (orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown');
        const backward = key === (orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp');
        if (!forward && !backward && key !== 'Home' && key !== 'End') return;
        event.preventDefault();
        const position = enabled.indexOf(index);
        const next = key === 'Home' ? enabled[0] : key === 'End' ? enabled[enabled.length - 1]
          : enabled[(position + (forward ? 1 : -1) + enabled.length) % enabled.length];
        if (next === undefined) return;
        onSelect(items[next].value);
        refs.current[next]?.focus();
      },
    } : {}),
  });
}
