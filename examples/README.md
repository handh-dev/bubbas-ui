# Consumer examples

Both examples import the same `Button` from `@bubbasfw/ui`. They use React Native
primitives throughout; React Native Web supplies their web implementation.

From the repository root, run `pnpm install` and `pnpm build` first.

## Next.js

```sh
pnpm --filter @bubbasfw/example-next dev
```

Open http://127.0.0.1:4310. The example uses the Pages Router, the NativeWind JSX
runtime, Tailwind 3, and an exact `react-native` → `react-native-web` webpack alias.
Its build scripts explicitly select webpack; the supplied alias is a webpack
configuration. For an App Router app, render the package from a client component.

## Expo

```sh
pnpm --filter @bubbasfw/example-expo start
```

Select an installed iOS simulator or Android emulator, or open a compatible Expo
development client. NativeWind's native setup needs the Expo Babel preset,
NativeWind Babel preset, `withNativeWind` Metro wrapper, and the global CSS import.
Declare `react-native-css-interop@0.2.7` directly in the Expo app: NativeWind 4's
Babel preset emits imports from that runtime into application files, and pnpm's
isolated dependency layout cannot resolve it through NativeWind's dependency.
The dependency versions follow Expo SDK 57; use `expo install` when adapting this
to another Expo SDK.

```sh
pnpm --filter @bubbasfw/example-expo export:native
pnpm --filter @bubbasfw/example-expo export:web
```

An export checks bundling. It does not prove native taps, screen-reader behavior,
or installed-device rendering; those need a simulator/device run.

## Styling an installed package

Each Tailwind config resolves `@bubbasfw/ui/package.json` and scans the package's
shipped `src` directory. Do not replace this with a repository-relative path:
that would work in a workspace but fail after installing from npm. Both examples
use the package's exported Tailwind preset for its brand utilities.

The counter demonstrates press handling. Disabled and loading controls must leave
the counter unchanged. The examples intentionally contain no product data or
network calls.
