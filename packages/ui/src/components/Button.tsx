'use client';

import { forwardRef, type ElementRef, type ReactNode } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, type PressableProps } from 'react-native';
import { NativeText as Text } from '../internal/native-text';
import { cn, focusRing } from '../internal/utils';
import { useTheme } from '../theme';
import { tokens } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'className'> {
  /** Text content, or inline React Native Text content. */
  children: ReactNode;
  dataSet?: Record<string,string>;
  /** A navigational action; web renders an anchor, native opens through Linking. */
  href?: string;
  external?: boolean;
  /** Native web form intent in @bubbasfw/ui/web. The root native entry is an app action. */
  type?: 'button' | 'submit' | 'reset';
  onOpenError?: (error: unknown) => void;
  variant?: ButtonVariant;
  /** Fixed-brand action; secondary is blue. Size lg is a featured hero action. */
  appearance?: 'default' | 'marketing';
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
const marketingContainerSizes: Record<ButtonSize,string> = {
 sm:'min-h-[48px] rounded-[6px] px-3 py-2',
 md:'min-h-[48px] rounded-[6px] px-4 py-2.5',
 lg:'min-h-[48px] rounded-xl px-5 py-3 min-[761px]:min-h-[60px] min-[761px]:px-[26px] min-[761px]:py-4',
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
      href, external = false, type = 'button', onOpenError, onPress,
      variant = 'primary',
      appearance = 'default',
      size = 'md',
      loading = false,
      loadingLabel,
      disabled = false,
      className,
      textClassName,
      style,
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
      : appearance === 'marketing' && (variant === 'primary' || variant === 'secondary') ? '#FFFFFF' : variant === 'primary' ? colors['action-text'] : colors.text;

    return (
      <Pressable
        {...props}
        ref={ref}
        {...{dataSet:{...props.dataSet, ...(appearance === 'marketing' ? {bubbaAction: variant,bubbaActionSize:size} : {})}}}
        {...(Platform.OS === 'web' ? { type, href: isDisabled ? undefined : href,
          hrefAttrs: href && external ? { target: '_blank', rel: 'noopener noreferrer' } : undefined } : {})}
        style={appearance === 'marketing' && Platform.OS !== 'web' ? (state) => [
          !isDisabled && (variant === 'primary' || variant === 'secondary')
            ? { shadowColor: variant === 'secondary' ? tokens.colors.blue : tokens.colors.red,
                shadowOpacity: .22, shadowRadius: 9, shadowOffset: { width: 0, height: 5 }, elevation: 4 }
            : undefined,
          typeof style === 'function' ? style(state) : style,
        ] : style}
        accessibilityRole={href ? 'link' : 'button'}
        onPress={(event) => {
          onPress?.(event);
          if (href && Platform.OS !== 'web' && !isDisabled && !event.isDefaultPrevented()) void Linking.openURL(href).catch((error: unknown) => onOpenError?.(error));
        }}
        accessibilityState={{ ...accessibilityState, disabled: isDisabled, busy: isBusy }}
        aria-busy={isBusy}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        className={cn(
          'min-w-[44px] flex-row items-center justify-center gap-2 rounded-[4px] border active:opacity-80',
          focusRing,
          containerVariants[variant],
          containerSizes[size],
          appearance === 'marketing' && marketingContainerSizes[size],
          appearance === 'marketing' && variant === 'primary' && 'border-bubba-red bg-bubba-red hover:bg-bubba-redHover',
          appearance === 'marketing' && variant === 'secondary' && 'border-bubba-blue bg-bubba-blue hover:bg-bubba-navy',
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
            appearance === 'marketing' && 'bubba-action-label font-extrabold uppercase tracking-wide',
            appearance === 'marketing' && (size==='lg'?'text-base leading-5 tracking-normal min-[761px]:text-lg min-[761px]:leading-[22px] min-[761px]:tracking-wide':'text-sm leading-5'),
            appearance === 'marketing' && (variant === 'primary' || variant === 'secondary') && 'text-white',
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
