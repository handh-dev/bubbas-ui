'use client';

import { forwardRef } from 'react';
import { Platform, TextInput, type TextInputProps } from 'react-native';
import { cn, focusRing } from '../../internal/utils';
import { useTheme } from '../../theme';
import { useFormField } from './FormField';

export interface InputProps extends TextInputProps {
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string;
}

/** Native TextInput with field association and matching light/dark paint. */
export const Input = forwardRef<TextInput, InputProps>(function Input({ disabled, invalid, required,
  readOnly = false, editable, className, style, nativeID, accessibilityLabel, accessibilityHint,
  accessibilityState, 'aria-label': ariaLabel, 'aria-disabled': ariaDisabled, placeholderTextColor, selectionColor, ...props }, ref) {
  const field = useFormField();
  const { colors, fontFamily } = useTheme();
  const isDisabled = Boolean(disabled || ariaDisabled || accessibilityState?.disabled || field?.disabled);
  const isReadOnly = readOnly || (editable === false && !isDisabled);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isRequired = required ?? field?.required ?? false;
  const explicitLabel = accessibilityLabel ?? ariaLabel;
  const nativeHint = [accessibilityHint ?? field?.hint, field?.error && `Error: ${field.error}`,
    isRequired && 'Required', isReadOnly && 'Read only'].filter(Boolean).join('. ') || undefined;
  const webProps = Platform.OS === 'web' ? {
    disabled: isDisabled,
    readOnly: isReadOnly,
    'aria-describedby': field?.descriptionID,
    'aria-labelledby': explicitLabel ? undefined : field?.labelID,
    'aria-invalid': isInvalid,
    'aria-required': isRequired,
    'aria-readonly': isReadOnly || undefined,
  } : {};

  return <TextInput {...props} {...webProps} ref={ref} nativeID={nativeID ?? field?.controlID}
    accessibilityLabel={explicitLabel ?? (Platform.OS === 'web' ? undefined : field?.label)}
    accessibilityHint={nativeHint} accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
    aria-disabled={isDisabled} editable={!isDisabled && !isReadOnly}
    placeholderTextColor={placeholderTextColor ?? colors.muted} selectionColor={selectionColor ?? colors.selection}
    style={[fontFamily ? { fontFamily } : undefined, style]}
    className={cn('min-h-[48px] rounded-[4px] border border-ui-border bg-ui-surface px-3 py-3 text-base text-ui-text',
      focusRing, isInvalid && 'border-ui-error', isDisabled && 'bg-ui-disabled-surface text-ui-disabled-text', className)} />;
});

export interface TextareaProps extends InputProps { }

/** A multiline Input; numberOfLines and style/minHeight remain native props. */
export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea({ className,
  numberOfLines = 4, textAlignVertical = 'top', ...props }, ref) {
  return <Input {...props} ref={ref} multiline numberOfLines={numberOfLines} textAlignVertical={textAlignVertical}
    className={cn('min-h-[120px]', className)} />;
});
