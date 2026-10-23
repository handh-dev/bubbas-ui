export const catalog = [
  [
    "Text",
    "Foundations",
    "Readable body copy, labels, captions and code.",
    "variant, tone, children",
  ],
  [
    "Heading",
    "Foundations",
    "A consistent hierarchy for clear page structure.",
    "level, children",
  ],
  [
    "Stack",
    "Foundations",
    "Vertical rhythm with shared spacing.",
    "gap, align, justify",
  ],
  [
    "Inline",
    "Foundations",
    "Horizontal groups that can wrap naturally.",
    "gap, align, justify, wrap",
  ],
  [
    "Container",
    "Foundations",
    "Comfortable content and reading widths.",
    "reading",
  ],
  ["Card", "Foundations", "A quiet surface for related content.", "padding"],
  [
    "Divider",
    "Foundations",
    "Separate content without competing with it.",
    "orientation",
  ],
  [
    "Button",
    "Actions",
    "Clear actions, in every size and state.",
    "variant, appearance, size (marketing lg: featured), loading, disabled, onPress",
  ],
  [
    "IconButton",
    "Actions",
    "A compact action with an accessible name.",
    "accessibilityLabel, variant, onPress",
  ],
  [
    "Link",
    "Actions",
    "Named destinations on web and native.",
    "href, external, disabled",
  ],
  [
    "Badge",
    "Content",
    "Small labels with meaningful status tones.",
    "tone, children",
  ],
  [
    "Avatar",
    "Content",
    "An image or readable initials fallback.",
    "name, source, size",
  ],
  [
    "ListItem",
    "Content",
    "A title, description and optional action.",
    "title, description, leading, trailing, onPress",
  ],
  [
    "Input",
    "Forms",
    "A single-line field with native input behavior.",
    "value, onChangeText, disabled, readOnly, invalid",
  ],
  [
    "Textarea",
    "Forms",
    "Room for longer notes and descriptions.",
    "value, onChangeText, numberOfLines, readOnly",
  ],
  [
    "FormField",
    "Forms",
    "Connect labels, hints and errors to an input.",
    "label, hint, error, required, disabled",
  ],
  [
    "Checkbox",
    "Forms",
    "An independent choice, including a mixed state.",
    "checked, onCheckedChange, indeterminate, label",
  ],
  [
    "Switch",
    "Forms",
    "An immediate on or off preference.",
    "checked, onCheckedChange, label, disabled",
  ],
  [
    "RadioGroup",
    "Forms",
    "Choose one clearly labeled option.",
    "options, value, onValueChange, orientation",
  ],
  [
    "Select",
    "Forms",
    "A native-friendly chooser in a focused dialog.",
    "options, value, onValueChange, placeholder, label",
  ],
  [
    "Tabs",
    "Navigation",
    "Switch between related content panels.",
    "items, value, onValueChange, orientation",
  ],
  [
    "Accordion",
    "Disclosure",
    "Reveal a section when it is useful.",
    "items, value, onValueChange",
  ],
  [
    "Dialog",
    "Disclosure",
    "A focused decision with explicit dismissal.",
    "open, onOpenChange, title, description, children",
  ],
  [
    "Sheet",
    "Disclosure",
    "A bottom-aligned panel for a focused task.",
    "open, onOpenChange, title, description, children",
  ],
  [
    "Alert",
    "Feedback",
    "An important message with a useful next step.",
    "title, description, tone, announce",
  ],
  [
    "Toast",
    "Feedback",
    "A dismissible, nonmodal notification.",
    "open, onOpenChange, duration, title, tone",
  ],
  [
    "Spinner",
    "Feedback",
    "An accessible signal that work is underway.",
    "label, size",
  ],
  [
    "Progress",
    "Feedback",
    "A labeled, bounded measure of completion.",
    "value, max, label",
  ],
  [
    "Skeleton",
    "Feedback",
    "A quiet placeholder without forced motion.",
    "className",
  ],
  [
    "EmptyState",
    "Content",
    "Explain an empty view and offer a next step.",
    "title, description, children",
  ],
  [
    "Breadcrumbs",
    "Navigation",
    "Show where the current page belongs.",
    "items, label",
  ],
  [
    "Pagination",
    "Navigation",
    "Move through a bounded set of pages.",
    "page, count, onPageChange",
  ],
] as const;
export type ComponentName = (typeof catalog)[number][0];
export const slugFor = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
export const components = catalog.map(
  ([name, category, description, props]) => ({
    name,
    category,
    description,
    props,
    slug: slugFor(name),
  }),
);
export const categories = [...new Set(components.map((item) => item.category))];
export const candidateVersion = "0.8.3";
