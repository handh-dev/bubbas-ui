# Expo component gallery

This complete consumer imports all 32 components from `@bubbasfw/ui`. From the
repository root, run `pnpm build`, then `pnpm dev:expo`. Use the component strip
to select a specimen and Light/Dark/System to review appearance. Native typography
uses the platform font until the host loads its own licensed font.

The example keeps Expo 57.0.31, React Native 0.86.3 and NativeWind 4.2.7. It declares
the Babel runtime/JSX plugin directly for pnpm resolution. Source is synchronized
from the canonical docs catalog using `pnpm sync:showcase`.

For Xcode 27/iOS 27, SDK 57’s generated app needs the scene lifecycle. The included
expo-build-properties 57.0.22 config sets `ios.enableSceneSupport: true`. This is
the tested SDK 57 opt-in, without a React Native or Expo major migration. See
[the targeted platform note](../../docs/platform-notes.md) and
[Expo’s guidance](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

Native bundle export, Expo Go startup, an installed simulator build and physical
device acceptance are separate observations. Release evidence records which were
actually tested; a successful export alone does not establish native interaction.
