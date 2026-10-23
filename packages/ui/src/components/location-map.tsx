'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Image, Platform, View } from 'react-native';
import { Button } from './Button';
import { Icon } from './Icon';
import { Link } from './actions';
import { Inline, Stack } from './layout';
import { MarketingScope } from './marketing';
import { Heading, Text } from './typography';
import type { SectionAction, SectionProps } from './sections';
import { cn } from '../internal/utils';

export interface LocationMapPin { id:string; title:string; label?:string; latitude:number; longitude:number; href:string }
export interface LocationMapProps extends SectionProps { children?:ReactNode; title?:string; description?:string; pins?:readonly LocationMapPin[]; tileUrlTemplate?:string; attribution?:SectionAction; emptyLabel?:string }
interface Point {x:number;y:number}
interface Camera {zoom:number;center:Point}
interface PlacedPin extends LocationMapPin {anchorX:number;anchorY:number;targetX:number;targetY:number}
interface Rect {left:number;top:number;right:number;bottom:number}
const tileSize=256,targetSize=44,targetGap=6;
function project(latitude:number,longitude:number):Point {const lat=Math.max(-85.05112878,Math.min(85.05112878,latitude))*Math.PI/180;return{x:(longitude+180)/360,y:(1-Math.log(Math.tan(lat)+1/Math.cos(lat))/Math.PI)/2};}
const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));
function overlaps(first:Rect,second:Rect){return first.left<second.right&&first.right>second.left&&first.top<second.bottom&&first.bottom>second.top;}
/** Only controls move. Every store's geographic anchor and caller coordinates stay unchanged. */
function placePins(pins:(LocationMapPin&{anchorX:number;anchorY:number})[],width:number,height:number):PlacedPin[] {
  const occupied:Rect[]=[{left:0,top:height-44,right:width,bottom:height},{left:width-60,top:height-184,right:width,bottom:height}];
  const half=targetSize/2,margin=half+4,step=targetSize+targetGap;
  const result:PlacedPin[]=[];
  for(const pin of pins){
    let point:Point|undefined;
    for(let ring=0;ring<=12&&!point;ring++){
      const candidates:Point[]=[];
      for(let dx=-ring;dx<=ring;dx++)for(let dy=-ring;dy<=ring;dy++)if(Math.abs(dx)===ring||Math.abs(dy)===ring)candidates.push({x:clamp(pin.anchorX+dx*step,margin,width-margin),y:clamp(pin.anchorY+dy*step,margin,height-44-margin)});
      candidates.sort((a,b)=>(a.x-pin.anchorX)**2+(a.y-pin.anchorY)**2-((b.x-pin.anchorX)**2+(b.y-pin.anchorY)**2));
      point=candidates.find(point=>!occupied.some(rect=>overlaps({left:point.x-half-3,top:point.y-half-3,right:point.x+half+3,bottom:point.y+half+3},rect)));
    }
    // A later grid pass recovers targets when this greedy local pass fragments.
    if(!point)continue;
    occupied.push({left:point.x-half,top:point.y-half,right:point.x+half,bottom:point.y+half});
    result.push({...pin,targetX:point.x,targetY:point.y});
  }
  if(result.length===pins.length)return result;
  // Arbitrary geographic phases can fragment the first pass on a dense phone
  // map. Repack controls onto disjoint nearest grid slots, keeping every true
  // anchor and its leader intact. This is a control layout, never new geography.
  const reserved:Rect[]=[{left:0,top:height-44,right:width,bottom:height},{left:width-60,top:height-184,right:width,bottom:height}];
  const slots:Point[]=[];
  for(let y=margin;y<=height-44-margin;y+=step)for(let x=margin;x<=width-margin;x+=step)if(!reserved.some(rect=>overlaps({left:x-half-3,top:y-half-3,right:x+half+3,bottom:y+half+3},rect)))slots.push({x,y});
  return pins.flatMap(pin=>{slots.sort((a,b)=>(a.x-pin.anchorX)**2+(a.y-pin.anchorY)**2-((b.x-pin.anchorX)**2+(b.y-pin.anchorY)**2));const point=slots.shift();return point?[{...pin,targetX:point.x,targetY:point.y}]:[];});
}

// Structural DOM types keep the same RN source independent of lib.dom.
interface MapEvent {target?:{closest?(selector:string):unknown};currentTarget?:unknown;pointerId:number;pointerType?:string;button?:number;clientX:number;clientY:number;deltaY:number;key?:string;cancelable?:boolean;preventDefault():void}
interface MapNode {addEventListener(type:string,listener:(event:MapEvent)=>void,options?:{passive?:boolean}):void;removeEventListener(type:string,listener:(event:MapEvent)=>void):void;getBoundingClientRect():{left:number;top:number;width:number;height:number};setPointerCapture?(id:number):void;releasePointerCapture?(id:number):void;focus?(options?:{preventScroll?:boolean}):void;setAttribute(name:string,value:string):void}
interface MapWeb {requestAnimationFrame(callback:()=>void):number;cancelAnimationFrame(id:number):void}

