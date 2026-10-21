import { View } from "react-native";
import { Heading, Text, Link, ThemeProvider } from "@bubbasfw/ui";
import { tokens } from "@bubbasfw/ui/tokens";
import { Guide } from "../src/Guide";
export default function Foundations() {
  return (
    <Guide
      title="Brand foundations"
      description="The shared values behind each component. Review the system in light and charcoal dark."
    >
      <View className="gap-4">
        <Heading level={2}>Brand colors</Heading>
        <View className="flex-row flex-wrap gap-6">
          {Object.entries({
            Blue: tokens.colors.blue,
            Red: tokens.colors.red,
            Navy: tokens.colors.navy,
            Ink: tokens.colors.ink,
            Gold: tokens.colors.gold,
          }).map(([name, color]) => (
            <View key={name} className="w-40 gap-2">
              <View
                className="h-20 rounded-lg"
                style={{ backgroundColor: color }}
              />
              <Text variant="label">{name}</Text>
              <Text selectable variant="code">
                {color}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View className="gap-4">
        <Heading level={2}>Semantic surfaces</Heading>
        <Text tone="muted">
          Components use roles, so the same implementation adapts to either
          appearance.
        </Text>
        <View className="flex-row flex-wrap gap-6">
          {(["light", "dark"] as const).map((appearance) => (
            <ThemeProvider
              key={appearance}
              appearance={appearance}
              className="min-w-0 flex-1 basis-80 gap-4 rounded-xl p-6"
            >
              <Heading level={3}>
                {appearance === "light" ? "Light" : "Dark"}
              </Heading>
              {Object.entries(tokens.themes[appearance])
                .filter(([, value]) => value.startsWith("#"))
                .map(([role, color]) => (
                  <View
                    key={role}
                    className="flex-row flex-wrap items-center gap-3 border-b border-ui-line py-2"
                  >
                    <View
                      className="h-8 w-8 rounded border border-ui-border"
                      style={{ backgroundColor: color }}
                    />
                    <Text className="flex-1" variant="small">
                      {role}
                    </Text>
                    <Text selectable variant="code">
                      {color}
                    </Text>
                  </View>
                ))}
            </ThemeProvider>
          ))}
        </View>
      </View>
      <View className="gap-4">
        <Heading level={2}>Typography</Heading>
        <Text variant="lead">Montserrat carries the public interface.</Text>
        <Heading level={1}>A clear first thought.</Heading>
        <Heading level={2}>Room for a second thought.</Heading>
        <Heading level={3}>And all the useful details.</Heading>
        <Text>
          Body copy stays comfortable, with a clear hierarchy and enough line
          height to read naturally.
        </Text>
        <Text variant="small" tone="muted">
          The docs self-host Montserrat under SIL OFL. Native examples use their
          platform font until the host loads a licensed font. The commercial
          Eurostile display font is not redistributed.
        </Text>
        <Link href="/bubbas-ui/fonts/OFL.txt">Montserrat license</Link>
      </View>
      <View className="gap-4">
        <Heading level={2}>Space and shape</Heading>
        {Object.entries(tokens.spacing).map(([step, pixels]) => (
          <View key={step} className="flex-row items-center gap-4">
            <Text variant="code" className="w-20">
              {pixels} px
            </Text>
            <View
              className="h-4 rounded bg-ui-heading"
              style={{ width: pixels }}
            />
          </View>
        ))}
        <Text>{`Control radius ${tokens.radius.control}px · Panel radius ${tokens.radius.panel}px · Touch target at least ${tokens.touchTarget.minimum}px.`}</Text>
      </View>
      <View className="gap-3 border-t border-ui-line pt-6">
        <Heading level={2}>Source and rights</Heading>
        <Text>
          Foundations are pinned from Brand Studio brand release 1.0.0 and
          interface system 0.3.0. Reviewing a proposed change here does not
          approve or edit the Studio source.
        </Text>
        <Text tone="muted">
          The software is MIT. Bubba’s names and logo geometry have separate
          rights and grant no trademark license. No mascot artwork or commercial
          font binary is included.
        </Text>
        <Link href="/bubbas-ui/brand/NOTICE.txt">Public asset notice</Link>
      </View>
    </Guide>
  );
}
