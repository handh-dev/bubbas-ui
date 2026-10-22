'use client';

import { Children, useState } from 'react';
import { Image, View } from 'react-native';
import { Inline, Stack, Container } from './layout';
import { Heading, Text } from './typography';
import { Link, IconButton } from './actions';
import { Badge } from './content';
import { Dialog } from './overlays';
import { cn } from '../internal/utils';
import { ThemeProvider } from '../theme';
import { Button } from './Button';
import { Icon } from './Icon';
import type { SiteHeaderProps, SiteFooterProps, HeroSectionProps, ContentSectionProps, ProductCardProps, ProductDetailProps, PromotionBannerProps, SectionAction, SectionProps } from './sections';

export function MarketingAction({ action }: { action: SectionAction }) {
  return <Button appearance="marketing" variant={action.tone === 'blue' ? 'secondary' : action.tone === 'white' ? 'outline' : 'primary'} href={action.href} external={action.external} className={cn('max-w-full self-stretch', action.tone === 'white' && 'border-white bg-white')} textClassName={action.tone === 'white' ? 'text-bubba-navy' : undefined}>{action.label}</Button>;
}
export function MarketingScope({children,className}: {children: React.ReactNode;className?:string}) { return <ThemeProvider appearance="light" className={cn("min-w-0 bg-transparent",className)}>{children}</ThemeProvider>; }
export function SocialLinks({links,color='#131B23'}:{links:readonly SectionAction[];color?:string}) {
 return <Inline wrap={false} gap={1}>{links.map(link=>{const icon=link.icon??(/instagram/i.test(link.label+link.href)?'instagram':/facebook/i.test(link.label+link.href)?'facebook':undefined);return icon?<Link key={link.href} href={link.href} external={link.external} accessibilityLabel={link.label} className="h-11 w-11 items-center justify-center" textClassName="no-underline"><Icon name={icon} size={22} color={color}/></Link>:<Link key={link.href} href={link.href} external={link.external}>{link.label}</Link>;})}</Inline>;
}
export function MarketingHeader({brand,links,action,announcement,auxiliaryLinks,socialLinks,currentPath,children,className,...props}:SiteHeaderProps) {
 const [open,setOpen]=useState(false);
 const socials=socialLinks??auxiliaryLinks?.filter(link=>/instagram|facebook/i.test(link.label+link.href))??[];
 const extra=auxiliaryLinks?.filter(link=>!socials.includes(link))??[];
 return <View {...props} role="banner" className={cn('bg-white',className)}>
  {announcement?<View className="bubba-announcement min-h-11 items-center justify-center bg-bubba-blue px-4 py-2"><Text variant="caption" className="bubba-announcement-copy text-center text-xs font-black uppercase italic text-white sm:text-sm">{announcement}</Text></View>:null}
  <View className="bubba-header-row mx-auto w-full max-w-[1600px] flex-row items-center justify-between gap-3 px-4 py-2 min-[761px]:px-8">
   <View className="bubba-header-brand min-w-0 shrink-0"><Link textVariant="caption" href={brand.href} accessibilityLabel={brand.label}>{brand.image?<Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-14 w-24 min-[761px]:h-16 min-[761px]:w-28"/>:brand.label}</Link></View>
   <View role="navigation" accessibilityLabel="Main navigation" className="bubba-header-nav hidden flex-row items-center gap-5 min-[1350px]:flex">{links.map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} aria-current={currentPath===link.href?'page':undefined} className="bubba-nav-link" textClassName="text-xs font-extrabold uppercase text-ui-text no-underline">{link.label}</Link>)}</View>
   <View className="bubba-header-actions min-w-0 flex-row items-center justify-end gap-2"><View className="hidden min-[1350px]:flex"><SocialLinks links={socials}/></View>{children}{action?<View className="hidden min-[1350px]:flex"><MarketingAction action={action}/></View>:null}<IconButton accessibilityLabel="Open navigation" aria-expanded={open} onPress={()=>setOpen(true)} className="min-[1350px]:hidden"><Icon name="menu"/></IconButton></View>
  </View>
  <Dialog open={open} onOpenChange={setOpen} title="Navigation" closeLabel="Close navigation"><Stack>{action?<MarketingAction action={action}/>:null}{[...links,...extra].map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} onPress={()=>setOpen(false)} textClassName="text-lg font-extrabold uppercase no-underline">{link.label}</Link>)}<SocialLinks links={socials}/></Stack></Dialog>
 </View>;
}
export function MarketingHero({title,description,eyebrow,image,imageNativeID,action,actions,logoImage,children,className,...props}:HeroSectionProps) {
  const allActions=actions??(action?[action]:[]);
  return <View {...props} className={cn('bubba-marketing-hero bg-white px-4 py-10 sm:py-12',className)}><Container className="bubba-hero-inner max-w-[1184px] px-0"><Inline wrap={false} align="center" className="gap-4 min-[761px]:gap-12">
    <Stack className="min-w-0 flex-[1.5]" gap={6}>{eyebrow?<Text variant="caption" className="text-[10px] font-extrabold uppercase text-ui-muted min-[761px]:text-xs">{eyebrow}</Text>:null}
      <Heading level={1} className={logoImage?'sr-only':'text-3xl font-black uppercase italic min-[761px]:text-5xl bubba-wide:text-5xl'}>{title}</Heading>
      {logoImage?<Image source={{uri:logoImage.uri}} accessibilityLabel={logoImage.alt} resizeMode="contain" className="h-32 w-full max-w-[280px] min-[761px]:h-[280px] min-[761px]:max-w-[560px]"/>:null}
      {description?<Text variant="caption" className="text-sm font-extrabold uppercase leading-5 min-[761px]:text-[21px] min-[761px]:leading-8">{description}</Text>:null}
      <Stack gap={3} className="items-stretch min-[761px]:flex-row min-[761px]:flex-wrap">{allActions.map((item,index)=><MarketingAction key={item.href} action={{...item,tone:item.tone??(index===1?'blue':'red')}}/>)}{children}</Stack>
    </Stack>
    {image?<View className="min-w-0 flex-[0.9] items-center min-[761px]:flex-1"><Image nativeID={imageNativeID} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="bubba-hero-mascot h-[260px] w-full max-w-[300px] min-[761px]:max-w-[440px] min-[761px]:h-[650px]"/></View>:null}
  </Inline></Container></View>;
}
export function MarketingContent({title,description,headingLevel=1,eyebrow,children,className,...props}:ContentSectionProps) {
  return <View {...props} className={cn('bg-bubba-blue bubba-marketing-banner py-10 min-[761px]:py-12',className)}><Container><Stack gap={3}>{eyebrow?<Text variant="caption" className="text-xs font-extrabold uppercase text-white">{eyebrow}</Text>:null}{title?<Heading level={headingLevel} className="text-4xl font-black uppercase italic text-white min-[761px]:text-[64px] min-[761px]:leading-[1.18] bubba-wide:text-[64px] bubba-wide:leading-[1.18]">{title}</Heading>:null}{description?<Text variant="caption" className="text-base text-white">{description}</Text>:null}{children}</Stack></Container></View>;
}
export function MarketingProductCard({product,className,...props}:ProductCardProps) {
 return <View {...props} className={cn('bubba-product-card h-full flex-1 overflow-hidden rounded-xl border border-ui-line bg-white',className)}><Link textVariant="caption" href={product.href} accessibilityLabel={product.title} className="bubba-product-image w-full bg-white">{product.image?<Image source={{uri:product.image.uri}} accessibilityLabel={product.image.alt} resizeMode="contain" className="aspect-[4/3] w-full"/>:<View className="aspect-[4/3] w-full"/>}</Link><Stack gap={2} className="flex-1 p-3 min-[761px]:p-4">{product.badge?<View className="bubba-product-badge self-start flex-row items-center gap-1 rounded-bubba-control bg-bubba-gold px-2 py-1"><Icon name="sparkles" size={16} color="#03256C"/><Text variant="caption" className="text-xs font-extrabold text-bubba-navy">{product.badge}</Text></View>:null}{product.typeLabel?<Text variant="caption" className="text-[10px] font-bold uppercase text-ui-muted min-[761px]:text-xs">{product.typeLabel}</Text>:null}<Heading level={3}><Link textVariant="caption" href={product.href} textClassName="text-base font-black uppercase leading-5 text-ui-text no-underline min-[761px]:text-xl min-[761px]:leading-6">{product.title}</Link></Heading>{product.description?<Text variant="caption" tone="muted" className="text-sm">{product.description}</Text>:null}{product.priceLabel?<Text variant="caption" className="mt-auto pt-2 text-xl font-black italic text-bubba-red min-[761px]:text-[22px]">{product.priceLabel}</Text>:null}</Stack></View>;
}
export function MarketingGrid({children,className,...props}:SectionProps) {
  return <Inline {...props} align="stretch" gap={0} className={cn('w-full',className)}>{Children.map(children,child=><View className="w-1/2 p-1.5 min-[761px]:w-1/4 min-[761px]:p-2">{child}</View>)}</Inline>;
}
export function MarketingFooter({brand,links,description,linkGroups,socialLinks,copyright,children,className,...props}:SiteFooterProps) {
  const groups=linkGroups??[{title:'Links',links}];
  return <View {...props} role="contentinfo" className={cn('bg-[#171717] py-12',className)}><Container><Inline align="start" className="gap-8 min-[1000px]:gap-12"><Stack className="min-w-0 basis-64 flex-[2]" gap={4}><Link textVariant="caption" href={brand.href} accessibilityLabel={brand.label}>{brand.image?<Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-16 w-48 rounded-bubba-control bg-white p-1"/>:brand.label}</Link>{description?<Text variant="caption" className="max-w-[280px] text-sm text-[#D9E8FB]">{description}</Text>:null}<SocialLinks links={socialLinks??[]} color="#FFFFFF"/></Stack>{groups.map(group=><Stack key={group.title} className="min-w-0 basis-36 flex-1" gap={2}><Text variant="caption" className="text-sm font-black uppercase text-white">{group.title}</Text>{group.links.map(link=><Link textVariant="caption" key={link.href} href={link.href} external={link.external} textClassName="text-xs text-[#D9E8FB] no-underline">{link.label}</Link>)}</Stack>)}{children?<Stack className="min-w-0 basis-36 flex-1">{children}</Stack>:null}</Inline>{copyright?<View className="mt-10 border-t border-white/20 pt-6"><Text variant="caption" className="text-xs text-[#D9E8FB]">{copyright}</Text></View>:null}</Container></View>;
}
export function MarketingProductDetail({product,children,legacyGalleryHooks,className,...props}:ProductDetailProps) {
  const images=product.gallery?.length?product.gallery:product.image?[product.image]:[];
  const [selected,setSelected]=useState(0);
  const image=images[selected]??images[0];
  return <View {...props} className={cn('bg-ui-canvas py-8 min-[761px]:py-12',className)}><Container><Inline wrap={false} align="start" className="flex-col gap-8 min-[761px]:flex-row min-[761px]:gap-12"><Stack className="w-full min-w-0 min-[761px]:w-0 min-[761px]:flex-1">{image?<Image nativeID={legacyGalleryHooks?'mainProductImg':undefined} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="aspect-square w-full rounded-xl bg-white"/>:null}{images.length>1?<Inline nativeID={legacyGalleryHooks?'pdpThumbs':undefined}>{images.map((item,index)=><IconButton key={index} accessibilityLabel={`View image ${index+1}: ${item.alt}`} accessibilityState={{selected:index===selected}} aria-pressed={index===selected} onPress={()=>setSelected(index)} {...(legacyGalleryHooks?{dataSet:{src:item.uri}}:{})} className={cn('h-20 w-20 overflow-hidden rounded border bg-white',selected===index?'border-bubba-red':'border-ui-line',legacyGalleryHooks&&'pdp-thumb')}><Image source={{uri:item.uri}} accessibilityLabel={item.alt} resizeMode="contain" className="h-full w-full"/></IconButton>)}</Inline>:null}</Stack><Stack className="w-full min-w-0 min-[761px]:w-0 min-[761px]:flex-1" gap={6}>{product.typeLabel?<Text variant="caption" className="text-xs font-bold uppercase text-ui-muted">{product.typeLabel}</Text>:null}<Heading level={1} className="text-3xl font-black uppercase italic min-[761px]:text-[44px] min-[761px]:leading-[1.18] bubba-wide:text-[44px] bubba-wide:leading-[1.18]">{product.title}</Heading>{product.badge?<Badge>{product.badge}</Badge>:null}{product.priceLabel?<Text variant="caption" className={cn('text-[32px] font-black italic text-bubba-red',legacyGalleryHooks&&'pdp-price')}>{product.priceLabel}</Text>:null}{product.description?<Text>{product.description}</Text>:null}{product.videoHref?<Link textVariant="caption" href={product.videoHref} external>Watch product video</Link>:null}<Stack gap={3} className="items-stretch min-[761px]:flex-row min-[761px]:flex-wrap">{product.actions?.map(action=><MarketingAction key={action.href} action={action}/>)}</Stack>{children}</Stack></Inline></Container></View>;
}
export function MarketingPromotion({title,description,action,emphasis,className,...props}:PromotionBannerProps) {
  return <View {...props} className={cn('relative overflow-hidden rounded-xl bg-bubba-red p-6 min-[761px]:p-8',emphasis==='sparkler'&&'bubba-sparkler-promo',className)}><Inline justify="between" gap={6}><Stack className="min-w-0 flex-1" gap={2}>{emphasis==='sparkler'?<View className="bubba-promo-spark self-start"><Icon name="sparkles" size={40} color="#FED766"/></View>:null}<Heading level={2} className="text-3xl font-black uppercase italic text-white">{title}</Heading>{description?<Text variant="caption" className="text-white">{description}</Text>:null}</Stack>{action?<MarketingAction action={{...action,tone:'white'}}/>:null}</Inline></View>;
}
