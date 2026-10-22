'use client';
import { Image, type ImageProps } from 'react-native';
import { iconSources } from '../internal/icon-sources';
import { useTheme } from '../theme';
export type IconName = keyof typeof iconSources;
export interface IconProps extends Omit<ImageProps, 'source'> { name:IconName; size?:number; color?:string }
/** Licensed Lucide controls and Simple Icons social marks. Parent controls supply labels. */
export function Icon({name,size=24,color,style,accessibilityLabel,...props}:IconProps) {
 const {colors}=useTheme();
 return <Image {...props} source={{uri:iconSources[name]}} resizeMode="contain" accessible={Boolean(accessibilityLabel)} accessibilityLabel={accessibilityLabel} aria-hidden={!accessibilityLabel} style={[{width:size,height:size,tintColor:color??colors.text},style]} />;
}
