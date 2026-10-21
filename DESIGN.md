---
name: Bubba’s UI
description: Reusable Bubba’s interface foundations and universal component patterns.
colors:
  brand-red: "#CC0000"
  brand-blue: "#007CE8"
  brand-navy: "#03256C"
  brand-gold: "#FED766"
  web-selection-text: "#000000"
  light-canvas: "#F7F8FA"
  light-surface: "#FFFFFF"
  light-raised: "#FFFFFF"
  light-hover: "#F6F7F9"
  light-selected: "#ECEEF1"
  light-text: "#131B23"
  light-heading: "#03256C"
  light-muted: "#526075"
  light-line: "#E4E6EA"
  light-border: "#637086"
  light-link: "#03256C"
  light-link-hover: "#A80000"
  light-focus: "#03256C"
  light-focus-inner: "#FFFFFF"
  light-accent: "#CC0000"
  light-action-text: "#FFFFFF"
  light-action-border: "#A80000"
  light-disabled-surface: "#F0F2F5"
  light-disabled-text: "#6B727E"
  light-info: "#03256C"
  light-info-surface: "#F1F5FC"
  light-info-border: "#03256C"
  light-success: "#23633F"
  light-success-surface: "#EAF5EF"
  light-success-border: "#23633F"
  light-warning: "#805500"
  light-warning-surface: "#FFF4D6"
  light-warning-border: "#805500"
  light-error: "#B42318"
  light-error-surface: "#FFF0EF"
  light-error-border: "#B42318"
  light-code-surface: "#171717"
  light-code-text: "#FFFFFF"
  light-code-muted: "#B4B4B4"
  light-selection: "#D9E8FB"
  light-selection-text: "#131B23"
  light-scrollbar: "#637086"
  light-scrollbar-track: "#F7F8FA"
  dark-canvas: "#171717"
  dark-surface: "#202020"
  dark-raised: "#292929"
  dark-hover: "#303030"
  dark-selected: "#383838"
  dark-text: "#FFFFFF"
  dark-heading: "#FFFFFF"
  dark-muted: "#B4B4B4"
  dark-line: "#3D3D3D"
  dark-border: "#858585"
  dark-link: "#8DC7FF"
  dark-link-hover: "#B8DEFF"
  dark-focus: "#FFFFFF"
  dark-focus-inner: "#202020"
  dark-accent: "#FF9F99"
  dark-action-text: "#FFFFFF"
  dark-action-border: "#EF817A"
  dark-disabled-surface: "#242424"
  dark-disabled-text: "#9A9A9A"
  dark-info: "#8DC7FF"
  dark-info-surface: "#1D2D3D"
  dark-info-border: "#8DC7FF"
  dark-success: "#8DDBA9"
  dark-success-surface: "#183323"
  dark-success-border: "#8DDBA9"
  dark-warning: "#FED766"
  dark-warning-surface: "#3A2E12"
  dark-warning-border: "#FED766"
  dark-error: "#FFAEA8"
  dark-error-surface: "#3D2020"
  dark-error-border: "#FFAEA8"
  dark-code-surface: "#171717"
  dark-code-text: "#FFFFFF"
  dark-code-muted: "#B4B4B4"
  dark-selection: "#383838"
  dark-selection-text: "#FFFFFF"
  dark-scrollbar: "#858585"
  dark-scrollbar-track: "#171717"
typography:
  headline:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 30px
    fontWeight: 700
    lineHeight: 40px
  title:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
  subtitle:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 20px
    fontWeight: 700
    lineHeight: 28px
  lead:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 18px
    lineHeight: 28px
  body:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 16px
    lineHeight: 24px
  small:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 14px
    lineHeight: 20px
  caption:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 12px
    lineHeight: 16px
  label:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  tag:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  button-sm:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
  button-md:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
  button-lg:
    fontFamily: Montserrat, Arial, sans-serif
    fontSize: 18px
    fontWeight: 700
    lineHeight: 28px
  code:
    fontFamily: ui-monospace, SFMono-Regular, monospace
    fontSize: 14px
    lineHeight: 24px
rounded:
  control: 4px
  panel: 12px
  tabs: 6px
  pill: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "6": 24px
  "8": 32px
  "12": 48px
  "16": 64px
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.light-action-text}"
    typography: "{typography.button-md}"
    rounded: "{rounded.control}"
    padding: 12px 20px
  button-secondary:
    backgroundColor: "{colors.light-selected}"
    textColor: "{colors.light-text}"
    typography: "{typography.button-md}"
    rounded: "{rounded.control}"
    padding: 12px 20px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.light-text}"
    typography: "{typography.button-md}"
    rounded: "{rounded.control}"
    padding: 12px 20px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.light-link}"
    typography: "{typography.button-md}"
    rounded: "{rounded.control}"
    padding: 12px 20px
  input:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: 12px
  badge-info:
    backgroundColor: "{colors.light-info-surface}"
    textColor: "{colors.light-info}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
  card:
    backgroundColor: "{colors.light-surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.6}"
  pagination:
    typography: "{typography.small}"
  checkbox:
    textColor: "{colors.light-text}"
    rounded: "{rounded.control}"
    padding: 8px 0
  alert-info:
    backgroundColor: "{colors.light-info-surface}"
    textColor: "{colors.light-info}"
    rounded: "{rounded.panel}"
    padding: "{spacing.4}"
---

# Design System: Bubba’s UI

## Overview

Bubba’s UI preserves the established Brand Studio identity: Montserrat on the public web, navy headings in light appearance, blue review selections, red actions, and light or charcoal semantic surfaces. Fine borders and tonal groups separate content; controls use small corners and containers use broader corners.

The reusable package uses React Native primitives and NativeWind on web and native. Its font is supplied by the consumer; the public docs load the cleared Montserrat font. The approved logo has separate distribution terms from the MIT code.

**Key Characteristics:**

- Red actions and semantic feedback colors.
- Light surfaces and neutral charcoal dark surfaces.
- Small control corners, broader panel corners, and fine boundaries.
- Visible keyboard focus and minimum touch targets.

This is a scan of the implemented system after the visual correction review. It introduces no new visual-world metaphor. Source authority is [PRODUCT.md](PRODUCT.md), [foundation provenance](docs/brand-sources.md), and the pinned implementation in [tokens.ts](packages/ui/src/tokens.ts), [theme.tsx](packages/ui/src/theme.tsx), and the [Tailwind preset](packages/ui/tailwind-preset.cjs). The docs-specific composition remains in its [surface brief](apps/docs/.impeccable/surfaces/apps-docs-pages-index-tsx.md).

## Colors

The frontmatter records the pinned brand colors and complete light/dark semantic color maps. Semantic role names match the source; select a theme through ThemeProvider rather than replacing individual colors.

### Primary

Bubba’s Red marks primary actions, checked choices, radio indicators, and progress. The primary button keeps its brand-red fill in both themes; its border adapts through the action-border role. Bubba’s Navy carries light-theme headings and links. Dark-theme headings use the dark heading role.

### Secondary

Bubba’s Blue marks selected review controls on the docs site, with black labels. The docs also use that pairing for browser text selection and blue carets. Shared Input text selection separately follows the theme’s selection role. Gold is an existing brand color and the dark warning foreground.

### Neutral

Light appearance uses a light canvas, white surfaces, ink text, muted supporting text, and fine lines. Dark appearance uses charcoal canvas, surface, raised, hover, and selected layers with white text. Use border for control outlines and line for quiet separators; they serve different contrast needs.

Info, success, warning, and error each have foreground, surface, and border roles in both themes. Badge and Alert use the foreground/surface pair. Disabled controls use their dedicated surface/text pair where implemented; several pressable choices instead reduce opacity.

## Typography

**Web font:** Montserrat, with Arial and sans-serif fallbacks. The docs load the cleared font from their own public assets. **Native font:** the platform font until the consuming app loads a licensed font. The shared package ships no font binary. Code uses the platform monospace stack.

The frontmatter’s type entries describe the shared scale with the docs’ web font binding. They do not make Montserrat a bundled package dependency. Heading is bold; Text separates body, lead, small, label, caption, and code roles. Button labels are bold; field labels and tab labels are semibold; choice labels use medium weight.

| Frontmatter role | Implemented source |
| --- | --- |
| headline / title / subtitle | Heading levels 1 / 2 / 3 |
| lead / body / small / caption / label / code | Matching Text variant |
| tag | Badge’s small semibold text |
| button-sm / button-md / button-lg | Matching Button size |

Heading levels 4–6 remain in the component API. The docs workbench overrides its page heading responsively; those page-specific sizes are not shared Heading defaults. Body and lead text retain explicit line heights rather than relying on the font’s metrics.

## Layout

The pinned spacing scale follows a four-unit base. Stack defaults to spacing step 4; Inline defaults to step 3 and wraps. Both expose the implemented spacing steps, alignment, and justification props. Card defaults to step 6 padding.

Container fills available width, centers itself, and offers the normal maximum width (1200px) or reading width (720px). Its horizontal padding is 16px, increases to 24px at Tailwind sm (640px), and to 32px at Tailwind lg (1024px). The token file also declares compact (640px) and wide (960px); the preset does not replace Tailwind’s default screens, so wide is not an alias for lg.

Interactive controls preserve a minimum target of 44 units; common text inputs and medium buttons use a 48-unit minimum height. These values are CSS pixels on web and native layout units in React Native. Small/medium/large Button minimum heights are 44/48/56, with horizontal padding 12/20/24 and vertical padding 8/12/16. Content may increase their height.

Responsive page compositions belong to their surface briefs. The docs’ preview-and-filmstrip arrangement does not prescribe how a consuming app organizes its screens.

## Elevation & Depth

The shared components currently separate surfaces through tone and fine borders. Card has no shadow; Button has no hover lift. Dialog and Sheet use a half-black backdrop, constrained scrollable content, and no entrance animation. Their normal and sheet content widths are capped at 560px and 720px respectively, with an 85% maximum height.

The source also pins action, panel, and dialog shadow strings for each theme. They are catalogued in the sidecar as available tokens; the current shared components do not apply them. Do not infer a shadow treatment from the token’s presence alone.

The feedback duration is pinned at 140ms. It does not add a transition automatically to every component. The docs disable smooth scrolling under reduced motion; shared Skeleton is static and shared overlays use no animation.

## Shapes

Controls use the control radius; Card, Alert, and dialog panels use the panel radius. Tabs use a slightly larger outer wrapper (6px) around control-radius tabs. Badge, Avatar, progress tracks, and switch tracks use full rounding. Sheet rounds only its top corners. One-pixel lines group content; control outlines are one pixel, while checkbox and radio outlines are two pixels. Checkmarks and chevrons are small functional geometry.

## Components

### Buttons and links

Button exposes primary, secondary, outline, and ghost variants; sizes are sm, md, and lg. Primary has white action text on red, secondary has text on the selected surface, outline is transparent with a control border, and ghost is transparent with link-colored text. Pressed buttons reduce opacity to 80%; no shared hover recolor is implemented. On web, focus uses a two-pixel outline with two-pixel offset in the theme’s focus color. Explicitly disabled buttons use dedicated disabled paint. Loading disables activation, displays an ActivityIndicator, and may replace the label through loadingLabel.

IconButton uses a 48-unit square with primary, outline, and ghost variants. Link remains underlined with link-colored text and a minimum target; it accepts href and external. Icons are provided by the consumer, not by a bundled icon family.

### Cards and content

Card is a bordered surface with panel corners and configurable padding. Divider is a one-pixel line. Badge is a small semibold pill with neutral, info, success, warning, and error tones; it communicates status and is not an interactive filter. Avatar clips images or initials to a circle. ListItem uses a minimum-height row, a bottom line, and optional leading/trailing content; onPress makes it actionable.

### Inputs and choices

Input uses a surface fill, control border, control radius, and step 3 padding. FormField associates its visible label, hint, error, required state, and disabled state with the control. Invalid inputs change the border to error; disabled inputs use disabled paint. Read-only remains distinct from disabled. Textarea adds multiline behavior and a 120-unit minimum height.

Checkbox and Switch expose checked/defaultChecked/onCheckedChange, label, description, invalid, and disabled; Checkbox also supports indeterminate. Checked controls use red, with white check/track geometry. RadioGroup uses red circular selection indicators and supports horizontal or vertical orientation. Select opens a labeled single-choice Dialog rather than a platform HTML select. Tabs use a selected-surface wrapper and surface-filled active tab; web arrow keys move and activate the selection.

### Navigation and disclosure

Breadcrumbs uses underlined ancestor links, small chevrons, and current-page text. Pagination uses small outline buttons and a live page label, disabling unavailable directions. Accordion is single-open, with a bottom separator and an expanding chevron; an empty value collapses all sections.

### Feedback and overlays

Alert groups a title, optional description, and children on a semantic tonal surface with panel corners and step 4 padding. Toast adds optional timing and a dismiss action; the consumer chooses its position. Progress uses a red indicator on a rounded selected-surface track. Spinner uses an ActivityIndicator; Skeleton stays static. Dialog and Sheet share open/defaultOpen/onOpenChange, title, description, closeLabel, and backdrop dismissal behavior. Their native and web behavior comes from the shared React Native implementation.

The sidecar contains ten self-contained HTML/CSS web translations for preview tooling. They expand the implemented utilities and resolve theme variables with light-theme fallbacks; they do not supply React state, NativeWind, or the package’s native behavior.

## Do's and Don'ts

### Do:

- **Do** use the pinned semantic theme roles for surfaces, text, borders, focus, and feedback.
- **Do** preserve red actions, navy light-theme headings, and the docs’ blue selections with black labels.
- **Do** keep shared components on React Native primitives and NativeWind.
- **Do** provide visible labels, keyboard focus, meaningful states, and minimum touch targets.
- **Do** load a licensed font in a native consumer before reviewing font parity.

### Don't:

- **Don’t** replace the charcoal dark baseline with navy or glow treatments.
- **Don’t** add Eurostile, mascot art, or unreviewed recovered artwork to public assets.
- **Don’t** infer MIT artwork or trademark rights from the code license.
- **Don’t** turn the docs’ preview-and-filmstrip composition into a required application layout.
- **Don’t** treat static HTML/CSS sidecar previews as shared native component implementations.
