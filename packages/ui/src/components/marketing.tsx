'use client';

import { Children, useEffect, useRef, useState } from 'react';
import { Image, Platform, View } from 'react-native';
import { vars } from 'nativewind';
import { Inline, Stack, Container } from './layout';
import { Heading, Text } from './typography';
import { Link, IconButton } from './actions';
import { Dialog } from './overlays';
import { cn } from '../internal/utils';
import { ThemeProvider } from '../theme';
import { Button, type ButtonSize } from './Button';
import { Icon } from './Icon';
import { useMarketingMotion } from '../internal/marketing-motion';
import { focusRing } from '../internal/utils';
import { Switch } from './forms/Choice';
import type { AnnouncementContent } from './announcement';
import type { SiteHeaderProps, SiteFooterProps, HeroSectionProps, ContentSectionProps, ProductCardProps, ProductDetailProps, PromotionBannerProps, SectionAction, SectionProps } from './sections';

export function MarketingAction({ action, size='md', compact=false, className }: { action: SectionAction; size?:ButtonSize; compact?:boolean; className?:string }) {
  return <Button appearance="marketing" size={size} variant={action.tone === 'blue' ? 'secondary' : action.tone === 'white' ? 'outline' : 'primary'} href={action.href} external={action.external} className={cn('bubba-marketing-action max-w-full self-start', action.tone === 'white' && 'border-white bg-white',className)} textClassName={cn(action.tone === 'white'&&'text-bubba-navy',compact&&'text-[11px] leading-4 tracking-normal min-[761px]:text-sm')}>{action.label}</Button>;
}
export function MarketingScope({children,className}: {children: React.ReactNode;className?:string}) { const [motion]=useMarketingMotion(); return <ThemeProvider {...{dataSet:{bubbaMotion:motion?"on":"off"}}} appearance="light" className={cn("min-w-0 bg-transparent",className)}>{children}</ThemeProvider>; }
export function SocialLinks({links,color='#131B23'}:{links:readonly SectionAction[];color?:string}) {
 return <Inline wrap gap={1} className="bubba-social-links">{links.map(link=>{const icon=link.icon??(/instagram/i.test(link.label+link.href)?'instagram':/facebook/i.test(link.label+link.href)?'facebook':/youtube/i.test(link.label+link.href)?'youtube':/tiktok/i.test(link.label+link.href)?'tiktok':/spotify/i.test(link.label+link.href)?'spotify':/(?:^X$|https?:\/\/(?:www\.)?(?:x|twitter)\.com)/i.test(link.label+' '+link.href)?'x':undefined);return icon?<Link key={link.href} href={link.href} external={link.external} accessibilityLabel={link.label} className="h-11 w-11 items-center justify-center" textClassName="no-underline"><Icon name={icon} size={22} color={color}/></Link>:<Link key={link.href} href={link.href} external={link.external}>{link.label}</Link>;})}</Inline>;
}
export function MarketingMotionControl({ dark=false }: { dark?:boolean }) {
 const [motion,toggle,reduced]=useMarketingMotion();
 return <Switch checked={motion} onCheckedChange={toggle} disabled={reduced} accessibilityLabel={reduced?"Decorative motion; disabled by system reduced motion":"Decorative motion"} label={motion?'Motion on':'Motion off'} className={cn('bubba-motion-control self-start gap-2 border border-transparent px-2',focusRing,dark&&'bubba-motion-control-dark focus:border-white web:focus-visible:outline-white')} textClassName={cn('text-xs font-bold',dark?'text-white':'text-bubba-navy')}/>;
}
// Structural web types keep the universal entry independent of lib.dom.
interface AnnouncementTextNode { style:{fontSize:string;setProperty(name:string,value:string,priority?:string):void;removeProperty(name:string):void}; scrollWidth:number; getBoundingClientRect():{width:number} }
interface AnnouncementViewportNode { clientWidth:number;setAttribute(name:string,value:string):void; querySelectorAll(selector:string):Iterable<AnnouncementTextNode> }
interface AnnouncementObserver { observe(node:AnnouncementViewportNode):void; disconnect():void }
interface AnnouncementWeb { ResizeObserver?:new(callback:()=>void)=>AnnouncementObserver; addEventListener(event:string,callback:()=>void):void; removeEventListener(event:string,callback:()=>void):void; getComputedStyle(node:AnnouncementTextNode):{fontSize:string}; document?:{fonts?:{ready:Promise<unknown>}} }
/** Static text: caller may supply a reviewed concise phone message. No moving announcement. */
export interface AnnouncementBannerProps { content:AnnouncementContent; compactCopy?:AnnouncementContent; onFitChange?:(fontSize:number)=>void }
export function AnnouncementBanner({content,compactCopy,onFitChange}:AnnouncementBannerProps) {
 const copy=typeof content==='string'?content:content.map(part=>part.text).join('');
 const renderContent=(value:AnnouncementContent)=>typeof value==='string'?value:value.map((part,index)=><Text key={index} variant="caption" className={cn('bubba-announcement-segment font-black uppercase italic',part.tone==='yellow'?'bubba-announcement-yellow':'text-white')} style={part.tone==='yellow'?{color:'#FED766',backgroundColor:'#03256C'}:undefined}>{part.text}</Text>);
 // Conservative uppercase advance bounds for the approved Montserrat 900 font.
 // Unlike a minimum font-size floor, this also contains long copy before JS runs.
 const fallback=(value:AnnouncementContent)=>{
  const text=(typeof value==='string'?value:value.map(part=>part.text).join('')).toUpperCase();
  const advance=Array.from(text).reduce((width,char)=>width+(/\s/.test(char)?.35:char==='W'?1.3:char==='M'?1.05:/[OQ]/.test(char)?.9:/[ADHNUV]/.test(char)?.85:/[BCKPRXG]/.test(char)?.8:/[ELFSTYZ0-9]/.test(char)?.75:char==='I'?.4:char==='J'?.65:/['’.,:;!|]/.test(char)?.4:/[\x20-\x7e]/.test(char)?1.3:2),0);
  return vars({'--bubba-announcement-length':String(Math.max(1,advance))});
 };
 const viewport=useRef<React.ElementRef<typeof View>>(null);
 useEffect(()=>{
  if(Platform.OS!=='web') return;
  const node=viewport.current as unknown as AnnouncementViewportNode|null;
  if(!node) return;
  let alive=true;
  const fit=()=>{
   if(!alive)return;
   const texts=Array.from(node.querySelectorAll('.bubba-announcement-copy'));
   const available=Math.max(1,node.clientWidth-24);
   // NativeWind utilities are important. Use the same priority while measuring
   // and painting, and measure the fractional rendered width rather than a
   // rounded scrollWidth at a different effective font size.
   const widths=texts.map(text=>{text.style.setProperty('font-size','14px','important');text.style.setProperty('display','block','important');const width=text.getBoundingClientRect().width;text.style.removeProperty('display');return width;});
   const compact=Boolean(compactCopy)&&(node.clientWidth<761||14*available/Math.max(widths[0],1)<11);
   node.setAttribute('data-bubba-compact',compact?'true':'false');
   const index=compact?1:0,size=Math.min(14,14*available/Math.max(widths[index],1));
   texts[index].style.setProperty('font-size',`${size}px`,'important');
   onFitChange?.(parseFloat(web.getComputedStyle(texts[index]).fontSize));
  };
  const web=globalThis as unknown as AnnouncementWeb;
  fit(); const observer=web.ResizeObserver?new web.ResizeObserver(fit):undefined;
  observer?.observe(node); web.addEventListener('resize',fit); web.document?.fonts?.ready.then(fit);
  return ()=>{alive=false;observer?.disconnect();web.removeEventListener('resize',fit);};
 },[copy,compactCopy,content,onFitChange]);
 return <View className="bubba-announcement min-h-11 justify-center bg-bubba-blue py-2"><View ref={viewport} accessible role="note" accessibilityLabel={copy} className="bubba-announcement-viewport min-w-0 w-full items-center justify-center"><Text style={fallback(content)} aria-hidden={Boolean(compactCopy)&&Platform.OS==='web'} variant="caption" className={cn('bubba-announcement-copy bubba-announcement-full text-center text-xs font-black uppercase italic text-white',compactCopy&&'bubba-announcement-has-compact')}>{renderContent(content)}</Text>{compactCopy&&Platform.OS==='web'?<Text style={fallback(compactCopy)} aria-hidden variant="caption" className="bubba-announcement-copy bubba-announcement-compact text-center text-xs font-black uppercase italic text-white">{renderContent(compactCopy)}</Text>:null}</View></View>;
}
export function MarketingHeader({brand,links,action,announcement,announcementCompact,auxiliaryLinks,socialLinks,currentPath,children,className,...props}:SiteHeaderProps) {
 const [open,setOpen]=useState(false);
 const socials=socialLinks??auxiliaryLinks?.filter(link=>/instagram|facebook|youtube|tiktok|spotify|twitter|x\.com/i.test(link.label+link.href))??[];
 const extra=auxiliaryLinks?.filter(link=>!socials.includes(link))??[];
 return <View {...props} role="banner" className={cn('bg-white',className)}>
  {announcement?<AnnouncementBanner content={announcement} compactCopy={announcementCompact}/>:null}
  <View className="bubba-header-row mx-auto w-full max-w-[1600px] flex-row items-center justify-between gap-3 px-4 py-2 min-[761px]:px-8">
   <View className="bubba-header-brand min-w-0 shrink-0"><Link textVariant="caption" href={brand.href} accessibilityLabel={brand.label}>{brand.image?<Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-14 w-24 min-[761px]:h-16 min-[761px]:w-28"/>:brand.label}</Link></View>
   <View role="navigation" accessibilityLabel="Main navigation" className="bubba-header-nav hidden flex-row items-center gap-5 min-[1350px]:flex">{links.map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} aria-current={currentPath===link.href?'page':undefined} className="bubba-nav-link" textClassName="text-xs font-extrabold uppercase text-ui-text no-underline">{link.label}</Link>)}</View>
   <View className="bubba-header-actions min-w-0 flex-row items-center justify-end gap-2"><View className="hidden min-[1350px]:flex"><SocialLinks links={socials}/></View>{children}{action?<View className="hidden min-[1350px]:flex"><MarketingAction action={action}/></View>:null}<IconButton accessibilityLabel="Open navigation" aria-expanded={open} onPress={()=>setOpen(true)} className={extra.length ? undefined : "min-[1350px]:hidden"}><Icon name="menu"/></IconButton></View>
  </View>
  <Dialog open={open} onOpenChange={setOpen} title="Navigation" closeLabel="Close navigation"><Stack>{action?<MarketingAction action={action}/>:null}{[...links,...extra].map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} onPress={()=>setOpen(false)} className="bubba-mobile-nav-link min-h-11 justify-center rounded-bubba-control px-3" textClassName="text-lg font-extrabold uppercase no-underline">{link.label}</Link>)}<SocialLinks links={socials}/><MarketingMotionControl/></Stack></Dialog>
 </View>;
}
export function MarketingHero({title,description,eyebrow,image,imageNativeID,action,actions,logoImage,children,className,...props}:HeroSectionProps) {
  const allActions=actions??(action?[action]:[]);
  return <View {...props} className={cn('bubba-marketing-hero bg-white px-4 py-6 min-[761px]:py-12',className)}><Container className="bubba-hero-inner max-w-[1184px] px-0"><Inline wrap={false} align="center" className="bubba-hero-layout flex-col gap-5 min-[761px]:flex-row min-[761px]:gap-12">
    <Stack className="bubba-hero-copy w-full min-w-0 min-[761px]:flex-[1.5] min-[761px]:gap-6" gap={4}>{eyebrow?<View className="bubba-honor-badge self-center rounded-full border border-[#C39424] bg-bubba-gold px-4 py-2 min-[761px]:self-start"><Text variant="caption" className="text-center text-xs font-extrabold uppercase text-[#352300]">{eyebrow}</Text></View>:null}
      <Heading level={1} className={logoImage?'sr-only':'text-3xl font-black uppercase italic min-[761px]:text-5xl bubba-wide:text-5xl'}>{title}</Heading>
      {logoImage?<Image source={{uri:logoImage.uri}} accessibilityLabel={logoImage.alt} resizeMode="contain" className="bubba-hero-logo hidden w-full min-[761px]:flex min-[761px]:h-[280px] min-[761px]:max-w-[560px]"/>:null}
      {description?<Text variant="caption" className="text-sm font-extrabold uppercase leading-5 min-[761px]:text-[21px] min-[761px]:leading-8">{description}</Text>:null}
      <Stack gap={3} className={cn("bubba-hero-actions w-full min-w-0 flex-row flex-nowrap items-center justify-center gap-2 min-[761px]:justify-start",allActions.length>1&&!children&&"bubba-hero-action-pair")}>{allActions.map((item,index)=><MarketingAction key={item.href} className="max-w-[49%] min-w-0 shrink self-center min-[761px]:self-start" compact size="sm" action={{...item,tone:item.tone??(index===1?'blue':'red')}}/>)}{children}</Stack>
    </Stack>
    {image?<View className="bubba-hero-art order-first w-full min-w-0 items-center min-[761px]:order-none min-[761px]:w-0 min-[761px]:flex-1"><Image nativeID={imageNativeID} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="bubba-hero-mascot h-[220px] w-full max-w-[280px] min-[761px]:max-w-[440px] min-[761px]:h-[650px]"/></View>:null}
  </Inline></Container></View>;
}
export function MarketingContent({title,description,headingLevel=1,eyebrow,children,className,width='standard',surface='default',...props}:ContentSectionProps) {
  return <View {...props} className={cn('bubba-marketing-banner py-10 min-[761px]:py-12',surface==='transparent'?'bubba-content-transparent bg-transparent':'bg-bubba-blue',className)}><Container width={width}><Stack gap={3}>{eyebrow?<Text variant="caption" className="text-xs font-extrabold uppercase text-white">{eyebrow}</Text>:null}{title?<Heading level={headingLevel} className="text-4xl font-black uppercase italic text-white min-[761px]:text-[64px] min-[761px]:leading-[1.18] bubba-wide:text-[64px] bubba-wide:leading-[1.18]">{title}</Heading>:null}{description?<Text variant="caption" className="text-base text-white">{description}</Text>:null}{children}</Stack></Container></View>;
}
/** Decorative native views become bounded gold twinkles on web; all motion obeys the shared preference. */
function GoldSparkles({large=false}:{large?:boolean}) { return <View accessible={false} aria-hidden pointerEvents="none" className={cn('bubba-gold-sparkles',large&&'bubba-gold-sparkles-large')}>{[0,1,2,3,4].map(i=><View key={i} className={`bubba-gold-sparkle bubba-gold-sparkle-${i}`}/>)}</View>; }
export function MarketingProductBadge({label,icon=true,className}:{label:string;icon?:boolean;className?:string}) { return <View className={cn("bubba-product-badge self-start flex-row items-center gap-1 rounded-bubba-control bg-bubba-gold px-2 py-1",className)}>{icon?<Icon name="sparkles" size={16} color="#03256C"/>:null}<Text variant="caption" className="text-xs font-extrabold text-bubba-navy">{label}</Text><GoldSparkles/></View>; }
export function MarketingProductCard({product,className,...props}:ProductCardProps) {
 return <View {...props} className={cn('bubba-product-card h-full flex-1 overflow-hidden rounded-xl border border-ui-line bg-white',className)}><Link textVariant="caption" href={product.href} accessibilityLabel={product.title} className="bubba-product-image w-full bg-white">{product.image?<Image source={{uri:product.image.uri}} accessibilityLabel={product.image.alt} resizeMode="contain" className="aspect-[4/3] w-full"/>:<View className="aspect-[4/3] w-full"/>}</Link><Stack gap={2} className="flex-1 p-3 min-[761px]:p-4">{product.badge?<MarketingProductBadge label={product.badge}/>:null}{product.typeLabel?<Text variant="caption" className="text-[10px] font-bold uppercase text-ui-muted min-[761px]:text-xs">{product.typeLabel}</Text>:null}<Heading level={3} className="bubba-product-title min-w-0 w-full"><Link textVariant="caption" className="min-w-0 max-w-full" href={product.href} textClassName="bubba-product-title-copy text-base font-black uppercase leading-5 text-ui-text no-underline min-[761px]:text-xl min-[761px]:leading-6">{product.title}</Link></Heading>{product.description?<Text variant="caption" tone="muted" className="text-sm">{product.description}</Text>:null}{product.priceLabel?<Text variant="caption" className="mt-auto pt-2 text-xl font-black italic text-bubba-red min-[761px]:text-[22px]">{product.priceLabel}</Text>:null}</Stack></View>;
}
export function MarketingGrid({children,className,...props}:SectionProps) {
  return <Inline {...props} align="stretch" gap={0} className={cn('bubba-marketing-grid w-full',className)}>{Children.map(children,child=><View className="bubba-marketing-grid-item min-w-0 w-1/2 p-1.5 min-[761px]:w-1/3 min-[1200px]:w-1/4 min-[761px]:p-2">{child}</View>)}</Inline>;
}
export function MarketingFooter({brand,links,description,linkGroups,socialLinks,copyright,children,className,...props}:SiteFooterProps) {
  const groups=linkGroups??[{title:'Links',links}];
  return <View {...props} role="contentinfo" className={cn('bubba-marketing-footer bg-[#171717] py-12',className)}><Container><Inline align="start" className="bubba-footer-layout gap-6 min-[761px]:gap-8 min-[1000px]:gap-12"><Stack className="bubba-footer-brand w-full min-w-0 min-[761px]:basis-64 min-[761px]:flex-[2]" gap={4}><Link textVariant="caption" href={brand.href} accessibilityLabel={brand.label}>{brand.image?<Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-16 w-48"/>:brand.label}</Link>{description?<Text variant="caption" className="max-w-[280px] text-sm text-[#D9E8FB]">{description}</Text>:null}<SocialLinks links={socialLinks??[]} color="#FFFFFF"/></Stack>{groups.map(group=><Stack key={group.title} className="bubba-footer-group min-w-0 min-[761px]:basis-36 min-[761px]:flex-1" gap={2}><Text variant="caption" className="text-sm font-black uppercase text-white">{group.title}</Text>{group.links.map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} className="max-w-full" textClassName="text-sm leading-6 text-[#D9E8FB] no-underline">{link.label}</Link>)}</Stack>)}{children?<Stack className="bubba-footer-season w-full min-w-0 min-[761px]:basis-36 min-[761px]:flex-1">{children}</Stack>:null}</Inline><Stack className="mt-8 border-t border-white/20 pt-5" gap={2}>{copyright?<Text variant="caption" className="text-xs text-[#D9E8FB]">{copyright}</Text>:null}<MarketingMotionControl dark/></Stack></Container></View>;
}
export function MarketingProductDetail({product,children,legacyGalleryHooks,className,...props}:ProductDetailProps) {
  const images=product.gallery?.length?product.gallery:product.image?[product.image]:[];
  const [selected,setSelected]=useState(0);
  const image=images[selected]??images[0];
  return <View {...props} className={cn('bubba-product-detail bg-ui-canvas py-5 min-[761px]:py-12',className)}><Container><Inline wrap={false} align="start" className="flex-col gap-5 min-[761px]:flex-row min-[761px]:gap-12"><Stack className="w-full min-w-0 min-[761px]:w-0 min-[761px]:flex-1">{image?<Image nativeID={legacyGalleryHooks?'mainProductImg':undefined} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="bubba-pdp-main-image h-[220px] w-full rounded-xl bg-white min-[761px]:aspect-square min-[761px]:h-auto"/>:null}{images.length>1?<Inline gap={2} className="bubba-pdp-thumbnails" nativeID={legacyGalleryHooks?'pdpThumbs':undefined}>{images.map((item,index)=><IconButton key={index} accessibilityLabel={`View image ${index+1}: ${item.alt}`} accessibilityState={{selected:index===selected}} aria-pressed={index===selected} onPress={()=>setSelected(index)} {...(legacyGalleryHooks?{dataSet:{src:item.uri}}:{})} className={cn('h-12 w-12 overflow-hidden rounded border bg-white min-[761px]:h-20 min-[761px]:w-20',selected===index?'border-bubba-red':'border-ui-line',legacyGalleryHooks&&'pdp-thumb')}><Image source={{uri:item.uri}} accessibilityLabel={item.alt} resizeMode="contain" className="h-full w-full"/></IconButton>)}</Inline>:null}</Stack><Stack className="w-full min-w-0 min-[761px]:w-0 min-[761px]:flex-1" gap={3}>{product.typeLabel?<Text variant="caption" className="text-xs font-bold uppercase text-ui-muted">{product.typeLabel}</Text>:null}<Heading level={1} className="text-2xl font-black uppercase italic min-[761px]:text-[44px] min-[761px]:leading-[1.18] bubba-wide:text-[44px] bubba-wide:leading-[1.18]">{product.title}</Heading>{product.badge?<MarketingProductBadge label={product.badge}/>:null}{product.priceLabel?<Text variant="caption" className={cn('text-[32px] font-black italic text-bubba-red',legacyGalleryHooks&&'pdp-price')}>{product.priceLabel}</Text>:null}{product.description?<Text>{product.description}</Text>:null}{product.videoHref?<Link textVariant="caption" href={product.videoHref} external>Watch product video</Link>:null}<Stack gap={3} className="items-start min-[761px]:flex-row min-[761px]:flex-wrap">{product.actions?.map(action=><MarketingAction key={action.href} action={action}/>)}</Stack>{children}</Stack></Inline></Container></View>;
}
export function MarketingPromotion({title,titleAccent,eyebrow,artwork,description,action,emphasis,className,...props}:PromotionBannerProps) {
 const [failedArtwork,setFailedArtwork]=useState<string|null>(null);
 const hasArtwork=Boolean(artwork?.uri)&&failedArtwork!==artwork?.uri;
 const ratio=artwork?.aspectRatio&&Number.isFinite(artwork.aspectRatio)&&artwork.aspectRatio>0?artwork.aspectRatio:1;
 const rotation=artwork?.rotation&&Number.isFinite(artwork.rotation)?Math.max(-180,Math.min(180,artwork.rotation)):0;
 if(emphasis==='sparkler') return <View {...props} className={cn('bubba-promotion bubba-sparkler-promo relative overflow-hidden rounded-xl bg-bubba-blue p-6',!hasArtwork&&'bubba-sparkler-promo-no-art',className)}>
  <View accessible={false} aria-hidden pointerEvents="none" className="bubba-sparkler-sweep absolute bg-bubba-red"/>
  <GoldSparkles large/>
  {hasArtwork&&artwork?<View accessible={false} aria-hidden pointerEvents="none" className="bubba-sparkler-art absolute"><Image key={artwork.uri} source={{uri:artwork.uri}} accessible={false} accessibilityLabel="" resizeMode="contain" onError={()=>setFailedArtwork(artwork.uri)} className="bubba-sparkler-original" style={{width:'100%',aspectRatio:ratio,transform:[{rotate:`${rotation}deg`}]}}/></View>:null}
  <View className="bubba-sparkler-copy relative items-start">
   {eyebrow?<MarketingProductBadge label={eyebrow} icon={false} className="bubba-sparkler-eyebrow"/>:null}
   <Heading level={2} className="bubba-sparkler-title w-full font-black uppercase italic text-white">{title}{titleAccent?<>
    {'\n'}<Text className="bubba-sparkler-title-accent font-black uppercase italic text-bubba-gold">{titleAccent}</Text></>:null}</Heading>
   {description?<Text variant="caption" className="bubba-sparkler-description text-base font-medium leading-6 text-white">{description}</Text>:null}
  </View>
  {action?<View className="bubba-sparkler-action relative self-start"><MarketingAction action={{...action,tone:'white'}}/></View>:null}
 </View>;
 return <View {...props} className={cn('bubba-promotion relative overflow-hidden rounded-xl bg-bubba-red p-6 min-[761px]:p-8',className)}><GoldSparkles large/><View accessible={false} aria-hidden pointerEvents="none" className="bubba-promo-burst bubba-promo-burst-left"/><View accessible={false} aria-hidden pointerEvents="none" className="bubba-promo-burst bubba-promo-burst-right"/><Inline justify="between" gap={6} className="relative flex-col items-stretch min-[761px]:flex-row min-[761px]:items-center"><Stack className="min-w-0 flex-1" gap={2}><Heading level={2} className="text-3xl font-black uppercase italic text-white">{title}{titleAccent?` ${titleAccent}`:''}</Heading>{description?<Text variant="caption" className="text-white">{description}</Text>:null}</Stack>{action?<View className="max-w-full self-start min-[761px]:self-center"><MarketingAction action={{...action,tone:'white'}}/></View>:null}</Inline></View>;
}
