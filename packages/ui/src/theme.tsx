'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { View, useColorScheme, type ViewProps } from 'react-native';
import { vars } from 'nativewind';
import { tokens } from './tokens';
import { cn } from './internal/utils';

export type Appearance = 'light' | 'dark' | 'system';
export type ResolvedAppearance = 'light' | 'dark';
export type ThemeColor = Exclude<keyof typeof tokens.themes.light, `shadow-${string}`>;
export type ThemeColors = { [Key in ThemeColor]: string };

function rgb(hex: string) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)).join(' ');
}

export function themeVariables(appearance: ResolvedAppearance) {
  return vars(Object.fromEntries(Object.entries(tokens.themes[appearance])
    .filter(([, value]) => value.startsWith('#'))
    .map(([key, value]) => [`--bui-${key}`, rgb(value)])));
}

function themeValue(appearance: Appearance, resolvedAppearance: ResolvedAppearance, fontFamily?: string) {
  return {
    appearance,
    resolvedAppearance,
    fontFamily,
    colors: Object.fromEntries(Object.entries(tokens.themes[resolvedAppearance])
      .filter(([, value]) => value.startsWith('#'))) as ThemeColors,
    variables: themeVariables(resolvedAppearance),
  };
}

const ThemeContext = createContext(themeValue('light', 'light'));

export interface ThemeProviderProps extends ViewProps {
  children: ReactNode;
  appearance?: Appearance;
  /** Loaded host font name for shared text and inputs. Inherits through nested
   * providers; explicit text/input style.fontFamily overrides this default.
   * Font loading and licensing remain the host's responsibility.
   */
  fontFamily?: string;
  /** Canvas paint is optional when composing a transparent standalone section. */
  surface?: 'canvas' | 'transparent';
  className?: string;
}

/** Scoped variables support nested themes without changing global appearance.
 * The host owns persistence and applies the same theme to safe areas/install shells.
 */
export function ThemeProvider({ appearance = 'light', fontFamily, surface='canvas', children, className, style, ...props }: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const system = useColorScheme();
  const resolved = appearance === 'system' ? system === 'dark' ? 'dark' : 'light' : appearance;
  const family = fontFamily ?? parent.fontFamily;
  const value = useMemo(() => themeValue(appearance, resolved, family), [appearance, resolved, family]);
  return (
    <ThemeContext.Provider value={value}>
      <View {...props} className={cn(surface==='transparent'?'bg-transparent':'bg-ui-canvas', className)} style={[value.variables, style]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }
