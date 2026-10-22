import { View } from 'react-native';
import { Card, Heading, Link, Text } from '@bubbasfw/ui';
import { tokens } from '@bubbasfw/ui/tokens';
import { Guide } from '../src/Guide';

const contracts = [
  ['Hierarchy and layout', 'One page title. Put the task, its current state, and its main action first. Use 1200 px maximum page width and 720 px reading width, with 16/24/32 px gutters. Reflow at 640 and 960 px; inspect 320 px, typical phone, tablet, and desktop. Keep long reading comfortable and tables scrollable within their own region.'],
  ['Space and shape', 'Use the 4 px baseline: 4, 8, 12, 16, 24, 32, 48, 64. Group related controls with 8–12 px, content with 16–24 px, sections with 32–64 px. Controls use 4 px corners; independent panels use 12 px. Reserve cards for information that belongs together.'],
  ['Motion', 'Feedback takes 140 ms. Motion confirms a real change and never delays the task. Honor reduced motion: remove transitions, animated transforms, parallax, and decorative movement. Shared overlays appear without forced animation and Skeleton stays still. Essential progress remains labeled.'],
  ['Color and appearance', 'Use semantic roles for UI and original brand inks for identity. Light information surfaces and neutral charcoal dark surfaces share the same hierarchy. Brand blue and navy belong to illustration and bounded campaign treatments. Red marks the primary action; gold is a small accent. Offer Light/Dark/System in tools and native apps; fixed marketing compositions are deliberate.'],
  ['Focus and keyboard', 'Every action works with keyboard and pointer. Use a visible 2 px focus outline with 2 px separation and at least 3:1 contrast. Preserve a logical order. Radio groups and tabs use one tab stop plus arrow/Home/End navigation; dialogs trap focus, close with Escape, and return to their actual trigger. Never hide focus as decoration.'],
  ['Targets and text', 'Targets are 48 px by default and never smaller than 44 × 44 px. Support native text scaling and browser zoom; avoid fixed content heights and truncated essential copy. Body text and labels meet 4.5:1; meaningful boundaries meet 3:1. White small text on bright blue fails the body-text requirement: use black or a solid information surface.'],
  ['Names and semantics', 'Use a button for an action and a link for a destination. Icon actions need an accessible name. Visible labels remain present for fields. FormField connects labels, hints, errors, required and disabled states. Use headings in order; meaningful images get plain alt text and decorative artwork stays out of the accessible name.'],
  ['States and feedback', 'Show default, hover, pressed, keyboard focus, selected, disabled, busy, invalid, and read only where relevant. Busy actions block duplicate submission. Disabled explains a prerequisite when needed. Loading names the work; empty offers a next step; errors preserve user input and provide recovery; offline identifies saved content and unavailable actions. Status always has text, not color alone.'],
  ['Forms and decisions', 'Keep input labels visible, instructions beside the relevant field, and validation specific. Retain values after failure. Ask for confirmation for consequential destructive actions with a named object and a clear consequence. Dialog and Sheet remain focused tasks; longer flows deserve a page. Toast is supplementary feedback, never the only record of an important outcome.'],
  ['Honest data', 'A known zero is zero. Missing stays unknown; stale identifies its saved time/source; failed retrieval is unavailable; ended offers stay ended. Published hours and reported Open/Closed are separate. Retail and case prices are separate. A design example is sample content and establishes no current business fact.'],
  ['Platform behavior', 'Shared package components use React Native primitives and NativeWind. Native apps retain safe areas, status bars, hardware back, system input and existing platform navigation. Existing web apps may use their own semantic HTML adapter with the same pinned foundations. Consumers own routing, data, authorization, persistence and device acceptance.'],
  ['Contribution and reuse', 'Find the component, task pattern and real consumer example first. Extend the shared implementation for a repeated need, integrate the requesting app, then update the catalog, source contracts, examples, and behavior checks. Preserve compatible APIs. A preview note proposes a change; it does not approve identity or release software.'],
] as const;

export default function Reference() {
  return <Guide title="System reference" description="The rules that connect identity, interface behavior, and product journeys.">
    <View className="rounded-xl border border-ui-line bg-ui-surface p-5 gap-2">
      <Text variant="label">{`@bubbasfw/ui · Foundation ${tokens.systemVersion} · Brand ${tokens.brandVersion}`}</Text>
      <Text>Brand Studio supplies an immutable public-safe foundation release. The package vendors that release and verifies its source identity, file rights, checksums, semantic roles and contrast before building. Consumers pin the package or a platform adapter at build time.</Text>
      <Link href="/bubbas-ui/foundations/">Inspect the foundations</Link>
    </View>
    <View className="gap-6">
      {contracts.map(([title, description]) => <View key={title} className="gap-3 border-t border-ui-line pt-6">
        <Heading level={2}>{title}</Heading><Text>{description}</Text>
      </View>)}
    </View>
    <Card className="gap-3">
      <Heading level={2}>Acceptance belongs to the journey</Heading>
      <Text>Check the actual product with pointer and keyboard, light/dark/system, phone and desktop, long content, missing data, request failure and offline recovery. Native bundles and a passing web build do not prove installed iOS/Android interaction or assistive technology support. Record the exact source/package identity beside the evidence.</Text>
      <Link href="/bubbas-ui/patterns/">Try the shared task patterns</Link>
    </Card>
  </Guide>;
}
