import { View } from "react-native";
import { Button, Heading, Input, Text } from "@bubbasfw/ui";
import { ComponentDemo } from "./showcase/Demo";
import type { ComponentName } from "./showcase/catalog";
export function CompareStates({ name }: { name: ComponentName }) {
  if (name === "Button")
    return (
      <View className="gap-5">
        <Heading level={2}>Compare the family</Heading>
        <Text tone="muted">
          Default, loading and disabled. Every variant uses the same medium
          size.
        </Text>
        {(["primary", "secondary", "outline", "ghost"] as const).map(
          (variant) => (
            <View
              key={variant}
              className="gap-3 border-b border-ui-line py-4 md:flex-row md:items-center"
            >
              <Text variant="label" className="md:w-32">
                {variant[0].toUpperCase() + variant.slice(1)}
              </Text>
              <View className="flex-1 flex-row flex-wrap gap-4">
                <Button variant={variant}>Save changes</Button>
                <Button variant={variant} loading loadingLabel="Saving…">
                  Save changes
                </Button>
                <Button variant={variant} disabled>
                  Save changes
                </Button>
              </View>
            </View>
          ),
        )}
      </View>
    );
  const states = ["Input", "Textarea", "FormField"].includes(name)
    ? (["default", "error", "readonly", "disabled"] as const)
    : [
          "Checkbox",
          "Switch",
          "Select",
          "IconButton",
          "Link",
          "ListItem",
        ].includes(name)
      ? (["default", "disabled"] as const)
      : (["default"] as const);
  return (
    <View className="gap-5">
      <Heading level={2}>A closer look</Heading>
      <Text tone="muted">
        {states.length > 1
          ? "Compare the supported states below."
          : "Use the live preview above to review interaction. Check both light and dark appearance."}
      </Text>
      {states.length > 1 ? (
        <View className="flex-row flex-wrap gap-8">
          {states.map((state) => (
            <View key={state} className="min-w-0 flex-1 basis-64 gap-4">
              <Text variant="label">
                {state[0].toUpperCase() + state.slice(1)}
              </Text>
              <View className="rounded-xl bg-ui-surface p-5">
                {name === "Input" ? (
                  <Input
                    testID={`comparison-input-${state}`}
                    accessibilityLabel={`${state} input example`}
                    defaultValue="Example value"
                    invalid={state === "error"}
                    readOnly={state === "readonly"}
                    disabled={state === "disabled"}
                  />
                ) : (
                  <ComponentDemo name={name} state={state} />
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-2">
          <Text>
            Check text length, keyboard focus, spacing and touch targets.
          </Text>
          <Text tone="muted">
            This is a live React Native Web preview. Run the Expo example to
            review actual native rendering.
          </Text>
        </View>
      )}
    </View>
  );
}
