# @bubbasfw/ui

Bubba’s universal component library for React Native, Expo and React Native Web.
All components use native primitives and NativeWind. React and platform runtimes
are peers, with no Base UI, Radix UI or DOM component implementation.

Version 0.3.1 includes 32 components, scoped light/dark/system themes and shared
design tokens. Use the same imports in Next.js/React Native Web and Expo.

Three task patterns cover appearance settings, page introductions and explicit
loading/empty/error/offline/ready states: AppearanceControl, PageHeader and
AsyncState. Their runnable examples preserve source/freshness/missing/zero
distinctions. Hosts own persistence and product data.

[Browse the visual workbench and setup guides](https://handh-dev.github.io/bubbas-ui/)

```tsx
import { Button, ThemeProvider } from '@bubbasfw/ui';

<ThemeProvider appearance="system">
  <Button onPress={save} loading={saving} loadingLabel="Saving…">
    Save changes
  </Button>
</ThemeProvider>
```

## Catalog

- Foundations: Text, Heading, Stack, Inline, Container, Card, Divider.
- Actions: Button, IconButton, Link.
- Content: Badge, Avatar, ListItem, EmptyState.
- Forms: Input, Textarea, FormField, Checkbox, Switch, RadioGroup, Select.
- Navigation: Tabs, Breadcrumbs, Pagination.
- Disclosure: Accordion, Dialog, Sheet.
- Feedback: Alert, Toast, Spinner, Progress, Skeleton.

Native props and refs are forwarded where supported. Interactive components
expose accessible names and state. A consuming app still owns content, routing,
font loading and acceptance on its devices and assistive technologies.

`Button` variants are primary, secondary, outline and ghost; sizes are sm, md and
lg. Disabled and loading block presses. `ThemeProvider` scopes semantic colors
for light, dark or system appearance and supports nested previews. Native-only
apps may omit the optional React Native Web peer.

## Consumer setup

Baseline: React 19.2.3, React Native 0.86.3, React Native Web 0.21.4,
NativeWind 4.2.7, Tailwind 3.4.17. Install alongside the app’s compatible peers:

```sh
pnpm add @bubbasfw/ui@0.3.1 nativewind@4.2.7
pnpm add -D tailwindcss@3.4.17
```

The host compiles the package’s utility classes. Include the published source:

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
  presets: [require('nativewind/preset'), require('@bubbasfw/ui/tailwind-preset')],
};
```

Import the global CSS at the app entry with Tailwind base, components and
utilities. Expo requires NativeWind’s Metro/Babel setup and compatible native
dependencies. Declare `react-native-css-interop@0.2.7` directly because NativeWind
4’s Babel preset emits this import into app files under pnpm’s isolated layout:

```sh
pnpm add react-native-css-interop@0.2.7
pnpm add -D @babel/plugin-transform-react-jsx@7.29.7
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context
```

Next.js requires exact React Native → React Native Web aliasing, web extension
priority, NativeWind’s JSX import source and Tailwind 3/PostCSS. The runnable
Pages Router example uses webpack and Tailwind `important: true`. Interactive
App Router consumers need a client boundary. Turbopack is not configured.

See the [complete runnable examples](https://github.com/handh-dev/bubbas-ui/tree/main/examples)
and the [visual workbench](https://handh-dev.github.io/bubbas-ui/) for component previews and platform setup.
Both example apps include every catalog component from the real package entry.

### Loaded host fonts

React Native Views do not inherit font family. Load the font in your app, then
pass its registered name to `ThemeProvider`. Every shared text and input,
including form labels, feedback and modal content, resolves that scoped default.

```tsx
const [loaded, error] = useFonts({
  BubbasBody: require('./assets/fonts/montserrat.ttf'),
});
if (!loaded && !error) return null;
return <ThemeProvider fontFamily={loaded ? 'BubbasBody' : undefined}>
  <PageHeader title="Find your Bubba’s" />
  <FormField label="Search stands"><Input placeholder="Name, city or ZIP" /></FormField>
</ThemeProvider>;
```

Import `useFonts` from `expo-font` and retain the font license in the host.
The complete Expo example includes cleared Montserrat/OFL; npm contains no font
binary. Web hosts can pass their loaded CSS family or retain document inheritance.
Nested providers inherit the font. Explicit native `style.fontFamily` overrides
the default; `Text variant="code"` retains monospace. An omitted `fontFamily`
preserves existing defaults. Raw app-owned native text/navigation remains the
host’s responsibility; `useTheme().fontFamily` exposes the current name.

## Exports and rights

ESM, CJS and declarations ship together. Source ships for Tailwind scanning.
`@bubbasfw/ui/tokens` is independent of React; `@bubbasfw/ui/tailwind-preset` is
CommonJS. The package bundles no platform runtime, font or artwork binary.

Foundation system 0.4.0 and brand release 1.0.0 remain separately versioned.
The immutable Studio release, file approvals/rights, hashes and lock ship under
`foundations/`. Portable exports are `/foundations`, `/foundation-manifest`,
`/foundation-lock`, and `/foundations.css`. The server-safe tokens export exposes
foundationDigest/sourceCommit; package.json#bubba exposes matching consumer pins.
See the public reference for complete typography, layout, motion, accessibility,
composition and generation contracts.

Software is [MIT](LICENSE). Bubba’s names and marks retain separate rights; no
trademark license is granted. Publication remains an explicit owner-reviewed
step, with no automatic npm release on push or merge.
