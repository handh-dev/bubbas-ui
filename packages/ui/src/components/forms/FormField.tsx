'use client';

import { createContext, forwardRef, useContext, useId, type ElementRef, type ReactNode } from 'react';
import { Platform, Text, View, type ViewProps } from 'react-native';
import { cn } from '../../internal/utils';

interface FieldContextValue {
  controlID: string;
  labelID: string;
  label: string;
  descriptionID?: string;
  hint?: string;
  error?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined);
export function useFormField() { return useContext(FieldContext); }

export interface FormFieldProps extends ViewProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Opt into announcing errors that change during interaction. */
  announceError?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

/** Associates a visible label, hint, and error with the enclosed form control. */
export const FormField = forwardRef<ElementRef<typeof View>, FormFieldProps>(function FormField({ label, hint, error, required = false, disabled = false,
  announceError = false, children, nativeID, className, labelClassName, ...props }, ref) {
  const generatedID = useId().replace(/:/g, '');
  const id = nativeID ?? `bui-field-${generatedID}`;
  const descriptionID = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const field: FieldContextValue = { controlID: `${id}-control`, labelID: `${id}-label`,
    label, descriptionID, hint, error, invalid: Boolean(error), required, disabled };

  return (
    <FieldContext.Provider value={field}>
      <View {...props} ref={ref} nativeID={nativeID} className={cn('gap-2', className)}>
        <Text nativeID={field.labelID} className={cn('text-base font-semibold text-ui-text', labelClassName)}>
          {label}{required ? ' *' : ''}
        </Text>
        {children}
        {hint ? <Text nativeID={`${id}-hint`} className="text-sm leading-5 text-ui-muted">{hint}</Text> : null}
        {error ? <Text nativeID={`${id}-error`} accessibilityLiveRegion={announceError ? 'polite' : 'none'}
          {...(Platform.OS === 'web' ? { 'aria-live': announceError ? 'polite' as const : 'off' as const } : {})}
          className="text-sm leading-5 text-ui-error">{error}</Text> : null}
      </View>
    </FieldContext.Provider>
  );
});
