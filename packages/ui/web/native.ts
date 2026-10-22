/** NativeWind's web interop applied to the same RN primitives as the universal entry. */
import * as Native from 'react-native-web';
import { createElement, forwardRef } from 'react';
import FormPressable from './form-pressable';
import { cssInterop } from 'react-native-css-interop/dist/runtime/web/api.js';
export * from 'react-native-web';
export const View = cssInterop(Native.View, { className: 'style' });
export const Text = cssInterop(Native.Text, { className: 'style' });
// NativeWind merges class names into a style array. Resolve caller callbacks
// after that merge so RNW still receives its real interaction state.
function hasStyleCallback(style: any): boolean {
  return typeof style === 'function' || Array.isArray(style) && style.some(hasStyleCallback);
}
function resolveStyleCallbacks(style: any, state: any): any {
  return typeof style === 'function' ? resolveStyleCallbacks(style(state), state)
    : Array.isArray(style) ? style.map(item => resolveStyleCallbacks(item, state)) : style;
}
const CallbackPressable = forwardRef(({style, ...props}: any, ref: any) => createElement(FormPressable, {
  ...props, ref, style: hasStyleCallback(style) ? (state: any) => resolveStyleCallbacks(style, state) : style,
}));
const InteropPressable = cssInterop(CallbackPressable, { className: 'style' });
// Interop otherwise replaces a top-level function while merging class styles.
export const Pressable = forwardRef(({style, ...props}: any, ref: any) => createElement(InteropPressable, {
  ...props, ref, style: typeof style === 'function' ? [style] : style,
}));
// RNW begins remote images in IDLE during SSR. Supplying the same known URI as
// defaultSource preserves the caller's initial artwork without requiring hydration.
const InitialImage = forwardRef((props: any, ref: any) => createElement(Native.Image, {
  ...props, ref, defaultSource: props.defaultSource ?? props.source,
}));
export const Image = cssInterop(InitialImage, { className: 'style' });
export const TextInput = cssInterop(Native.TextInput, { className: 'style' });
export const ScrollView = cssInterop(Native.ScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
export const ActivityIndicator = cssInterop(Native.ActivityIndicator, { className: 'style' });
