import { View } from "react-native";
import * as UI from "@bubbasfw/ui";
import type { DemoContext } from "./Demo";
const choices = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium", disabled: true },
  { value: "large", label: "Large" },
];
export function renderFoundationsDemo({
  name,
  variant,
  size,
  state,
  value,
  setValue,
  checked,
  setChecked,
  selection,
  setSelection,
  open,
  setOpen,
  page,
  setPage,
  presses,
  setPresses,
  disabled,
  text,
  input,
}: DemoContext) {
  switch (name) {
    case "Text":
      return (
        <UI.Stack>
          <UI.Text variant="lead">A little room to celebrate.</UI.Text>
          <UI.Text>Clear, comfortable reading for every screen.</UI.Text>
          <UI.Text variant="small" tone="muted">
            Supporting information stays readable.
          </UI.Text>
          <UI.Text variant="code">@bubbasfw/ui</UI.Text>
        </UI.Stack>
      );
    case "Heading":
      return (
        <UI.Stack>
          <UI.Heading level={1}>Make room for good things.</UI.Heading>
          <UI.Heading level={2}>A clear second thought.</UI.Heading>
          <UI.Heading level={3}>The details belong here.</UI.Heading>
        </UI.Stack>
      );
    case "Stack":
      return (
        <UI.Stack gap={4}>
          <UI.Badge>First item</UI.Badge>
          <UI.Badge tone="info">Second item</UI.Badge>
          <UI.Badge tone="success">Third item</UI.Badge>
        </UI.Stack>
      );
    case "Inline":
      return (
        <UI.Inline>
          <UI.Badge>One</UI.Badge>
          <UI.Badge tone="info">Two</UI.Badge>
          <UI.Badge tone="success">Three</UI.Badge>
        </UI.Inline>
      );
    case "Container":
      return (
        <UI.Container reading>
          <UI.Text>
            A reading container holds content at a comfortable measure. Resize
            the screen to see its edges adapt.
          </UI.Text>
        </UI.Container>
      );
    case "Card":
      return (
        <UI.Card className="w-full max-w-sm">
          <UI.Stack gap={2}>
            <UI.Heading level={2}>A place for the details</UI.Heading>
            <UI.Text tone="muted">
              Related content, grouped with a quiet boundary.
            </UI.Text>
          </UI.Stack>
        </UI.Card>
      );
    case "Divider":
      return (
        <UI.Stack className="w-full">
          <UI.Text>Above the divider</UI.Text>
          <UI.Divider />
          <UI.Text>Below the divider</UI.Text>
        </UI.Stack>
      );
    case "Button":
      return (
        <UI.Stack align="center">
          <UI.Button
            testID="demo-button"
            variant={variant}
            size={size}
            disabled={disabled}
            loading={state === "loading"}
            loadingLabel="Saving…"
            onPress={() => setPresses(presses + 1)}
          >
            Save changes
          </UI.Button>
          <UI.Text
            testID="demo-button-count"
            variant="small"
            tone="muted"
            accessibilityLiveRegion="polite"
          >
            {presses
              ? `Pressed ${presses} ${presses === 1 ? "time" : "times"}`
              : "Try the action"}
          </UI.Text>
        </UI.Stack>
      );
    case "IconButton":
      return (
        <UI.IconButton
          accessibilityLabel="Close example"
          disabled={disabled}
          onPress={() => setPresses(presses + 1)}
        >
          <View
            accessible={false}
            className="h-4 w-4 items-center justify-center"
          >
            <View className="absolute h-0.5 w-4 rotate-45 bg-ui-text" />
            <View className="absolute h-0.5 w-4 -rotate-45 bg-ui-text" />
          </View>
        </UI.IconButton>
      );
    case "Link":
      return (
        <UI.Link
          href="https://github.com/handh-dev/bubbas-ui"
          external
          disabled={disabled}
        >
          Explore the source
        </UI.Link>
      );
    case "Badge":
      return (
        <UI.Inline>
          <UI.Badge>Draft</UI.Badge>
          <UI.Badge tone="info">Information</UI.Badge>
          <UI.Badge tone="success">Ready</UI.Badge>
          <UI.Badge tone="warning">Review</UI.Badge>
          <UI.Badge tone="error">Needs attention</UI.Badge>
        </UI.Inline>
      );
    case "Avatar":
      return (
        <UI.Inline>
          <UI.Avatar name="Alex Example" size="sm" />
          <UI.Avatar name="Alex Example" />
          <UI.Avatar name="Alex Example" size="lg" />
        </UI.Inline>
      );
    case "ListItem":
      return (
        <UI.Stack gap={0} className="w-full">
          <UI.ListItem
            title="Example collection"
            description="A demonstration item"
            leading={<UI.Avatar name="Example collection" />}
            trailing={<UI.Badge>Draft</UI.Badge>}
            onPress={() => setPresses(presses + 1)}
            disabled={disabled}
          />
          <UI.Text
            variant="small"
            tone="muted"
          >{`Selected ${presses} times`}</UI.Text>
        </UI.Stack>
      );
  }
}
