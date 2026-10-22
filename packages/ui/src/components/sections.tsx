'use client';

import { useState, type ReactNode } from 'react';
import { Image, View, type ViewProps } from 'react-native';
import { Card, Container, Inline, Stack } from './layout';
import { Button } from './Button';
import { Badge } from './content';
import { Heading, Text } from './typography';
import { Link } from './actions';
import { cn } from '../internal/utils';
import { MarketingHeader, MarketingFooter, MarketingHero, MarketingContent, MarketingProductCard, MarketingGrid, MarketingProductDetail, MarketingPromotion } from './marketing';

/** Caller supplies cleared assets and real content. These sections never fetch business facts. */
export interface SectionImage { uri: string; alt: string }
export interface SectionAction { label: string; href: string; external?: boolean }
export interface SectionProps extends ViewProps { className?: string; variant?: 'default' | 'marketing' }
export interface BrandLink { label: string; href: string; image?: SectionImage }
function SectionActionLink({ action }: { action: SectionAction }) {
  return <Link href={action.href} external={action.external} className="rounded-bubba-control border border-ui-action-border bg-ui-primary px-5 py-3" textClassName="font-bold text-ui-action-text no-underline">{action.label}</Link>;
}
export interface SiteHeaderProps extends SectionProps { brand: BrandLink; links: readonly SectionAction[]; action?: SectionAction; children?: ReactNode; announcement?: string; auxiliaryLinks?: readonly SectionAction[]; currentPath?: string }
export function SiteHeader({ brand, links, action, children, className, variant, announcement, auxiliaryLinks, currentPath, ...props }: SiteHeaderProps) {
  if (variant === 'marketing') return <MarketingHeader {...props} {...{brand, links, action, children, className, announcement, auxiliaryLinks, currentPath}} />;
  return <View {...props} role="banner" className={cn('border-b border-ui-line bg-ui-surface py-4', className)}><Container><Inline justify="between" gap={6}>
    <Link href={brand.href} accessibilityLabel={brand.label}>{brand.image ? <Image source={{ uri: brand.image.uri }} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-16 w-48" /> : brand.label}</Link>
    <Inline role="navigation" accessibilityLabel="Main navigation" gap={4}>{links.map((link) => <Link key={link.href} href={link.href} external={link.external} textClassName="font-bold no-underline">{link.label}</Link>)}{action ? <SectionActionLink action={action} /> : null}</Inline>{children}
  </Inline></Container></View>;
}
export interface SiteFooterProps extends SectionProps { brand: BrandLink; links: readonly SectionAction[]; description?: string; children?: ReactNode; linkGroups?: readonly { title: string; links: readonly SectionAction[] }[]; socialLinks?: readonly SectionAction[]; copyright?: string }
export function SiteFooter({ brand, links, description, children, className, variant, linkGroups, socialLinks, copyright, ...props }: SiteFooterProps) {
  if (variant === 'marketing') return <MarketingFooter {...props} {...{brand, links, description, children, className, linkGroups, socialLinks, copyright}} />;
  return <View {...props} role="contentinfo" className={cn('border-t border-ui-line bg-ui-surface py-8', className)}><Container><Stack gap={4}><Link href={brand.href}>{brand.label}</Link>{description ? <Text tone="muted">{description}</Text> : null}<Inline gap={4}>{links.map((link) => <Link key={link.href} href={link.href} external={link.external}>{link.label}</Link>)}</Inline>{children}</Stack></Container></View>;
}
export interface ContentSectionProps extends SectionProps { title?: string; description?: string; headingLevel?: 1 | 2 | 3; children?: ReactNode; eyebrow?: string }
export function ContentSection({ title, description, headingLevel = 2, children, className, variant, eyebrow, ...props }: ContentSectionProps) {
  if (variant === 'marketing') return <MarketingContent {...props} {...{title, description, headingLevel, children, className, eyebrow}} />;
  return <View {...props} className={cn('py-8 sm:py-12', className)}><Container><Stack gap={6}>{title ? <Heading level={headingLevel}>{title}</Heading> : null}{description ? <Text tone="muted">{description}</Text> : null}{children}</Stack></Container></View>;
}
export interface HeroSectionProps extends SectionProps { title: string; description?: string; eyebrow?: string; image?: SectionImage; imageNativeID?: string; action?: SectionAction; children?: ReactNode; logoImage?: SectionImage; actions?: readonly SectionAction[] }
export function HeroSection({ title, description, eyebrow, image, imageNativeID, action, children, className, variant, logoImage, actions, ...props }: HeroSectionProps) {
  if (variant === 'marketing') return <MarketingHero {...props} {...{title, description, eyebrow, image, imageNativeID, action, children, className, logoImage, actions}} />;
  return <View {...props} className={cn('bg-ui-surface py-12 sm:py-16', className)}><Container><Inline gap={8} align="center"><Stack className="min-w-0 flex-1 basis-80" gap={6}>{eyebrow ? <Text variant="label" tone="muted">{eyebrow}</Text> : null}<Heading level={1}>{title}</Heading>{description ? <Text variant="lead">{description}</Text> : null}{action ? <SectionActionLink action={action} /> : null}{children}</Stack>{image ? <Image nativeID={imageNativeID} source={{ uri: image.uri }} accessibilityLabel={image.alt} resizeMode="contain" className="h-64 min-w-0 flex-1 basis-80 sm:h-96" /> : null}</Inline></Container></View>;
}
export interface ProductPresentation { id: string; title: string; href: string; image?: SectionImage; priceLabel?: string; description?: string; badge?: string; typeLabel?: string; gallery?: readonly SectionImage[]; videoHref?: string; actions?: readonly SectionAction[] }
export interface ProductCardProps extends SectionProps { product: ProductPresentation }
export function ProductCard({ product, className, variant, ...props }: ProductCardProps) {
  if (variant === 'marketing') return <MarketingProductCard {...props} {...{product, className}} />;
  return <Card {...props} className={cn('gap-4', className)}>{product.image ? <Image source={{ uri: product.image.uri }} accessibilityLabel={product.image.alt} resizeMode="contain" className="h-48 w-full" /> : null}{product.badge ? <Badge>{product.badge}</Badge> : null}<Heading level={3}><Link href={product.href} textClassName="font-bold no-underline">{product.title}</Link></Heading>{product.description ? <Text tone="muted">{product.description}</Text> : null}{product.priceLabel ? <Text variant="label">{product.priceLabel}</Text> : null}</Card>;
}
export interface ProductGridProps extends SectionProps { items: readonly ProductPresentation[]; emptyLabel?: string }
export function ProductGrid({ items, emptyLabel = 'No products to display.', className, variant, ...props }: ProductGridProps) {
  if (variant === 'marketing') return <MarketingGrid {...props} className={className}>{items.length ? items.map(product => <ProductCard key={product.id} product={product} variant="marketing" />) : <Text tone="muted">{emptyLabel}</Text>}</MarketingGrid>;
  return <Inline {...props} align="stretch" gap={6} className={className}>{items.length ? items.map((product) => <ProductCard key={product.id} product={product} className="min-w-0 flex-1 basis-64" />) : <Text tone="muted">{emptyLabel}</Text>}</Inline>;
}
export type CategoryPresentation = Omit<ProductPresentation, 'priceLabel'>;
export interface CategoryCardProps extends SectionProps { category: CategoryPresentation }
export function CategoryCard({ category, ...props }: CategoryCardProps) { return <ProductCard {...props} product={category} />; }
export interface CategoryGridProps extends SectionProps { items: readonly CategoryPresentation[]; emptyLabel?: string }
export function CategoryGrid(props: CategoryGridProps) { return <ProductGrid {...props} emptyLabel={props.emptyLabel ?? 'No categories to display.'} />; }
export interface LocationPresentation { id: string; title: string; href?: string; address: readonly string[]; hoursLabel?: string; statusLabel?: string; phoneLabel?: string; description?: string; actions?: readonly SectionAction[] }
export interface LocationCardProps extends SectionProps { location: LocationPresentation }
export function LocationCard({ location, className, variant, ...props }: LocationCardProps) {
  return <Card {...props} className={cn('gap-4', variant === 'marketing' && 'p-5', className)}><Heading level={3} className={variant === 'marketing' ? 'text-2xl font-black uppercase italic' : undefined}>{location.href ? <Link href={location.href} textClassName="font-bold no-underline">{location.title}</Link> : location.title}</Heading><Stack gap={1} className="loc-address">{location.address.map((line, index) => <Text key={index}>{line}</Text>)}</Stack>{location.hoursLabel ? <Text>{location.hoursLabel}</Text> : null}{location.phoneLabel ? <Text>{location.phoneLabel}</Text> : null}{location.description ? <Text>{location.description}</Text> : null}{location.statusLabel ? <Text variant="label">{location.statusLabel}</Text> : null}<Inline gap={3}>{location.actions?.map((action) => <Link key={action.href} href={action.href} external={action.external}>{action.label}</Link>)}</Inline></Card>;
}
export interface LocationGridProps extends SectionProps { items: readonly LocationPresentation[]; emptyLabel?: string }
export function LocationGrid({ items, emptyLabel = 'Location information is unavailable.', className, variant, ...props }: LocationGridProps) {
  return <Inline {...props} align="stretch" gap={6} className={className}>{items.length ? items.map((location) => <LocationCard key={location.id} variant={variant} location={location} className="min-w-0 flex-1 basis-80" />) : <Text tone="muted">{emptyLabel}</Text>}</Inline>;
}
export interface ProductDetailProps extends SectionProps { product: ProductPresentation; children?: ReactNode; legacyGalleryHooks?: boolean }
export function ProductDetail({ product, children, legacyGalleryHooks = false, className, variant, ...props }: ProductDetailProps) {
  const [selected, setSelected] = useState(0);
  if (variant === 'marketing') return <MarketingProductDetail {...props} {...{product, children, legacyGalleryHooks, className}} />;
  const images = product.gallery?.length ? product.gallery : product.image ? [product.image] : [];
  const image = images[selected] ?? images[0];
  return <HeroSection {...props} className={className} title={product.title} description={product.description} eyebrow={product.typeLabel} image={image} imageNativeID={legacyGalleryHooks ? "mainProductImg" : undefined}>
    {product.badge ? <Text variant="label">{product.badge}</Text> : null}
    {product.priceLabel ? <Text variant="label" className={legacyGalleryHooks ? "pdp-price" : undefined}>{product.priceLabel}</Text> : null}
    {images.length > 1 ? <Inline nativeID={legacyGalleryHooks ? "pdpThumbs" : undefined}>{images.map((item, index) => <Button key={index} {...(legacyGalleryHooks ? { className: "pdp-thumb", dataSet: { src: item.uri } } : {})} accessibilityState={{ selected: index === selected }} variant={index === selected ? 'secondary' : 'outline'} accessibilityLabel={`View image ${index + 1}: ${item.alt}`} onPress={() => setSelected(index)}>{`Image ${index + 1}`}</Button>)}</Inline> : null}
    {product.videoHref ? <Link href={product.videoHref} external>Watch product video</Link> : null}
    <Inline>{product.actions?.map((action) => <SectionActionLink key={action.href} action={action} />)}</Inline>{children}
  </HeroSection>;
}
export interface PromotionBannerProps extends SectionProps { title: string; description?: string; action?: SectionAction }
export function PromotionBanner({ title, description, action, className, variant, ...props }: PromotionBannerProps) {
  if (variant === 'marketing') return <MarketingPromotion {...props} {...{title, description, action, className}} />;
  return <Card {...props} className={cn('gap-4 bg-ui-selected', className)}><Heading level={2}>{title}</Heading>{description ? <Text>{description}</Text> : null}{action ? <SectionActionLink action={action} /> : null}</Card>;
}
