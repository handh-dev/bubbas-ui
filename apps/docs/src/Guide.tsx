import type { ReactNode } from "react";
import Head from "next/head";
import { View } from "react-native";
import { Heading, Link, Text, ThemeProvider } from "@bubbasfw/ui";
import { Choice } from "./Choice";
import { useReview } from "./review";
export function Guide({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { appearance, setAppearance } = useReview();
  return (
    <ThemeProvider appearance={appearance} className="min-h-screen">
      <Head>
        <title>{`${title} · Bubba’s UI`}</title>
      </Head>
      <View className="mx-auto w-full max-w-[1200px] gap-10 px-5 py-6 md:px-8">
        <View className="flex-row flex-wrap items-center justify-between gap-4 border-b border-ui-line pb-5">
          <Link href="/bubbas-ui/">Back to the workbench</Link>
          <Choice
            label="Appearance"
            options={["light", "dark", "system"]}
            value={appearance}
            onChange={setAppearance}
          />
        </View>
        <View className="gap-3">
          <Heading level={1}>{title}</Heading>
          <Text tone="muted" variant="lead">
            {description}
          </Text>
        </View>
        {children}
        <View className="border-t border-ui-line py-5">
          <Link href="/bubbas-ui/">Review components</Link>
        </View>
      </View>
    </ThemeProvider>
  );
}
