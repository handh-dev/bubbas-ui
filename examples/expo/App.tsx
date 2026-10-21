import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@bubbasfw/ui';

export default function App() {
  const [presses, setPresses] = useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="flex-1 bg-white">
          <View className="mx-auto w-full max-w-2xl gap-6 px-6 py-8">
            <Text className="text-sm font-bold uppercase tracking-widest text-slate-600">
              @bubbasfw/ui · Expo
            </Text>
            <Text accessibilityRole="header" className="text-3xl font-bold text-slate-900">
              One Button. Web and native.
            </Text>
            <Text className="text-base leading-6 text-slate-600">
              The same package and Button API run on iOS, Android, and the web.
            </Text>
            <Button testID="count-button" onPress={() => setPresses((count) => count + 1)}>
              Celebrate with Bubba’s
            </Button>
            <Text testID="press-count" accessibilityLiveRegion="polite" className="text-base text-slate-900">
              {`Button presses: ${presses}`}
            </Text>
            <View className="gap-4">
              <Button variant="secondary">Secondary action</Button>
              <Button variant="outline">Outline action</Button>
              <Button variant="ghost" size="sm" accessibilityLabel="Help" testID="compact-button" className="self-start">
                ?
              </Button>
              <Button disabled testID="disabled-button" onPress={() => setPresses(999)}>
                Disabled action
              </Button>
              <Button loading testID="loading-button" onPress={() => setPresses(999)}>
                Loading action
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
