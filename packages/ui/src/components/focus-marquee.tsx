'use client';

import { useEffect, useRef, useState, type ElementRef } from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import { vars } from 'nativewind';
import { Text } from './typography';
import { Inline } from './layout';
import { MarketingScope } from './marketing';
import { useMarketingMotion } from '../internal/marketing-motion';
import { cn } from '../internal/utils';

export interface FocusMarqueeProps extends Omit<ViewProps, 'children'> {
  /** Plain caller-owned claims; no links, controls or inferred business facts. */
  items: readonly string[];
  /** Constant horizontal velocity in CSS pixels per second; zero is static. */
  speed?: number;
  direction?: 'left' | 'right';
  /** Space between pills, including the last-to-first seam. */
  spacing?: number;
  badgeAppearance?: { size?: 'sm' | 'md'; shape?: 'pill' | 'rounded'; textTone?: 'navy' | 'red' };
  centerEmphasis?: { scale?: number; lift?: number; range?: number };
  className?: string;
}
// Browser-only structural types keep the universal package independent of lib.dom.
interface WebNode {
  style: { transform:string; setProperty(name:string,value:string):void; removeProperty(name:string):void };
  getBoundingClientRect(): { x:number; width:number; height:number };
  querySelector(selector:string):WebNode|null;
  querySelectorAll(selector:string):Iterable<WebNode>;
  setAttribute(name:string,value:string):void;
}
interface Observer { observe(node:WebNode):void; disconnect():void }
interface WebRuntime {
  requestAnimationFrame(callback:(time:number)=>void):number;
  cancelAnimationFrame(id:number):void;
  ResizeObserver?:new(callback:()=>void)=>Observer;
  IntersectionObserver?:new(callback:(entries:{isIntersecting:boolean}[])=>void)=>Observer;
  addEventListener(name:string,callback:()=>void):void;
  removeEventListener(name:string,callback:()=>void):void;
  document?: { hidden:boolean; addEventListener(name:string,callback:()=>void):void; removeEventListener(name:string,callback:()=>void):void; fonts?:{ready:Promise<unknown>;addEventListener(name:string,callback:()=>void):void;removeEventListener(name:string,callback:()=>void):void} };
}
const bounded=(value:number|undefined,fallback:number,min:number,max:number)=>Number.isFinite(value)?Math.min(max,Math.max(min,value!)):fallback;

