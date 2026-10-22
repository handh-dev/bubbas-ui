import { useState } from "react";
import * as UI from "../index";
import type { ComponentName } from "./catalog";

export interface DemoProps {
  name: ComponentName;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  state?: "default" | "disabled" | "loading" | "error" | "readonly";
}
import { renderFoundationsDemo } from "./FoundationsDemo";
import { renderFormsDemo } from "./FormsDemo";
import { renderFeedbackDemo } from "./FeedbackDemo";
function useDemoState({ name, variant, size, state }: Required<DemoProps>) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [selection, setSelection] = useState("small");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [presses, setPresses] = useState(0);
  const disabled = state === "disabled";
  const text = <UI.Text>Everything has its place.</UI.Text>;
  const input = (
    <UI.Input
      testID="demo-input"
      accessibilityLabel="Example name"
      value={value}
      onChangeText={setValue}
      placeholder="Your name"
      disabled={disabled}
      readOnly={state === "readonly"}
      invalid={state === "error"}
    />
  );
  return {
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
  };
}
export type DemoContext = ReturnType<typeof useDemoState>;
export function ComponentDemo({
  name,
  variant = "primary",
  size = "md",
  state = "default",
}: DemoProps) {
  const context = useDemoState({ name, variant, size, state });
  return (
    renderFoundationsDemo(context) ??
    renderFormsDemo(context) ??
    renderFeedbackDemo(context) ??
    null
  );
}
