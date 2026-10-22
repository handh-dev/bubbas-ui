'use client';
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { Container, Inline, Stack } from './layout';
import { Heading, Text } from './typography';
import { Icon } from './Icon';
import { IconButton } from './actions';
import { MarketingScope, SocialLinks } from './marketing';
import type { SectionAction, SectionProps } from './sections';
import { cn } from '../internal/utils';

export interface CampaignSectionProps extends SectionProps {
 title:string; description?:string; eyebrow?:string; highlight?:string;
 badges?:readonly string[]; tone?:'blue'|'red'; children?:ReactNode;
}
/** Caller owns all campaign claims and seasonal facts. Fixed-brand light composition. */
export function CampaignSection({title,description,eyebrow,highlight,badges,tone='blue',children,className,variant,...props}:CampaignSectionProps) {
 return <MarketingScope><View {...props} className={cn('px-4 py-12 min-[761px]:py-16',tone==='blue'?'bg-bubba-blue':'bg-bubba-red',className)}><Container><Stack gap={4} className="items-center">{eyebrow?<Text variant="caption" className="text-center text-sm font-extrabold uppercase text-white">{eyebrow}</Text>:null}{highlight?<Text variant="caption" className="text-center text-[100px] font-black italic leading-[1] text-bubba-gold min-[761px]:text-[160px]">{highlight}</Text>:null}<Heading level={2} className="text-center text-3xl font-black uppercase italic text-white min-[761px]:text-5xl">{title}</Heading>{description?<Text className="max-w-[760px] text-center text-white">{description}</Text>:null}{badges?.length?<Inline gap={3} className="bubba-campaign-badges mt-4 justify-center">{badges.map((badge,index)=><View key={index} className="rounded-bubba-control bg-white px-3 py-2"><Text variant="caption" className="text-center text-xs font-black uppercase text-bubba-navy">{badge}</Text></View>)}</Inline>:null}{children}</Stack></Container></View></MarketingScope>;
}
export interface SocialSectionProps extends Omit<CampaignSectionProps,'highlight'|'badges'|'children'> { links:readonly SectionAction[] }
export function SocialSection({links,...props}:SocialSectionProps) {
 return <CampaignSection {...props}><SocialLinks links={links} color="#FFFFFF"/></CampaignSection>;
}
export interface FlagTickerProps extends SectionProps { items:readonly string[] }
/** Animated flag behind readable copy. Pause and reduced-motion keep all content available. */
export function FlagTicker({items,className,variant,...props}:FlagTickerProps) {
 const [paused,setPaused]=useState(false);
 return <MarketingScope><View {...props} {...{dataSet:{...props.dataSet,bubbaPaused:paused?'true':'false'}}} className={cn('bubba-flag-ticker relative flex-row items-center overflow-hidden bg-bubba-blue',className)}><View accessible={false} aria-hidden className="bubba-flag-field absolute inset-0"/><View className="bubba-ticker-viewport min-w-0 flex-1 overflow-hidden py-2"><View className="bubba-ticker-track flex-row items-center gap-10 px-4">{items.map((item,index)=><Text key={index} variant="caption" className="bubba-ticker-word shrink-0 text-xs font-black uppercase italic text-white">{item}</Text>)}</View></View><IconButton accessibilityLabel={paused?'Play scrolling announcement':'Pause scrolling announcement'} aria-pressed={paused} onPress={()=>setPaused(!paused)} className="bubba-ticker-pause shrink-0 bg-bubba-navy"><Icon name={paused?'play':'pause'} size={18} color="#FFFFFF"/></IconButton></View></MarketingScope>;
}
