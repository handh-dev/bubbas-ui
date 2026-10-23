'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Container, Inline, Stack } from './layout';
import { Heading, Text } from './typography';
import { MarketingScope, SocialLinks } from './marketing';
import type { SectionAction, SectionProps } from './sections';
import { cn } from '../internal/utils';
import { useMarketingMotion } from '../internal/marketing-motion';

export interface CampaignSectionProps extends SectionProps {
 title:string; description?:string; eyebrow?:string; highlight?:string;
 badges?:readonly string[]; tone?:'blue'|'red'; children?:ReactNode;
}
/** Caller owns all campaign claims and seasonal facts. Fixed-brand light composition. */
export function CampaignSection({title,description,eyebrow,highlight,badges,tone='blue',children,className,variant,...props}:CampaignSectionProps) {
 return <MarketingScope><View {...props} className={cn('bubba-campaign-section px-4 py-12 min-[761px]:py-16',tone==='blue'?'bubba-campaign-blue bg-bubba-blue':'bubba-campaign-red bg-bubba-red',className)}><Container><Stack gap={4} className="items-center">{eyebrow?<Text variant="caption" className="text-center text-sm font-extrabold uppercase text-white">{eyebrow}</Text>:null}{highlight?<Text variant="caption" className="text-center text-[100px] font-black italic leading-[1] text-bubba-gold min-[761px]:text-[160px]">{highlight}</Text>:null}<Heading level={2} className="w-full min-w-0 max-w-full text-center text-3xl font-black uppercase italic text-white min-[761px]:text-5xl bubba-wide:text-5xl">{title}</Heading>{description?<Text className="bubba-campaign-description max-w-[760px] text-center text-white">{description}</Text>:null}{badges?.length?<ScrollView tabIndex={0} horizontal showsHorizontalScrollIndicator accessibilityLabel="Campaign badges; scroll horizontally for more" className="bubba-campaign-badge-scroll mt-4 w-full" contentContainerStyle={{flexGrow:1}}><Inline wrap={false} gap={3} className="bubba-campaign-badges mx-auto justify-center">{badges.map((badge,index)=><View key={index} className="bubba-campaign-badge shrink-0 rounded-bubba-control bg-white px-3 py-2"><Text variant="caption" className="text-center text-xs font-black uppercase text-bubba-navy">{badge}</Text></View>)}</Inline></ScrollView>:null}{children}</Stack></Container></View></MarketingScope>;
}
export interface SocialSectionProps extends Omit<CampaignSectionProps,'highlight'|'badges'|'children'> { links:readonly SectionAction[] }
export function SocialSection({links,description,...props}:SocialSectionProps) {
 return <CampaignSection {...props} className={cn("bubba-social-section",props.className)}>{description?<Text className="bubba-campaign-description max-w-[760px] text-center text-[#FFFAE8]">{description}</Text>:null}<SocialLinks links={links} color="#FFFFFF"/></CampaignSection>;
}
export interface FlagTickerProps extends SectionProps { items:readonly string[] }
/** Patriotic ribbon with caller-owned copy; native/no-JS/reduced motion keep every item readable. */
function TickerEndcap({side}:{side:'left'|'right'}) {
 return <View accessible={false} aria-hidden pointerEvents="none" className={cn('bubba-ticker-endcap w-6 shrink-0 items-center justify-center bg-bubba-navy px-0.5 min-[761px]:w-12',side==='left'?'bubba-ticker-endcap-left':'bubba-ticker-endcap-right')}><Text variant="caption" className="text-center text-[6px] leading-[10px] text-white min-[761px]:text-[10px] min-[761px]:leading-3">{'★ ★ ★\n ★ ★\n★ ★ ★'}</Text></View>;
}
export function FlagTicker({items,className,variant,...props}:FlagTickerProps) {
 const [motion]=useMarketingMotion();
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>setHydrated(true),[]);
 const animated=hydrated&&Platform.OS==='web';
 return <MarketingScope><View {...props} {...{dataSet:{...props.dataSet,bubbaPaused:motion?'false':'true',bubbaAnimated:animated?'true':'false'}}} className={cn('bubba-flag-ticker relative flex-row items-stretch overflow-hidden border-y-[6px] border-bubba-red bg-white min-[761px]:border-y-8',className)}><TickerEndcap side="left"/><View className="bubba-ticker-viewport min-h-11 min-w-0 flex-1 justify-center overflow-hidden bg-white py-2 min-[761px]:min-h-12"><View className="bubba-ticker-track flex-row flex-wrap items-center gap-x-4 gap-y-2 px-3 min-[761px]:gap-x-6 min-[761px]:px-5">{items.map((item,index)=><View key={index} className="bubba-ticker-item min-w-0 max-w-full flex-row items-center gap-4"><Text variant="caption" className="bubba-ticker-word min-w-0 shrink text-sm font-black uppercase italic leading-5 text-bubba-navy min-[761px]:text-base min-[761px]:leading-6">{item}</Text>{index<items.length-1?<Text accessible={false} aria-hidden variant="caption" className="shrink-0 text-lg text-bubba-red">★</Text>:null}</View>)}</View></View><TickerEndcap side="right"/></View></MarketingScope>;
}
