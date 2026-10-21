'use client';

import { forwardRef, type ElementRef, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { tokens } from '../tokens';

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
  primary: 'border-bubba-red bg-bubba-red',
  secondary: 'border-bubba-navy bg-bubba-navy',
  outline: 'border-bubba-navy bg-transparent',
  ghost: 'border-transparent bg-transparent',
};
const textVariants: Record<ButtonVariant, string> = {
  primary: 'text-bubba-white',
  secondary: 'text-bubba-white',
  outline: 'text-bubba-navy',
  ghost: 'text-bubba-navy',
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
    const explicitlyDisabled = disabled || (ariaDisabled ?? accessibilityState?.disabled ?? false);
    const isDisabled = explicitlyDisabled || loading;
    const isBusy = loading || (ariaBusy ?? accessibilityState?.busy ?? false);
    const spinnerColor = explicitlyDisabled
      ? tokens.colors.disabledText
      : variant === 'primary' || variant === 'secondary'
        ? tokens.colors.white
        : tokens.colors.navy;

    return (
      <Pressable
        {...props}
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: isBusy }}
        aria-busy={isBusy}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        className={twMerge(
          'min-w-[44px] flex-row items-center justify-center gap-2 rounded-[4px] border active:opacity-80 web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-offset-2 web:focus-visible:outline-bubba-navy',
          containerVariants[variant],
          containerSizes[size],
          explicitlyDisabled && 'border-bubba-disabled bg-bubba-disabled',
          className,
        )}
      >
        {loading ? <ActivityIndicator size="small" color={spinnerColor} accessible={false} /> : null}
        <Text
          className={twMerge(
            'font-bold text-center',
            textVariants[variant],
            textSizes[size],
            explicitlyDisabled && 'text-bubba-disabledText',
            textClassName,
          )}
        >
          {loading && loadingLabel ? loadingLabel : children}
        </Text>
      </Pressable>
    );
  },
);
