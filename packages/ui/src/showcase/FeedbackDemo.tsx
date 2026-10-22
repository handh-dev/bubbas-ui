import { View } from "react-native";
import * as UI from "../index";
import type { DemoContext } from "./Demo";
const choices = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium", disabled: true },
  { value: "large", label: "Large" },
];
export function renderFeedbackDemo({
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
    case "Accordion":
      return (
        <UI.Accordion
          className="w-full"
          items={[
            {
              value: "first",
              title: "What is included?",
              content: (
                <UI.Text>
                  The same universal components run on web and native.
                </UI.Text>
              ),
            },
            {
              value: "second",
              title: "Can I change the appearance?",
              content: (
                <UI.Text>
                  Use the shared theme and supported component variants.
                </UI.Text>
              ),
            },
            {
              value: "third",
              title: "Unavailable section",
              content: text,
              disabled: true,
            },
          ]}
        />
      );
    case "Dialog":
    case "Sheet": {
      const Overlay = name === "Dialog" ? UI.Dialog : UI.Sheet;
      return (
        <UI.Stack>
          <UI.Inline>
            <UI.Button
              testID="overlay-trigger"
              disabled={disabled}
              onPress={() => setOpen(true)}
            >{`Open ${name.toLowerCase()}`}</UI.Button>
            <UI.Button
              testID="overlay-trigger-two"
              variant="outline"
              onPress={() => setOpen(true)}
            >
              Another trigger
            </UI.Button>
          </UI.Inline>
          <Overlay
            testID="demo-overlay"
            open={open}
            onOpenChange={setOpen}
            title="Review this example"
            description="A demo of a focused, dismissible surface."
          >
            <UI.Stack>
              <UI.Input
                accessibilityLabel="Example title"
                placeholder="Example title"
              />
              <UI.Button onPress={() => setOpen(false)}>
                Done reviewing
              </UI.Button>
            </UI.Stack>
          </Overlay>
        </UI.Stack>
      );
    }
    case "Alert":
      return (
        <UI.Stack className="w-full">
          <UI.Alert
            title="This is an example message"
            description="Useful details explain what happens next."
            tone={state === "error" ? "error" : "info"}
          />
          <UI.Alert
            title="Ready to continue"
            description="A success message with a clear label."
            tone="success"
          />
        </UI.Stack>
      );
    case "Toast":
      return (
        <UI.Stack className="w-full">
          <UI.Button variant="outline" onPress={() => setOpen(true)}>
            Show notification
          </UI.Button>
          <UI.Toast
            testID="demo-toast"
            open={open}
            onOpenChange={setOpen}
            title="Example saved"
            description="Your demonstration changes are ready."
            tone="success"
            duration={0}
          />
        </UI.Stack>
      );
    case "Spinner":
      return (
        <UI.Inline>
          <UI.Spinner label="Loading example" />
          <UI.Spinner label="Loading large example" size="large" />
          <UI.Text tone="muted">Loading example…</UI.Text>
        </UI.Inline>
      );
    case "Progress":
      return (
        <UI.Stack className="w-full max-w-md">
          <UI.Progress
            testID="demo-progress"
            value={page * 20}
            label="Example progress"
          />
          <UI.Text variant="small">{`${page * 20}% complete`}</UI.Text>
          <UI.Button
            variant="outline"
            onPress={() => setPage(page === 5 ? 1 : page + 1)}
          >
            Advance progress
          </UI.Button>
        </UI.Stack>
      );
    case "Skeleton":
      return (
        <UI.Stack className="w-full max-w-sm">
          <UI.Skeleton className="h-12 w-12 rounded-full" />
          <UI.Skeleton className="h-5 w-3/4" />
          <UI.Skeleton />
          <UI.Skeleton className="w-2/3" />
        </UI.Stack>
      );
    case "EmptyState":
      return (
        <UI.EmptyState
          title="Nothing here yet"
          description="Add your first example to see it here."
        >
          <UI.Button onPress={() => setPresses(presses + 1)}>
            {presses ? "Example added" : "Add an example"}
          </UI.Button>
        </UI.EmptyState>
      );
    case "Breadcrumbs":
      return (
        <UI.Breadcrumbs
          items={[
            {
              label: "Library",
              href: "https://github.com/handh-dev/bubbas-ui",
            },
            {
              label: "Components",
              href: "https://github.com/handh-dev/bubbas-ui",
            },
            { label: "Button" },
          ]}
        />
      );
    case "Pagination":
      return (
        <UI.Pagination
          testID="demo-pagination"
          page={page}
          count={5}
          onPageChange={setPage}
        />
      );
  }
}
