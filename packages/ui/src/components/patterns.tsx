'use client';

import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../internal/utils';
import type { Appearance } from '../theme';
import { RadioGroup } from './forms/RadioGroup';
import { Heading, Text } from './typography';
import { Alert, Spinner } from './feedback';
import { EmptyState } from './content';
import { Button } from './Button';

export interface AppearanceControlProps extends Omit<ViewProps, 'children'> {
  value: Appearance;
  onValueChange: (appearance: Appearance) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** The host stores the preference and passes it to ThemeProvider. */
export function AppearanceControl({ value, onValueChange, label = 'Appearance', ...props }: AppearanceControlProps) {
  return <RadioGroup {...props} label={label} value={value} orientation="horizontal"
    options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]}
    onValueChange={(next) => { if (next === 'light' || next === 'dark' || next === 'system') onValueChange(next); }} />;
}

export interface PageHeaderProps extends Omit<ViewProps, 'children'> {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  /** Use level 1 for the page; lower levels for a nested region. */
  level?: 1 | 2 | 3;
  className?: string;
}

/** A responsive introduction with a clear heading and caller-owned actions. */
export function PageHeader({ title, description, eyebrow, actions, level = 1, className, ...props }: PageHeaderProps) {
  return <View {...props} className={cn('flex-row flex-wrap items-start justify-between gap-6', className)}>
    <View className="min-w-0 flex-1 basis-64 gap-2">
      {eyebrow ? <Text variant="small" className="font-bold text-ui-accent">{eyebrow}</Text> : null}
      <Heading level={level}>{title}</Heading>
      {description ? <Text tone="muted" className="max-w-[720px]">{description}</Text> : null}
    </View>
    {actions ? <View className="max-w-full flex-row flex-wrap items-center gap-3">{actions}</View> : null}
  </View>;
}

export type AsyncStatus = 'loading' | 'empty' | 'error' | 'offline' | 'ready';
export interface AsyncStateProps extends Omit<ViewProps, 'children'> {
  status: AsyncStatus;
  title?: string;
  description?: string;
  children?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  /** Explicit source/freshness labels; never inferred from a timestamp. */
  sourceLabel?: string;
  freshnessLabel?: string;
  className?: string;
}
const titles: Record<Exclude<AsyncStatus, 'ready'>, string> = {
  loading: 'Loading…', empty: 'Nothing here yet', error: 'We couldn’t load this', offline: 'You’re offline',
};

/** Retains supplied content during loading/failure; the caller labels cached data. */
export function AsyncState({ status, title, description, children, onRetry, retryLabel = 'Try again', sourceLabel, freshnessLabel, className, ...props }: AsyncStateProps) {
  const action = onRetry && status !== 'ready' && status !== 'loading'
    ? <Button variant="outline" onPress={onRetry}>{retryLabel}</Button> : null;
  return <View {...props} className={cn('gap-4', className)}>
    {status === 'loading' ? <View accessibilityLiveRegion="polite" className="flex-row items-center gap-3">
      <Spinner label={title ?? titles.loading} /><View className="min-w-0 flex-1 gap-1">
        <Text variant="label">{title ?? titles.loading}</Text>
        {description ? <Text tone="muted">{description}</Text> : null}
      </View>
    </View> : status === 'empty' ? <EmptyState title={title ?? titles.empty} description={description}>{action}</EmptyState>
      : status === 'error' || status === 'offline' ? <Alert title={title ?? titles[status]} description={description}
        tone={status === 'error' ? 'error' : 'warning'} announce="polite">{action}</Alert> : null}
    {children}
    {sourceLabel || freshnessLabel ? <View className="gap-1">
      {sourceLabel ? <Text variant="small" tone="muted">{sourceLabel}</Text> : null}
      {freshnessLabel ? <Text variant="small" tone="muted">{freshnessLabel}</Text> : null}
    </View> : null}
  </View>;
}
