'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Image, Platform, View } from 'react-native';
import { Accordion } from './disclosure';
import { Button } from './Button';
import { Badge } from './content';
import { Input } from './forms/Input';
import { FormField } from './forms/FormField';
import { Heading, Text } from './typography';
import { Inline, Stack } from './layout';
import { Link } from './actions';
import { Icon } from './Icon';
import { Dialog } from './overlays';
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
    <FormField label={label} error={error} announceError>
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
  return <MarketingScope className={cn('bubba-location-compact-scope h-full',className)}><View {...props} {...{dataSet:{...props.dataSet,locationId:location.id}}} className="bubba-location-card h-full gap-3 rounded-xl border border-ui-line bg-white p-4">
    <View className="bubba-location-details min-w-0 flex-1 gap-2">
      <Inline wrap={false} justify="between" align="start" gap={2}><Heading level={3} className="bubba-location-title min-w-0 flex-1 text-lg font-black leading-6 text-bubba-navy">{location.href?<Link href={location.href} textVariant="caption" textClassName="text-lg font-black text-bubba-navy no-underline">{location.title}</Link>:location.title}</Heading>{location.distanceLabel?<Text variant="caption" className="shrink-0 pt-1 text-xs text-bubba-navy">{location.distanceLabel}</Text>:null}</Inline>
      {location.statusLabel?<Badge tone={location.statusTone??'neutral'} textClassName="text-[11px] leading-4" className="bubba-location-status px-2 py-0.5">{location.statusLabel}</Badge>:null}
      <Stack gap={1} className="loc-address">{location.address.map((line,index)=><Text key={index} variant="caption" className="text-xs leading-5 text-ui-muted">{line}</Text>)}</Stack>
      {location.hoursLabel?<Text variant="caption" className="text-xs leading-5 text-ui-muted">{location.hoursLabel}</Text>:null}
      {location.phoneLabel?(location.phoneHref?<Link href={location.phoneHref} textVariant="caption" className="self-start" textClassName="text-sm font-semibold text-bubba-blue no-underline">{location.phoneLabel}</Link>:<Text variant="caption" className="text-sm text-bubba-navy">{location.phoneLabel}</Text>):null}
      {location.description?<Text variant="caption" className="text-xs leading-5 text-ui-muted">{location.description}</Text>:null}
    </View>
    {location.actions?.length?<Stack gap={2} className="bubba-location-actions min-w-0">{location.actions.map((action,index)=><Button key={action.href} appearance="marketing" variant={index===0?'secondary':'outline'} href={action.href} external={action.external} className="bubba-location-action w-full" textClassName="text-xs leading-4">{action.label}</Button>)}</Stack>:null}
  </View></MarketingScope>;
}
export function CompactLocationGrid({items,emptyLabel='Location information is unavailable.',className,variant:_variant,density:_density,...props}:LocationGridProps) {
  return <View {...props} className={cn('bubba-location-grid flex-row flex-wrap items-stretch',className)}>{items.length?items.map(location=><View key={location.id} className="bubba-location-grid-item w-full min-w-0 p-1.5 min-[761px]:w-1/2 min-[1100px]:w-1/3 min-[1400px]:w-1/4"><CompactLocationCard location={location}/></View>):<Text className="p-4" tone="muted">{emptyLabel}</Text>}</View>;
}

