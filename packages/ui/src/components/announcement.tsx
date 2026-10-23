'use client';

import {useRef, useState, type ReactNode} from 'react';
import {Platform, type TextInput} from 'react-native';
import {Stack, Inline} from './layout';
import {Text} from './typography';
import {Textarea} from './forms/Input';
import {FormField} from './forms/FormField';
import {Button} from './Button';
import {AnnouncementBanner} from './marketing';

/** Safe presentation content only. Core and caller apps own publication and revision rules. */
export interface AnnouncementSegment { text:string; tone:'default'|'yellow' }
export type AnnouncementContent = string | readonly AnnouncementSegment[];
export interface AnnouncementEditorProps {
 value:readonly AnnouncementSegment[];
 onValueChange:(value:readonly AnnouncementSegment[])=>void;
 disabled?:boolean;
 busy?:boolean;
 error?:string;
 label?:string;
 /** Preview viewport width; the standard authoring preview shows a 320px phone. */
 previewWidth?:number;
 /** Caller-owned enable/save/status controls. The editor never fetches or saves. */
 children?:ReactNode;
}
const maxCharacters=160,maxSegments=24;
function normalize(parts:readonly AnnouncementSegment[]) {
 const result:AnnouncementSegment[]=[];
 for(const part of parts){if(!part.text)continue;const previous=result.at(-1);if(previous?.tone===part.tone)previous.text+=part.text;else result.push({...part});}
 return result;
}
function sliceSegments(parts:readonly AnnouncementSegment[],start:number,end:number) {
 let offset=0;const result:AnnouncementSegment[]=[];
 for(const part of parts){const from=Math.max(0,start-offset),to=Math.min(part.text.length,end-offset);if(to>from)result.push({text:part.text.slice(from,to),tone:part.tone});offset+=part.text.length;}
 return result;
}
// Browser/native selections use UTF-16 offsets. Never create half of a surrogate pair.
function safeBoundary(text:string,index:number,end=false){const i=Math.max(0,Math.min(index,text.length));return i>0&&i<text.length&&/[\uDC00-\uDFFF]/.test(text[i])&&/[\uD800-\uDBFF]/.test(text[i-1])?i+(end?1:-1):i;}

/** Controlled universal authoring pattern with a preview of the actual public banner. */
export function AnnouncementEditor({value,onValueChange,disabled=false,busy=false,error,label='Promotional announcement',previewWidth=320,children}:AnnouncementEditorProps) {
 const input=useRef<TextInput>(null);
 const [selection,setSelection]=useState({start:0,end:0});
 const [previewSize,setPreviewSize]=useState(14);
 const [localError,setLocalError]=useState<string>();
 const text=value.map(part=>part.text).join(''),inactive=disabled||busy;
 const commit=(parts:readonly AnnouncementSegment[])=>{
  const next=normalize(parts);
  if(next.length>maxSegments){setLocalError('Use no more than 24 highlighted or plain text sections.');return false;}
  setLocalError(undefined);onValueChange(next);return true;
 };
 const change=(next:string)=>{
  if(/[<>\p{Cc}\u2028\u2029]/u.test(next)){setLocalError('Use plain text on one line, without angle brackets or control characters.');return;}
  if(Array.from(next).length>maxCharacters){setLocalError('Use 160 characters or fewer.');return;}
  let prefix=0;while(prefix<text.length&&prefix<next.length&&text[prefix]===next[prefix])prefix++;
  prefix=safeBoundary(text,prefix);
  let suffix=0;while(suffix<text.length-prefix&&suffix<next.length-prefix&&text[text.length-1-suffix]===next[next.length-1-suffix])suffix++;
  suffix=text.length-safeBoundary(text,text.length-suffix,true);
  const before=sliceSegments(value,0,prefix),after=sliceSegments(value,text.length-suffix,text.length);
  const inserted=next.slice(prefix,next.length-suffix);
  commit([...before,...(inserted?[{text:inserted,tone:before.at(-1)?.tone??'default' as const}]:[]),...after]);
 };
 const apply=(tone:AnnouncementSegment['tone'])=>{
  const start=safeBoundary(text,selection.start),end=safeBoundary(text,selection.end,true);
  if(end<=start||inactive)return;
  if(commit([...sliceSegments(value,0,start),{text:text.slice(start,end),tone},...sliceSegments(value,end,text.length)])){
   setSelection({start,end});input.current?.focus();
   if(Platform.OS==='web')(input.current as unknown as {setSelectionRange?:(start:number,end:number)=>void}|null)?.setSelectionRange?.(start,end);
   else input.current?.setNativeProps({selection:{start,end}});
  }
 };
 return <Stack gap={4}>
  <FormField label={label} hint="Select words, then choose Make yellow or Make white. Keep the message short for phones." error={error??localError} disabled={inactive} announceError>
   <Textarea ref={input} value={text} onChangeText={change} onSelectionChange={event=>setSelection(event.nativeEvent.selection)} disabled={inactive} accessibilityLabel={label} />
  </FormField>
  <Inline gap={2}>
   <Button size="sm" variant="outline" disabled={inactive||selection.start===selection.end} onPress={()=>apply('yellow')}>Make yellow</Button>
   <Button size="sm" variant="outline" disabled={inactive||selection.start===selection.end} onPress={()=>apply('default')}>Make white</Button>
   <Text variant="caption" tone="muted">{Array.from(text).length} / {maxCharacters} characters</Text>
  </Inline>
  <Stack gap={2}><Text variant="label">Banner preview</Text><Stack className="max-w-full self-start" style={{width:previewWidth}}><AnnouncementBanner content={value} onFitChange={setPreviewSize}/></Stack>{previewSize<11?<Text variant="caption" tone="warning">This message becomes very small on a phone. Shorten it or provide a shorter phone message.</Text>:null}</Stack>
  {children}
 </Stack>;
}
