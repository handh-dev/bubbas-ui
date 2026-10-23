'use client';

import { type ReactNode } from 'react';
import { Image, View } from 'react-native';
import { Accordion } from './disclosure';
import { Button } from './Button';
import { Badge } from './content';
import { Input } from './forms/Input';
import { FormField } from './forms/FormField';
import { Heading, Text } from './typography';
import { Inline, Stack } from './layout';
import { Link } from './actions';
import { Icon } from './Icon';
import { MarketingAction, MarketingProductBadge, MarketingScope } from './marketing';
import type { LocationCardProps, LocationGridProps, ProductPresentation, SectionAction, SectionProps } from './sections';
import { cn } from '../internal/utils';

export interface LocationSearchProps extends SectionProps {
  value: string; onValueChange: (value: string) => void; onSearch: () => void;
  onLocate?: () => void; locating?: boolean; busy?: boolean; error?: string;
  resultLabel?: string; placeholder?: string; label?: string;
}
/** Controlled presentation. The host owns geolocation permission, lookup and results. */
export function LocationSearch({ value, onValueChange, onSearch, onLocate, locating=false, busy=false, error, resultLabel, placeholder='City or ZIP code', label='Find a Bubba’s near you', className, variant: _variant, ...props }: LocationSearchProps) {
  const searching=busy||locating;
  return <MarketingScope><Stack {...props} className={cn('bubba-location-search mx-auto w-full max-w-[880px]',className)} gap={2}>
    <FormField label={label} labelLeading={<Icon name="mapPin" size={22} color="#D40000"/>} error={error} announceError>
      <Inline align="stretch" className="bubba-location-search-row w-full gap-2">
        <View className="bubba-location-search-field min-w-0 flex-1 basis-full min-[761px]:basis-[280px]"><Input value={value} onChangeText={onValueChange} onSubmitEditing={()=>{if(!searching)onSearch();}} returnKeyType="search" placeholder={placeholder} disabled={searching} className="rounded-xl border-ui-border bg-white"/></View>
        {onLocate?<Button variant="outline" appearance="marketing" onPress={onLocate} disabled={searching} loading={locating} loadingLabel="Locating" className="bubba-locate-button" accessibilityLabel="Use my location to find nearby stores">Use my location</Button>:null}
        <Button appearance="marketing" onPress={onSearch} loading={busy} loadingLabel="Searching" disabled={locating} className="bubba-location-search-submit">Search locations</Button>
      </Inline>
    </FormField>
    <View role="status" aria-live="polite" aria-atomic>{resultLabel?<Text variant="caption" className="text-sm text-ui-muted">{resultLabel}</Text>:null}</View>
  </Stack></MarketingScope>;
}