/** Caller owns location facts and provider choice. This component owns map presentation and navigation. */
export function LocationMap({children,title='All locations',description,pins=[],tileUrlTemplate,attribution,emptyLabel='Map information is unavailable.',className,variant:_variant,...props}:LocationMapProps) {
  const [size,setSize]=useState({width:0,height:0});
  const [camera,setCamera]=useState<Camera|null>(null);
  const [tileStates,setTileStates]=useState<Record<string,'ready'|'error'>>({});
  const [retry,setRetry]=useState(0);
  const frame=useRef<React.ElementRef<typeof View>>(null);
  const validPins=useMemo(()=>pins.filter(pin=>Number.isFinite(pin.latitude)&&Number.isFinite(pin.longitude)&&Math.abs(pin.latitude)<=90&&Math.abs(pin.longitude)<=180).map(pin=>({...pin,...project(pin.latitude,pin.longitude)})),[pins]);
  const map=useMemo(()=>{
    if(!validPins.length||!size.width||!size.height)return null;
    const xs=validPins.map(pin=>pin.x),ys=validPins.map(pin=>pin.y);
    const bounds={left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
    const fitZoom=clamp(Math.floor(Math.log2(Math.min(Math.max(1,size.width-120)/Math.max(.000001,(bounds.right-bounds.left)*tileSize),Math.max(1,size.height-120)/Math.max(.000001,(bounds.bottom-bounds.top)*tileSize)))),1,13);
    const zoom=camera?.zoom??fitZoom,center=camera?.center??{x:(bounds.left+bounds.right)/2,y:(bounds.top+bounds.bottom)/2};
    const scale=tileSize*2**zoom,left=center.x*scale-size.width/2,top=center.y*scale-size.height/2;
    const tiles=[];
    for(let y=Math.floor(top/tileSize);y<=Math.floor((top+size.height)/tileSize);y++)for(let x=Math.floor(left/tileSize);x<=Math.floor((left+size.width)/tileSize);x++)if(y>=0&&y<2**zoom)tiles.push({id:`${zoom}/${x}/${y}`,left:x*tileSize-left,top:y*tileSize-top,url:tileUrlTemplate?.replace('{z}',String(zoom)).replace('{x}',String(((x%2**zoom)+2**zoom)%2**zoom)).replace('{y}',String(y))});
    const visible=validPins.map(pin=>({...pin,anchorX:pin.x*scale-left,anchorY:pin.y*scale-top})).filter(pin=>pin.anchorX>=0&&pin.anchorX<=size.width&&pin.anchorY>=0&&pin.anchorY<=size.height);
    return{zoom,center,scale,left,top,tiles,placed:placePins(visible,size.width,size.height)};
  },[validPins,size,camera,tileUrlTemplate]);
  const currentMap=useRef(map);currentMap.current=map;
  const hasMap=Platform.OS==='web'&&map&&tileUrlTemplate&&attribution;
  const zoomAt=(direction:number,point?:Point)=>{
    const current=currentMap.current;if(!current)return;
    const zoom=clamp(current.zoom+direction,1,18);if(zoom===current.zoom)return;
    const anchor=point??{x:size.width/2,y:size.height/2},nextScale=tileSize*2**zoom;
    const world={x:(current.left+anchor.x)/current.scale,y:(current.top+anchor.y)/current.scale};
    setCamera({zoom,center:{x:clamp(world.x+(size.width/2-anchor.x)/nextScale,0,1),y:clamp(world.y+(size.height/2-anchor.y)/nextScale,0,1)}});
  };
  const zoomAction=useRef(zoomAt);zoomAction.current=zoomAt;
  useEffect(()=>{
    if(Platform.OS!=='web'||!tileUrlTemplate||!attribution)return;
    const node=frame.current as unknown as MapNode|null;if(!node)return;
    const web=globalThis as unknown as MapWeb;
    let drag:{id:number;startX:number;startY:number;map:NonNullable<typeof map>}|null=null,pending:Camera|null=null,raf=0,lastWheel=0;
    const paint=()=>{raf=0;if(pending){setCamera(pending);pending=null;}};
    const down=(event:MapEvent)=>{if(event.button&&event.button!==0||event.target?.closest?.('[data-map-interactive]'))return;const current=currentMap.current;if(!current)return;drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,map:current};node.setPointerCapture?.(event.pointerId);node.focus?.({preventScroll:true});node.setAttribute('data-map-dragging','true');};
    const move=(event:MapEvent)=>{if(!drag||drag.id!==event.pointerId)return;if(event.cancelable)event.preventDefault();pending={zoom:drag.map.zoom,center:{x:clamp(drag.map.center.x-(event.clientX-drag.startX)/drag.map.scale,0,1),y:clamp(drag.map.center.y-(event.clientY-drag.startY)/drag.map.scale,0,1)}};if(!raf)raf=web.requestAnimationFrame(paint);};
    const up=(event:MapEvent)=>{if(!drag||drag.id!==event.pointerId)return;if(raf){web.cancelAnimationFrame(raf);paint();}try{node.releasePointerCapture?.(event.pointerId);}catch{/* Pointer capture may already have ended. */}drag=null;node.setAttribute('data-map-dragging','false');};
    const wheel=(event:MapEvent)=>{const current=currentMap.current;if(!current||!event.deltaY)return;const direction=event.deltaY<0?1:-1;if(current.zoom===18&&direction>0||current.zoom===1&&direction<0)return;if(event.cancelable)event.preventDefault();const now=Date.now();if(now-lastWheel<130)return;lastWheel=now;const rect=node.getBoundingClientRect();zoomAction.current(direction,{x:event.clientX-rect.left,y:event.clientY-rect.top});};
    const key=(event:MapEvent)=>{if((event.target as unknown)!==node||!currentMap.current)return;const current=currentMap.current;const movement=60/current.scale;if(event.key==='+'||event.key==='='){event.preventDefault();zoomAction.current(1);}else if(event.key==='-'){event.preventDefault();zoomAction.current(-1);}else if(event.key==='Home'){event.preventDefault();setCamera(null);}else{const delta:Record<string,Point>={ArrowLeft:{x:-movement,y:0},ArrowRight:{x:movement,y:0},ArrowUp:{x:0,y:-movement},ArrowDown:{x:0,y:movement}};const change=event.key?delta[event.key]:undefined;if(change){event.preventDefault();setCamera({zoom:current.zoom,center:{x:clamp(current.center.x+change.x,0,1),y:clamp(current.center.y+change.y,0,1)}});}}};
    node.addEventListener('pointerdown',down);node.addEventListener('pointermove',move,{passive:false});node.addEventListener('pointerup',up);node.addEventListener('pointercancel',up);node.addEventListener('wheel',wheel,{passive:false});node.addEventListener('keydown',key);
    return()=>{if(raf)web.cancelAnimationFrame(raf);node.removeEventListener('pointerdown',down);node.removeEventListener('pointermove',move);node.removeEventListener('pointerup',up);node.removeEventListener('pointercancel',up);node.removeEventListener('wheel',wheel);node.removeEventListener('keydown',key);};
  },[Boolean(tileUrlTemplate),Boolean(attribution)]);
  const tileError=map?.tiles.some(tile=>tile.url&&tileStates[tile.url]==='error'),loading=map?.tiles.some(tile=>tile.url&&!tileStates[tile.url]);
  const setTileState=(url:string,state:'ready'|'error')=>setTileStates(previous=>previous[url]===state?previous:{...previous,[url]:state});
  const retryTiles=()=>{setTileStates(previous=>{const next={...previous};for(const tile of map?.tiles??[])if(tile.url&&next[tile.url]==='error')delete next[tile.url];return next;});setRetry(value=>value+1);};
  return <MarketingScope><Stack {...props} className={cn('bubba-location-map w-full',className)} gap={2}>
    <Heading level={2} className="sr-only">{title}</Heading>
    {description?<Text variant="caption" className="text-sm text-ui-muted">{description}</Text>:null}
    <View ref={frame} role="region" accessibilityLabel={`${title} map`} accessibilityHint={hasMap?'Drag to pan. Scroll or use plus and minus to zoom. Arrow keys pan the focused map; Home shows all stores.':undefined} {...{tabIndex:hasMap?0:undefined,dataSet:{mapZoom:String(map?.zoom??''),mapCenter:map?`${map.center.x},${map.center.y}`:''}}} className={cn('bubba-map-frame relative w-full overflow-hidden rounded-xl border border-ui-line bg-[#EEF0F2]',Platform.OS==='web'?'h-[320px] min-[761px]:h-[380px]':'min-h-[160px]')} style={Platform.OS==='web'&&size.width?{minHeight:Math.ceil((validPins.length+4)/Math.max(1,Math.floor((size.width-52)/50)+1))*50+96}:undefined} onLayout={event=>{const{width,height}=event.nativeEvent.layout;setSize(previous=>width>0&&height>0&&(previous.width!==width||previous.height!==height)?{width,height}:previous);}}>
      {children??(hasMap?<>
        <View accessible={false} aria-hidden pointerEvents="none" className="bubba-map-tiles absolute inset-0">{map.tiles.map(tile=><Image key={`${tile.id}/${retry}`} source={{uri:tile.url!}} accessible={false} onLoad={()=>setTileState(tile.url!,'ready')} onError={()=>setTileState(tile.url!,'error')} resizeMode="cover" style={{position:'absolute',left:tile.left,top:tile.top,width:tileSize,height:tileSize}}/>)}</View>
        {map.placed.map(pin=>{const dx=pin.targetX-pin.anchorX,dy=pin.targetY-pin.anchorY,distance=Math.hypot(dx,dy);return <View key={pin.id} pointerEvents="box-none" className="absolute inset-0">
          {distance>2?<><View aria-hidden accessible={false} pointerEvents="none" className="bubba-map-leader absolute bg-bubba-navy" style={{left:(pin.anchorX+pin.targetX)/2-distance/2,top:(pin.anchorY+pin.targetY)/2-.75,width:distance,height:1.5,transform:[{rotate:`${Math.atan2(dy,dx)*180/Math.PI}deg`}]}}/><View aria-hidden accessible={false} pointerEvents="none" className="bubba-map-coordinate-dot absolute h-2 w-2 rounded-full border border-white bg-bubba-red" style={{left:pin.anchorX-4,top:pin.anchorY-4}}/></>:null}
          <Link href={pin.href} external accessibilityLabel={`Directions to ${pin.title}`} accessibilityHint={distance>2?'The leader line connects this accessible pin to its exact store position.':undefined} {...{title:pin.title,dataSet:{mapInteractive:'pin',pinId:pin.id,anchorX:String(pin.anchorX),anchorY:String(pin.anchorY)}}} className="bubba-map-pin absolute h-11 w-11 items-center justify-center" style={{left:pin.targetX-22,top:pin.targetY-22}} textClassName="no-underline"><Icon name="mapPin" size={28} color="#D40000"/><Text variant="caption" className="bubba-map-pin-label text-xs font-bold text-bubba-navy">{pin.label??pin.title}</Text></Link>
        </View>;})}
        <Stack gap={0} {...{dataSet:{mapInteractive:'controls'}}} className="bubba-map-controls absolute bottom-11 right-2 overflow-hidden rounded-xl border border-ui-line bg-white"><Button variant="ghost" accessibilityLabel="Zoom map in" onPress={()=>zoomAt(1)} disabled={map.zoom>=18} className="h-11 min-h-[44px] w-11 p-0" textClassName="text-xl">+</Button><Button variant="ghost" accessibilityLabel="Zoom map out" onPress={()=>zoomAt(-1)} disabled={map.zoom<=1} className="h-11 min-h-[44px] w-11 p-0" textClassName="text-xl">−</Button><Button variant="ghost" accessibilityLabel="Show all locations on map" onPress={()=>setCamera(null)} className="h-11 min-h-[44px] w-11 p-0"><Icon name="fit" size={20} color="#03256C"/></Button></Stack>
        <Link href={attribution.href} external accessibilityLabel={attribution.label} {...{dataSet:{mapInteractive:'attribution'}}} className="bubba-map-attribution absolute bottom-0 left-2 h-11 min-h-11 max-w-[calc(100%-76px)] justify-center" textVariant="caption" textClassName="text-[10px] leading-4 text-bubba-navy no-underline">{attribution.label}</Link>
      </>:<Stack className="flex-1 justify-center p-6"><Text>{validPins.length&&Platform.OS==='web'?'Use the location cards below for directions. The interactive map requires JavaScript.':emptyLabel}</Text>{Platform.OS!=='web'?validPins.map(pin=><Link key={pin.id} href={pin.href} external>{pin.title} · Directions</Link>):null}</Stack>)}
    </View>
    {hasMap&&loading&&!tileError?<View role="status"><Text variant="caption" className="text-xs text-ui-muted">Loading map…</Text></View>:null}
    {hasMap&&tileError?<Inline role="status" className="rounded-xl border border-ui-line bg-white p-3"><Text variant="caption" className="min-w-0 flex-1 text-xs leading-5">Map tiles could not load. Location cards below still provide directions.</Text><Button variant="outline" size="sm" onPress={retryTiles}>Retry map</Button></Inline>:null}
  </Stack></MarketingScope>;
}
