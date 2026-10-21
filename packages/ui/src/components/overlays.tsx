'use client';

import { useEffect, useId, useReducer, useState, type ReactNode } from 'react';
import { Modal, Platform, Pressable, ScrollView, View, type ViewProps } from 'react-native';
import { cn, focusRing, useControllableState } from '../internal/utils';
import { useWebScrollLock } from '../internal/scroll-lock';
import { useTheme } from '../theme';
import { Heading, Text } from './typography';

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
  const { variables } = useTheme();
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
  const canRender = Platform.OS !== 'web' || webMounted;
  useWebScrollLock(isOpen && canRender);
  // RNW captures the current trigger on mount and restores it on unmount.
  if (!isOpen || !canRender) return null;
  return <Modal transparent visible animationType="none" onRequestClose={() => setOpen(false)} accessibilityLabel={title} aria-labelledby={titleID} {...(description ? { 'aria-describedby': descriptionID } : {})}>
    <View className={cn('flex-1 px-4 py-6', sheet ? 'justify-end' : 'justify-center')} style={variables}>
      <View testID={testID ? `${testID}-backdrop` : undefined} accessible={false} onStartShouldSetResponder={() => dismissOnBackdropPress} onResponderRelease={() => { if (dismissOnBackdropPress) setOpen(false); }} className="absolute inset-0 bg-black/50" />
      <View {...props} testID={testID} accessibilityViewIsModal className={cn('w-full self-center bg-ui-surface p-6', sheet ? 'max-h-[85%] max-w-[720px] rounded-t-xl' : 'max-h-[85%] max-w-[560px] rounded-xl', className)} style={style}>
        <View className="mb-4 flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1 gap-2">
            <Heading nativeID={titleID} level={2}>{title}</Heading>
            {description ? <Text nativeID={descriptionID} tone="muted">{description}</Text> : null}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={() => setOpen(false)} className={cn('min-h-[44px] min-w-[44px] items-center justify-center rounded px-2', focusRing)}><Text variant="small" className="font-semibold text-ui-link">{closeLabel}</Text></Pressable>
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
