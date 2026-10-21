import { useEffect, useRef, type ComponentType } from "react";
import { useRouter } from "next/router";
import { Pressable, ScrollView, View, type PressableProps } from "react-native";
import { Button, Text } from "@bubbasfw/ui";
import { components } from "./showcase/catalog";
import type { Reviews } from "./review";
import { SpecimenMiniature } from "./SpecimenMiniature";
type WebLinkProps = PressableProps & { href: string };
const NavigationLink = Pressable as ComponentType<WebLinkProps>;
export function ComponentFilmstrip({
  shown,
  current,
  reviews,
  query,
  onClear,
}: {
  shown: typeof components;
  current: string;
  reviews: Reviews;
  query: string;
  onClear: () => void;
}) {
  const router = useRouter();
  const scroller = useRef<ScrollView>(null);
  const selectedIndex = shown.findIndex((item) => item.slug === current);
  useEffect(() => {
    scroller.current?.scrollTo({
      x: Math.max(0, (selectedIndex - 1) * 188),
      animated: false,
    });
  }, [current, selectedIndex]);
  return (
    <ScrollView
      ref={scroller}
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
      testID="component-filmstrip"
    >
      {shown.map((component) => (
        <View key={component.slug} className="w-44">
          <SpecimenMiniature name={component.name} />
          <NavigationLink
            href={`/bubbas-ui/components/${component.slug}/`}
            accessibilityRole="link"
            accessibilityLabel={`Review ${component.name}`}
            aria-current={current === component.slug ? "page" : undefined}
            onPress={(event) => {
              const pointer = event.nativeEvent as unknown as {
                button?: number;
                metaKey?: boolean;
                ctrlKey?: boolean;
                shiftKey?: boolean;
                altKey?: boolean;
              };
              if (
                (pointer.button === undefined || pointer.button === 0) &&
                !pointer.metaKey &&
                !pointer.ctrlKey &&
                !pointer.shiftKey &&
                !pointer.altKey
              ) {
                event.preventDefault();
                void router.push(`/components/${component.slug}/`);
              }
            }}
            className={`w-44 justify-between gap-2 rounded-lg border px-4 pb-4 pt-[84px] web:focus-visible:outline web:focus-visible:outline-2 web:focus-visible:outline-ui-focus ${current === component.slug ? "border-ui-focus bg-ui-surface" : "border-ui-line bg-ui-surface web:hover:bg-ui-hover"}`}
          >
            <Text variant="small" tone="muted">
              {component.category}
            </Text>
            <Text variant="label">{component.name}</Text>
            <Text
              variant="caption"
              tone={
                reviews[component.name]?.status === "change" ? "error" : "muted"
              }
            >
              {reviews[component.name]?.status === "keep"
                ? "Keep as is"
                : reviews[component.name]?.status === "change"
                  ? "Change needed"
                  : "Not reviewed"}
            </Text>
          </NavigationLink>
        </View>
      ))}
      {!shown.length ? (
        <View className="gap-2 py-4">
          <Text>No components match “{query}”.</Text>
          <Button variant="outline" onPress={onClear}>
            Clear filters
          </Button>
        </View>
      ) : null}
    </ScrollView>
  );
}
