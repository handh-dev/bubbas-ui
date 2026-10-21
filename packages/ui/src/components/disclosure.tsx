'use client';

import { useId, type ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn, focusRing, useControllableState } from '../internal/utils';
import { Text } from './typography';

export interface AccordionItem { value: string; title: string; content: ReactNode; disabled?: boolean }
export interface AccordionProps extends ViewProps {
  items: AccordionItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

/** Single-open disclosure. An empty value collapses every section. */
export function Accordion({ items, value, defaultValue = '', onValueChange, className, ...props }: AccordionProps) {
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const id = useId();
  return <View {...props} className={className}>{items.map((item, index) => {
    const expanded = selected === item.value;
    const triggerID = `${id}-trigger-${index}`;
    const panelID = `${id}-panel-${index}`;
    return <View key={item.value} className="border-b border-ui-line">
      <Pressable nativeID={triggerID} accessibilityRole="button" accessibilityLabel={item.title} accessibilityState={{ expanded, disabled: item.disabled }} aria-expanded={expanded} aria-disabled={item.disabled} {...{ 'aria-controls': expanded ? panelID : undefined }} disabled={item.disabled} onPress={() => setSelected(expanded ? '' : item.value)} className={cn('min-h-[48px] min-w-[44px] flex-row items-center justify-between gap-4 py-3', focusRing, item.disabled && 'opacity-50')}>
        <Text className="flex-1 font-semibold">{item.title}</Text>
        <View accessible={false} className={cn('mr-1 h-2 w-2 border-b-2 border-r-2 border-ui-text', expanded ? 'rotate-[225deg]' : 'rotate-45')} />
      </Pressable>
      {expanded ? <View nativeID={panelID} aria-labelledby={triggerID} className="gap-3 pb-4">{item.content}</View> : null}
    </View>;
  })}</View>;
}
