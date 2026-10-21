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

Native examples use the system font. The public web workbench self-hosts cleared
Montserrat under SIL OFL. A consuming app loads its own licensed fonts and reviews
its final native typography. No Eurostile binary is distributed.
