import { getLoadedFonts } from 'expo-font';
import { Platform } from 'react-native';

/** SDK 57 needs static native families. Do not load a runtime alias with the
 * same name: doing so replaces Android's multi-weight XML family.
 */
export function registeredBodyFamily(): string | undefined {
  const loaded = new Set(getLoadedFonts());
  if (Platform.OS === 'android' && loaded.has('BubbasBody')) return 'BubbasBody';
  if (Platform.OS === 'ios' && ['Regular', 'Medium', 'SemiBold', 'Bold', 'Black']
    .every(face => loaded.has(`Montserrat-${face}`))) return 'Montserrat';
  return undefined;
}

// A separate static Regular alias makes Expo Go/older hosts readable. It does
// not demonstrate compiled family registration or faithful 500/600/700/900.
export const bodyPreviewFonts = {
  BubbasBodyPreview: require('./assets/fonts/native/Montserrat-Regular.ttf'),
};
