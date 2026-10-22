/** NativeWind's web interop applied to the same RN primitives as the universal entry. */
import * as Native from 'react-native-web';
import { createElement, forwardRef } from 'react';
import FormPressable from './form-pressable';
import { cssInterop } from 'react-native-css-interop/dist/runtime/web/api.js';
export * from 'react-native-web';
export const View = cssInterop(Native.View, { className: 'style' });
export const Text = cssInterop(Native.Text, { className: 'style' });
export const Pressable = cssInterop(FormPressable, { className: 'style' });
// RNW begins remote images in IDLE during SSR. Supplying the same known URI as
// defaultSource preserves the caller's initial artwork without requiring hydration.
const InitialImage = forwardRef((props: any, ref: any) => createElement(Native.Image, {
  ...props, ref, defaultSource: props.defaultSource ?? props.source,
}));
export const Image = cssInterop(InitialImage, { className: 'style' });
export const TextInput = cssInterop(Native.TextInput, { className: 'style' });
export const ScrollView = cssInterop(Native.ScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
export const ActivityIndicator = cssInterop(Native.ActivityIndicator, { className: 'style' });
