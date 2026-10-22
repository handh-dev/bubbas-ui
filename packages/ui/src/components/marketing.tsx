'use client';

import { Children, useState } from 'react';
import { Image, View } from 'react-native';
import { Inline, Stack, Container } from './layout';
import { Heading, Text } from './typography';
import { Link, IconButton } from './actions';
import { Badge } from './content';
import { Dialog } from './overlays';
import { cn } from '../internal/utils';
import type { SiteHeaderProps, SiteFooterProps, HeroSectionProps, ContentSectionProps, ProductCardProps, ProductDetailProps, PromotionBannerProps, SectionAction, SectionProps } from './sections';

function MarketingAction({ action }: { action: SectionAction }) {
  return <Link href={action.href} external={action.external} className="min-h-12 items-center rounded-bubba-control bg-bubba-red px-5 py-3 active:opacity-80" textClassName="text-sm font-extrabold uppercase text-white no-underline">{action.label}</Link>;
}
export function MarketingHeader({brand,links,action,announcement,auxiliaryLinks,currentPath,children,className,...props}:SiteHeaderProps) {
  const [open,setOpen]=useState(false);
  return <View {...props} role="banner" className={cn('bg-white',className)}>
    {announcement ? <View className="min-h-[52px] items-center justify-center bg-bubba-navy px-4 py-3"><Text className="text-center text-xs font-black uppercase italic text-white sm:text-sm">{announcement}</Text></View> : null}
    <Container className="max-w-[1344px]"><Inline wrap={false} justify="between" className="min-h-24 gap-3 py-3">
      <Link href={brand.href} accessibilityLabel={brand.label} className="shrink-0">{brand.image ? <Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-16 w-32 sm:w-40"/> : brand.label}</Link>
      <Inline role="navigation" accessibilityLabel="Main navigation" wrap={false} className="hidden min-[1100px]:flex min-[1100px]:gap-4">{links.map(link=><Link key={link.href} href={link.href} external={link.external} aria-current={currentPath===link.href?'page':undefined} className={cn('border-b-2',currentPath===link.href?'border-bubba-red':'border-transparent')} textClassName="text-xs font-extrabold uppercase text-ui-text no-underline">{link.label}</Link>)}</Inline>
      <Inline wrap={false} gap={3} className="shrink-0"><Inline className="hidden min-[1200px]:flex" gap={3}>{auxiliaryLinks?.map(link=><Link key={link.href} href={link.href} external={link.external} textClassName="text-xs font-bold no-underline">{link.label}</Link>)}</Inline>{children}{action?<View className="hidden min-[1100px]:flex"><MarketingAction action={action}/></View>:null}<IconButton accessibilityLabel="Open navigation" aria-expanded={open} onPress={()=>setOpen(true)} className="min-[1100px]:hidden"><Text className="text-2xl">☰</Text></IconButton></Inline>
    </Inline></Container>
    <Dialog open={open} onOpenChange={setOpen} title="Navigation" closeLabel="Close navigation"><Stack>{action?<MarketingAction action={action}/>:null}{links.map(link=><Link key={link.href} href={link.href} external={link.external} onPress={()=>setOpen(false)} textClassName="text-lg font-extrabold uppercase no-underline">{link.label}</Link>)}</Stack></Dialog>
  </View>;
}
export function MarketingHero({title,description,eyebrow,image,imageNativeID,action,actions,logoImage,children,className,...props}:HeroSectionProps) {
  const allActions=actions??(action?[action]:[]);
  return <View {...props} className={cn('bg-ui-canvas px-4 py-10 sm:py-16',className)}><Container className="max-w-[1184px] px-0"><Inline wrap={false} align="center" className="gap-4 min-[761px]:gap-12">
    <Stack className="min-w-0 flex-[1.5]" gap={6}>{eyebrow?<Text className="text-[10px] font-extrabold uppercase text-ui-muted min-[761px]:text-xs">{eyebrow}</Text>:null}
      <Heading level={1} className={logoImage?'sr-only':'text-3xl font-black uppercase italic min-[761px]:text-5xl'}>{title}</Heading>
      {logoImage?<Image source={{uri:logoImage.uri}} accessibilityLabel={logoImage.alt} resizeMode="contain" className="h-32 w-full max-w-[280px] min-[761px]:h-[280px] min-[761px]:max-w-[560px]"/>:null}
      {description?<Text className="text-sm font-extrabold uppercase leading-5 min-[761px]:text-[21px] min-[761px]:leading-8">{description}</Text>:null}
      <Inline gap={3} className="items-start">{allActions.map(item=><MarketingAction key={item.href} action={item}/>)}{children}</Inline>
    </Stack>
    {image?<View className="min-w-0 flex-[0.9] items-center min-[761px]:flex-1"><Image nativeID={imageNativeID} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="h-[260px] w-full max-w-[300px] min-[761px]:h-[440px]"/></View>:null}
  </Inline></Container></View>;
}
export function MarketingContent({title,description,headingLevel=1,eyebrow,children,className,...props}:ContentSectionProps) {
  return <View {...props} className={cn('bg-bubba-navy bubba-marketing-banner py-10 min-[761px]:py-12',className)}><Container><Stack gap={3}>{eyebrow?<Text className="text-xs font-extrabold uppercase text-white">{eyebrow}</Text>:null}{title?<Heading level={headingLevel} className="text-4xl font-black uppercase italic text-white min-[761px]:text-[64px] min-[761px]:leading-[1.18]">{title}</Heading>:null}{description?<Text className="text-base text-white">{description}</Text>:null}{children}</Stack></Container></View>;
}
export function MarketingProductCard({product,className,...props}:ProductCardProps) {
  return <View {...props} className={cn('overflow-hidden rounded-xl border border-ui-line bg-white',className)}>{product.image?<Link href={product.href} accessibilityLabel={product.title} className="w-full"><Image source={{uri:product.image.uri}} accessibilityLabel={product.image.alt} resizeMode="contain" className="aspect-square w-full"/></Link>:null}<Stack gap={2} className="p-3 min-[761px]:p-5">{product.badge?<Badge>{product.badge}</Badge>:null}{product.typeLabel?<Text className="text-xs font-bold uppercase text-ui-muted">{product.typeLabel}</Text>:null}<Heading level={3}><Link href={product.href} textClassName="text-sm font-black uppercase leading-5 text-ui-text no-underline min-[761px]:text-[17px] min-[761px]:leading-6">{product.title}</Link></Heading>{product.description?<Text tone="muted" className="text-sm">{product.description}</Text>:null}{product.priceLabel?<Text className="text-xl font-black italic text-bubba-red min-[761px]:text-[22px]">{product.priceLabel}</Text>:null}</Stack></View>;
}
export function MarketingGrid({children,className,...props}:SectionProps) {
  return <Inline {...props} align="stretch" gap={0} className={cn('w-full',className)}>{Children.map(children,child=><View className="w-1/2 p-1.5 min-[761px]:w-1/4 min-[761px]:p-2.5">{child}</View>)}</Inline>;
}
export function MarketingFooter({brand,links,description,linkGroups,socialLinks,copyright,children,className,...props}:SiteFooterProps) {
  const groups=linkGroups??[{title:'Links',links}];
  return <View {...props} role="contentinfo" className={cn('bg-[#171717] py-12',className)}><Container><Inline align="start" className="gap-8 min-[1000px]:gap-12"><Stack className="min-w-0 basis-64 flex-[2]" gap={4}><Link href={brand.href} accessibilityLabel={brand.label}>{brand.image?<Image source={{uri:brand.image.uri}} accessibilityLabel={brand.image.alt} resizeMode="contain" className="h-14 w-48"/>:brand.label}</Link>{description?<Text className="max-w-[280px] text-sm text-[#D9E8FB]">{description}</Text>:null}<Inline>{socialLinks?.map(link=><Link key={link.href} href={link.href} external={link.external} textClassName="text-sm text-[#D9E8FB] no-underline">{link.label}</Link>)}</Inline></Stack>{groups.map(group=><Stack key={group.title} className="min-w-0 basis-36 flex-1" gap={2}><Text className="text-sm font-black uppercase text-white">{group.title}</Text>{group.links.map(link=><Link key={link.href} href={link.href} external={link.external} textClassName="text-xs text-[#D9E8FB] no-underline">{link.label}</Link>)}</Stack>)}{children?<Stack className="min-w-0 basis-36 flex-1">{children}</Stack>:null}</Inline>{copyright?<View className="mt-10 border-t border-white/20 pt-6"><Text className="text-xs text-[#D9E8FB]">{copyright}</Text></View>:null}</Container></View>;
}
export function MarketingProductDetail({product,children,legacyGalleryHooks,className,...props}:ProductDetailProps) {
  const images=product.gallery?.length?product.gallery:product.image?[product.image]:[];
  const [selected,setSelected]=useState(0);
  const image=images[selected]??images[0];
  return <View {...props} className={cn('bg-ui-canvas py-8 min-[761px]:py-12',className)}><Container><Inline align="start" className="gap-8 min-[761px]:gap-12"><Stack className="min-w-0 basis-80 flex-1">{image?<Image nativeID={legacyGalleryHooks?'mainProductImg':undefined} source={{uri:image.uri}} accessibilityLabel={image.alt} resizeMode="contain" className="aspect-square w-full rounded-xl bg-white"/>:null}{images.length>1?<Inline nativeID={legacyGalleryHooks?'pdpThumbs':undefined}>{images.map((item,index)=><IconButton key={index} accessibilityLabel={`View image ${index+1}: ${item.alt}`} accessibilityState={{selected:index===selected}} aria-pressed={index===selected} onPress={()=>setSelected(index)} {...(legacyGalleryHooks?{dataSet:{src:item.uri}}:{})} className={cn('h-20 w-20 overflow-hidden rounded border bg-white',selected===index?'border-bubba-red':'border-ui-line',legacyGalleryHooks&&'pdp-thumb')}><Image source={{uri:item.uri}} accessibilityLabel={item.alt} resizeMode="contain" className="h-full w-full"/></IconButton>)}</Inline>:null}</Stack><Stack className="min-w-0 basis-80 flex-1" gap={6}>{product.typeLabel?<Text className="text-xs font-bold uppercase text-ui-muted">{product.typeLabel}</Text>:null}<Heading level={1} className="text-3xl font-black uppercase italic min-[761px]:text-[44px] min-[761px]:leading-[1.18]">{product.title}</Heading>{product.badge?<Badge>{product.badge}</Badge>:null}{product.priceLabel?<Text className={cn('text-[32px] font-black italic text-bubba-red',legacyGalleryHooks&&'pdp-price')}>{product.priceLabel}</Text>:null}{product.description?<Text>{product.description}</Text>:null}{product.videoHref?<Link href={product.videoHref} external>Watch product video</Link>:null}<Inline>{product.actions?.map(action=><MarketingAction key={action.href} action={action}/>)}</Inline>{children}</Stack></Inline></Container></View>;
}
export function MarketingPromotion({title,description,action,className,...props}:PromotionBannerProps) {
  return <View {...props} className={cn('rounded-xl bg-bubba-red p-6 min-[761px]:p-8',className)}><Inline justify="between" gap={6}><Stack className="min-w-0 flex-1" gap={2}><Heading level={2} className="text-3xl font-black uppercase italic text-white">{title}</Heading>{description?<Text className="text-white">{description}</Text>:null}</Stack>{action?<Link href={action.href} external={action.external} className="rounded-bubba-control border-2 border-white px-5 py-3" textClassName="font-extrabold uppercase text-white no-underline">{action.label}</Link>:null}</Inline></View>;
}