export function CompactLocationCard({ location, className, variant: _variant, density: _density, ...props }: LocationCardProps) {
  const identity=[location.title,...location.address].join(', ');
  const directions=location.actions?.find(action=>!action.href.startsWith('tel:'));
  const phoneHref=location.phoneHref??location.actions?.find(action=>action.href.startsWith('tel:'))?.href;
  return <MarketingScope className={cn('bubba-location-compact-scope h-full',className)}><View {...props} {...{dataSet:{...props.dataSet,locationId:location.id}}} className="bubba-location-card h-full gap-3 rounded-xl border border-ui-line bg-white p-4">
    <View className="bubba-location-details min-w-0 flex-1 gap-2">
      <Inline wrap={false} justify="between" align="start" gap={2}><Heading level={3} className="bubba-location-title min-w-0 flex-1 text-lg font-black leading-6 text-bubba-navy">{location.href?<Link href={location.href} textVariant="caption" textClassName="text-lg font-black text-bubba-navy no-underline">{location.title}</Link>:location.title}</Heading>{location.distanceLabel?<Text variant="caption" className="shrink-0 pt-1 text-xs text-bubba-navy">{location.distanceLabel}</Text>:null}</Inline>
      {location.badgeLabel?<View className="bubba-location-feature-badge self-start rounded-full border border-bubba-gold bg-bubba-blue px-2 py-1"><Text variant="caption" className="text-[10px] font-extrabold uppercase leading-4 text-white">{location.badgeLabel}</Text></View>:null}
      {location.statusLabel?<Badge leading={<Icon name="clock" size={12} color="#03256C"/>} tone={location.statusTone??'neutral'} textClassName="text-[11px] leading-4" className="bubba-location-status px-2 py-0.5">{location.statusLabel}</Badge>:null}
      <Inline wrap={false} align="start" gap={2} className="bubba-location-info"><Icon name="mapPin" size={15} color="#0866FF"/><Stack gap={0} className="loc-address min-w-0 flex-1">{location.address.map((line,index)=><Text key={index} variant="caption" className="text-xs leading-5 text-ui-muted">{line}</Text>)}</Stack></Inline>
      {location.hoursLabel?<Inline wrap={false} align="start" gap={2} className="bubba-location-info"><Icon name="clock" size={15} color="#0866FF"/><Text variant="caption" className="min-w-0 flex-1 text-xs leading-5 text-ui-muted">{location.hoursLabel}</Text></Inline>:null}
      {location.phoneLabel?<Inline wrap={false} align="start" gap={2} className="bubba-location-info"><Icon name="phone" size={15} color="#0866FF"/><Text variant="caption" className="min-w-0 flex-1 text-xs leading-5 text-ui-muted">{location.phoneLabel}</Text></Inline>:null}
      {location.description?<Text variant="caption" className="text-xs leading-5 text-ui-muted">{location.description}</Text>:null}
    </View>
    {directions||phoneHref?<Stack gap={2} className="bubba-location-actions min-w-0">{directions?<Link href={directions.href} external={directions.external} accessibilityLabel={`Get directions to ${identity}`} {...{title:`Get directions to ${identity}`}} className="bubba-location-icon-action bubba-location-directions h-11 w-11 items-center justify-center rounded-lg bg-bubba-blue" textVariant="caption" textClassName="no-underline"><Icon name="directions" size={23} color="#FFFFFF"/></Link>:null}{phoneHref?<Link href={phoneHref} accessibilityLabel={`Call ${identity}`} {...{title:`Call ${identity}`}} className="bubba-location-icon-action bubba-location-call h-11 w-11 items-center justify-center rounded-lg bg-bubba-red" textVariant="caption" textClassName="no-underline"><Icon name="phone" size={22} color="#FFFFFF"/></Link>:null}</Stack>:null}
  </View></MarketingScope>;
}
export function CompactLocationGrid({items,emptyLabel='Location information is unavailable.',className,variant:_variant,density:_density,...props}:LocationGridProps) {
  return <View {...props} className={cn('bubba-location-grid flex-row flex-wrap items-stretch',className)}>{items.length?items.map(location=><View key={location.id} className="bubba-location-grid-item w-full min-w-0 p-1.5 min-[640px]:w-1/2 min-[900px]:w-1/3 min-[1024px]:w-1/4"><CompactLocationCard location={location}/></View>):<Text className="p-4" tone="muted">{emptyLabel}</Text>}</View>;
}

export { LocationMap } from './location-map';
export type { LocationMapProps, LocationMapPin } from './location-map';

export interface LocationHoursDay { id:string; dateLabel:string; hoursLabel:string; isToday?:boolean }
export interface LocationHoursProps extends SectionProps { days:readonly LocationHoursDay[]; title?:string; description?:string; sourceLabel?:string; emptyLabel?:string }
/** Host supplies the ten calendar dates in the business timezone, including today. */
export function LocationHours({days,title='Store hours',description,sourceLabel,emptyLabel='Published hours are unavailable.',className,variant:_variant,...props}:LocationHoursProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-location-hours rounded-xl border border-ui-line bg-white p-5 min-[761px]:p-6',className)} gap={4}><Stack gap={2}><Heading level={2} className="text-2xl font-black text-bubba-navy">{title}</Heading>{description?<Text variant="caption" className="text-sm text-ui-muted">{description}</Text>:null}</Stack><View className="bubba-hours-days flex-row flex-wrap">{days.length?days.map(day=><View key={day.id} className="bubba-hours-day w-1/2 min-w-0 gap-2 border-b border-ui-line px-3 py-4 min-[761px]:w-1/5"><Inline gap={2}><Text variant="caption" className="bubba-hours-date text-sm font-extrabold text-bubba-red">{day.dateLabel}</Text>{day.isToday?<Badge textClassName="text-[10px]" className="px-2 py-0.5">Today</Badge>:null}</Inline><Text variant="caption" className="bubba-hours-time text-sm font-bold leading-5 text-bubba-navy">{day.hoursLabel}</Text></View>):<Text tone="muted">{emptyLabel}</Text>}</View>{sourceLabel?<Text variant="caption" className="text-xs text-ui-muted">{sourceLabel}</Text>:null}</Stack></MarketingScope>;
}

