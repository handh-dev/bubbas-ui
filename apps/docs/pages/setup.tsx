import { useState } from "react";
import { View } from "react-native";
import { Accordion, Alert, Heading, Link, Text } from "@bubbasfw/ui";
import { Guide } from "../src/Guide";
import { Choice } from "../src/Choice";
import { candidateVersion } from "../src/showcase/catalog";
const tailwind = `const path = require('node:path');\nconst uiRoot = path.dirname(require.resolve('@bubbasfw/ui/package.json'));\nmodule.exports = {\n  darkMode: 'class',\n  content: ['./App.{js,jsx,ts,tsx}', './{app,pages,src}/**/*.{js,jsx,ts,tsx}',\n    path.join(uiRoot, 'src/**/*.{ts,tsx}')],\n  presets: [require('nativewind/preset'), require('@bubbasfw/ui/tailwind-preset')],\n};`;
const next = `// next.config.js — run Next with --webpack\nmodule.exports = {\n  transpilePackages: ['@bubbasfw/ui', 'nativewind',\n    'react-native-css-interop', 'react-native', 'react-native-web'],\n  webpack(config) {\n    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };\n    config.resolve.extensions = ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', ...config.resolve.extensions];\n    return config;\n  },\n};\n// tsconfig.json: jsx = "react-jsx", jsxImportSource = "nativewind"\n// postcss.config.cjs: plugins = { tailwindcss: {}, autoprefixer: {} }`;
const expo = `// metro.config.js\nconst { getDefaultConfig } = require('expo/metro-config');\nconst { withNativeWind } = require('nativewind/metro');\nmodule.exports = withNativeWind(getDefaultConfig(__dirname), { input: './global.css' });\n\n// babel.config.js\nmodule.exports = function(api) {\n  api.cache(true);\n  return { presets: [\n    ['babel-preset-expo', { jsxImportSource: 'nativewind' }],\n    'nativewind/babel',\n  ] };\n};`;
export default function Setup() {
  const [platform, setPlatform] = useState<"Web" | "Expo">("Web");
  return (
    <Guide
      title="Use the system"
      description="Start with a runnable example. Both platforms import the same components."
    >
      <Alert
        title="Patch candidate: 32 controls, icons and 15 reusable sections"
        description={`Unpublished patch @bubbasfw/ui@${candidateVersion}; install its exact reviewed archive for qualification. 0.6.0 is deprecated for dropped web Button caller styles; npm latest is 0.5.0. Vite and Astro use the web entry; Expo and the Next.js universal example keep their NativeWind host setup.`}
        tone="info"
      />
      <View className="gap-4">
        <Heading level={2}>Run the examples</Heading>
        <Text
          selectable
          variant="code"
          className="rounded-lg bg-ui-surface p-5"
        >
          {
            "git clone https://github.com/handh-dev/bubbas-ui.git\ncd bubbas-ui\npnpm install\npnpm build\npnpm dev:web\n# Or: pnpm dev:expo"
          }
        </Text>
        <Text tone="muted">
          Use Node 22.13+ and pnpm 11.15.0. The Next example runs on port 4310.
          Expo opens its normal development flow. The package must be rebuilt
          after component source changes.
        </Text>
        <Link
          href="https://github.com/handh-dev/bubbas-ui/tree/main/examples"
          external
        >
          Open the complete example projects
        </Link>
      </View>
      <View className="gap-4">
        <Heading level={2}>Vite and Astro</Heading>
        <Text selectable variant="code" className="rounded-lg bg-ui-surface p-5">
          {`pnpm add @bubbasfw/ui@${candidateVersion} react@19.2.3 react-dom@19.2.3 react-native-web@0.21.4`}
        </Text>
        <Text selectable variant="code" className="rounded-lg bg-ui-surface p-5">
          {'import { ThemeProvider, HeroSection } from "@bubbasfw/ui/web";\nimport "@bubbasfw/ui/web.css";\n\n<ThemeProvider appearance="light">\n  <HeroSection variant="marketing" title="Your page title" />\n</ThemeProvider>'}
        </Text>
        <Text>
          Import the shared CSS once. This browser entry includes the web
          interop and utility styles; it needs no host NativeWind Babel or
          Tailwind configuration. Keep declared peers compatible and use one
          React/React Native Web instance. Apps provide content, cleared assets,
          links and actions.
        </Text>
        <Text>
          Astro and Node SSR hosts render shared content before collecting
          StyleSheet.getSheet() from the same installed react-native-web instance.
          Include its returned id and textContent in the document alongside
          web.css so structural styles exist before hydration. Hydrate the shared
          header and interactive sections with the same data to enable their
          menus and galleries.
        </Text>
        <Link href="https://github.com/handh-dev/bubbas-ui/blob/main/docs/system-contract.md#server-rendered-browser-styles" external>
          Read the browser and SSR contract
        </Link>
      </View>
      <View className="gap-4">
        <Heading level={2}>Expo and the Next.js universal example</Heading>
        <Text>
          React, React Native, NativeWind and Tailwind remain peer dependencies.
          Web also needs React Native Web and React DOM. Native-only apps can
          omit React Native Web.
        </Text>
        <Text
          selectable
          variant="code"
          className="rounded-lg bg-ui-surface p-5"
        >
          {
            `pnpm add @bubbasfw/ui@${candidateVersion} nativewind@4.2.7\npnpm add -D tailwindcss@3.4.17`
          }
        </Text>
        <Text tone="muted">
          Pinned example baseline: React 19.2.3, RN 0.86.3, RNW 0.21.4,
          NativeWind 4.2.7, Tailwind 3.4.17. NativeWind 5 and Tailwind 4 need a
          separate migration.
        </Text>
      </View>
      <Accordion
        defaultValue="scan"
        items={[
          {
            value: "scan",
            title: "Compile the shared utilities",
            content: (
              <View className="gap-4">
                <Text>
                  The host app scans the package’s published source and loads
                  both presets.
                </Text>
                <Text
                  selectable
                  variant="code"
                  className="rounded-lg bg-ui-surface p-5"
                >
                  {tailwind}
                </Text>
                <Text>
                  Import global CSS from the entry, with @tailwind base,
                  @tailwind components and @tailwind utilities. Web sets
                  important: true in its Tailwind config so utilities override
                  RNW defaults.
                </Text>
              </View>
            ),
          },
          {
            value: "platform",
            title: "Platform configuration",
            content: (
              <View className="gap-4">
                <Choice
                  label="Setup platform"
                  options={["Web", "Expo"]}
                  value={platform}
                  onChange={setPlatform}
                />
                <Text
                  selectable
                  variant="code"
                  className="rounded-lg bg-ui-surface p-5"
                >
                  {platform === "Web" ? next : expo}
                </Text>
                {platform === "Expo" ? (
                  <Text selectable variant="code">
                    {
                      "pnpm add react-native-css-interop@0.2.7\npnpm add -D @babel/plugin-transform-react-jsx@7.29.7\nnpx expo install react-native-reanimated react-native-worklets react-native-safe-area-context"
                    }
                  </Text>
                ) : (
                  <Text>
                    Pages Router is the runnable baseline. App Router consumers
                    need an interactive “use client” boundary. This
                    configuration uses webpack; Turbopack is not configured.
                  </Text>
                )}
              </View>
            ),
          },
          {
            value: "theme",
            title: "Choose appearance",
            content: (
              <View className="gap-4">
                <Text
                  selectable
                  variant="code"
                  className="rounded-lg bg-ui-surface p-5"
                >
                  {
                    'import { ThemeProvider, Button } from "@bubbasfw/ui";\n\n<ThemeProvider appearance="system">\n  <Button onPress={save}>Save changes</Button>\n</ThemeProvider>'
                  }
                </Text>
                <Text>
                  Appearance accepts light, dark or system. The provider scopes
                  semantic colors and may be nested. Load fonts in the host app;
                  components do not bundle a commercial font.
                </Text>
                <Text>
                  Native Views do not inherit fontFamily. After loading the
                  licensed font, pass its registered name to the provider. This
                  reaches every shared heading, label, state, button and input,
                  including modal content. Nested providers inherit the family.
                  Explicit text/input style.fontFamily wins; code stays monospace.
                  Raw app-owned native text still needs its own font style.
                </Text>
                <Text selectable variant="code" className="rounded-lg bg-ui-surface p-5">
                  {`import { registeredBodyFamily } from './native-fonts';
import { ThemeProvider, PageHeader, FormField, Input } from '@bubbasfw/ui';

function App() {
  // Registered by expo-font config plugin in a native build.
  const family = registeredBodyFamily();
  return <ThemeProvider appearance="system" fontFamily={family}>
    <PageHeader title="Find your Bubba’s" />
    <FormField label="Search stands"><Input placeholder="Name, city or ZIP" /></FormField>
  </ThemeProvider>;
}`}
                </Text>
                <Text>
                  On Expo SDK 57, register static faces with the expo-font config
                  plugin and rebuild the native app. The complete gallery keeps
                  OFL Montserrat 400/500/600/700/900, hashes and the pinned
                  generation recipe. Android uses its BubbasBody XML family;
                  iOS uses Montserrat’s embedded family/PostScript names. Never
                  overwrite that Android family with a single runtime font alias.
                  SDK 57 variable-font runtime aliases do not preserve real weights.
                  The separate Regular preview fallback in Expo Go is not native
                  weight qualification. Retain the font’s license in the host. Web
                  hosts may pass their loaded CSS font name or keep existing
                  document font inheritance. An omitted fontFamily preserves
                  the host/platform defaults.
                </Text>
              </View>
            ),
          },
        ]}
      />
      <View className="gap-3">
        <Heading level={2}>Building with Xcode 27</Heading>
        <Text>
          Expo SDK 57 needs the scene-lifecycle opt-in for an iOS 27 build.
          Install a compatible expo-build-properties plugin and configure
          ios.enableSceneSupport: true before regenerating a native project.
          Expo 57.0.23 or newer is required; this example pins 57.0.31.
        </Text>
        <Link
          href="https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27"
          external
        >
          Expo’s SDK 57 and Xcode 27 setup
        </Link>
      </View>
      <Text tone="muted">
        Browser and Metro checks cover their observed behavior. Device,
        assistive technology and release acceptance remain separate checks for
        each consuming app.
      </Text>
    </Guide>
  );
}