/** Endless web pill lane. Native, SSR and motion-off keep the complete static copy. */
export function FocusMarquee({items,speed=38,direction='left',spacing=20,badgeAppearance,centerEmphasis,className,style,...props}:FocusMarqueeProps) {
  const [motion]=useMarketingMotion();
  const [copies,setCopies]=useState(1);
  const root=useRef<ElementRef<typeof View>>(null);
  const phase=useRef(0);
  const velocity=bounded(speed,38,0,240),gap=bounded(spacing,20,0,96);
  const scale=bounded(centerEmphasis?.scale,1.12,1,1.35),lift=bounded(centerEmphasis?.lift,4,0,16),range=bounded(centerEmphasis?.range,.5,.1,1);
  const itemKey=JSON.stringify(items);
  useEffect(()=>{
    if(Platform.OS!=='web'||!motion||velocity===0||items.length===0)return;
    const node=root.current as unknown as WebNode|null;
    const track=node?.querySelector('.bubba-focus-track'),first=track?.querySelector('.bubba-focus-group');
    if(!node||!track||!first)return;
    const web=globalThis as unknown as WebRuntime;
    let alive=true,frame=0,measureFrame=0,lastTime:number|undefined,visible=true,ready=false;
    let width=0,period=0,geometry:{node:WebNode;center:number}[]=[];
    const stop=()=>{web.cancelAnimationFrame(frame);frame=0;lastTime=undefined;};
    const paint=()=>{
      const offset=direction==='right'?-period+phase.current:-phase.current;
      track.style.transform=`translate3d(${offset}px,0,0)`;
      // All geometry is cached during measurement. Animation writes transforms only.
      for(const item of geometry){
        const distance=Math.min(1,Math.abs(item.center+offset-width/2)/Math.max(1,width*range));
        const focus=(1+Math.cos(Math.PI*distance))/2;
        item.node.style.transform=`translate3d(0,${-lift*focus}px,0) scale(${1+(scale-1)*focus})`;
      }
    };
    const tick=(time:number)=>{
      frame=0;
      if(!alive||!ready||!visible||web.document?.hidden)return;
      if(lastTime!==undefined)phase.current=(phase.current+(time-lastTime)*velocity/1000)%period;
      lastTime=time;paint();frame=web.requestAnimationFrame(tick);
    };
    const start=()=>{if(alive&&ready&&visible&&!web.document?.hidden&&!frame)frame=web.requestAnimationFrame(tick);};
    const measure=()=>{
      measureFrame=0;if(!alive)return;
      width=node.getBoundingClientRect().width;
      const wrappers=Array.from(track.querySelectorAll('.bubba-focus-item'));
      // Reserve each pill's maximum scaled footprint in layout. The configured
      // gap is then a minimum visible edge gap, even for two large neighbors.
      const pills=wrappers.map(item=>item.querySelector('.bubba-focus-pill')!);
      for(const pill of pills)pill.style.transform='';
      const reserves=pills.map(pill=>(scale-1)*pill.getBoundingClientRect().width/2);
      wrappers.forEach((item,index)=>{item.style.setProperty('padding-left',`${reserves[index]}px`);item.style.setProperty('padding-right',`${reserves[index]}px`);});
      period=first.getBoundingClientRect().width;
      if(width<=0||period<=0){ready=false;stop();return;}
      const required=Math.max(2,Math.ceil(width/period)+2);
      if(required!==copies){ready=false;stop();setCopies(required);return;}
      const origin=track.getBoundingClientRect().x;
      geometry=Array.from(track.querySelectorAll('.bubba-focus-item')).map(item=>{const box=item.getBoundingClientRect();return{node:item.querySelector('.bubba-focus-pill')!,center:box.x-origin+box.width/2};});
      const height=first.getBoundingClientRect().height;
      node.style.setProperty('--bubba-focus-inset',`${Math.ceil(lift+(scale-1)*height/2+8)}px`);
      phase.current%=period;ready=true;paint();node.setAttribute('data-bubba-focus-active','true');start();
    };
    const schedule=()=>{if(alive&&!measureFrame)measureFrame=web.requestAnimationFrame(measure);};
    const visibility=()=>{stop();if(!web.document?.hidden){schedule();start();}};
    const resize=web.ResizeObserver?new web.ResizeObserver(schedule):undefined;
    const intersection=web.IntersectionObserver?new web.IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;stop();if(visible){schedule();start();}}):undefined;
    resize?.observe(node);resize?.observe(first);intersection?.observe(node);
    web.addEventListener('resize',schedule);web.document?.addEventListener('visibilitychange',visibility);
    web.document?.fonts?.addEventListener('loadingdone',schedule);web.document?.fonts?.ready.then(schedule);
    measure();
    return()=>{alive=false;stop();web.cancelAnimationFrame(measureFrame);resize?.disconnect();intersection?.disconnect();web.removeEventListener('resize',schedule);web.document?.removeEventListener('visibilitychange',visibility);web.document?.fonts?.removeEventListener('loadingdone',schedule);node.setAttribute('data-bubba-focus-active','false');track.style.transform='';for(const item of geometry)item.node.style.transform='';for(const item of track.querySelectorAll('.bubba-focus-item')){item.style.removeProperty('padding-left');item.style.removeProperty('padding-right');}node.style.removeProperty('--bubba-focus-inset');};
  },[itemKey,motion,velocity,direction,gap,scale,lift,range,copies,badgeAppearance?.size,badgeAppearance?.shape,badgeAppearance?.textTone]);
  if(items.length===0)return null;
  const pill=(label:string)=><View className={cn('bubba-focus-pill bg-white px-3 py-2',badgeAppearance?.shape==='rounded'?'rounded-bubba-control':'rounded-full')}><Text variant="caption" className={cn('bubba-focus-label text-center font-black uppercase',badgeAppearance?.size==='md'?'text-sm leading-5':'text-xs leading-4',badgeAppearance?.textTone==='red'?'text-bubba-red':'text-bubba-navy')}>{label}</Text></View>;
  return <MarketingScope><View {...props} ref={root} style={[vars({'--bubba-focus-gap':`${gap}px`,'--bubba-focus-scale':String(scale)}),style]} className={cn('bubba-focus-marquee relative min-w-0 max-w-full bg-bubba-red px-0 py-4',className)}>
    <Inline justify="center" gap={3} className="bubba-focus-static min-w-0 max-w-full px-4">{items.map((label,index)=><View key={index} className="min-w-0 max-w-full">{pill(label)}</View>)}</Inline>
    {Platform.OS==='web'?<View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" className="bubba-focus-visual"><View className="bubba-focus-track flex-row">{Array.from({length:copies},(_,copy)=><View key={copy} className="bubba-focus-group flex-row items-center">{items.map((label,index)=><View key={index} className="bubba-focus-item shrink-0">{pill(label)}</View>)}</View>)}</View></View>:null}
  </View></MarketingScope>;
}
