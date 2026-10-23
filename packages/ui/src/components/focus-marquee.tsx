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
  /** Linear-preset velocity in CSS pixels per second; zero keeps either preset static. */
  speed?: number;
  direction?: 'left' | 'right';
  /** Spring hands off one centered fact per cadence (seconds). */
  motion?: 'spring' | 'linear';
  cadence?: number;
  spring?: 'gentle' | 'poppy';
  /** Decorative moving pills only; canonical/static content is always clear. */
  edgeBlur?: number;
  /** Minimum visible edge gap, including the last-to-first seam. */
  spacing?: number;
  badgeAppearance?: { size?: 'sm' | 'md'; shape?: 'pill' | 'rounded'; textTone?: 'navy' | 'red' };
  centerEmphasis?: { scale?: number; lift?: number; range?: number };
  className?: string;
}
// Browser-only structural types keep the universal package independent of lib.dom.
interface WebNode {
  style: { transform:string; filter:string; setProperty(name:string,value:string):void; removeProperty(name:string):void };
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
  document?: { hidden:boolean; addEventListener(name:string,callback:()=>void):void; removeEventListener(name:string,callback:()=>void):void; fonts?:{status?:string;ready:Promise<unknown>;addEventListener(name:string,callback:()=>void):void;removeEventListener(name:string,callback:()=>void):void} };
}
const bounded=(value:number|undefined,fallback:number,min:number,max:number)=>Number.isFinite(value)?Math.min(max,Math.max(min,value!)):fallback;

