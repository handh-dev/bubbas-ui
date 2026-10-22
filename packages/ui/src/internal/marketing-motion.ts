'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';

// Structural browser types keep the native package independent of lib.dom.
interface MotionQuery { matches:boolean; addEventListener(event:'change', listener:()=>void):void; removeEventListener(event:'change', listener:()=>void):void }
interface MotionStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }
export function reducedMotionQuery() {
  return (globalThis as unknown as { matchMedia?:(query:string)=>MotionQuery }).matchMedia?.('(prefers-reduced-motion: reduce)');
}
const storageKey = 'bubbas-marketing-motion';
// One preference for announcement and ribbon. Opaque Studio frames and restricted
// storage keep the same in-memory behavior; no data/action/service state is stored.
let enabled = true;
let initialized = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
function storage() { return (globalThis as unknown as { localStorage?:MotionStorage }).localStorage; }
function setEnabled(value: boolean, persist=false) {
  enabled = value;
  if (persist) { try { storage()?.setItem(storageKey, value?'on':'off'); } catch { /* in-memory fallback */ } }
  listeners.forEach(listener => listener());
}
export function useMarketingMotion() {
  const motion = useSyncExternalStore(subscribe, () => enabled, () => true);
  const [reduced,setReduced]=useState(false);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const media = reducedMotionQuery();
    if (!initialized) {
      initialized = true;
      try { const saved = storage()?.getItem(storageKey); if (saved==='off'||saved==='on') setEnabled(saved==='on'); } catch { /* in-memory fallback */ }
    }
    setReduced(media?.matches??false);
    const update = () => setReduced(media?.matches??false);
    media?.addEventListener('change', update);
    return () => media?.removeEventListener('change', update);
  }, []);
  return [motion&&!reduced, () => { if (!reduced) setEnabled(!enabled,true); }, reduced] as const;
}
