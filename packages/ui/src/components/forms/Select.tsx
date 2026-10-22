'use client';

import { forwardRef, useEffect, useId, useState, type ElementRef } from 'react';
import { Platform, Pressable, View, type PressableProps } from 'react-native';
import { NativeText as Text } from '../../internal/native-text';
import { cn, focusRing, useControllableState } from '../../internal/utils';
import { Dialog } from '../overlays';
import { useFormField } from './FormField';
import type { RadioOption } from './RadioGroup';
import { useSelectionNavigation } from './selection';

export type SelectOption = RadioOption;
export interface SelectProps extends Omit<PressableProps, 'children'> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  className?: string;
  textClassName?: string;
}

/** A labelled button opens a single-choice dialog on web and native. */
export const Select = forwardRef<ElementRef<typeof Pressable>, SelectProps>(function Select({
  options, value, defaultValue, onValueChange, label, placeholder = 'Choose an option',
  required, invalid, disabled, className, textClassName, nativeID, testID, onPress,
  accessibilityLabel, accessibilityHint, accessibilityState, 'aria-label': ariaLabel, 'aria-disabled': ariaDisabled, ...props
}, ref) {
  const field = useFormField();
  const generatedID = useId().replace(/:/g, '');
  const id = nativeID ?? field?.controlID ?? `bui-select-${generatedID}`;
  const isDisabled = Boolean(disabled || ariaDisabled || accessibilityState?.disabled || field?.disabled);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isRequired = required ?? field?.required ?? false;
  const [selected, setSelected] = useControllableState<string | undefined>({ value, defaultValue,
    onChange: (next) => { if (next !== undefined) onValueChange?.(next); },
  });
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(selected);
  useEffect(() => { if (isDisabled) setOpen(false); }, [isDisabled]);
  const selectedOption = options.find((option) => option.value === selected);
  const title = label ?? field?.label ?? 'Choose an option';
  const labelID = label ? `${id}-label` : field?.labelID;
  const explicitLabel = accessibilityLabel ?? ariaLabel;
  const hint = [accessibilityHint ?? field?.hint, field?.error && `Error: ${field.error}`,
    isRequired && 'Required', 'Opens a list of choices'].filter(Boolean).join('. ');
  const commit = (next: string) => {
    if (isDisabled || !options.some((option) => option.value === next && !option.disabled)) return;
    setSelected(next);
    setOpen(false);
  };
  const navigation = useSelectionNavigation(options, pending, setPending, 'vertical', isDisabled, commit);

  return <View className="gap-2">
    {label ? <Text nativeID={labelID} className="text-base font-semibold text-ui-text">{label}</Text> : null}
    <Pressable {...props} ref={ref} nativeID={id} testID={testID} accessibilityRole="button"
      accessibilityLabel={explicitLabel ?? (Platform.OS === 'web' ? undefined : `${title}: ${selectedOption?.label ?? placeholder}`)}
      accessibilityHint={hint} accessibilityState={{ ...accessibilityState, disabled: isDisabled, expanded: open }}
      aria-disabled={isDisabled} aria-expanded={open} disabled={isDisabled}
      {...(Platform.OS === 'web' ? { 'aria-haspopup': 'dialog',
        'aria-labelledby': !explicitLabel && labelID ? `${labelID} ${id}-value` : undefined,
        'aria-describedby': field?.descriptionID, 'aria-invalid': isInvalid } : {})}
      onPress={(event) => { if (!isDisabled) { setPending(selected); setOpen(true); } onPress?.(event); }}
      className={cn('min-h-[48px] flex-row items-center justify-between gap-4 rounded-[4px] border border-ui-border bg-ui-surface px-3 py-3',
        focusRing, isInvalid && 'border-ui-error', isDisabled && 'bg-ui-disabled-surface', className)}>
      <Text nativeID={`${id}-value`} className={cn('min-w-0 flex-1 text-base', selectedOption ? 'text-ui-text' : 'text-ui-muted',
        isDisabled && 'text-ui-disabled-text', textClassName)}>{selectedOption?.label ?? placeholder}</Text>
      <View accessible={false} importantForAccessibility="no-hide-descendants"
        className="mr-1 h-2 w-2 rotate-45 border-b-2 border-r-2 border-ui-muted" />
    </Pressable>
    <Dialog open={open} onOpenChange={setOpen} title={title} closeLabel="Cancel"
      testID={testID ? `${testID}-dialog` : undefined}>
      <View accessibilityRole="radiogroup" accessibilityLabel={title}
        {...(Platform.OS === 'web' ? { 'aria-required': isRequired } : {})} className="gap-1">
        {options.map((option, index) => {
          const checked = pending === option.value;
          const optionID = `${id}-option-${index}`;
          return <Pressable key={option.value} {...navigation(index)} nativeID={optionID}
            testID={testID ? `${testID}-option-${option.value}` : undefined}
            accessibilityRole="radio" accessibilityLabel={option.label} accessibilityHint={option.description}
            accessibilityState={{ checked, disabled: Boolean(option.disabled) }}
            aria-checked={checked} aria-disabled={Boolean(option.disabled)} disabled={option.disabled}
            {...(Platform.OS === 'web' ? { 'aria-describedby': option.description ? `${optionID}-description` : undefined } : {})}
            onPress={() => commit(option.value)} className={cn('min-h-[48px] min-w-[44px] flex-row items-center gap-3 rounded-[4px] px-3 py-3',
              focusRing, checked && 'bg-ui-selected', option.disabled && 'opacity-50')}>
            <View accessible={false} importantForAccessibility="no-hide-descendants"
              className={cn('h-5 w-5 items-center justify-center rounded-full border-2 border-ui-border', checked && 'border-bubba-red')}>
              {checked ? <View className="h-2.5 w-2.5 rounded-full bg-bubba-red" /> : null}
            </View>
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-base font-medium text-ui-text">{option.label}</Text>
              {option.description ? <Text nativeID={`${optionID}-description`} className="text-sm leading-5 text-ui-muted">{option.description}</Text> : null}
            </View>
          </Pressable>;
        })}
        {options.length === 0 ? <Text className="px-3 py-4 text-base text-ui-muted">No options available.</Text> : null}
      </View>
    </Dialog>
  </View>;
});