export interface FAQPresentation {id:string;question:string;answer:string}
export interface FAQSectionProps extends SectionProps {items:readonly FAQPresentation[];title?:string;description?:string;defaultValue?:string}
export function FAQSection({items,title='Frequently asked questions',description,defaultValue='',className,variant:_variant,...props}:FAQSectionProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-faq-section mx-auto w-full max-w-[960px]',className)} gap={6}><Heading level={2} className="text-3xl font-black text-bubba-navy">{title}</Heading>{description?<Text tone="muted">{description}</Text>:null}<Accordion className="bubba-faq-list gap-3" appearance="marketing" progressiveEnhancement defaultValue={defaultValue} items={items.map(item=>({value:item.id,title:item.question,content:<Text variant="caption" className="text-base leading-7 text-ui-muted">{item.answer}</Text>}))}/></Stack></MarketingScope>;
}
export interface SafetyRule {id:string;title:string;description:string}
export interface SafetySectionProps extends SectionProps {title:string;description?:string;rules:readonly SafetyRule[];aside?:ReactNode}
export function SafetySection({title,description,rules,aside,className,variant:_variant,...props}:SafetySectionProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-safety-section',className)} gap={6}><Stack className="max-w-[720px]" gap={3}><Heading level={2} className="text-3xl font-black text-bubba-navy">{title}</Heading>{description?<Text tone="muted">{description}</Text>:null}</Stack><View className="bubba-safety-layout flex-col items-stretch gap-6 min-[1100px]:flex-row"><View className="bubba-safety-rules min-w-0 flex-1 flex-row flex-wrap">{rules.map((rule,index)=><View key={rule.id} className="w-full min-w-0 p-2 min-[761px]:w-1/2"><View className="h-full flex-row gap-4 rounded-xl border border-ui-line bg-white p-5"><View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ui-selected"><Text variant="caption" className="text-sm font-black text-bubba-navy">{String(index+1).padStart(2,'0')}</Text></View><Stack className="min-w-0 flex-1" gap={2}><Heading level={3} className="text-base font-extrabold text-bubba-navy">{rule.title}</Heading><Text variant="caption" className="text-sm leading-6 text-ui-muted">{rule.description}</Text></Stack></View></View>)}</View>{aside?<Stack className="bubba-safety-aside w-full min-w-0 gap-4 min-[1100px]:w-[320px]">{aside}</Stack>:null}</View></Stack></MarketingScope>;
}

export interface FeaturedProductRowProps extends SectionProps {items:readonly ProductPresentation[];title?:string;emptyLabel?:string}
export function FeaturedProductRow({items,title='Featured favorites',emptyLabel='Featured products are unavailable.',className,variant:_variant,...props}:FeaturedProductRowProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-featured-products',className)} gap={4}><Heading level={2} className="text-2xl font-black text-bubba-navy">{title}</Heading><View className="flex-row flex-wrap items-stretch">{items.length?items.slice(0,4).map(product=><View key={product.id} className="bubba-featured-item w-1/2 min-w-0 p-1.5 min-[1100px]:w-1/4"><View className="bubba-featured-card h-full flex-row gap-3 rounded-xl border border-ui-line bg-white p-3"><Link href={product.href} accessibilityLabel={product.title} className="bubba-featured-image h-20 w-20 shrink-0" textClassName="no-underline">{product.image?<Image source={{uri:product.image.uri}} accessibilityLabel={product.image.alt} resizeMode="contain" className="h-20 w-20"/>:null}</Link><Stack gap={2} className="min-w-0 flex-1">{product.badge?<MarketingProductBadge label={product.badge}/>:null}<Heading level={3} className="min-w-0"><Link href={product.href} textVariant="caption" textClassName="text-sm font-extrabold leading-5 text-bubba-navy no-underline">{product.title}</Link></Heading>{product.priceLabel?<Text variant="caption" className="mt-auto text-base font-black text-bubba-red">{product.priceLabel}</Text>:null}</Stack></View></View>):<Text tone="muted">{emptyLabel}</Text>}</View></Stack></MarketingScope>;
}

