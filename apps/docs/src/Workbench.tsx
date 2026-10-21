import { useEffect, useState } from "react";
import Head from "next/head";
import { Image, ScrollView, View } from "react-native";
import {
  Button,
  Heading,
  Input,
  Link,
  Text,
  Textarea,
  ThemeProvider,
} from "@bubbasfw/ui";
import { Choice } from "./Choice";
import { CompareStates } from "./CompareStates";
import { useReview, type ReviewStatus } from "./review";
import { components, categories, candidateVersion } from "./showcase/catalog";
import { ComponentDemo, type DemoProps } from "./showcase/Demo";
import { Implementation } from "./Implementation";
import { ComponentFilmstrip } from "./ComponentFilmstrip";

export function Workbench({ initialSlug }: { initialSlug: string }) {
  const item =
    components.find(({ slug }) => slug === initialSlug) || components[7];
  const {
    reviews,
    appearance,
    setAppearance,
    update,
    exportReviews,
    storageError,
  } = useReview();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [variant, setVariant] =
    useState<NonNullable<DemoProps["variant"]>>("primary");
  const [size, setSize] = useState<NonNullable<DemoProps["size"]>>("md");
  const [state, setState] =
    useState<NonNullable<DemoProps["state"]>>("default");
  const [frame, setFrame] = useState("full");
  useEffect(() => {
    setVariant("primary");
    setSize("md");
    setState("default");
    setFrame("full");
  }, [item.name]);
  const review = reviews[item.name] || {
    status: "pending" as ReviewStatus,
    note: "",
  };
  const shown = components.filter(
    (component) =>
      (category === "All" || component.category === category) &&
      `${component.name} ${component.category} ${component.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const stateful = [
    "Button",
    "IconButton",
    "Link",
    "ListItem",
    "Input",
    "Textarea",
    "FormField",
    "Checkbox",
    "Switch",
    "Select",
  ].includes(item.name);
  const states: NonNullable<DemoProps["state"]>[] =
    item.name === "Button"
      ? ["default", "loading", "disabled"]
      : ["Input", "Textarea", "FormField"].includes(item.name)
        ? ["default", "error", "readonly", "disabled"]
        : ["default", "disabled"];
  const reviewed = Object.values(reviews).filter(
    ({ status }) => status !== "pending",
  ).length;
  return (
    <ThemeProvider appearance={appearance} className="min-h-screen">
      <Head>
        <title>{`${item.name} · Bubba’s UI`}</title>
        <meta
          name="description"
          content="Review Bubba’s universal components, their states and behavior, with web and Expo examples."
        />
        <link rel="icon" href="/bubbas-ui/brand/favicon.svg" />
      </Head>
      <View className="border-b border-ui-line bg-ui-surface px-4 py-3 md:px-8 md:py-4 short:py-2">
        <View className="mx-auto w-full max-w-[1440px] flex-row flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <View className="flex-row items-center gap-5">
            <View>
              <Image
                source={{ uri: "/bubbas-ui/brand/wordmark.svg" }}
                accessibilityLabel="Bubba’s"
                className="h-9 w-[86px] md:h-[46px] md:w-[114px]"
                resizeMode="contain"
              />
              <Text variant="caption" tone="muted" className="md:hidden">
                {candidateVersion}
              </Text>
            </View>
            <View className="hidden gap-1 md:flex">
              <Text variant="label">UI workbench</Text>
              <Text variant="caption" tone="muted">
                {candidateVersion}
              </Text>
            </View>
          </View>
          <View className="order-2 md:order-3">
            <Choice
              label="Appearance"
              compactLabel
              options={["light", "dark", "system"]}
              value={appearance}
              onChange={setAppearance}
            />
          </View>
          <View className="order-3 w-full flex-row items-center justify-between gap-2 md:order-2 md:w-auto md:gap-4">
            <Link href="/bubbas-ui/foundations/" textClassName="text-sm">
              Foundations
            </Link>
            <Link href="/bubbas-ui/setup/" textClassName="text-sm">
              Setup
            </Link>
            <Button variant="outline" size="sm" onPress={exportReviews}>
              Export notes
            </Button>
          </View>
        </View>
      </View>
      <View className="mx-auto w-full max-w-[1440px] min-w-0 gap-4 px-4 py-5 md:gap-5 md:px-8 md:py-7 lg:px-12 short:gap-3 short:py-4">
        <View className="flex-row flex-wrap items-end justify-between gap-5">
          <View className="min-w-0 gap-2">
            <Heading
              level={1}
              className="text-3xl leading-10 md:text-5xl md:leading-[58px] short:text-4xl short:leading-[44px]"
            >
              {item.name}
            </Heading>
            <Text tone="muted">{item.description}</Text>
          </View>
          <Input
            testID="component-search"
            accessibilityLabel="Find a component"
            placeholder="Find a component…"
            value={query}
            onChangeText={setQuery}
            className="w-full md:w-72"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{
            gap: 20,
            alignItems: "flex-end",
            paddingBottom: 6,
          }}
          testID="preview-controls"
        >
          {item.name === "Button" ? (
            <Choice
              label="Variant"
              options={["primary", "secondary", "outline", "ghost"]}
              value={variant}
              onChange={setVariant}
            />
          ) : null}
          {item.name === "Button" ? (
            <Choice
              label="Size"
              options={["sm", "md", "lg"]}
              value={size}
              onChange={setSize}
            />
          ) : null}
          {stateful ? (
            <Choice
              label="State"
              options={states}
              value={state}
              onChange={setState}
            />
          ) : (
            <Text variant="small" tone="muted">
              Live component preview
            </Text>
          )}
          <Choice
            label="Preview width"
            options={["full", "phone"]}
            value={frame}
            onChange={setFrame}
          />
        </ScrollView>
        <View
          testID="preview-stage"
          className="min-h-[220px] items-center justify-center rounded-xl bg-ui-surface px-5 py-8 md:py-12 md:min-h-[280px] md:px-12 short:min-h-[160px] short:py-6"
        >
          <View
            className={`w-full items-center ${frame === "phone" ? "max-w-[342px]" : "max-w-[880px]"}`}
          >
            <ComponentDemo
              key={`${item.name}-${state}`}
              name={item.name}
              variant={variant}
              size={size}
              state={state}
            />
          </View>
        </View>
        <View className="-mt-3 flex-row flex-wrap items-center justify-between gap-4">
          <Text variant="small" tone="muted">
            Try the component with pointer or keyboard. This preview runs on
            web.
          </Text>
          <Choice
            label="Review"
            options={["pending", "keep", "change"]}
            value={review.status}
            onChange={(status) => update(item.name, { status })}
          />
        </View>
        <View className="gap-4 border-t border-ui-line pt-6 short:gap-3 short:pt-4">
          <View className="flex-row flex-wrap items-center justify-between gap-3">
            <Heading level={2}>Component library</Heading>
            <Text
              variant="small"
              tone="muted"
            >{`${shown.length} of 32 components · ${reviewed} reviewed`}</Text>
          </View>
          <ComponentFilmstrip
            shown={shown}
            current={item.slug}
            reviews={reviews}
            query={query}
            onClear={() => {
              setQuery("");
              setCategory("All");
            }}
          />
          <Choice
            label="Browse"
            options={["All", ...categories]}
            value={category}
            onChange={setCategory}
          />
        </View>
        <View className="gap-10 border-t border-ui-line py-6">
          <CompareStates name={item.name} />
          <View className="gap-4">
            <View className="flex-row flex-wrap items-center justify-between gap-2">
              <Heading level={2}>Review notes</Heading>
              <Text variant="small" tone="muted">
                {storageError
                  ? "Browser storage unavailable. Export before leaving."
                  : "Saved only in this browser"}
              </Text>
            </View>
            <Textarea
              testID="review-note"
              accessibilityLabel={`Review notes for ${item.name}`}
              placeholder="What should change about the look or feel?"
              value={review.note}
              onChangeText={(note) => update(item.name, { note })}
              numberOfLines={4}
            />
            <Text variant="small" tone="muted">
              Export notes to hand changes back. Notes do not change the package
              or Studio source.
            </Text>
          </View>
        </View>
        <Implementation item={item} />
        <View className="flex-row flex-wrap items-center justify-between gap-4 border-t border-ui-line py-5">
          <Text variant="small" tone="muted">
            Bubba’s UI · Universal components, reviewed by eye.
          </Text>
          <View className="flex-row gap-6">
            <Link
              href="https://github.com/handh-dev/bubbas-ui"
              external
              textClassName="text-sm"
            >
              Source
            </Link>
            <Link
              href="https://www.npmjs.com/package/@bubbasfw/ui"
              external
              textClassName="text-sm"
            >
              npm
            </Link>
          </View>
        </View>
      </View>
    </ThemeProvider>
  );
}