/** Endless web pill lane. Native, SSR and motion-off keep the complete static copy. */
export function FocusMarquee({items,speed=38,direction='left',motion:motionMode='spring',cadence=.9,spring='poppy',edgeBlur=1,spacing=8,badgeAppearance,centerEmphasis,className,style,...props}:FocusMarqueeProps) {
  const [motion]=useMarketingMotion();
  const [copies,setCopies]=useState(1);
  const root=useRef<ElementRef<typeof View>>(null);
  const phase=useRef(0);
  const velocity=bounded(speed,38,0,240),gap=bounded(spacing,8,0,96);
  const scale=bounded(centerEmphasis?.scale,motionMode==='spring'?1.16:1.12,1,1.35),lift=bounded(centerEmphasis?.lift,4,0,16),range=bounded(centerEmphasis?.range,.5,.1,1);
  const beat=bounded(cadence,.9,.8,3),blur=bounded(edgeBlur,1,0,4);
  const stretch=motionMode==='spring'?(spring==='gentle'?.03:.06):0;
  const nudge=motionMode==='spring'?(spring==='gentle'?1:2):0;
  const popLift=motionMode==='spring'?(spring==='gentle'?3:6):0;
  const peakX=scale*(1+stretch),peakY=scale*(1+stretch*.5),sideReserve=nudge;
  const moving=velocity>0;
  const hasStarted=useRef(false),measurementSignature=useRef('');
  const sequence=useRef({from:0,to:0,elapsed:0,cadence:beat,travel:beat-.14,travelling:false,source:0,target:0,sign:1});
  const motionSettings=useRef({velocity,direction,cadence:beat});
  // Changing positive speed/direction does not restart layout or the frame loop.
  useEffect(()=>{motionSettings.current={velocity,direction,cadence:beat};},[velocity,direction,beat]);
  const itemKey=JSON.stringify(items);
  useEffect(()=>{
    if(Platform.OS!=='web'||!motion||!moving||items.length===0)return;
    const node=root.current as unknown as WebNode|null;
    const track=node?.querySelector('.bubba-focus-track'),first=track?.querySelector('.bubba-focus-group');
    if(!node||!track||!first)return;
    const web=globalThis as unknown as WebRuntime;
    let alive=true,frame=0,measureFrame=0,lastTime:number|undefined,visible=true,ready=false;
    let fontsReady=!web.document?.fonts||web.document.fonts.status==='loaded';
    let width=0,period=0,geometry:{node:WebNode;center:number;index:number}[]=[],centers:{center:number;index:number}[]=[];
    const stop=()=>{web.cancelAnimationFrame(frame);frame=0;lastTime=undefined;};
    const modulo=(value:number)=>((value%period)+period)%period;
    const smooth=(value:number)=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
    const nearest=(position:number)=>centers.reduce((best,item)=>{
      const distance=Math.abs(modulo(item.center-position-width/2+period/2)-period/2);
      return distance<best.distance?{index:item.index,distance}:best;
    },{index:0,distance:Infinity}).index;
    const next=(position:number,sign:number)=>{
      // Advance the logical fact ordinal, rather than reselecting the same fact
      // after a fractional font/resize shift has moved its drawn center.
      const index=(nearest(position)+sign+items.length)%items.length;
      const item=centers[index],logical=position+width/2;
      let center=item.center+Math.floor((logical-item.center)/period)*period;
      if(sign>0&&center<=logical+.01)center+=period;
      if(sign<0&&center>=logical-.01)center-=period;
      return{position:center-width/2,index};
    };
    const resetSequence=()=>{const settings=motionSettings.current;sequence.current={from:phase.current,to:phase.current,elapsed:0,cadence:settings.cadence,travel:settings.cadence-.14,travelling:false,source:nearest(phase.current),target:nearest(phase.current),sign:settings.direction==='right'?-1:1};};
    const paint=()=>{
      const offset=-modulo(phase.current);
      track.style.transform=`translate3d(${offset}px,0,0)`;
      const state=sequence.current;
      const u=state.travelling?Math.max(0,Math.min(1,(state.elapsed-state.cadence+state.travel)/state.travel)):0;
      const pulse=Math.sin(Math.PI*u),rebound=Math.sin(Math.PI*Math.max(0,Math.min(1,(u-.55)/.45)));
      // Cached geometry only: frame work writes transform/filter, never reads layout.
      for(const item of geometry){
        const position=item.center+offset-width/2;
        const radius=motionMode==='spring'?Math.min(width*range,period/items.length*1.05):width*range;
        const distance=Math.min(1,Math.abs(position)/Math.max(1,radius));
        const focus=(1+Math.cos(Math.PI*distance))/2;
        const base=1+(scale-1)*focus;
        const incoming=motionMode==='spring'&&state.travelling&&item.index===state.target&&Math.abs(position-(state.to-phase.current))<1?focus:0;
        const outgoing=motionMode==='spring'&&state.travelling&&item.index===state.source&&Math.abs(position-(state.from-phase.current))<1?focus:0;
        const x=base*(1+stretch*pulse*incoming-stretch*.5*pulse*outgoing);
        const y=base*(1-stretch*.5*pulse*incoming+stretch*.5*rebound*incoming-stretch*.5*pulse*outgoing);
        const shift=-state.sign*nudge*pulse*outgoing;
        item.node.style.transform=`translate3d(${shift}px,${-lift*focus-popLift*rebound*incoming}px,0) scale(${x},${y})`;
        // The central region stays crisp; softness grows only in the outer lane.
        const soft=smooth((Math.abs(position)/Math.max(1,width/2)-.75)/.25);
        item.node.style.filter=`blur(${blur*soft}px)`;
      }
    };
    const tick=(time:number)=>{
      frame=0;
      if(!alive||!ready||!visible||web.document?.hidden)return;
      if(lastTime!==undefined){
        const settings=motionSettings.current,delta=(time-lastTime)/1000;
        if(motionMode==='linear')phase.current+=delta*settings.velocity*(settings.direction==='right'?-1:1);
        else{
          const state=sequence.current;
          // A stalled visible frame slows the finite sequence; hidden time never
          // accumulates spring energy or skips a queue of facts on return.
          state.elapsed+=Math.min(delta,.064);
          const hold=state.cadence-state.travel;
          if(state.elapsed>=hold&&!state.travelling){
            state.sign=settings.direction==='right'?-1:1;
            const target=next(state.from,state.sign);
            state.to=target.position;state.target=target.index;state.travelling=true;
          }
          if(state.travelling){
            const u=Math.max(0,Math.min(1,(state.elapsed-hold)/state.travel));
            const distance=state.to-state.from,over=Math.min(spring==='gentle'?3:5,Math.abs(distance)*.04)*state.sign;
            // One bounded overshoot with zero-velocity endpoints, then settle.
            const settle=Math.min(.12,state.travel*.18),arrival=1-settle/state.travel;
            phase.current=u<arrival?state.from+(distance+over)*smooth(u/arrival):state.to+over*(1-smooth((u-arrival)/(1-arrival)));
          }
          if(state.elapsed>=state.cadence){const remainder=state.elapsed-state.cadence;phase.current=state.to;resetSequence();sequence.current.elapsed=remainder;}
        }
      }
      lastTime=time;paint();frame=web.requestAnimationFrame(tick);
    };
    const start=()=>{if(alive&&ready&&visible&&!web.document?.hidden&&!frame)frame=web.requestAnimationFrame(tick);};
    const measure=()=>{
      measureFrame=0;if(!alive||!fontsReady)return;
      width=node.getBoundingClientRect().width;
      const wrappers=Array.from(track.querySelectorAll('.bubba-focus-item'));
      // Reserve each pill's maximum scaled footprint in layout. The configured
      // gap is then a minimum visible edge gap, even for two large neighbors.
      const pills=wrappers.map(item=>item.querySelector('.bubba-focus-pill')!);
      for(const pill of pills)pill.style.transform='';
      const reserves=pills.map(pill=>(peakX-1)*pill.getBoundingClientRect().width/2+sideReserve);
      wrappers.forEach((item,index)=>{item.style.setProperty('padding-left',`${reserves[index]}px`);item.style.setProperty('padding-right',`${reserves[index]}px`);});
      period=first.getBoundingClientRect().width;
      if(width<=0||period<=0){ready=false;stop();return;}
      const required=Math.max(2,Math.ceil(width/period)+2);
      if(required!==copies){ready=false;stop();setCopies(required);return;}
      const origin=track.getBoundingClientRect().x;
      geometry=Array.from(track.querySelectorAll('.bubba-focus-item')).map((item,index)=>{const box=item.getBoundingClientRect();return{node:item.querySelector('.bubba-focus-pill')!,center:box.x-origin+box.width/2,index:index%items.length};});
      centers=geometry.slice(0,items.length).map(item=>({center:item.center,index:item.index}));
      const height=first.getBoundingClientRect().height;
      node.style.setProperty('--bubba-focus-inset',`${Math.ceil(lift+popLift+(peakY-1)*height/2+blur*3+8)}px`);
      // Ignore sub-hundredth-pixel transform rounding when resuming an unchanged lane.
      const signature=[motionMode,...[width,period,...centers.map(item=>item.center)].map(value=>Math.round(value*100)/100)].join('|');
      if(!hasStarted.current){if(motionMode==='spring')phase.current=centers[0].center-width/2;hasStarted.current=true;}
      if(measurementSignature.current!==signature){measurementSignature.current=signature;resetSequence();}
      ready=true;paint();node.setAttribute('data-bubba-focus-active','true');start();
    };
    const schedule=()=>{if(alive&&!measureFrame)measureFrame=web.requestAnimationFrame(measure);};
    const visibility=()=>{stop();if(!web.document?.hidden){schedule();start();}};
    const resize=web.ResizeObserver?new web.ResizeObserver(schedule):undefined;
    const intersection=web.IntersectionObserver?new web.IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;stop();if(visible){schedule();start();}}):undefined;
    resize?.observe(node);resize?.observe(first);intersection?.observe(node);
    web.addEventListener('resize',schedule);web.document?.addEventListener('visibilitychange',visibility);
    web.document?.fonts?.addEventListener('loadingdone',schedule);web.document?.fonts?.ready.then(()=>{fontsReady=true;schedule();});
    measure();
    return()=>{alive=false;stop();web.cancelAnimationFrame(measureFrame);resize?.disconnect();intersection?.disconnect();web.removeEventListener('resize',schedule);web.document?.removeEventListener('visibilitychange',visibility);web.document?.fonts?.removeEventListener('loadingdone',schedule);node.setAttribute('data-bubba-focus-active','false');track.style.transform='';for(const item of geometry){item.node.style.transform='';item.node.style.filter='';}for(const item of track.querySelectorAll('.bubba-focus-item')){item.style.removeProperty('padding-left');item.style.removeProperty('padding-right');}node.style.removeProperty('--bubba-focus-inset');};
  },[itemKey,motion,moving,motionMode,spring,blur,peakX,peakY,sideReserve,popLift,nudge,stretch,gap,scale,lift,range,copies,badgeAppearance?.size,badgeAppearance?.shape,badgeAppearance?.textTone]);
  if(items.length===0)return null;
  const pill=(label:string)=><View className={cn('bubba-focus-pill bg-white px-3 py-2',badgeAppearance?.shape==='rounded'?'rounded-bubba-control':'rounded-full')}><Text variant="caption" className={cn('bubba-focus-label text-center font-black uppercase',badgeAppearance?.size==='md'?'text-sm leading-5':'text-xs leading-4',badgeAppearance?.textTone==='red'?'text-bubba-red':'text-bubba-navy')}>{label}</Text></View>;
  return <MarketingScope><View {...props} ref={root} style={[vars({'--bubba-focus-gap':`${gap}px`,'--bubba-focus-scale':String(peakX),'--bubba-focus-side-reserve':`${sideReserve}px`}),style]} className={cn('bubba-focus-marquee relative min-w-0 max-w-full bg-bubba-red px-0 py-4',className)}>
    <Inline justify="center" gap={3} className="bubba-focus-static min-w-0 max-w-full px-4">{items.map((label,index)=><View key={index} className="min-w-0 max-w-full">{pill(label)}</View>)}</Inline>
    {Platform.OS==='web'?<View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" className="bubba-focus-visual"><View className="bubba-focus-track flex-row">{Array.from({length:copies},(_,copy)=><View key={copy} className="bubba-focus-group flex-row items-center">{items.map((label,index)=><View key={index} className="bubba-focus-item shrink-0">{pill(label)}</View>)}</View>)}</View></View>:null}
  </View></MarketingScope>;
}
