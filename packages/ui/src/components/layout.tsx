'use client';

import { forwardRef, type ElementRef } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../internal/utils';

const gaps = { 0: 'gap-0', 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 6: 'gap-6', 8: 'gap-8', 12: 'gap-12', 16: 'gap-16' };
const alignments = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' };
const justifications = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' };
export interface StackProps extends ViewProps {
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
  justify?: keyof typeof justifications;
  className?: string;
}
export const Stack = forwardRef<ElementRef<typeof View>, StackProps>(function Stack({ gap = 4, align = 'stretch', justify = 'start', className, ...props }, ref) {
  return <View {...props} ref={ref} className={cn('flex-col', gaps[gap], alignments[align], justifications[justify], className)} />;
});
export interface InlineProps extends StackProps { wrap?: boolean }
export const Inline = forwardRef<ElementRef<typeof View>, InlineProps>(function Inline({ gap = 3, align = 'center', justify = 'start', wrap = true, className, ...props }, ref) {
  return <View {...props} ref={ref} className={cn('flex-row', gaps[gap], alignments[align], justifications[justify], wrap ? 'flex-wrap' : 'flex-nowrap', className)} />;
});
export interface ContainerProps extends ViewProps { reading?: boolean; width?: 'standard' | 'wide'; className?: string }
export const Container = forwardRef<ElementRef<typeof View>, ContainerProps>(function Container({ reading = false, width = 'standard', className, ...props }, ref) {
  return <View {...props} ref={ref} className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', reading ? 'max-w-[720px]' : width === 'wide' ? 'max-w-[1600px] px-4 sm:px-4 lg:px-4' : 'max-w-[1200px]', className)} />;
});
export interface CardProps extends ViewProps { className?: string; padding?: keyof typeof gaps }
const paddings = { 0: 'p-0', 1: 'p-1', 2: 'p-2', 3: 'p-3', 4: 'p-4', 6: 'p-6', 8: 'p-8', 12: 'p-12', 16: 'p-16' };
export const Card = forwardRef<ElementRef<typeof View>, CardProps>(function Card({ padding = 6, className, ...props }, ref) {
  return <View {...props} ref={ref} className={cn('rounded-xl border border-ui-line bg-ui-surface', paddings[padding], className)} />;
});
export interface DividerProps extends ViewProps { orientation?: 'horizontal' | 'vertical'; className?: string }
export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  return <View {...props} accessible={false} className={cn('bg-ui-line', orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch', className)} />;
}
