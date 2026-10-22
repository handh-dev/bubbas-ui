import { useState } from "react";
import { View } from "react-native";
import { Accordion, Alert, Heading, Link, Text } from "@bubbasfw/ui";
import { Guide } from "../src/Guide";
import { Choice } from "../src/Choice";
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
        title="32 components for Web and Expo"
        description="Install @bubbasfw/ui@0.3.1 in your app, configure NativeWind, and use the same component imports on both platforms."
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
        <Heading level={2}>Add it to an app</Heading>
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
            "pnpm add @bubbasfw/ui@0.3.1 nativewind@4.2.7\npnpm add -D tailwindcss@3.4.17"
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
                  {`import { useFonts } from 'expo-font';
import { ThemeProvider, PageHeader, FormField, Input } from '@bubbasfw/ui';

function App() {
  const [loaded, error] = useFonts({
    BubbasBody: require('./assets/fonts/montserrat.ttf'),
  });
  if (!loaded && !error) return null;
  return <ThemeProvider appearance="system" fontFamily={loaded ? 'BubbasBody' : undefined}>
    <PageHeader title="Find your Bubba’s" />
    <FormField label="Search stands"><Input placeholder="Name, city or ZIP" /></FormField>
  </ThemeProvider>;
}`}
                </Text>
                <Text>
                  Retain the font’s license in the host. The complete Expo
                  gallery demonstrates this with cleared Montserrat/OFL. Web
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
