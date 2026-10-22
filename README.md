# @bubbasfw/ui

Bubba’s universal design system for Next.js, Vite, Astro, Expo, iOS and Android.
`@bubbasfw/ui@0.6.0` contains 32 controls, the shared Icon library, 15 reusable sections and three task
patterns built with React Native primitives and NativeWind, plus semantic
themes, a visual review workbench and complete Web/Expo galleries.

Version 0.5 adds browser and server-rendered web entries, public marketing
section variants and the package-owned catalog. Existing native font and input
contracts remain supported. Publication/deployment receipts remain separate.

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

`packages/ui/src/catalog.tsx` and its showcase modules own the universal
catalog/demo source. Docs and both complete consumer projects import those
package exports, so previews use the implementation consumers install.

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

For Vite, Astro and other browser hosts, use the browser setup below. The
NativeWind host configuration that follows remains for Expo and the existing
Next.js universal example.

### Vite and Astro

```sh
pnpm add @bubbasfw/ui@0.6.0 react@19.2.3 react-dom@19.2.3 react-native-web@0.21.4
```

Import controls and sections from `@bubbasfw/ui/web` and load
`@bubbasfw/ui/web.css` once. This entry supplies the shared utility CSS and web
interop; it needs no host NativeWind Babel or Tailwind configuration. Keep the
package's declared peers compatible and use one React/React Native Web instance.
Wrap shared regions in `ThemeProvider`; apps supply content, assets, links and
actions. Choose `variant="marketing"` for public marketing sections.

For Astro/Node SSR, render the shared content before collecting
`StyleSheet.getSheet()` from the same installed `react-native-web` instance.
Include its returned `id` and `textContent` in the document alongside web.css;
this supplies structural styles before hydration. Hydrate the shared header
and other interactive sections with the same data to enable menus and galleries.
See the [browser/SSR contract](docs/system-contract.md#server-rendered-browser-styles).

### Expo and the Next.js universal example

Install the package alongside the app’s compatible platform dependencies.
For local development, you can also install a tarball from `pnpm run pack`.
React, React Native, React Native Web, NativeWind, and Tailwind are peers. The
universal entry keeps its platform runtimes external; the browser entry includes
its NativeWind web interop. React Native Web is an optional peer for a
native-only Expo app. Web consumers must install it and React DOM.

The tested example baseline is React 19.2.3, React Native 0.86.3, React Native Web
0.21.4, NativeWind 4.2.7, and Tailwind 3.4.17. The example apps pin the platform
versions. NativeWind v5 and Tailwind v4 require a separate migration.

```sh
pnpm add @bubbasfw/ui@0.6.0 nativewind@4.2.7
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

## Annotated web candidate 0.6.0

This is an unreleased design candidate. Foundation system 0.5.0 and its immutable
source/digest remain unchanged. Marketing variants now use the original blue,
compact red/blue actions with hover glow, centered desktop navigation, full-height
white hero, equal compact product cards, and caller-labelled gold badges.
`CampaignSection`, `SocialSection` and `FlagTicker` take caller-owned content;
`PromotionBanner emphasis="sparkler"` highlights a supplied offer. No facts are
inferred. Motion stops under reduced motion and ticker motion has a pause control.

`Icon` uses pinned Lucide 1.61.0 control icons and Simple Icons 16.35.0 social
marks, rendered through RN Image with 96px transparent sources. Use 24px controls
and 22px social marks inside targets at least 44px wide/high. Provide accessible
labels on the parent control, or `accessibilityLabel` for a standalone image.
Vector sources, licenses and SHA256 hashes ship under `icons/`; the reproducible
bundled Chromium recipe is `scripts/build-icons.mjs`. Social trademarks remain with
their owners. This subset introduces no native SVG peer or font dependency.

Marketing actions use the existing `appearance="marketing"` and `size` API.
Choose `size="lg"` for a featured action (60px desktop / 56px phone, 18px desktop / 16px phone label,
12px corners); default `md` and `sm` retain compact 44px targets, 14px labels and
6px corners. HeroSection chooses featured actions; header and repeated controls
stay compact. Blue/red fills use gentle gradients and soft ambient glow on web,
with lift/press feedback and a white-separated focus ring. Inactive controls have
no glow or movement; reduced motion removes travel. Native keeps the same sizing,
solid brand fill, label, semantics and restrained native shadow without a new
gradient dependency. Default application controls retain their previous design.
