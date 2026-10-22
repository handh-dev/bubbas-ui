# Platform notes

## Expo SDK 57 with Xcode 27

The example keeps Expo 57.0.31 and React Native 0.86.3. When generating an iOS app
with Xcode 27/iOS 27, SDK 57 needs Expo’s scene-lifecycle opt-in; its older default
application lifecycle does not launch correctly on iOS 27.

The runnable example includes expo-build-properties 57.0.22 and this opt-in.
For another SDK 57 app, install the compatible plugin and add this configuration:

```sh
npx expo install expo-build-properties
```

```json
{
  "expo": {
    "plugins": [
      ["expo-build-properties", { "ios": { "enableSceneSupport": true } }]
    ]
  }
}
```

This requires Expo 57.0.23+ and the plugin version containing scene support
(the local proof used 57.0.22). Regenerate a generated iOS project or create a new
EAS build after applying the config. Hand-maintained native projects must follow
the migration steps rather than replacing custom AppDelegate code blindly.
See [Expo’s SDK 57/Xcode 27 guidance](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

## NativeWind Babel runtime

The self-contained Expo example declares `react-native-css-interop@0.2.7` and
`@babel/plugin-transform-react-jsx@7.29.7` directly so pnpm’s isolated dependency
layout can resolve Babel-emitted runtime and plugin imports during native embedding.

## Fonts

The Expo SDK 57 example registers static OFL Montserrat 400/500/600/700/900
using the expo-font config plugin: Android uses the BubbasBody XML weight family;
iOS uses the embedded Montserrat family and PostScript names. Rebuild native apps
when registrations change. A single runtime alias for the variable source selects
its Thin default on SDK 57; it does not qualify the intended weight family. Never
overwrite an Android XML family with a runtime alias of the same name.
The separate Regular preview fallback in Expo Go/older hosts is not installed
weight proof. Per-file metadata, source/license hashes and the pinned generator
are retained with the canonical example. The web workbench separately self-hosts
cleared Montserrat under OFL. No Eurostile binary is distributed.
See [Expo font guidance](https://docs.expo.dev/develop/user-interface/fonts/).
