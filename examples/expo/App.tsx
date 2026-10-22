import type { ReactNode } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@bubbasfw/ui";
import { useFonts } from "expo-font";
import { bodyPreviewFonts, registeredBodyFamily } from './native-fonts';
import { Gallery } from "./showcase/Gallery";
function NativeFrame({ children }: { children: ReactNode }) {
  const { colors, resolvedAppearance } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <StatusBar
        barStyle={
          resolvedAppearance === "dark" ? "light-content" : "dark-content"
        }
      />
      {children}
    </SafeAreaView>
  );
}
export default function App() {
  const nativeFamily = registeredBodyFamily();
  const [loaded, error] = useFonts(nativeFamily ? {} : bodyPreviewFonts);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <Gallery platform="Expo" Frame={NativeFrame} fontFamily={nativeFamily ?? (loaded ? 'BubbasBodyPreview' : undefined)} />
    </SafeAreaProvider>
  );
}
