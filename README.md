# @bubbasfw/ui

A public universal design system scaffold for Bubba’s Fireworks. One shared
Button implementation uses React Native primitives and NativeWind on Next.js,
iOS, and Android. The first scaffold contains a Button and pinned foundation
tokens; it is not yet a complete component catalog.

The npm package is configured for public access. It has not been published.
The code is licensed under [MIT](LICENSE). Bubba’s names and marks are not
licensed as trademarks; separately supplied fonts and artwork retain their own
rights.

## Workspace

```text
packages/ui/
  src/components/Button.tsx   Shared Pressable + Text control
  src/tokens.ts              Platform-neutral foundation values
  src/index.ts               Component entry with a Next.js client boundary
  tailwind-preset.cjs         Shared colors and radius utilities
  tsup.config.ts             Externalized ESM/CJS + TypeScript declarations
examples/next/               React Native Web + Next.js Pages Router
examples/expo/               NativeWind + Expo Metro/Babel configuration
scripts/                     Packed-package and browser integration checks
docs/brand-sources.md         Pinned source versions and asset boundaries
```

## Develop

Use Node 22.13 or newer and pnpm 11.15.0.

```sh
pnpm install
pnpm verify
pnpm dev:web
# In another terminal, or instead of the web example:
pnpm dev:expo
```

The Next.js example runs at `http://127.0.0.1:4310`. Expo offers iOS, Android,
and web through its normal development flow. Changes to `packages/ui/src`
require a package rebuild (`pnpm build`) before consumers see them.

```sh
pnpm verify:package
pnpm verify:web
pnpm pack
```

The package check uses an actual npm tarball in independent consumer fixtures.
The browser check uses Playwright’s bundled Chromium and closes its browser in
`finally`. These checks are separate from native simulator/device acceptance.

## Use the Button

```tsx
import { Button } from '@bubbasfw/ui';

export function SaveAction() {
  return (
    <Button onPress={() => save()} loading={saving} loadingLabel="Saving…">
      Save changes
    </Button>
  );
}
```

`Button` forwards its native ref and standard `PressableProps`. Its API adds:

| Prop | Values / purpose |
| --- | --- |
| `variant` | `primary` (default), `secondary`, `outline`, `ghost` |
| `size` | `sm`, `md` (default), `lg`; minimum touch target is 44 px |
| `loading` | Shows a spinner, marks the control busy, and blocks presses |
| `loadingLabel` | Optional visible text while loading |
| `disabled` | Blocks presses and exposes disabled accessibility state |
| `className` | NativeWind classes for the Pressable; conflicting utilities override defaults |
| `textClassName` | NativeWind classes for the Text label |

Children should be text or inline React Native `Text` content. Supply
`accessibilityLabel` when the visible label needs additional context. Consumers
own font loading and may use `style` / `textClassName` to select licensed fonts.
The example keeps native system fonts until a consumer loads its brand font.

## Install in a consuming app

After the first npm release, install the package with the app’s compatible
platform dependencies. Before publication, use a local tarball from `pnpm pack`.
React, React Native, React Native Web, NativeWind, and Tailwind are peers; they
are not bundled into the package. React Native Web is an optional peer for a
native-only Expo app. Web consumers must install it and React DOM.

This scaffold’s baseline is React 19.2.3, React Native 0.86.3, React Native Web
0.21.4, NativeWind 4.2.7, and Tailwind 3.4.17. The example apps pin the platform
versions. NativeWind v5 and Tailwind v4 require a separate migration.

```sh
pnpm add @bubbasfw/ui nativewind@4.2.7
pnpm add -D tailwindcss@3.4.17
```

In Expo, declare NativeWind 4's Babel runtime directly in the app, then let
`expo install` select platform-compatible native dependencies:

```sh
pnpm add react-native-css-interop@0.2.7
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context
```

The Babel preset emits `react-native-css-interop` imports into application files.
An explicit app dependency makes those imports resolve under pnpm's isolated
dependency layout; NativeWind's transitive dependency alone is insufficient.

The host app compiles the utility classes for its platform. Add the package’s
published source directory to Tailwind’s `content` list and load both presets:

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

Import a global CSS file with `@tailwind base`, `@tailwind components`, and
`@tailwind utilities` from the app’s entry. Keep Tailwind’s package scan when
using a tarball or npm installation; scanning only the app hides Button styles.

**Expo:** copy the pattern in `examples/expo/metro.config.js` and
`babel.config.js`. Metro uses `withNativeWind` with the app’s CSS input. Babel
uses `babel-preset-expo` with `jsxImportSource: 'nativewind'` and the
`nativewind/babel` preset. Import the global CSS in the app entry.

**Next.js:** the Pages Router example uses webpack, an exact
`react-native` → `react-native-web` alias, web extension priority, and
`transpilePackages` for the NativeWind runtime. Its TypeScript
`jsxImportSource` is `nativewind`, and PostCSS runs Tailwind 3. The example uses
`next dev --webpack` / `next build --webpack`; Turbopack is not configured.
For App Router, place interactive consuming code inside a `"use client"`
boundary. The published component entry already preserves that directive;
`@bubbasfw/ui/tokens` stays independent of React and can be read on the server.

## Package and brand boundaries

The build compiles JSX to `nativewind/jsx-runtime` and keeps platform runtimes
external. ESM, CJS, and their corresponding declaration files are exported.
Source is included for Tailwind scanning; the consumer imports built JavaScript.
There are no DOM primitives, Base UI, Radix UI, font binaries, or logo binaries
in the shared component source. Read [brand provenance](docs/brand-sources.md)
for the pinned foundation sources.

## Release

Build, typecheck, inspect the tarball, verify both consumer bundlers, and review
the result before the first public npm release. Publishing remains a deliberate
owner-reviewed step; no script or GitHub push publishes automatically. Confirm the
package repository metadata before release. Distribution rights for brand
artwork and commercial fonts remain separate.

Official setup references:
[NativeWind Expo](https://www.nativewind.dev/docs/getting-started/installation),
[NativeWind Next.js](https://www.nativewind.dev/docs/getting-started/installation/nextjs),
[React Native Web](https://necolas.github.io/react-native-web/docs/multi-platform/).
