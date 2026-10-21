import { useEffect } from 'react';
import { Platform } from 'react-native';

// Structural browser types keep the native package independent of lib.dom.
interface InlineStyle {
  getPropertyValue(name: string): string;
  getPropertyPriority(name: string): string;
  setProperty(name: string, value: string, priority?: string): void;
  removeProperty(name: string): string;
}
interface StyledElement { style: InlineStyle }
interface ScrollDocument {
  body: StyledElement | null;
  documentElement: StyledElement & { clientWidth: number };
  defaultView: {
    scrollX: number;
    scrollY: number;
    getComputedStyle(element: StyledElement): { paddingRight: string };
    scrollTo(x: number, y: number): void;
  } | null;
}
interface ScrollLock { count: number; restore: () => void }
const locks = new WeakMap<ScrollDocument, ScrollLock>();
const overflowProperties = ['overflow', 'overflow-x', 'overflow-y'];
const overscrollProperties = ['overscroll-behavior', 'overscroll-behavior-x', 'overscroll-behavior-y'];

function preserve(style: InlineStyle, properties: string[]) {
  const previous = properties.map((property) => ({
    property,
    value: style.getPropertyValue(property),
    priority: style.getPropertyPriority(property),
  }));
  return () => {
    for (const { property, value, priority } of previous) {
      if (value) style.setProperty(property, value, priority);
      else style.removeProperty(property);
    }
  };
}

function acquire(document: ScrollDocument) {
  let lock = locks.get(document);
  if (!lock) {
    const body = document.body;
    const view = document.defaultView;
    if (!body || !view) return;
    const root = document.documentElement;
    const { scrollX, scrollY } = view;
    const width = root.clientWidth;
    const paddingRight = Number.parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    const restoreRoot = preserve(root.style, [...overflowProperties, ...overscrollProperties]);
    const restoreBody = preserve(body.style, [
      ...overflowProperties, ...overscrollProperties, 'position', 'top', 'left', 'right', 'padding-right',
    ]);
    const restoreScrollBehavior = preserve(root.style, ['scroll-behavior']);

    root.style.setProperty('scroll-behavior', 'auto', 'important');
    root.style.setProperty('overflow', 'hidden', 'important');
    root.style.setProperty('overscroll-behavior', 'none', 'important');
    body.style.setProperty('overflow', 'hidden', 'important');
    body.style.setProperty('overscroll-behavior', 'none', 'important');
    body.style.setProperty('position', 'fixed', 'important');
    body.style.setProperty('top', `${-scrollY}px`, 'important');
    body.style.setProperty('left', `${-scrollX}px`, 'important');
    body.style.setProperty('right', `${scrollX}px`, 'important');
    // Measure the actual change so existing stable/thin scrollbar styling is respected.
    const compensation = Math.max(0, root.clientWidth - width);
    if (compensation > 0) body.style.setProperty('padding-right', `${paddingRight + compensation}px`, 'important');

    lock = {
      count: 0,
      restore: () => {
        restoreRoot();
        restoreBody();
        view.scrollTo(scrollX, scrollY);
        restoreScrollBehavior();
      },
    };
    locks.set(document, lock);
  }
  lock.count += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lock.count -= 1;
    if (lock.count === 0) {
      lock.restore();
      locks.delete(document);
    }
  };
}

/** One page lock survives nested dialogs; modal ScrollViews remain scrollable. */
export function useWebScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || Platform.OS !== 'web') return;
    const document = (globalThis as unknown as { document?: ScrollDocument }).document;
    return document ? acquire(document) : undefined;
  }, [active]);
}
