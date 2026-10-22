'use client';

import { forwardRef, type ElementRef, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { NativeText as Text } from '../internal/native-text';
import { cn, focusRing } from '../internal/utils';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'className'> {
  /** Text content, or inline React Native Text content. */
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  textClassName?: string;
}

const containerVariants: Record<ButtonVariant, string> = {
  primary: 'border-ui-action-border bg-ui-primary hover:bg-ui-primary-hover active:bg-ui-primary-hover',
  secondary: 'border-ui-border bg-ui-selected',
  outline: 'border-ui-border bg-transparent',
  ghost: 'border-transparent bg-transparent',
};
const textVariants: Record<ButtonVariant, string> = {
  primary: 'text-ui-action-text',
  secondary: 'text-ui-text',
  outline: 'text-ui-text',
  ghost: 'text-ui-link',
};
const containerSizes: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-3 py-2',
  md: 'min-h-[48px] px-5 py-3',
  lg: 'min-h-[56px] px-6 py-4',
};
const textSizes: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/** One native Pressable and Text implementation on iOS, Android, and web. */
export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingLabel,
      disabled = false,
      className,
      textClassName,
      accessibilityState,
      'aria-busy': ariaBusy,
      'aria-disabled': ariaDisabled,
      ...props
    },
    ref,
  ) {
    const { colors } = useTheme();
    const explicitlyDisabled = disabled || (ariaDisabled ?? accessibilityState?.disabled ?? false);
    const isDisabled = explicitlyDisabled || loading;
    const isBusy = loading || (ariaBusy ?? accessibilityState?.busy ?? false);
    const spinnerColor = explicitlyDisabled
      ? colors['disabled-text']
      : variant === 'primary' ? colors['action-text'] : colors.text;

    return (
      <Pressable
        {...props}
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: isBusy }}
        aria-busy={isBusy}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        className={cn(
          'min-w-[44px] flex-row items-center justify-center gap-2 rounded-[4px] border active:opacity-80',
          focusRing,
          containerVariants[variant],
          containerSizes[size],
          explicitlyDisabled && 'border-ui-disabled-surface bg-ui-disabled-surface',
          className,
        )}
      >
        {loading ? <ActivityIndicator size="small" color={spinnerColor} accessible={false} /> : null}
        <Text
          className={cn(
            'font-bold text-center',
            textVariants[variant],
            textSizes[size],
            explicitlyDisabled && 'text-ui-disabled-text',
            textClassName,
          )}
        >
          {loading && loadingLabel ? loadingLabel : children}
        </Text>
      </Pressable>
    );
  },
);
