'use client';

import { View, type ViewProps } from 'react-native';
import { cn } from '../internal/utils';
import { Button } from './Button';
import { Link } from './actions';
import { Text } from './typography';

export interface BreadcrumbItem { label: string; href?: string }
export interface BreadcrumbsProps extends ViewProps { items: BreadcrumbItem[]; label?: string; className?: string }
export function Breadcrumbs({ items, label = 'Breadcrumb', className, ...props }: BreadcrumbsProps) {
  return <View {...props} role="navigation" accessibilityLabel={label} className={cn('flex-row flex-wrap items-center gap-2', className)}>{items.map((item, index) => <View key={`${item.label}-${index}`} className="flex-row items-center gap-2">
    {index > 0 ? <View accessible={false} className="h-2 w-2 rotate-[-45deg] border-b border-r border-ui-muted" /> : null}
    {item.href && index !== items.length - 1 ? <Link href={item.href} textClassName="text-sm">{item.label}</Link> : <Text variant="small" {...(index === items.length - 1 ? { 'aria-current': 'page' as const } : {})}>{item.label}</Text>}
  </View>)}</View>;
}

export interface PaginationProps extends ViewProps { page: number; count: number; onPageChange: (page: number) => void; label?: string; className?: string }
export function Pagination({ page, count, onPageChange, label = 'Pagination', className, ...props }: PaginationProps) {
  const total = Math.max(1, Math.floor(Number.isFinite(count) ? count : 1));
  const current = Math.min(total, Math.max(1, Math.floor(Number.isFinite(page) ? page : 1)));
  return <View {...props} role="navigation" accessibilityLabel={label} className={cn('flex-row flex-wrap items-center gap-3', className)}>
    <Button variant="outline" size="sm" disabled={current === 1} onPress={() => onPageChange(current - 1)} accessibilityLabel="Previous page">Previous</Button>
    <Text variant="small" accessibilityLiveRegion="polite" aria-live="polite">{`Page ${current} of ${total}`}</Text>
    <Button variant="outline" size="sm" disabled={current === total} onPress={() => onPageChange(current + 1)} accessibilityLabel="Next page">Next</Button>
  </View>;
}
