import { View } from "react-native";
import * as UI from "@bubbasfw/ui";
import type { DemoContext } from "./Demo";
const choices = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium", disabled: true },
  { value: "large", label: "Large" },
];
export function renderFormsDemo({
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
    case "Input":
      return (
        <UI.Stack className="w-full max-w-md">
          {input}
          <UI.Input
            accessibilityLabel="Read only example"
            value="Read only value"
            readOnly
          />
          <UI.Input
            accessibilityLabel="Disabled example"
            value="Disabled value"
            disabled
          />
        </UI.Stack>
      );
    case "Textarea":
      return (
        <UI.Textarea
          className="w-full max-w-md"
          accessibilityLabel="Example notes"
          placeholder="Write a few thoughts…"
          value={value}
          onChangeText={setValue}
          numberOfLines={4}
          disabled={disabled}
          readOnly={state === "readonly"}
          invalid={state === "error"}
        />
      );
    case "FormField":
      return (
        <UI.FormField
          className="w-full max-w-md"
          label="Display name"
          hint="Use a name people will recognize."
          error={
            state === "error" ? "Enter a display name to continue." : undefined
          }
          required
          disabled={disabled}
        >
          {input}
        </UI.FormField>
      );
    case "Checkbox":
      return (
        <UI.Stack>
          <UI.Checkbox
            testID="demo-checkbox"
            checked={checked}
            onCheckedChange={setChecked}
            label="Include this option"
            description="A clear independent choice."
            disabled={disabled}
          />
          <UI.Checkbox checked={false} indeterminate label="Mixed selection" />
          <UI.Checkbox checked disabled label="Disabled selection" />
        </UI.Stack>
      );
    case "Switch":
      return (
        <UI.Switch
          testID="demo-switch"
          checked={checked}
          onCheckedChange={setChecked}
          label="Show example details"
          description="Changes immediately."
          disabled={disabled}
        />
      );
    case "RadioGroup":
      return (
        <UI.RadioGroup
          testID="demo-radio"
          label="Example size"
          options={choices}
          value={selection}
          onValueChange={setSelection}
        />
      );
    case "Select":
      return (
        <UI.Select
          testID="demo-select"
          label="Example size"
          options={choices}
          value={selection}
          onValueChange={setSelection}
          disabled={disabled}
        />
      );
    case "Tabs":
      return (
        <UI.Tabs
          className="w-full"
          testID="demo-tabs"
          items={[
            {
              value: "overview",
              label: "Overview",
              content: <UI.Text>Overview panel content.</UI.Text>,
            },
            {
              value: "unavailable",
              label: "Unavailable",
              disabled: true,
              content: text,
            },
            {
              value: "details",
              label: "Details",
              content: <UI.Text>Details panel content.</UI.Text>,
            },
          ]}
        />
      );
  }
}
