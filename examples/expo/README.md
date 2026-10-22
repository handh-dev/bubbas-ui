# Expo component gallery

This complete consumer imports all 32 components from `@bubbasfw/ui`. From the
repository root, run `pnpm build`, then `pnpm dev:expo`. Use the component strip
to select a specimen and Light/Dark/System to review appearance. Native typography uses static Montserrat 400/500/600/700/900 registered by the
`expo-font` config plugin in app.config.js/native-fonts.json. Android uses the
BubbasBody XML family; iOS uses the embedded Montserrat family. These static OFL
instances preserve actual weight intent on SDK 57, including black headings.
Run `uv run scripts/instantiate-native-fonts.py` from the repository root to
reproduce them using pinned fontTools 4.67.0. The original approved variable source
is unchanged; assets/fonts/native/manifest.json records source/license/output
hashes, weights and PostScript names. No font binary ships in npm.

Run `npx expo run:android` or `npx expo run:ios` for a native development build
with these registrations. Expo Go cannot load a config plugin: its separate
BubbasBodyPreview regular alias offers readable specimen previews, without
qualifying actual native weights. Do not runtime-load a single file under the
Android BubbasBody alias, which would overwrite its XML family. Failed loading
retains platform defaults. See [Expo font guidance](https://docs.expo.dev/develop/user-interface/fonts/).

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
