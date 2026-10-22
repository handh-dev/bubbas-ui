import { View } from 'react-native';
import { Heading, Link, Text } from '@bubbasfw/ui';
import { Guide } from '../src/Guide';
import { PatternsDemo } from '../src/showcase/PatternsDemo';

export default function Patterns() {
  return <Guide title="Task patterns" description="Small, shared compositions for real work. Content, storage, permissions, and business rules stay with the app.">
    <PatternsDemo />
    <View className="gap-4">
      <Heading level={2}>AppearanceControl</Heading>
      <Text>Offer Light, Dark, and System in app settings. The control is a labeled radio group with native semantics and arrow-key navigation on web. Pass its value to ThemeProvider. Keep a deliberate Light default until a stored preference exists; System follows operating-system changes.</Text>
      <Text selectable variant="code">{'const [appearance, setAppearance] = useState<Appearance>("light");\n<ThemeProvider appearance={appearance}>\n  <AppearanceControl value={appearance} onValueChange={setAppearance} />\n</ThemeProvider>'}</Text>
      <Text tone="muted">The host owns persistence: browser storage with a failure fallback on web; the app’s existing preference store on native. A persistence failure must leave the current selection usable. Scope preview themes independently. Paint safe areas, status bars, portals, and install/offline shells too.</Text>
    </View>
    <View className="gap-4">
      <Heading level={2}>PageHeader</Heading>
      <Text>Give a page one clear title, a short description, and its next action. Optional eyebrow copy names context rather than replacing the title. The actions wrap below the title on small screens. Use level 1 for the page or a lower level inside an existing hierarchy.</Text>
      <Text selectable variant="code">{'<PageHeader title="Order requests" description="Review unpaid buyer requests."\n  actions={<Button onPress={refresh}>Refresh requests</Button>} />'}</Text>
    </View>
    <View className="gap-4">
      <Heading level={2}>AsyncState</Heading>
      <Text>Represent ready, loading, empty, error, and offline explicitly. Preserve entered work and any useful cached content. Pass sourceLabel and freshnessLabel when showing retained information. A timestamp alone cannot prove a result current. The component never converts missing data into zero or infers Open from published hours.</Text>
      <Text selectable variant="code">{'<AsyncState status={offline ? "offline" : "ready"}\n  title="Offline · showing saved orders"\n  sourceLabel="Source: Core · saved locally"\n  freshnessLabel="Saved at 10:30 AM · current state unverified"\n  onRetry={reload}>\n  <OrderList orders={savedOrders} />\n</AsyncState>'}</Text>
      <Text tone="muted">Use retry only when it can do something. Empty explains how to begin; error explains recovery; offline identifies what still works. Avoid a spinner for the entire page when only one region is loading. A known zero is a value. Unknown, stale, unavailable, and expired each need their own text.</Text>
    </View>
    <View className="gap-4">
      <Heading level={2}>Business patterns</Heading>
      <Text>Stand information: name, verified address, directions, published dates/hours and timezone, then separate staff-reported status. Product information: original image, product identity, qualified retail price and relevant availability. Bulk: case price and size stay distinct from retail; requests remain unpaid until the owning workflow records otherwise.</Text>
      <Text>Campaigns: one message, approved artwork, verified destination, current terms, eligibility, dates/timezone and owner. Expired campaigns lose redemption actions. A missing or unverified fact stays absent or clearly unavailable.</Text>
      <Link href="/bubbas-ui/compositions/">Composition and asset guidance</Link>
    </View>
  </Guide>;
}
