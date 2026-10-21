'use client';

import { forwardRef, useState, type ElementRef, type ReactNode } from 'react';
import { Image, Pressable, View, type ImageSourcePropType, type ViewProps, type PressableProps } from 'react-native';
import { cn, focusRing } from '../internal/utils';
import { Text } from './typography';

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
const toneClasses = {
  neutral: 'bg-ui-selected', info: 'bg-ui-info-surface', success: 'bg-ui-success-surface', warning: 'bg-ui-warning-surface', error: 'bg-ui-error-surface',
};
const toneText = { neutral: 'text-ui-text', info: 'text-ui-info', success: 'text-ui-success', warning: 'text-ui-warning', error: 'text-ui-error' };
export interface BadgeProps extends ViewProps { children: ReactNode; tone?: StatusTone; className?: string; textClassName?: string }
export function Badge({ children, tone = 'neutral', className, textClassName, ...props }: BadgeProps) {
  return <View {...props} className={cn('self-start rounded-full px-3 py-1', toneClasses[tone], className)}><Text variant="small" className={cn('font-semibold', toneText[tone], textClassName)}>{children}</Text></View>;
}

export interface AvatarProps extends ViewProps {
  source?: ImageSourcePropType;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
const avatarSizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
export function Avatar({ source, name, size = 'md', className, ...props }: AvatarProps) {
  const [failedSource, setFailedSource] = useState<ImageSourcePropType>();
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';
  return <View {...props} accessible accessibilityRole="image" accessibilityLabel={name} className={cn('items-center justify-center overflow-hidden rounded-full bg-ui-selected', avatarSizes[size], className)}>
    {source && source !== failedSource ? <Image source={source} resizeMode="cover" accessible={false} className="h-full w-full" onError={() => setFailedSource(source)} /> : <Text accessible={false} className="font-bold">{initials}</Text>}
  </View>;
}

export interface EmptyStateProps extends ViewProps { title: string; description?: string; children?: ReactNode; className?: string }
export function EmptyState({ title, description, children, className, ...props }: EmptyStateProps) {
  return <View {...props} className={cn('items-start gap-3 py-8', className)}>
    <Text className="text-lg font-bold">{title}</Text>
    {description ? <Text tone="muted">{description}</Text> : null}
    {children}
  </View>;
}

export interface ListItemProps extends Omit<ViewProps, 'children'> {
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
}
export const ListItem = forwardRef<ElementRef<typeof View>, ListItemProps>(function ListItem({ title, description, leading, trailing, className, disabled = false, onPress, accessibilityState, ...props }, ref) {
  const content = <>{leading}<View className="min-w-0 flex-1 gap-1"><Text className="font-semibold">{title}</Text>{description ? <Text variant="small" tone="muted">{description}</Text> : null}</View>{trailing}</>;
  const classes = cn('min-h-[48px] min-w-[44px] flex-row items-center gap-3 border-b border-ui-line py-3', onPress && focusRing, disabled && 'opacity-50', className);
  return onPress ? <Pressable {...props} ref={ref} onPress={onPress} disabled={disabled} aria-disabled={disabled} accessibilityRole="button" accessibilityState={{ ...accessibilityState, disabled }} className={classes}>{content}</Pressable> : <View {...props} ref={ref} accessibilityState={accessibilityState} className={classes}>{content}</View>;
});
