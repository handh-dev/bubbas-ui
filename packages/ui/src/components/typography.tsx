'use client';

import { forwardRef, type ElementRef } from 'react';
import { Platform, type TextProps as NativeTextProps } from 'react-native';
import { NativeText } from '../internal/native-text';
import { cn } from '../internal/utils';

export type TextTone = 'default' | 'muted' | 'info' | 'success' | 'warning' | 'error';
export type TextVariant = 'body' | 'lead' | 'small' | 'label' | 'caption' | 'code';
const tones = { default: 'text-ui-text', muted: 'text-ui-muted', info: 'text-ui-info', success: 'text-ui-success', warning: 'text-ui-warning', error: 'text-ui-error' };
const variants = { body: 'font-normal text-bubba-body bubba-wide:text-bubba-body-wide', lead: 'text-lg leading-7', small: 'font-medium text-bubba-supporting', label: 'font-bold text-bubba-label', caption: 'text-xs leading-4', code: 'font-mono text-sm leading-6' };

export interface TextProps extends NativeTextProps {
  tone?: TextTone;
  variant?: TextVariant;
  className?: string;
}

export const Text = forwardRef<ElementRef<typeof NativeText>, TextProps>(function Text({ tone = 'default', variant = 'body', className, ...props }, ref) {
  return <NativeText {...props} ref={ref} inheritFont={variant !== 'code'} className={cn(variants[variant], tones[tone], className)} />;
});

export interface HeadingProps extends NativeTextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}
const levels = { 1: 'text-bubba-page bubba-wide:text-bubba-page-wide', 2: 'text-bubba-section bubba-wide:text-bubba-section-wide', 3: 'text-xl leading-7', 4: 'text-lg leading-6', 5: 'text-base leading-6', 6: 'text-sm leading-5' };

export const Heading = forwardRef<ElementRef<typeof NativeText>, HeadingProps>(function Heading({ level = 2, className, ...props }, ref) {
  const webLevel = Platform.OS === 'web' ? { 'aria-level': level } : {};
  return <NativeText {...props} {...webLevel} ref={ref} accessibilityRole="header" className={cn('font-bold text-ui-heading', levels[level], className)} />;
});