export interface OfferPresentation {id:string;title:string;description:string;eyebrow?:string;kind:'social'|'guarantee'|'review';action?:SectionAction;socialLink?:SectionAction;artwork?:{uri:string;alt:string};artworkHref?:string}
export interface OfferGridProps extends SectionProps {items:readonly OfferPresentation[]}
export function OfferGrid({items,className,variant:_variant,...props}:OfferGridProps) {
  return <MarketingScope><View {...props} className={cn('bubba-offer-grid flex-row flex-wrap items-stretch',className)}>{items.map(offer=><View key={offer.id} className="bubba-offer-grid-item w-full min-w-0 p-2 min-[900px]:w-1/3"><View className={cn('bubba-offer-card h-full min-h-[280px] overflow-hidden rounded-xl border border-ui-line p-6',`bubba-offer-${offer.kind}`,offer.kind==='guarantee'?'bg-white':'bg-[#EAF3FF]')}>
    <View className="bubba-offer-art absolute right-4 top-4 h-20 w-20 items-center justify-center">{offer.artwork?(offer.artworkHref?<Link href={offer.artworkHref} external accessibilityLabel={offer.artwork.alt} className="h-20 w-20" textClassName="no-underline"><Image source={{uri:offer.artwork.uri}} accessibilityLabel={offer.artwork.alt} resizeMode="contain" className="h-20 w-20"/></Link>:<Image source={{uri:offer.artwork.uri}} accessibilityLabel={offer.artwork.alt} resizeMode="contain" className="h-20 w-20"/>):<Icon name={offer.kind==='social'?'popIts':offer.kind==='guarantee'?'money':'fountain'} size={80} color={null}/>}</View>
    {offer.eyebrow?<Text variant="caption" className="bubba-offer-eyebrow mb-3 max-w-[65%] text-xs font-bold uppercase text-bubba-red">{offer.eyebrow}</Text>:null}
    <Heading level={2} className="bubba-offer-title min-h-[64px] max-w-[68%] text-2xl font-black leading-8 text-bubba-navy">{offer.title}</Heading>
    <Text variant="caption" className="mt-4 text-sm leading-6 text-ui-muted">{offer.description}</Text>
    {offer.socialLink?<Link href={offer.socialLink.href} external={offer.socialLink.external} accessibilityLabel={offer.socialLink.label} contentLayout="block" className="bubba-offer-social-link mt-3 flex-row items-center gap-2 self-start"><Icon name={offer.socialLink.icon??'instagram'} size={20} color="#0866FF"/><Text variant="caption" className="min-w-0 shrink text-sm font-bold text-bubba-blue">{offer.socialLink.label}</Text></Link>:null}
    {offer.action?<View className="mt-auto pt-5"><MarketingAction action={{...offer.action,tone:'blue'}}/></View>:null}
  </View></View>)}</View></MarketingScope>;
}

export interface ReviewLocationLink {id:string;title:string;addressLabel?:string;href:string}
export interface ReviewLocationLinksProps extends SectionProps {items:readonly ReviewLocationLink[];title?:string;description?:string}
/** Caller supplies reviewed store-specific destinations; no review or rating claim is inferred. */
export function ReviewLocationLinks({items,title='Choose your store',description,className,variant:_variant,...props}:ReviewLocationLinksProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-review-locations rounded-xl border border-ui-line bg-white p-5 min-[761px]:p-8',className)} gap={6}><Stack gap={2}><Heading level={2} className="text-2xl font-black text-bubba-navy">{title}</Heading>{description?<Text variant="caption" className="text-sm leading-6 text-ui-muted">{description}</Text>:null}</Stack><View className="bubba-review-location-grid flex-row flex-wrap">{items.map(item=><View key={item.id} className="bubba-review-location-item w-full min-w-0 p-1.5 min-[640px]:w-1/2 min-[1024px]:w-1/3 min-[1400px]:w-1/4"><Link href={item.href} external accessibilityLabel={`Review ${item.title}${item.addressLabel?', '+item.addressLabel:''}`} contentLayout="block" className="bubba-review-location-link min-h-[72px] w-full rounded-xl border border-ui-line bg-[#F6F9FF] px-4 py-3" textVariant="caption" textClassName="no-underline"><View className="min-w-0 flex-row items-center gap-3"><Icon name="mapPin" size={22} color="#D40000"/><Stack gap={1} className="min-w-0 flex-1"><Text variant="caption" className="text-sm font-extrabold leading-5 text-bubba-navy">{item.title}</Text>{item.addressLabel?<Text variant="caption" className="text-xs leading-5 text-ui-muted">{item.addressLabel}</Text>:null}</Stack><Icon name="arrowRight" size={18} color="#0866FF"/></View></Link></View>)}</View></Stack></MarketingScope>;
}
export const ReviewLocationGrid=ReviewLocationLinks;
export type ReviewLocationGridProps=ReviewLocationLinksProps;
