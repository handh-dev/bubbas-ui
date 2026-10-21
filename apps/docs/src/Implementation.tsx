import { useState } from "react";
import { View } from "react-native";
import { Accordion, Alert, Link, Text } from "@bubbasfw/ui";
import { Choice } from "./Choice";
import { components } from "./showcase/catalog";
import { snippetFor } from "./snippets";
export function Implementation({
  item,
}: {
  item: (typeof components)[number];
}) {
  const [platform, setPlatform] = useState<"Web" | "Expo">("Web");
  return (
    <Accordion
      items={[
        {
          value: "implementation",
          title: "Implementation · Web & Expo",
          content: (
            <View className="gap-4">
              <Alert
                title="Use @bubbasfw/ui@0.2.0"
                description="Web and Expo use the same component imports. Configure NativeWind and the platform peers in your app, then add the example below."
                tone="neutral"
              />
              <Choice
                label="Example platform"
                options={["Web", "Expo"]}
                value={platform}
                onChange={setPlatform}
              />
              <Text
                selectable
                variant="code"
                className="rounded-lg bg-ui-surface p-4"
              >
                {snippetFor(item.name, platform)}
              </Text>
              <Text variant="small" tone="muted">
                Example fragment: supply application state, callbacks and any
                referenced child components.
              </Text>
              <Text variant="label">Main props</Text>
              <Text selectable variant="code">
                {item.props}
              </Text>
              <Link href="/bubbas-ui/setup/">Open platform setup</Link>
              <Link
                href={`https://github.com/handh-dev/bubbas-ui/tree/main/examples/${platform === "Web" ? "next" : "expo"}`}
                external
              >
                Runnable {platform} example
              </Link>
            </View>
          ),
        },
      ]}
    />
  );
}
