'use client';
import {useState} from 'react';
import {AnnouncementEditor,type AnnouncementSegment} from './components/announcement';
import { MarketingMotionControl } from './components/marketing';
import { FocusMarquee, FOCUS_MARQUEE_DEFAULT_CADENCE } from './components/focus-marquee';
import { FOCUS_MARQUEE_CAMPAIGN_PRESET } from './components/focus-marquee-preset.js';
import { Icon } from './components/Icon';
import { FlagTicker, CampaignSection, SocialSection } from './components/campaigns';
import { Inline } from './components/layout';
import { Button } from './components/Button';
import { FormField, Input } from './components/forms';
import { ThemeProvider } from './theme';
import { View } from 'react-native';
import { components } from './showcase/catalog';
import { ComponentDemo } from './showcase/Demo';
import { PatternsDemo } from './showcase/PatternsDemo';
import { Heading, Text } from './components/typography';
import { CategoryCard, CategoryGrid, ContentSection, HeroSection, LocationCard, LocationGrid, ProductCard, ProductDetail, ProductGrid, PromotionBanner, SiteHeader, SiteFooter, type PromotionBannerProps } from './components/sections';
import { LocationSearch, LocationMap, LocationHours, FAQSection, SafetySection, FeaturedProductRow, OfferGrid } from './components/website-sections';
export { catalog, components, categories, slugFor, candidateVersion } from './showcase/catalog';
export type { ComponentName } from './showcase/catalog';
export { ComponentDemo } from './showcase/Demo';
export type { DemoProps, DemoContext } from './showcase/Demo';
export { Gallery } from './showcase/Gallery';
export { PatternsDemo } from './showcase/PatternsDemo';
export { renderFoundationsDemo } from './showcase/FoundationsDemo';
export { renderFormsDemo } from './showcase/FormsDemo';
export { renderFeedbackDemo } from './showcase/FeedbackDemo';
export const sectionCatalog = ['SiteHeader', 'SiteFooter', 'HeroSection', 'ContentSection', 'ProductCard', 'ProductGrid', 'CategoryCard', 'CategoryGrid', 'LocationCard', 'LocationGrid', 'ProductDetail', 'PromotionBanner', 'CampaignSection', 'SocialSection', 'FlagTicker', 'FocusMarquee', 'Icon', 'AnnouncementEditor', 'LocationSearch', 'LocationMap', 'LocationHours', 'FAQSection', 'SafetySection', 'FeaturedProductRow', 'OfferGrid'] as const;
export const reviewCatalog = [...components.map((entry) => ({ id: entry.slug, name: entry.name, category: entry.category })), ...sectionCatalog.map((name) => ({ id: name, name, category: 'Sections' })), { id: 'patterns', name: 'Task patterns', category: 'Patterns' }];
function AnnouncementAuthoringDemo() {
 const[value,setValue]=useState<readonly AnnouncementSegment[]>([{text:'Example ',tone:'default'},{text:'gold words',tone:'yellow'},{text:' · synthetic review',tone:'default'}]);
 return <AnnouncementEditor value={value} onValueChange={setValue}/>;
}
function LocationSearchDemo() {
 const [value,setValue]=useState('');const [result,setResult]=useState('Example results · simulated search only');
 return <LocationSearch value={value} onValueChange={setValue} onSearch={()=>setResult(`Example search submitted: ${value||'empty query'}`)} onLocate={()=>setResult('Example location action · no device location requested')} resultLabel={result}/>;
}
function FocusMarqueeDemo() {
 const[draft,setDraft]=useState(String(FOCUS_MARQUEE_DEFAULT_CADENCE));
 const[cadence,setCadence]=useState(FOCUS_MARQUEE_DEFAULT_CADENCE);
 const valid=(value:string)=>value.trim()!==''&&Number.isFinite(Number(value))&&Number(value)>=.8&&Number(value)<=3;
 const change=(value:string)=>{setDraft(value);if(valid(value))setCadence(Number(value));};
 return <View className="gap-4"><Text variant="label">Selected campaign preset · 1.64 seconds per pill</Text><Text variant="small">1.1s standing · .25s leaving · .25s entering · .04s settling. Synthetic example facts.</Text><FocusMarquee {...FOCUS_MARQUEE_CAMPAIGN_PRESET} testID="focus-marquee-campaign-preview" items={['Example: 16 DFW locations','Example: price beat guarantee','Example: free pop-its with follow','Example: open daily through July 5th']}/><Text variant="label">Generic cadence comparison · {FOCUS_MARQUEE_DEFAULT_CADENCE}s shared default</Text><View className="w-full max-w-sm"><FormField label="Seconds per pill" hint="0.8–3 seconds. Applies on next handoff." error={valid(draft)?undefined:'Enter a number from 0.8 to 3 seconds.'}><Input value={draft} onChangeText={change} inputMode="decimal" keyboardType="decimal-pad"/></FormField><Text variant="small" testID="focus-marquee-cadence-value">Preview: {cadence} seconds per pill</Text></View><FocusMarquee testID="focus-marquee-live-preview" cadence={cadence} items={['Example: 16 DFW locations','Example: price beat guarantee','Example: free pop-its with follow','Example: open daily through July 5th']}/><Text variant="label">Linear preset · optional comparison</Text><FocusMarquee motion="linear" edgeBlur={0} items={['Example custom direction','Synthetic caller-owned content']} speed={28} direction="right" spacing={28} badgeAppearance={{size:'md',shape:'rounded'}} centerEmphasis={{scale:1.1,lift:3,range:.4}}/><MarketingMotionControl/></View>;
}
/** Fixtures are visibly examples and never imply catalog, prices, hours or availability. */
export type PromotionExample = Pick<PromotionBannerProps,'title'|'titleAccent'|'eyebrow'|'description'|'artwork'|'action'>;
export function SectionDemo({ name, variant = 'default', promotionExample }: { name: string; variant?: 'default' | 'marketing'; promotionExample?: PromotionExample }) {
  const sampleImage = { uri: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="400" height="280" fill="#d9e8fb"/><text x="40" y="150" font-size="36">SAMPLE ART</text></svg>'), alt: 'Sample artwork fixture' };
  const brand = { image: variant === 'marketing' ? sampleImage : undefined, label: 'Bubba’s · sample navigation', href: '#sample' };
  const links = [{ label: 'Sample destination', href: '#sample' }];
  const products = [{ id: 'sample', title: 'Example ExtraordinarilyLongProductName (782 shots)', href: '#sample', description: 'Presentation fixture · no real retail facts.', priceLabel: 'Price unavailable', badge: 'Example label', image: variant === 'marketing' ? sampleImage : undefined }];
  const locations = [{ id: 'sample', title: 'Example location', address: ['Example address · not a real stand'], hoursLabel: 'Published hours unavailable', statusLabel: 'Reported stand status unavailable', actions: links }];
  if (name === 'LocationSearch') return <LocationSearchDemo/>;
  if (name === 'LocationMap') return <LocationMap description="Example provider slot · no real store coordinates"><View className="flex-1 items-center justify-center p-6"><Text>App-owned map provider renders verified coordinates here.</Text></View></LocationMap>;
  if (name === 'LocationHours') return <LocationHours sourceLabel="Synthetic dates and hours · not a business schedule" days={Array.from({length:10},(_,index)=>({id:String(index),dateLabel:`Example day ${index+1}`,hoursLabel:'Published hours unavailable',isToday:index===0}))}/>;
  if (name === 'FAQSection') return <FAQSection description="Example answers for presentation review." items={[{id:'sample-one',question:'How does this example disclosure work?',answer:'Choose a question to reveal its answer. These are synthetic examples, not actual business policies.'},{id:'sample-two',question:'What happens with a longer question that wraps on a narrow screen?',answer:'The complete question stays readable, the disclosure retains a full target, and the answer follows it in reading order.'}]}/>;
  if (name === 'SafetySection') return <SafetySection title="Example safety layout" description="Synthetic rules for reviewing hierarchy and spacing." rules={Array.from({length:4},(_,index)=>({id:String(index),title:`Example rule ${index+1}`,description:'Caller supplies reviewed instructions. This sample does not establish a safety policy.'}))} aside={<View className="rounded-xl border border-ui-line bg-white p-5"><Text>Example supporting information and actions.</Text></View>}/>;
  if (name === 'FeaturedProductRow') return <FeaturedProductRow items={Array.from({length:4},(_,index)=>({...products[0],id:String(index),title:`Example favorite ${index+1}`}))}/>;
  if (name === 'OfferGrid') return <OfferGrid items={(['social','guarantee','review'] as const).map(kind=>({id:kind,kind,title:`Example ${kind} offer`,eyebrow:'Synthetic review content',description:'Caller supplies the actual offer, conditions and destination. No live promotion is implied.',action:links[0]}))}/>;
  if (name === 'AnnouncementEditor') return <AnnouncementAuthoringDemo/>;
  if (name === 'Icon') return <Inline>{(['search','menu','close','instagram','facebook','x','youtube','tiktok','spotify','sparkles','pause','play','arrowRight'] as const).map(name=><Icon key={name} name={name} accessibilityLabel={name}/>)}</Inline>;
  if (name === 'CampaignSection') return <CampaignSection title="Example campaign" highlight="250" description="Synthetic composition for review; not a live promotion." badges={['Example: 16 DFW locations','Example: price beat guarantee','Example: free pop-its with follow','Example: open daily through July 5th']}/>;
  if (name === 'SocialSection') return <SocialSection title="Example social links" description="Example destinations only." links={[{label:'Instagram',href:'#sample',icon:'instagram'},{label:'Facebook',href:'#sample-facebook',icon:'facebook'}]}/>;
  if (name === 'FocusMarquee') return <FocusMarqueeDemo/>;
  if (name === 'FlagTicker') return <View className="gap-2"><FlagTicker items={['Example campaign','Example destination','Synthetic review copy']}/><MarketingMotionControl/></View>;
  if (name === 'SiteHeader') return <SiteHeader variant={variant} brand={brand} links={links} showSocialLinks={false} showMotionControl={false} announcementScrollBehavior="hide" announcement={variant === 'marketing' ? 'Example announcement · no live campaign' : undefined} />;
  if (name === 'SiteFooter') return <SiteFooter variant={variant} brand={brand} links={links} description="Sample footer" linkGroups={[{title:"Explore",links:[...links,{label:"Example long destination",href:"#sample-long"}]},{title:"Resources",links}]} copyright="Sample copyright; no live business facts"><Text className="text-white">Example season information</Text></SiteFooter>;
  if (name === 'ProductDetail') return <ProductDetail variant={variant} product={{...products[0],gallery:[sampleImage,sampleImage],actions:links,videoHref:"#sample-video"}} />;
  if (name === 'HeroSection') return <HeroSection variant={variant} logoImage={variant === 'marketing' ? sampleImage : undefined} image={variant === 'marketing' ? sampleImage : undefined} title="Make a memory." eyebrow="Example honor badge · sample location count" actions={variant==='marketing'?[{label:'Shop all products',href:'#sample-products'},{label:'Find a location',href:'#sample-locations',tone:'blue'}]:undefined} action={links[0]} />;
  if (name === 'PromotionBanner') return <PromotionBanner variant={variant} emphasis="sparkler" title="Sample" titleAccent="Campaign" eyebrow="Example offer" description="Synthetic campaign content. No live promotion or expiry is implied." action={links[0]} {...promotionExample} />;
  if (name === 'LocationCard') return <LocationCard variant={variant} density={variant==='marketing'?'compact':'default'} location={locations[0]} />;
  if (name === 'LocationGrid') return <LocationGrid variant={variant} density={variant==='marketing'?'compact':'default'} items={Array.from({length:4},(_,index)=>({...locations[0],id:String(index),title:`Example location ${index+1}`}))} />;
  if (name === 'ProductCard') return <ProductCard variant={variant} product={products[0]} />;
  if (name === 'CategoryCard') return <CategoryCard variant={variant} category={products[0]} />;
  if (name === 'CategoryGrid') return <CategoryGrid variant={variant} items={products} />;
  if (name === 'ContentSection') return <ContentSection variant={variant} width="wide" surface="transparent" title="Sample information"><Text>Caller-owned content supplied to a shared section.</Text></ContentSection>;
  return <ProductGrid variant={variant} items={products} />;
}
function MarketingButtonExamples() {
 return <ThemeProvider appearance="light" className="gap-4 bg-white p-4"><Text variant="label">Public marketing actions · simulated examples</Text><Inline align="start"><Button appearance="marketing" size="lg">Example primary action</Button><Button appearance="marketing" size="lg" variant="secondary">Example location action</Button></Inline><Inline><Button appearance="marketing" variant="secondary">Compact action</Button><Button appearance="marketing" variant="secondary" loading loadingLabel="Working">Example busy action</Button><Button appearance="marketing" variant="secondary" disabled>Example disabled action</Button></Inline></ThemeProvider>;
}
export interface UIReviewCatalogProps { componentId?: string; /** Caller-owned private review data, never embedded into the public package. */ promotionExample?: PromotionExample }
export function UIReviewCatalog({ componentId, promotionExample }: UIReviewCatalogProps) {
  const entries = componentId ? reviewCatalog.filter((item) => item.id === componentId || item.name === componentId) : reviewCatalog;
  return <View className="gap-8">{entries.length ? entries.map((entry) => <View key={entry.id} testID={`review-${entry.id}`} className="gap-4"><Heading level={2}>{entry.name}</Heading><Text variant="small" tone="muted">Local demonstration fixture · simulated actions</Text>{entry.category === 'Sections' ? <View className="gap-6"><SectionDemo name={entry.name} promotionExample={promotionExample} /><Text variant="label">Public marketing variant · example content</Text><SectionDemo name={entry.name} variant="marketing" promotionExample={promotionExample} /></View> : entry.id === 'patterns' ? <PatternsDemo /> : <><ComponentDemo name={entry.name as typeof components[number]['name']} />{entry.name==='Button'?<MarketingButtonExamples/>:null}</>}</View>) : <Text>No matching review specimen.</Text>}</View>;
}