export interface LocationMapPin { id:string; title:string; /** Optional concise visual label; title remains the complete accessible name. */ label?:string; latitude:number; longitude:number; href:string }
export interface LocationMapProps extends SectionProps { children?:ReactNode; title?:string; description?:string; pins?:readonly LocationMapPin[]; tileUrlTemplate?:string; attribution?:SectionAction; emptyLabel?:string }
const tileSize=256;
function project(latitude:number,longitude:number) { const lat=Math.max(-85.05112878,Math.min(85.05112878,latitude))*Math.PI/180;return {x:(longitude+180)/360,y:(1-Math.log(Math.tan(lat)+1/Math.cos(lat))/Math.PI)/2}; }
type ProjectedMapPin=LocationMapPin&{left:number;top:number};
interface MapCluster {id:string;left:number;top:number;pins:ProjectedMapPin[]}
/** Merge overlapping 44px screen targets, recomputing centroids until disjoint. */
function clusterMapPins(pins:ProjectedMapPin[]):MapCluster[] {
  const groups:MapCluster[]=pins.map(pin=>({id:pin.id,left:pin.left,top:pin.top,pins:[pin]}));
  let merged=true;
  while(merged){merged=false;outer:for(let first=0;first<groups.length;first++)for(let second=first+1;second<groups.length;second++)if(Math.abs(groups[first].left-groups[second].left)<52&&Math.abs(groups[first].top-groups[second].top)<52){const members=[...groups[first].pins,...groups[second].pins];groups[first]={id:members.map(pin=>pin.id).sort().join(':'),left:members.reduce((sum,pin)=>sum+pin.left,0)/members.length,top:members.reduce((sum,pin)=>sum+pin.top,0)/members.length,pins:members};groups.splice(second,1);merged=true;break outer;}}
  return groups;
}
/** Geographic presentation only. Caller owns verified map coordinates and provider choice. */
export function LocationMap({children,title='All locations',description,pins=[],tileUrlTemplate,attribution,emptyLabel='Map information is unavailable.',className,variant:_variant,...props}:LocationMapProps) {
  // Wait for the measured viewport; SSR must not fetch desktop-sized offscreen
  // provider tiles on a phone. The directory remains the no-script fallback.
  const [size,setSize]=useState({width:0,height:0});
  const [zoomDelta,setZoomDelta]=useState(0);
  const [tileStates,setTileStates]=useState<Record<string,'ready'|'error'>>({});
  const [tileRetry,setTileRetry]=useState(0);
  const [selectedIDs,setSelectedIDs]=useState<readonly string[]>([]);
  const validPins=useMemo(()=>pins.filter(pin=>Number.isFinite(pin.latitude)&&Number.isFinite(pin.longitude)&&Math.abs(pin.latitude)<=90&&Math.abs(pin.longitude)<=180).map(pin=>({...pin,...project(pin.latitude,pin.longitude)})),[pins]);
  const map=useMemo(()=>{
    if(!validPins.length||!size.width||!size.height)return null;
    const xs=validPins.map(pin=>pin.x),ys=validPins.map(pin=>pin.y);
    const bounds={left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
    const fit=Math.min(13,Math.max(1,Math.floor(Math.log2(Math.min(Math.max(1,size.width-100)/Math.max(.000001,(bounds.right-bounds.left)*tileSize),Math.max(1,size.height-100)/Math.max(.000001,(bounds.bottom-bounds.top)*tileSize))))));
    const zoom=Math.min(18,Math.max(1,fit+zoomDelta)),scale=tileSize*2**zoom;
    const left=(bounds.left+bounds.right)/2*scale-size.width/2,top=(bounds.top+bounds.bottom)/2*scale-size.height/2;
    const tiles=[];for(let y=Math.floor(top/tileSize);y<=Math.floor((top+size.height)/tileSize);y++)for(let x=Math.floor(left/tileSize);x<=Math.floor((left+size.width)/tileSize);x++)if(y>=0&&y<2**zoom)tiles.push({x,y,left:x*tileSize-left,top:y*tileSize-top,url:tileUrlTemplate?.replace('{z}',String(zoom)).replace('{x}',String(((x%2**zoom)+2**zoom)%2**zoom)).replace('{y}',String(y))});
    const markers=validPins.map(pin=>({...pin,left:pin.x*scale-left,top:pin.y*scale-top}));
    return {zoom,fit,tiles,clusters:clusterMapPins(markers.filter(pin=>pin.left>=22&&pin.left<=size.width-22&&pin.top>=22&&pin.top<=size.height-22))};
  },[validPins,size,zoomDelta,tileUrlTemplate]);
  const hasMap=Platform.OS==='web'&&map&&tileUrlTemplate&&attribution;
  const tileError=map?.tiles.some(tile=>tile.url&&tileStates[tile.url]==='error');
  const tilesLoading=map?.tiles.some(tile=>tile.url&&!tileStates[tile.url]);
  const setTileState=(url:string,state:'ready'|'error')=>setTileStates(previous=>previous[url]===state?previous:{...previous,[url]:state});
  const retryTiles=()=>{setTileStates(previous=>{const next={...previous};for(const tile of map?.tiles??[])if(tile.url&&next[tile.url]==='error')delete next[tile.url];return next;});setTileRetry(value=>value+1);};
  const selectedPins=validPins.filter(pin=>selectedIDs.includes(pin.id));
  return <MarketingScope><Stack {...props} className={cn('bubba-location-map w-full',className)} gap={2}>
    <Heading level={2} className="sr-only">{title}</Heading>
    {description?<Text variant="caption" className="text-sm text-ui-muted">{description}</Text>:null}
    {hasMap?<Inline gap={1} className="bubba-map-toolbar self-end rounded-xl border border-ui-line bg-white p-1"><Text variant="caption" className="px-2 text-xs text-ui-muted">Map</Text><Button variant="ghost" accessibilityLabel="Zoom map in" onPress={()=>setZoomDelta(value=>Math.min(18-map.fit,value+1))} disabled={map.zoom>=18}>+</Button><Button variant="ghost" accessibilityLabel="Zoom map out" onPress={()=>setZoomDelta(value=>Math.max(1-map.fit,value-1))} disabled={map.zoom<=1}>−</Button><Button variant="ghost" accessibilityLabel="Show all locations on map" onPress={()=>setZoomDelta(0)}>Fit all</Button></Inline>:null}
    <View className={cn('bubba-map-frame relative w-full overflow-hidden rounded-xl border border-ui-line bg-[#D9E8FB]',Platform.OS==='web'?'h-[300px] min-[761px]:h-[360px]':'min-h-[160px]')} onLayout={event=>{const {width,height}=event.nativeEvent.layout;setSize(previous=>width>0&&height>0&&(previous.width!==width||previous.height!==height)?{width,height}:previous);}}>
      {children??(hasMap?<>
        <View accessible={false} aria-hidden pointerEvents="none" className="absolute inset-0">{map.tiles.map(tile=><Image key={`${map.zoom}/${tile.x}/${tile.y}/${tileRetry}`} source={{uri:tile.url!}} accessible={false} onLoad={()=>setTileState(tile.url!,'ready')} onError={()=>setTileState(tile.url!,'error')} resizeMode="cover" style={{position:'absolute',left:tile.left,top:tile.top,width:tileSize,height:tileSize}}/>)}</View>
        {map.clusters.map(cluster=>cluster.pins.length>1?<Button key={cluster.id} variant="ghost" accessibilityLabel={`Show ${cluster.pins.length} nearby locations`} onPress={()=>setSelectedIDs(cluster.pins.map(pin=>pin.id))} {...{dataSet:{pinCount:String(cluster.pins.length)}}} className="bubba-map-cluster absolute h-11 min-h-[44px] w-11 items-center justify-center rounded-full border-[3px] border-white bg-bubba-navy p-0" textClassName="text-sm font-black text-white" style={{left:cluster.left-22,top:cluster.top-22}}>{cluster.pins.length}</Button>:cluster.pins.map(pin=><Link key={pin.id} href={pin.href} external accessibilityLabel={`Directions to ${pin.title}`} className="bubba-map-pin absolute h-11 w-11 items-center justify-center" style={{left:pin.left-22,top:pin.top-22}} textClassName="no-underline"><View className="bubba-map-pin-dot h-5 w-5 rounded-full border-[3px] border-white bg-bubba-red"/><Text variant="caption" className="bubba-map-pin-label text-xs font-bold text-bubba-navy">{pin.label??pin.title}</Text></Link>))}
      </>:<Stack className="flex-1 justify-center p-6"><Text>{validPins.length&&Platform.OS==='web'?'Use the location cards below for directions. The interactive map requires JavaScript.':emptyLabel}</Text>{Platform.OS!=='web'?validPins.map(pin=><Link key={pin.id} href={pin.href} external>{pin.title} · Directions</Link>):null}</Stack>)}
    </View>
    {hasMap&&attribution?<Link textVariant="caption" href={attribution.href} external className="self-end" textClassName="text-[11px] text-bubba-navy">{attribution.label}</Link>:null}
    {hasMap&&tilesLoading&&!tileError?<View role="status"><Text variant="caption" className="text-xs text-ui-muted">Loading map…</Text></View>:null}
    {hasMap&&tileError?<Inline role="status" className="rounded-xl border border-ui-line bg-white p-3"><Text variant="caption" className="min-w-0 flex-1 text-xs leading-5">Map tiles could not load. Location cards below still provide directions.</Text><Button variant="outline" size="sm" onPress={retryTiles}>Retry map</Button></Inline>:null}
    <Dialog open={selectedPins.length>0} onOpenChange={open=>{if(!open)setSelectedIDs([]);}} title={`${selectedPins.length} nearby locations`} description="Choose a store for directions. Close this list and zoom in to separate nearby map pins." closeLabel="Close nearby locations"><Stack gap={3}>{selectedPins.map(pin=><Stack key={pin.id} gap={2} className="rounded-xl border border-ui-line p-4"><Heading level={3} className="text-base font-bold">{pin.title}</Heading><Button variant="secondary" href={pin.href} external accessibilityLabel={`Directions to ${pin.title}`}>Get directions</Button></Stack>)}</Stack></Dialog>
  </Stack></MarketingScope>;
}

export interface LocationHoursDay { id:string; dateLabel:string; hoursLabel:string; isToday?:boolean }
export interface LocationHoursProps extends SectionProps { days:readonly LocationHoursDay[]; title?:string; description?:string; sourceLabel?:string; emptyLabel?:string }
/** Host supplies the ten calendar dates in the business timezone, including today. */
export function LocationHours({days,title='The next 10 days',description,sourceLabel,emptyLabel='Published hours are unavailable.',className,variant:_variant,...props}:LocationHoursProps) {
  return <MarketingScope><Stack {...props} className={cn('bubba-location-hours rounded-xl border border-ui-line bg-white p-5 min-[761px]:p-6',className)} gap={4}><Stack gap={2}><Heading level={2} className="text-2xl font-black text-bubba-navy">{title}</Heading>{description?<Text variant="caption" className="text-sm text-ui-muted">{description}</Text>:null}</Stack><View className="bubba-hours-days flex-row flex-wrap">{days.length?days.map(day=><View key={day.id} className="bubba-hours-day w-1/2 min-w-0 gap-2 border-b border-ui-line px-3 py-4 min-[761px]:w-1/5"><Inline gap={2}><Text variant="caption" className="text-sm font-bold text-bubba-navy">{day.dateLabel}</Text>{day.isToday?<Badge textClassName="text-[10px]" className="px-2 py-0.5">Today</Badge>:null}</Inline><Text variant="caption" className="text-sm leading-5 text-ui-muted">{day.hoursLabel}</Text></View>):<Text tone="muted">{emptyLabel}</Text>}</View>{sourceLabel?<Text variant="caption" className="text-xs text-ui-muted">{sourceLabel}</Text>:null}</Stack></MarketingScope>;
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

export interface OfferPresentation {id:string;title:string;description:string;eyebrow?:string;kind:'social'|'guarantee'|'review';action?:SectionAction}
export interface OfferGridProps extends SectionProps {items:readonly OfferPresentation[]}
export function OfferGrid({items,className,variant:_variant,...props}:OfferGridProps) {
  return <MarketingScope><View {...props} className={cn('bubba-offer-grid flex-row flex-wrap items-stretch',className)}>{items.map(offer=><View key={offer.id} className="bubba-offer-grid-item w-full min-w-0 p-2 min-[900px]:w-1/3"><View className={cn('bubba-offer-card h-full min-h-[280px] overflow-hidden rounded-xl border p-6',`bubba-offer-${offer.kind}`,offer.kind==='social'?'border-bubba-blue bg-bubba-blue':offer.kind==='guarantee'?'border-ui-line bg-white':'border-bubba-navy bg-bubba-navy')}><View className="bubba-offer-mark mb-5 h-11 w-11 items-center justify-center rounded-full"><Icon name={offer.kind==='social'?'instagram':offer.kind==='guarantee'?'arrowRight':'sparkles'} size={24} color={offer.kind==='guarantee'?'#0866FF':'#FFFFFF'}/></View>{offer.eyebrow?<Text variant="caption" className={cn('mb-2 text-xs font-bold uppercase',offer.kind==='guarantee'?'text-bubba-red':'text-white')}>{offer.eyebrow}</Text>:null}<Heading level={2} className={cn('text-2xl font-black leading-8',offer.kind==='guarantee'?'text-bubba-navy':'text-white')}>{offer.title}</Heading><Text variant="caption" className={cn('mt-3 text-sm leading-6',offer.kind==='guarantee'?'text-ui-muted':'text-white')}>{offer.description}</Text>{offer.action?<View className="mt-auto pt-6"><MarketingAction action={{...offer.action,tone:offer.kind==='guarantee'?'blue':'white'}}/></View>:null}</View></View>)}</View></MarketingScope>;
}
