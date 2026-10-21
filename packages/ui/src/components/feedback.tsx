'use client';

import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type ViewProps } from 'react-native';
import { cn, focusRing, useControllableState } from '../internal/utils';
import { useTheme } from '../theme';
import { Text } from './typography';
import type { StatusTone } from './content';

const paints = { neutral: 'bg-ui-selected', info: 'bg-ui-info-surface', success: 'bg-ui-success-surface', warning: 'bg-ui-warning-surface', error: 'bg-ui-error-surface' };
const texts = { neutral: 'text-ui-text', info: 'text-ui-info', success: 'text-ui-success', warning: 'text-ui-warning', error: 'text-ui-error' };
export interface AlertProps extends ViewProps {
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: StatusTone;
  announce?: 'off' | 'polite' | 'assertive';
  className?: string;
}
export function Alert({ title, description, children, tone = 'info', announce = 'off', className, ...props }: AlertProps) {
  return <View {...props} accessibilityLiveRegion={announce === 'off' ? 'none' : announce} aria-live={announce} className={cn('gap-2 rounded-xl p-4', paints[tone], className)}>
    <Text className={cn('font-semibold', texts[tone])}>{title}</Text>
    {description ? <Text className={texts[tone]}>{description}</Text> : null}
    {children}
  </View>;
}

export interface ToastProps extends Omit<AlertProps, 'announce'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Zero keeps the notification until explicitly dismissed. */
  duration?: number;
  dismissLabel?: string;
}
/** Nonmodal inline notification. The consumer chooses its location. */
export function Toast({ open, defaultOpen = true, onOpenChange, duration = 0, dismissLabel = 'Dismiss notification', className, children, ...props }: ToastProps) {
  const [visible, setVisible] = useControllableState({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration, visible, setVisible]);
  if (!visible) return null;
  return <Alert {...props} accessibilityRole="alert" announce="polite" className={className}>
    {children}
    <Pressable accessibilityRole="button" accessibilityLabel={dismissLabel} onPress={() => setVisible(false)} className={cn('min-h-[44px] min-w-[44px] self-start justify-center rounded px-2', focusRing)}><Text variant="small" className="font-semibold underline">Dismiss</Text></Pressable>
  </Alert>;
}

export interface SpinnerProps extends ViewProps { label?: string; size?: 'small' | 'large'; className?: string }
export function Spinner({ label = 'Loading', size = 'small', className, ...props }: SpinnerProps) {
  const { colors } = useTheme();
  return <View {...props} accessibilityRole="progressbar" accessibilityLabel={label} accessibilityState={{ busy: true }} aria-busy className={cn('self-start', className)}><ActivityIndicator accessible={false} color={colors.text} size={size} /></View>;
}

export interface ProgressProps extends ViewProps { value: number; max?: number; label: string; className?: string; indicatorClassName?: string }
export function Progress({ value, max = 100, label, className, indicatorClassName, ...props }: ProgressProps) {
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Math.min(maximum, Math.max(0, Number.isFinite(value) ? value : 0));
  return <View {...props} accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: maximum, now: current }} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current} className={cn('h-2 w-full overflow-hidden rounded-full bg-ui-selected', className)}>
    <View className={cn('h-full bg-bubba-red', indicatorClassName)} style={{ width: `${current / maximum * 100}%` }} />
  </View>;
}

export interface SkeletonProps extends ViewProps { className?: string }
/** Static placeholder; avoids forcing motion on either platform. */
export function Skeleton({ className, ...props }: SkeletonProps) { return <View {...props} accessible={false} aria-hidden importantForAccessibility="no-hide-descendants" className={cn('h-4 w-full rounded bg-ui-selected', className)} />; }
