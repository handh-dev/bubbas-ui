'use client';

import { forwardRef, useId, type ElementRef, type KeyboardEvent, type SyntheticEvent } from 'react';
import { Platform, Pressable, View, type GestureResponderEvent, type PressableProps } from 'react-native';
import { NativeText as Text } from '../../internal/native-text';
import { cn, focusRing, useControllableState } from '../../internal/utils';
import { useFormField } from './FormField';

/** RNW's Enter activation forwards a raw DOM keyup, without React event methods. */
export interface ChoiceDOMKeyboardEvent {
  readonly key: string;
  readonly code: string;
  readonly repeat: boolean;
  readonly type: string;
  readonly defaultPrevented: boolean;
  readonly target: unknown;
  readonly currentTarget: unknown;
  preventDefault(): void;
  stopPropagation(): void;
}
export type ChoicePressEvent = GestureResponderEvent | SyntheticEvent<unknown, unknown> | ChoiceDOMKeyboardEvent;
export interface ChoiceProps extends Omit<PressableProps, 'children' | 'onPress'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Web supplies React keyboard events for Space and raw DOM keyup for Enter. */
  onPress?: ((event: ChoicePressEvent) => void) | null;
  label?: string;
  description?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
  textClassName?: string;
}

export interface CheckboxProps extends ChoiceProps {
  /** A mixed checkbox becomes checked on its next activation. */
  indeterminate?: boolean;
}
export interface SwitchProps extends ChoiceProps { }

interface ChoiceControlProps extends CheckboxProps { kind: 'checkbox' | 'switch' }

/** RNW Pressable handles Enter; non-button roles need an explicit Space handler. */
function spaceKeyHandler(disabled: boolean, activate: (event: KeyboardEvent<unknown>) => void) {
  return Platform.OS === 'web' ? {
    onKeyDown(event: KeyboardEvent<unknown>) {
      const key = event.key;
      if (key === ' ' || key === 'Spacebar') {
        event.preventDefault();
        if (!disabled && !event.repeat) activate(event);
      }
    },
  } : {};
}

const ChoiceControl = forwardRef<ElementRef<typeof Pressable>, ChoiceControlProps>(function ChoiceControl({
  kind, checked, defaultChecked = false, onCheckedChange, indeterminate = false, label, description, invalid, required,
  disabled, className, textClassName, onPress, accessibilityLabel, accessibilityHint, accessibilityState,
  'aria-label': ariaLabel, 'aria-disabled': ariaDisabled, nativeID, ...props
}, ref) {
  const field = useFormField();
  const generatedID = useId().replace(/:/g, '');
  const id = nativeID ?? field?.controlID ?? `bui-choice-${generatedID}`;
  const isDisabled = Boolean(disabled || ariaDisabled || accessibilityState?.disabled || field?.disabled);
  const [isChecked, setChecked] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const mixed = kind === 'checkbox' && indeterminate;
  const state = mixed ? 'mixed' : isChecked;
  const name = accessibilityLabel ?? ariaLabel ?? label ?? field?.label;
  const isRequired = required ?? field?.required ?? false;
  const isInvalid = invalid ?? field?.invalid ?? false;
  const hint = [accessibilityHint ?? description ?? field?.hint, field?.error && `Error: ${field.error}`,
    isRequired && 'Required'].filter(Boolean).join('. ') || undefined;
  const activate = (event: ChoicePressEvent) => {
    if (isDisabled) return;
    setChecked(mixed || !isChecked);
    onPress?.(event);
  };
  const descriptions = [description && `${id}-description`, field?.descriptionID].filter(Boolean).join(' ') || undefined;

  return <Pressable {...props} {...spaceKeyHandler(isDisabled, activate)} ref={ref} nativeID={id}
    accessibilityRole={kind} accessibilityLabel={name} accessibilityHint={hint}
    accessibilityState={{ ...accessibilityState, checked: state, disabled: isDisabled }}
    aria-checked={state} aria-disabled={isDisabled} disabled={isDisabled}
    {...(Platform.OS === 'web' ? { 'aria-describedby': descriptions, 'aria-required': isRequired,
      'aria-invalid': isInvalid } : {})}
    onPress={activate}
    className={cn('min-h-[44px] min-w-[44px] flex-row items-center gap-3 rounded-[4px] py-2', focusRing,
      isDisabled && 'opacity-50', className)}>
    {kind === 'checkbox' ? <View accessible={false} importantForAccessibility="no-hide-descendants"
      className={cn('h-5 w-5 items-center justify-center rounded-[4px] border-2 border-ui-border',
        (isChecked || mixed) && 'border-bubba-red bg-bubba-red', isInvalid && 'border-ui-error')}>
      {mixed ? <View className="h-0.5 w-3 bg-white" /> : isChecked ?
        <View className="h-[10px] w-[6px] -translate-y-px rotate-45 border-b-2 border-r-2 border-white" /> : null}
    </View> : <View accessible={false} importantForAccessibility="no-hide-descendants"
      className={cn('h-[26px] w-[44px] rounded-full border border-ui-border bg-ui-selected p-[2px]',
        isChecked && 'border-bubba-red bg-bubba-red', isInvalid && 'border-ui-error')}>
      <View className={cn('h-5 w-5 rounded-full', isChecked ? 'translate-x-[18px] bg-white' : 'translate-x-0 bg-ui-muted')} />
    </View>}
    {label || description ? <View className="min-w-0 flex-1 gap-1">
      {label ? <Text className={cn('text-base font-medium text-ui-text', textClassName)}>{label}</Text> : null}
      {description ? <Text nativeID={`${id}-description`} className="text-sm leading-5 text-ui-muted">{description}</Text> : null}
    </View> : null}
  </Pressable>;
});

export const Checkbox = forwardRef<ElementRef<typeof Pressable>, CheckboxProps>(function Checkbox(props, ref) {
  return <ChoiceControl {...props} ref={ref} kind="checkbox" />;
});

export const Switch = forwardRef<ElementRef<typeof Pressable>, SwitchProps>(function Switch(props, ref) {
  return <ChoiceControl {...props} ref={ref} kind="switch" />;
});
