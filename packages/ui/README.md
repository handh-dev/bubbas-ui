# @bubbasfw/ui

Bubba’s universal React Native design system scaffold. The same NativeWind
Button uses `Pressable`, `Text`, and `ActivityIndicator` on native platforms and
React Native Web. This initial package contains the Button and foundation tokens.

```tsx
import { Button } from '@bubbasfw/ui';

<Button onPress={save} loading={saving} loadingLabel="Saving…">
  Save changes
</Button>
```

Variants: `primary`, `secondary`, `outline`, `ghost`. Sizes: `sm`, `md`, `lg`.
Use `className` for the Pressable and `textClassName` for the label. Native
Pressable props and refs are forwarded. Loading and disabled states block presses
and expose accessibility state. Label content should be text or inline native Text.

## Consumer setup

Baseline: React 19.2.3, React Native 0.86.3, React Native Web 0.21.4,
NativeWind 4.2.7, Tailwind 3.4.17. Configure the host app for NativeWind and scan
this package’s source so its utilities are generated:

```sh
pnpm add @bubbasfw/ui nativewind@4.2.7
pnpm add -D tailwindcss@3.4.17
```

Expo apps must also declare NativeWind 4's Babel runtime directly:

```sh
pnpm add react-native-css-interop@0.2.7
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context
```

The Babel preset emits `react-native-css-interop` imports into app files. Its
transitive dependency through NativeWind does not resolve from those files in
pnpm's isolated dependency layout.

```js
const path = require('node:path');
const uiRoot = path.dirname(require.resolve('@bubbasfw/ui/package.json'));

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    path.join(uiRoot, 'src/**/*.{ts,tsx}'),
  ],
  presets: [
    require('nativewind/preset'),
    require('@bubbasfw/ui/tailwind-preset'),
  ],
};
```

Expo requires NativeWind’s Metro/Babel setup and compatible native dependencies.
Next.js requires React Native Web aliasing, NativeWind’s JSX import source,
Tailwind 3/PostCSS, and runtime transpilation. App Router interactive consumers
need a client boundary. See the repository’s
[complete setup and runnable examples](https://github.com/handh-dev/bubbas-ui#readme).

The package exports `@bubbasfw/ui/tokens` without React runtime imports and
`@bubbasfw/ui/tailwind-preset` for shared color/radius utilities. Platform peers
are external; React Native Web is optional for native-only consumers.

Public access is configured, but the first npm release is pending. The code is
licensed under [MIT](LICENSE). Font and artwork binaries are excluded and retain
their separate distribution rights. No trademark license is granted.
