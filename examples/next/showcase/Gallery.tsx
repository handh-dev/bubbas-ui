import { useState, type ComponentType, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import {
  Button,
  Heading,
  Text,
  ThemeProvider,
  type Appearance,
} from "@bubbasfw/ui";
import { components, type ComponentName } from "./catalog";
import { ComponentDemo } from "./Demo";
import { PatternsDemo } from "./PatternsDemo";
function UniversalFrame({ children }: { children: ReactNode }) {
  return <View className="flex-1">{children}</View>;
}
export function Gallery({
  platform,
  Frame = UniversalFrame,
  fontFamily,
}: {
  platform: "Web" | "Expo";
  Frame?: ComponentType<{ children: ReactNode }>;
  fontFamily?: string;
}) {
  const [name, setName] = useState<ComponentName>("Button");
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [presses, setPresses] = useState(0);
  return (
    <ThemeProvider appearance={appearance} fontFamily={fontFamily} className="flex-1">
      <Frame>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View className="mx-auto w-full max-w-4xl gap-8 px-5 py-8">
            <Heading level={1}>Bubba’s UI · {platform}</Heading>
            <Text tone="muted">
              32 universal components. Demonstration content only.
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {(["light", "dark", "system"] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={appearance === value ? "secondary" : "outline"}
                  accessibilityLabel={`Appearance ${value}`}
                  aria-pressed={appearance === value}
                  onPress={() => setAppearance(value)}
                >
                  {value}
                </Button>
              ))}
            </View>
            <View className="gap-4 border-b border-ui-line pb-8">
              <Heading level={2}>Button interaction</Heading>
              <Button
                testID="count-button"
                onPress={() => setPresses(presses + 1)}
              >
                Celebrate with Bubba’s
              </Button>
              <Text
                testID="press-count"
                accessibilityLiveRegion="polite"
              >{`Button presses: ${presses}`}</Text>
              <View className="flex-row flex-wrap gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  accessibilityLabel="Help"
                  testID="compact-button"
                >
                  ?
                </Button>
                <Button
                  disabled
                  testID="disabled-button"
                  onPress={() => setPresses(999)}
                >
                  Disabled action
                </Button>
                <Button
                  loading
                  testID="loading-button"
                  onPress={() => setPresses(999)}
                >
                  Loading action
                </Button>
              </View>
            </View>
            <Heading level={2}>Explore components</Heading>
            <ScrollView
              horizontal
              contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
              showsHorizontalScrollIndicator
            >
              {components.map((item) => (
                <Pressable
                  key={item.slug}
                  testID={`select-${item.slug}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${item.name}`}
                  accessibilityState={{ selected: item.name === name }}
                  aria-pressed={item.name === name}
                  onPress={() => setName(item.name)}
                  className={`min-h-[48px] justify-center rounded border px-4 web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-ui-focus ${name === item.name ? "border-ui-focus bg-ui-selected" : "border-ui-line bg-ui-surface"}`}
                >
                  <Text>{item.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View testID={`gallery-${name}`} className="gap-5 pb-12">
              <Heading level={2}>{name}</Heading>
              <Text tone="muted">
                {components.find((item) => item.name === name)?.description}
              </Text>
              <View className="min-h-[240px] justify-center rounded-xl bg-ui-surface p-5">
                <ComponentDemo key={name} name={name} />
              </View>
            </View>
            <Heading level={2}>Shared task patterns</Heading>
            <PatternsDemo />
          </View>
        </ScrollView>
      </Frame>
    </ThemeProvider>
  );
}
