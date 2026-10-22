'use client';
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
export const sectionCatalog = ['SiteHeader', 'SiteFooter', 'HeroSection', 'ContentSection', 'ProductCard', 'ProductGrid', 'CategoryCard', 'CategoryGrid', 'LocationCard', 'LocationGrid', 'ProductDetail', 'PromotionBanner'] as const;
export const reviewCatalog = [...components.map((entry) => ({ id: entry.slug, name: entry.name, category: entry.category })), ...sectionCatalog.map((name) => ({ id: name, name, category: 'Sections' })), { id: 'patterns', name: 'Task patterns', category: 'Patterns' }];
/** Fixtures are visibly examples and never imply catalog, prices, hours or availability. */
export function SectionDemo({ name }: { name: string }) {
  const brand = { label: 'Bubba’s · sample navigation', href: '#sample' };
  const links = [{ label: 'Sample destination', href: '#sample' }];
  const products = [{ id: 'sample', title: 'Example product', href: '#sample', description: 'Presentation fixture · no real retail facts.', priceLabel: 'Price unavailable' }];
  const locations = [{ id: 'sample', title: 'Example location', address: ['Example address · not a real stand'], hoursLabel: 'Published hours unavailable', statusLabel: 'Reported stand status unavailable', actions: links }];
  if (name === 'SiteHeader') return <SiteHeader brand={brand} links={links} />;
  if (name === 'SiteFooter') return <SiteFooter brand={brand} links={links} description="Sample footer" />;
  if (name === 'ProductDetail') return <ProductDetail product={products[0]} />;
  if (name === 'HeroSection') return <HeroSection title="Make a memory." description="Evergreen sample copy for owner review." action={links[0]} />;
  if (name === 'PromotionBanner') return <PromotionBanner title="Sample campaign message" description="No live promotion, price or expiry is implied." action={links[0]} />;
  if (name === 'LocationCard') return <LocationCard location={locations[0]} />;
  if (name === 'LocationGrid') return <LocationGrid items={locations} />;
  if (name === 'ProductCard') return <ProductCard product={products[0]} />;
  if (name === 'CategoryCard') return <CategoryCard category={products[0]} />;
  if (name === 'CategoryGrid') return <CategoryGrid items={products} />;
  if (name === 'ContentSection') return <ContentSection title="Sample information"><Text>Caller-owned content supplied to a shared section.</Text></ContentSection>;
  return <ProductGrid items={products} />;
}
export interface UIReviewCatalogProps { componentId?: string }
export function UIReviewCatalog({ componentId }: UIReviewCatalogProps) {
  const entries = componentId ? reviewCatalog.filter((item) => item.id === componentId || item.name === componentId) : reviewCatalog;
  return <View className="gap-8">{entries.length ? entries.map((entry) => <View key={entry.id} testID={`review-${entry.id}`} className="gap-4"><Heading level={2}>{entry.name}</Heading><Text variant="small" tone="muted">Local demonstration fixture · simulated actions</Text>{entry.category === 'Sections' ? <SectionDemo name={entry.name} /> : entry.id === 'patterns' ? <PatternsDemo /> : <ComponentDemo name={entry.name as typeof components[number]['name']} />}</View>) : <Text>No matching review specimen.</Text>}</View>;
}
