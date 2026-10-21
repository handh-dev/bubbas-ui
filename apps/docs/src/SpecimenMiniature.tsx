import type { ComponentType } from "react";
import { View, type ViewProps } from "react-native";
import * as UI from "@bubbasfw/ui";
import type { ComponentName } from "./showcase/catalog";
const InertView = View as ComponentType<ViewProps & { inert?: boolean }>;
const choices = [
  { value: "small", label: "Small" },
  { value: "large", label: "Large" },
];
function Specimen({ name }: { name: ComponentName }) {
  switch (name) {
    case "Text":
      return <UI.Text>A little room to celebrate.</UI.Text>;
    case "Heading":
      return <UI.Heading level={2}>Good things.</UI.Heading>;
    case "Stack":
      return (
        <UI.Stack gap={2}>
          <UI.Badge>One</UI.Badge>
          <UI.Badge tone="info">Two</UI.Badge>
        </UI.Stack>
      );
    case "Inline":
      return (
        <UI.Inline>
          <UI.Badge>One</UI.Badge>
          <UI.Badge tone="info">Two</UI.Badge>
        </UI.Inline>
      );
    case "Container":
      return (
        <UI.Container reading>
          <UI.Text>Comfortable reading.</UI.Text>
        </UI.Container>
      );
    case "Card":
      return (
        <UI.Card padding={3}>
          <UI.Text variant="label">A quiet surface</UI.Text>
        </UI.Card>
      );
    case "Divider":
      return (
        <UI.Stack gap={2} className="w-full">
          <UI.Text variant="small">Above</UI.Text>
          <UI.Divider />
          <UI.Text variant="small">Below</UI.Text>
        </UI.Stack>
      );
    case "Button":
      return (
        <UI.Button size="sm" tabIndex={-1}>
          Save changes
        </UI.Button>
      );
    case "IconButton":
      return (
        <UI.IconButton accessibilityLabel="Close" tabIndex={-1}>
          <View className="h-4 w-4 items-center justify-center">
            <View className="absolute h-0.5 w-4 rotate-45 bg-ui-text" />
            <View className="absolute h-0.5 w-4 -rotate-45 bg-ui-text" />
          </View>
        </UI.IconButton>
      );
    case "Link":
      return (
        <UI.Link href="#" tabIndex={-1}>
          Explore the source
        </UI.Link>
      );
    case "Badge":
      return (
        <UI.Inline>
          <UI.Badge tone="success">Ready</UI.Badge>
          <UI.Badge tone="warning">Review</UI.Badge>
        </UI.Inline>
      );
    case "Avatar":
      return <UI.Avatar name="Alex Example" />;
    case "ListItem":
      return (
        <UI.ListItem
          title="Example item"
          leading={<UI.Avatar name="Example item" size="sm" />}
        />
      );
    case "Input":
      return <UI.Input placeholder="Your name" readOnly tabIndex={-1} />;
    case "Textarea":
      return (
        <UI.Textarea
          value="A few thoughts…"
          readOnly
          numberOfLines={2}
          tabIndex={-1}
        />
      );
    case "FormField":
      return (
        <UI.FormField label="Display name">
          <UI.Input placeholder="Your name" readOnly tabIndex={-1} />
        </UI.FormField>
      );
    case "Checkbox":
      return <UI.Checkbox checked label="Include option" tabIndex={-1} />;
    case "Switch":
      return <UI.Switch checked label="Show details" tabIndex={-1} />;
    case "RadioGroup":
      return (
        <UI.RadioGroup
          options={choices}
          defaultValue="small"
          orientation="horizontal"
        />
      );
    case "Select":
      return <UI.Select options={choices} defaultValue="small" tabIndex={-1} />;
    case "Tabs":
      return (
        <UI.Tabs
          items={[
            {
              value: "one",
              label: "Overview",
              content: <UI.Text>Overview content.</UI.Text>,
            },
            { value: "two", label: "Details", content: null },
          ]}
        />
      );
    case "Accordion":
      return (
        <UI.Accordion
          items={[
            {
              value: "one",
              title: "What is included?",
              content: <UI.Text>More details.</UI.Text>,
            },
          ]}
        />
      );
    case "Dialog":
      return (
        <UI.Button size="sm" tabIndex={-1}>
          Open dialog
        </UI.Button>
      );
    case "Sheet":
      return (
        <UI.Button size="sm" variant="outline" tabIndex={-1}>
          Open sheet
        </UI.Button>
      );
    case "Alert":
      return <UI.Alert tone="info" title="A useful message" />;
    case "Toast":
      return <UI.Toast title="Example saved" tone="success" duration={0} />;
    case "Spinner":
      return <UI.Spinner label="Loading example" size="large" />;
    case "Progress":
      return <UI.Progress value={60} label="Example progress" />;
    case "Skeleton":
      return (
        <UI.Stack gap={2} className="w-full">
          <UI.Skeleton className="h-5 w-3/4" />
          <UI.Skeleton />
          <UI.Skeleton className="w-2/3" />
        </UI.Stack>
      );
    case "EmptyState":
      return <UI.EmptyState title="Nothing here yet" />;
    case "Breadcrumbs":
      return (
        <UI.Breadcrumbs
          items={[{ label: "Library", href: "#" }, { label: "Button" }]}
        />
      );
    case "Pagination":
      return <UI.Pagination page={2} count={5} onPageChange={() => {}} />;
  }
}
export function SpecimenMiniature({ name }: { name: ComponentName }) {
  return (
    <InertView
      inert
      aria-hidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      testID={`miniature-${name}`}
      className="absolute left-3 right-3 top-3 z-10 h-[64px] items-center justify-center overflow-hidden"
    >
      <View
        className="w-[240px] items-stretch"
        style={{ transform: [{ scale: 0.56 }] }}
      >
        <Specimen name={name} />
      </View>
    </InertView>
  );
}
