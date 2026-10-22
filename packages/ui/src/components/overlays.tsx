'use client';

import { useEffect, useId, useReducer, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, View, type ViewProps } from 'react-native';
import { cn, focusRing, useControllableState } from '../internal/utils';
import { reducedMotionQuery } from '../internal/marketing-motion';
import { useWebScrollLock } from '../internal/scroll-lock';
import { useTheme } from '../theme';
import { tokens } from '../tokens';
import { Heading, Text } from './typography';
import { Icon } from './Icon';

export interface DialogProps extends Omit<ViewProps, 'children'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeLabel?: string;
  dismissOnBackdropPress?: boolean;
  className?: string;
  contentClassName?: string;
}

function Overlay({ open, defaultOpen = false, onOpenChange, title, description, children, closeLabel = 'Close', dismissOnBackdropPress = true, className, contentClassName, testID, style, sheet = false, ...props }: DialogProps & { sheet?: boolean }) {
  const [isOpen, setOpen] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const { variables, colors, resolvedAppearance } = useTheme();
  const titleID = useId();
  const descriptionID = useId();
  const [webMounted, setWebMounted] = useState(false);
  useEffect(() => {
    // RNW has no server portal; keep the initial hydration render identical.
    if (Platform.OS === 'web') setWebMounted(true);
  }, []);
  const [, refreshPortal] = useReducer((count: number) => count + 1, 0);
  useEffect(() => {
    // RNW 0.21.4 StrictMode cleanup can clear its render-created portal ref.
    // One ordinary rerender recreates it while preserving the Modal's identity.
    if (Platform.OS === 'web' && isOpen && webMounted) refreshPortal();
  }, [isOpen, webMounted]);
  // Keep the web portal/focus trap alive through its short exit animation.
  const [webPresent, setWebPresent] = useState(isOpen);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (isOpen) { setWebPresent(true); return; }
    if (reducedMotionQuery()?.matches) { setWebPresent(false); return; }
    const timeout = setTimeout(() => setWebPresent(false), 200);
    return () => clearTimeout(timeout);
  }, [isOpen]);
  const present = isOpen || (Platform.OS === 'web' && webPresent);
  const canRender = Platform.OS !== 'web' || webMounted;
  useWebScrollLock(present && canRender);
  // RNW captures the current trigger on mount and restores it on unmount.
  if (!present || !canRender) return null;
  return <Modal transparent visible animationType="none" onRequestClose={() => setOpen(false)} accessibilityLabel={title} aria-labelledby={titleID} {...(description ? { 'aria-describedby': descriptionID } : {})}>
    <View {...{dataSet:{bubbaOverlay:isOpen?'open':'closing'}}} className={cn('bubba-overlay flex-1 px-4 py-6', sheet ? 'justify-end' : 'justify-center')} style={variables}>
      <View testID={testID ? `${testID}-backdrop` : undefined} accessible={false} onStartShouldSetResponder={() => dismissOnBackdropPress} onResponderRelease={() => { if (dismissOnBackdropPress) setOpen(false); }} className="bubba-overlay-backdrop absolute inset-0" style={{ backgroundColor: colors.overlay, opacity: tokens.opacity.overlay[resolvedAppearance] }} />
      <View {...props} testID={testID} accessibilityViewIsModal className={cn('bubba-overlay-panel w-full self-center bg-ui-surface p-6', sheet ? 'max-h-[85%] max-w-[720px] rounded-t-xl' : 'max-h-[85%] max-w-[560px] rounded-xl', className)} style={style}>
        <View className="mb-4 flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1 gap-2">
            <Heading nativeID={titleID} level={2}>{title}</Heading>
            {description ? <Text nativeID={descriptionID} tone="muted">{description}</Text> : null}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={() => setOpen(false)} className={cn('min-h-[44px] min-w-[44px] items-center justify-center rounded px-2', focusRing)}><Icon name="close" size={24} color={colors.link}/></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" className={cn('shrink', contentClassName)}>{children}</ScrollView>
      </View>
    </View>
  </Modal>;
}

/** Controlled or initially open modal dialog; supplies no hidden trigger. */
export function Dialog(props: DialogProps) { return <Overlay {...props} />; }
export type SheetProps = DialogProps;
/** Bottom-aligned, scrollable modal sheet with the same dismissal contract. */
export function Sheet(props: SheetProps) { return <Overlay {...props} sheet />; }
