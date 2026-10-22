'use client';
import { Icon } from './components/Icon';
import { FlagTicker, CampaignSection, SocialSection } from './components/campaigns';
import { Inline } from './components/layout';
import { Button } from './components/Button';
import { ThemeProvider } from './theme';
import { View } from 'react-native';
import { components } from './showcase/catalog';
import { ComponentDemo } from './showcase/Demo';
import { PatternsDemo } from './showcase/PatternsDemo';
import { Heading, Text } from './components/typography';
import { CategoryCard, CategoryGrid, ContentSection, HeroSection, LocationCard, LocationGrid, ProductCard, ProductDetail, ProductGrid, PromotionBanner, SiteHeader, SiteFooter } from './components/sections';
export { catalog, components, categories, slugFor, candidateVersion } from './showcase/catalog';
export type { ComponentName } from './showcase/catalog';
export { ComponentDemo } from './showcase/Demo';
export type { DemoProps, DemoContext } from './showcase/Demo';
export { Gallery } from './showcase/Gallery';
export { PatternsDemo } from './showcase/PatternsDemo';
export { renderFoundationsDemo } from './showcase/FoundationsDemo';
export { renderFormsDemo } from './showcase/FormsDemo';
export { renderFeedbackDemo } from './showcase/FeedbackDemo';
export const sectionCatalog = ['SiteHeader', 'SiteFooter', 'HeroSection', 'ContentSection', 'ProductCard', 'ProductGrid', 'CategoryCard', 'CategoryGrid', 'LocationCard', 'LocationGrid', 'ProductDetail', 'PromotionBanner', 'CampaignSection', 'SocialSection', 'FlagTicker', 'Icon'] as const;
export const reviewCatalog = [...components.map((entry) => ({ id: entry.slug, name: entry.name, category: entry.category })), ...sectionCatalog.map((name) => ({ id: name, name, category: 'Sections' })), { id: 'patterns', name: 'Task patterns', category: 'Patterns' }];
/** Fixtures are visibly examples and never imply catalog, prices, hours or availability. */
export function SectionDemo({ name, variant = 'default' }: { name: string; variant?: 'default' | 'marketing' }) {
  const sampleImage = { uri: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="400" height="280" fill="#d9e8fb"/><text x="40" y="150" font-size="36">SAMPLE ART</text></svg>'), alt: 'Sample artwork fixture' };
  const brand = { image: variant === 'marketing' ? sampleImage : undefined, label: 'Bubba’s · sample navigation', href: '#sample' };
  const links = [{ label: 'Sample destination', href: '#sample' }];
  const products = [{ id: 'sample', title: 'Example product', href: '#sample', description: 'Presentation fixture · no real retail facts.', priceLabel: 'Price unavailable', badge: 'Example label', image: variant === 'marketing' ? sampleImage : undefined }];
  const locations = [{ id: 'sample', title: 'Example location', address: ['Example address · not a real stand'], hoursLabel: 'Published hours unavailable', statusLabel: 'Reported stand status unavailable', actions: links }];
  if (name === 'Icon') return <Inline>{(['search','menu','close','instagram','facebook','sparkles','pause','play','arrowRight'] as const).map(name=><Icon key={name} name={name} accessibilityLabel={name}/>)}</Inline>;
  if (name === 'CampaignSection') return <CampaignSection title="Example campaign" highlight="250" description="Synthetic composition for review; not a live promotion." badges={['Example badge A','Example badge B','Example badge C','Example badge D']}/>;
  if (name === 'SocialSection') return <SocialSection title="Example social links" description="Example destinations only." links={[{label:'Instagram',href:'#sample',icon:'instagram'},{label:'Facebook',href:'#sample-facebook',icon:'facebook'}]}/>;
  if (name === 'FlagTicker') return <FlagTicker items={['Example campaign','Example destination','Synthetic review copy']}/>;
  if (name === 'SiteHeader') return <SiteHeader variant={variant} brand={brand} links={links} announcement={variant === 'marketing' ? 'Example announcement · no live campaign' : undefined} />;
  if (name === 'SiteFooter') return <SiteFooter variant={variant} brand={brand} links={links} description="Sample footer" />;
  if (name === 'ProductDetail') return <ProductDetail variant={variant} product={products[0]} />;
  if (name === 'HeroSection') return <HeroSection variant={variant} logoImage={variant === 'marketing' ? sampleImage : undefined} image={variant === 'marketing' ? sampleImage : undefined} title="Make a memory." description="Evergreen sample copy for owner review." action={links[0]} />;
  if (name === 'PromotionBanner') return <PromotionBanner variant={variant} emphasis="sparkler" title="Sample campaign message" description="No live promotion, price or expiry is implied." action={links[0]} />;
  if (name === 'LocationCard') return <LocationCard variant={variant} location={locations[0]} />;
  if (name === 'LocationGrid') return <LocationGrid variant={variant} items={locations} />;
  if (name === 'ProductCard') return <ProductCard variant={variant} product={products[0]} />;
  if (name === 'CategoryCard') return <CategoryCard variant={variant} category={products[0]} />;
  if (name === 'CategoryGrid') return <CategoryGrid variant={variant} items={products} />;
  if (name === 'ContentSection') return <ContentSection variant={variant} title="Sample information"><Text>Caller-owned content supplied to a shared section.</Text></ContentSection>;
  return <ProductGrid variant={variant} items={products} />;
}
function MarketingButtonExamples() {
 return <ThemeProvider appearance="light" className="gap-4 bg-white p-4"><Text variant="label">Public marketing actions · simulated examples</Text><Inline align="start"><Button appearance="marketing" size="lg">Example primary action</Button><Button appearance="marketing" size="lg" variant="secondary">Example location action</Button></Inline><Inline><Button appearance="marketing" variant="secondary">Compact action</Button><Button appearance="marketing" variant="secondary" loading loadingLabel="Working">Example busy action</Button><Button appearance="marketing" variant="secondary" disabled>Example disabled action</Button></Inline></ThemeProvider>;
}
export interface UIReviewCatalogProps { componentId?: string }
export function UIReviewCatalog({ componentId }: UIReviewCatalogProps) {
  const entries = componentId ? reviewCatalog.filter((item) => item.id === componentId || item.name === componentId) : reviewCatalog;
  return <View className="gap-8">{entries.length ? entries.map((entry) => <View key={entry.id} testID={`review-${entry.id}`} className="gap-4"><Heading level={2}>{entry.name}</Heading><Text variant="small" tone="muted">Local demonstration fixture · simulated actions</Text>{entry.category === 'Sections' ? <View className="gap-6"><SectionDemo name={entry.name} /><Text variant="label">Public marketing variant · example content</Text><SectionDemo name={entry.name} variant="marketing" /></View> : entry.id === 'patterns' ? <PatternsDemo /> : <><ComponentDemo name={entry.name as typeof components[number]['name']} />{entry.name==='Button'?<MarketingButtonExamples/>:null}</>}</View>) : <Text>No matching review specimen.</Text>}</View>;
}
