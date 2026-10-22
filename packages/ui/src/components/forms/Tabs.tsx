'use client';

import { forwardRef, useId, type ElementRef, type ReactNode } from 'react';
import { Platform, Pressable, View, type ViewProps } from 'react-native';
import { NativeText as Text } from '../../internal/native-text';
import { cn, focusRing, useControllableState } from '../../internal/utils';
import { useSelectionNavigation } from './selection';

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<ViewProps, 'children'> {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  textClassName?: string;
  panelClassName?: string;
}

/** Automatically activates tabs with arrow keys; inactive panels are unmounted. */
export const Tabs = forwardRef<ElementRef<typeof View>, TabsProps>(function Tabs({
  items, value, defaultValue, onValueChange, label = 'Content sections', orientation = 'horizontal',
  className, tabListClassName, tabClassName, textClassName, panelClassName, nativeID, ...props
}, ref) {
  const generatedID = useId().replace(/:/g, '');
  const id = nativeID ?? `bui-tabs-${generatedID}`;
  const [selected, setSelected] = useControllableState<string | undefined>({ value,
    defaultValue: defaultValue ?? items.find((item) => !item.disabled)?.value,
    onChange: (next) => { if (next !== undefined) onValueChange?.(next); },
  });
  const select = (next: string) => {
    if (items.some((item) => item.value === next && !item.disabled)) setSelected(next);
  };
  const navigation = useSelectionNavigation(items, selected, select, orientation);
  const activeIndex = items.findIndex((item) => item.value === selected && !item.disabled);
  const active = items[activeIndex];

  return <View {...props} ref={ref} nativeID={id} className={cn('gap-4', className)}>
    <View accessibilityRole="tablist" accessibilityLabel={label}
      {...(Platform.OS === 'web' ? { 'aria-orientation': orientation } : {})}
      className={cn('gap-1 rounded-md border border-ui-border bg-ui-selected p-1',
        orientation === 'horizontal' && 'flex-row flex-wrap', tabListClassName)}>
      {items.map((item, index) => {
        const isSelected = index === activeIndex;
        return <Pressable key={item.value} {...navigation(index)} nativeID={`${id}-tab-${index}`}
          accessibilityRole="tab" accessibilityLabel={item.label}
          accessibilityState={{ selected: isSelected, disabled: Boolean(item.disabled) }}
          aria-selected={isSelected} aria-disabled={Boolean(item.disabled)} disabled={item.disabled}
          {...(Platform.OS === 'web' ? { 'aria-controls': isSelected ? `${id}-panel-${index}` : undefined } : {})}
          onPress={() => select(item.value)} className={cn('min-h-[44px] min-w-[44px] items-center justify-center rounded-[4px] px-4 py-2',
            focusRing, isSelected && 'bg-ui-surface', item.disabled && 'opacity-50', tabClassName)}>
          <Text className={cn('text-base font-semibold', isSelected ? 'text-ui-text' : 'text-ui-muted', textClassName)}>{item.label}</Text>
        </Pressable>;
      })}
    </View>
    {active ? <View key={active.value} nativeID={`${id}-panel-${activeIndex}`} role="tabpanel"
      accessibilityLabel={Platform.OS === 'web' ? undefined : active.label} tabIndex={0}
      {...(Platform.OS === 'web' ? { 'aria-labelledby': `${id}-tab-${activeIndex}` } : {})}
      className={cn('rounded-[4px]', focusRing, panelClassName)}>{active.content}</View> : null}
  </View>;
});
