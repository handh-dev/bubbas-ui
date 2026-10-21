'use client';

import { forwardRef, useId, type ElementRef } from 'react';
import { Platform, Pressable, Text, View, type ViewProps } from 'react-native';
import { cn, focusRing, useControllableState } from '../../internal/utils';
import { useFormField } from './FormField';
import { useSelectionNavigation } from './selection';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<ViewProps, 'children'> {
  options: readonly RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  optionClassName?: string;
  textClassName?: string;
}

/** Single selection with roving web focus and native radio accessibility. */
export const RadioGroup = forwardRef<ElementRef<typeof View>, RadioGroupProps>(function RadioGroup({
  options, value, defaultValue, onValueChange, label, disabled = false, required, invalid,
  orientation = 'vertical', className, optionClassName, textClassName, nativeID,
  accessibilityLabel, accessibilityHint, accessibilityState, 'aria-label': ariaLabel, 'aria-disabled': ariaDisabled, ...props
}, ref) {
  const field = useFormField();
  const generatedID = useId().replace(/:/g, '');
  const id = nativeID ?? field?.controlID ?? `bui-radio-${generatedID}`;
  const isDisabled = Boolean(disabled || ariaDisabled || accessibilityState?.disabled || field?.disabled);
  const isRequired = required ?? field?.required ?? false;
  const isInvalid = invalid ?? field?.invalid ?? false;
  const [selected, setSelected] = useControllableState<string | undefined>({
    value, defaultValue, onChange: (next) => { if (next !== undefined) onValueChange?.(next); },
  });
  const select = (next: string) => {
    if (!isDisabled && options.some((option) => option.value === next && !option.disabled)) setSelected(next);
  };
  const navigation = useSelectionNavigation(options, selected, select, orientation, isDisabled);
  const labelID = label ? `${id}-label` : field?.labelID;
  const explicitLabel = accessibilityLabel ?? ariaLabel;
  const name = explicitLabel ?? label ?? field?.label;
  const hint = [accessibilityHint ?? field?.hint, field?.error && `Error: ${field.error}`,
    isRequired && 'Required'].filter(Boolean).join('. ') || undefined;

  return <View {...props} ref={ref} nativeID={id} className={cn('gap-2', className)}>
    {label ? <Text nativeID={labelID} className="text-base font-semibold text-ui-text">{label}</Text> : null}
    <View accessibilityRole="radiogroup" accessibilityLabel={Platform.OS === 'web' && labelID && !explicitLabel ? undefined : name}
      accessibilityHint={hint} accessibilityState={{ ...accessibilityState, disabled: isDisabled }} aria-disabled={isDisabled}
      {...(Platform.OS === 'web' ? { 'aria-labelledby': explicitLabel ? undefined : labelID,
        'aria-describedby': field?.descriptionID, 'aria-required': isRequired, 'aria-invalid': isInvalid,
        'aria-orientation': orientation } : {})}
      className={cn('gap-1', orientation === 'horizontal' && 'flex-row flex-wrap gap-x-6')}>
      {options.map((option, index) => {
        const checked = selected === option.value;
        const optionDisabled = isDisabled || Boolean(option.disabled);
        const optionID = `${id}-option-${index}`;
        return <Pressable key={option.value} {...navigation(index)} nativeID={optionID}
          accessibilityRole="radio" accessibilityLabel={option.label} accessibilityHint={option.description}
          accessibilityState={{ checked, disabled: optionDisabled }} aria-checked={checked} aria-disabled={optionDisabled}
          {...(Platform.OS === 'web' ? { 'aria-describedby': option.description ? `${optionID}-description` : undefined } : {})}
          disabled={optionDisabled} onPress={() => select(option.value)}
          className={cn('min-h-[44px] min-w-[44px] flex-row items-center gap-3 rounded-[4px] py-2',
            focusRing, optionDisabled && 'opacity-50', optionClassName)}>
          <View accessible={false} importantForAccessibility="no-hide-descendants"
            className={cn('h-5 w-5 items-center justify-center rounded-full border-2 border-ui-border', checked && 'border-bubba-red')}>
            {checked ? <View className="h-2.5 w-2.5 rounded-full bg-bubba-red" /> : null}
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className={cn('text-base font-medium text-ui-text', textClassName)}>{option.label}</Text>
            {option.description ? <Text nativeID={`${optionID}-description`} className="text-sm leading-5 text-ui-muted">{option.description}</Text> : null}
          </View>
        </Pressable>;
      })}
    </View>
  </View>;
});
