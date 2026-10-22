'use client';

import { forwardRef, type ElementRef, type ReactNode } from 'react';
import { Linking, Platform, Pressable, type PressableProps } from 'react-native';
import { cn, focusRing } from '../internal/utils';
import { Text, type TextVariant } from './typography';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'accessibilityLabel'> {
  accessibilityLabel: string;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}
const iconVariants = { primary: 'bg-bubba-red border-bubba-red', outline: 'border-ui-border bg-transparent', ghost: 'border-transparent bg-transparent' };
export const IconButton = forwardRef<ElementRef<typeof Pressable>, IconButtonProps>(function IconButton({ accessibilityLabel, children, variant = 'ghost', className, disabled, accessibilityState, 'aria-disabled': ariaDisabled, ...props }, ref) {
  const isDisabled = disabled || (ariaDisabled ?? accessibilityState?.disabled ?? false);
  return <Pressable {...props} ref={ref} accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={isDisabled} aria-disabled={isDisabled} accessibilityState={{ ...accessibilityState, disabled: isDisabled }} className={cn('h-12 w-12 items-center justify-center rounded border active:opacity-80', focusRing, iconVariants[variant], isDisabled && 'opacity-50', className)}>{children}</Pressable>;
});

export interface LinkProps extends Omit<PressableProps, 'children'> {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  textClassName?: string;
  textVariant?: TextVariant;
  /** Called when the operating system cannot open a native URL. */
  onOpenError?: (error: unknown) => void;
}
type WebLinkProps = PressableProps & { href?: string; hrefAttrs?: { target?: string; rel?: string } };
const LinkPressable = Pressable as typeof Pressable & ((props: WebLinkProps) => ReactNode);

export const Link = forwardRef<ElementRef<typeof Pressable>, LinkProps>(function Link({ href, children, external = false, className, textClassName, textVariant, disabled, onPress, onOpenError, accessibilityState, 'aria-disabled': ariaDisabled, ...props }, ref) {
  const isDisabled = disabled || (ariaDisabled ?? accessibilityState?.disabled ?? false);
  const webProps = Platform.OS === 'web' && !isDisabled ? { href, hrefAttrs: external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined } : {};
  return <LinkPressable {...props} {...webProps} ref={ref} accessibilityRole="link" disabled={isDisabled} aria-disabled={isDisabled} accessibilityState={{ ...accessibilityState, disabled: isDisabled }} className={cn('min-h-[44px] min-w-[44px] justify-center self-start', focusRing, isDisabled && 'opacity-50', className)} onPress={(event) => {
    onPress?.(event);
    if (Platform.OS !== 'web' && !event.isDefaultPrevented()) void Linking.openURL(href).catch((error: unknown) => onOpenError?.(error));
  }}><Text variant={textVariant} className={cn('text-ui-link underline', textClassName)}>{children}</Text></LinkPressable>;
});
