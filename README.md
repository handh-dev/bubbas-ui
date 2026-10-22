# @bubbasfw/ui

Bubba’s universal design system for Next.js, Expo, iOS and Android.
`@bubbasfw/ui@0.3.0` contains 32 components built with React Native primitives and
NativeWind, plus semantic themes, a visual review workbench and complete
Web/Expo galleries.

The 0.3.0 candidate adds AppearanceControl, PageHeader and AsyncState, complete
public system/pattern/composition references, and mechanically verified Studio
foundation custody. Publication and deployment receipts are recorded separately.

[Review the design system](https://handh-dev.github.io/bubbas-ui/) ·
[npm package](https://www.npmjs.com/package/@bubbasfw/ui)

[System reference](https://handh-dev.github.io/bubbas-ui/reference/) ·
[Task patterns](https://handh-dev.github.io/bubbas-ui/patterns/) ·
[Composition guidance](https://handh-dev.github.io/bubbas-ui/compositions/)

Published releases use public npm access.
The code is licensed under [MIT](LICENSE). Bubba’s names and marks are not
licensed as trademarks; separately supplied fonts and artwork retain their own
rights.

## Workspace

```text
packages/ui/                 Universal components, themes, tokens, ESM/CJS/types
apps/docs/                   Static workbench, 38 routes and complete system guides
examples/next/               Self-contained React Native Web + Next.js gallery
examples/expo/               Self-contained native Expo gallery
scripts/                     Packed-package, gallery and docs browser checks
docs/brand-sources.md         Pinned provenance and separate asset rights
```

## Develop

Use Node 22.13 or newer and pnpm 11.15.0.

```sh
pnpm install
pnpm verify
pnpm dev:docs
# Runnable consumer examples:
pnpm dev:web
pnpm dev:expo
```

The docs preview runs at `http://127.0.0.1:4313/bubbas-ui/`. The Next.js example runs at `http://127.0.0.1:4310`. Expo offers iOS, Android,
and web through its normal development flow. Changes to `packages/ui/src`
require a package rebuild (`pnpm build`) before consumers see them.

```sh
pnpm verify:package
pnpm verify:web
pnpm verify:docs
pnpm run pack
```

The package check uses an actual npm tarball in independent consumer fixtures.
The browser check uses Playwright’s bundled Chromium and closes its browser in
`finally`. These checks are separate from native simulator/device acceptance.

## Review the system

The workbench puts a real component on a large stage, with appearance, variant,
size and state controls. Browse or search the 32-component filmstrip. Keep/Change
status and notes stay in your browser; Export notes downloads a JSON handback.
Code fragments and Web/Expo setup stay behind secondary implementation guidance.
The web preview is React Native Web; the Expo gallery demonstrates native rendering.

`apps/docs/src/showcase` is the canonical universal catalog/demo source.
`pnpm sync:showcase` copies it into both complete consumer projects so packed
consumer verification has no cross-repository imports. Run it after demo changes.

```sh
pnpm build:docs
pnpm preview:docs
```

The output in `apps/docs/out` is ready for the chosen GitHub Pages path,
`https://handh-dev.github.io/bubbas-ui/`. It uses static
export, `/bubbas-ui` base path, trailing slashes and `.nojekyll`. There is no
GitHub Actions workflow or automatic deployment.

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
The examples keep native system fonts until a consumer loads its brand font.
The public docs self-host cleared Montserrat with its OFL license.

## Install in a consuming app

Install the package alongside the app’s compatible platform dependencies.
For local development, you can also install a tarball from `pnpm run pack`.
React, React Native, React Native Web, NativeWind, and Tailwind are peers; they
are not bundled into the package. React Native Web is an optional peer for a
native-only Expo app. Web consumers must install it and React DOM.

The tested example baseline is React 19.2.3, React Native 0.86.3, React Native Web
0.21.4, NativeWind 4.2.7, and Tailwind 3.4.17. The example apps pin the platform
versions. NativeWind v5 and Tailwind v4 require a separate migration.

```sh
pnpm add @bubbasfw/ui@0.3.0 nativewind@4.2.7
pnpm add -D tailwindcss@3.4.17
```

In Expo, declare NativeWind 4's Babel runtime directly in the app, then let
`expo install` select platform-compatible native dependencies:

```sh
pnpm add react-native-css-interop@0.2.7
pnpm add -D @babel/plugin-transform-react-jsx@7.29.7
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
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './{app,pages,src}/**/*.{js,jsx,ts,tsx}',
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

See [the maintained system contract](docs/system-contract.md) for foundation
refresh, file approval/rights gates, source digests, platform adapters and
contribution workflow. `@bubbasfw/ui/foundations`, `/foundation-manifest`,
`/foundation-lock` and `/foundations.css` expose pinned portable sources for
existing platform adapters. The token export includes foundationDigest and
sourceCommit. Native consumers continue to use the RN components.

The build compiles JSX to `nativewind/jsx-runtime` and keeps platform runtimes
external. ESM, CJS, and their corresponding declaration files are exported.
Source is included for Tailwind scanning; the consumer imports built JavaScript.
There are no DOM primitives, Base UI, Radix UI, font binaries, or logo binaries
in the shared package. The docs separately include cleared Montserrat and original
logo geometry with an explicit asset notice. Read [brand provenance](docs/brand-sources.md)
for the pinned foundation sources.

## Release

Build, typecheck, inspect the tarball, verify both consumer bundlers, and review
the result before each public npm release. Publishing remains a deliberate
owner-reviewed step; no script or GitHub push publishes automatically. Confirm the
package repository metadata before release. Distribution rights for brand
artwork and commercial fonts remain separate.

Official setup references:
[NativeWind Expo](https://www.nativewind.dev/docs/getting-started/installation),
[NativeWind Next.js](https://www.nativewind.dev/docs/getting-started/installation/nextjs),
[React Native Web](https://necolas.github.io/react-native-web/docs/multi-platform/).

For Expo SDK57 builds with Xcode27/iOS27, follow the targeted
[scene-lifecycle setup](docs/platform-notes.md).
