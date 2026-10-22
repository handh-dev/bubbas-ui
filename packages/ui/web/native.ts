/** NativeWind's web interop applied to the same RN primitives as the universal entry. */
import * as Native from 'react-native-web';
import { cssInterop } from 'react-native-css-interop/dist/runtime/web/api.js';
export * from 'react-native-web';
export const View = cssInterop(Native.View, { className: 'style' });
export const Text = cssInterop(Native.Text, { className: 'style' });
export const Pressable = cssInterop(Native.Pressable, { className: 'style' });
export const Image = cssInterop(Native.Image, { className: 'style' });
export const TextInput = cssInterop(Native.TextInput, { className: 'style' });
export const ScrollView = cssInterop(Native.ScrollView, { className: 'style', contentContainerClassName: 'contentContainerStyle' });
export const ActivityIndicator = cssInterop(Native.ActivityIndicator, { className: 'style' });
