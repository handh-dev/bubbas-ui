'use client';

import { forwardRef, type ElementRef } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme';

/** RN Views do not inherit fontFamily. Every shared text primitive resolves the
 * scoped host default here, including labels inside controls and native Modals.
 * Code opts out; explicit native style remains the final override.
 */
export const NativeText = forwardRef<ElementRef<typeof Text>, TextProps & { inheritFont?: boolean }>(
  function NativeText({ inheritFont = true, style, ...props }, ref) {
    const { fontFamily } = useTheme();
    return <Text {...props} ref={ref} style={[inheritFont && fontFamily ? { fontFamily } : undefined, style]} />;
  },
);
