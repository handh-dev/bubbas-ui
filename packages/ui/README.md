# @bubbasfw/ui

Bubba’s universal component library for React Native, Expo and React Native Web.
All components use native primitives and NativeWind. React and platform runtimes
are peers, with no Base UI, Radix UI or DOM component implementation.

Version 0.2.0 includes 32 components, scoped light/dark/system themes and shared
design tokens. Use the same imports in Next.js/React Native Web and Expo.

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
pnpm add @bubbasfw/ui@0.2.0 nativewind@4.2.7
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

## Exports and rights

ESM, CJS and declarations ship together. Source ships for Tailwind scanning.
`@bubbasfw/ui/tokens` is independent of React; `@bubbasfw/ui/tailwind-preset` is
CommonJS. The package bundles no platform runtime, font or artwork binary.

Software is [MIT](LICENSE). Bubba’s names and marks retain separate rights; no
trademark license is granted. Publication remains an explicit owner-reviewed
step, with no automatic npm release on push or merge.
