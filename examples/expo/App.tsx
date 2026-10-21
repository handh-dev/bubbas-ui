import type { ReactNode } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@bubbasfw/ui";
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
  return (
    <SafeAreaProvider>
      <Gallery platform="Expo" Frame={NativeFrame} />
    </SafeAreaProvider>
  );
}
