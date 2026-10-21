import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Input,
  Sheet,
  Text,
  ThemeProvider,
} from "@bubbasfw/ui";
export default function OverlayCheck() {
  const [show, setShow] = useState(true);
  const [nested, setNested] = useState(false);
  return (
    <ThemeProvider>
      <View className="min-h-screen gap-6 p-8">
        <Text>Overlay compatibility fixture</Text>
        <Button testID="default-reopen" onPress={() => setShow(true)}>
          Open initial dialog
        </Button>
        <View className="h-[1400px]">
          <Text>Background scroll content.</Text>
        </View>
        {show ? (
          <Dialog
            defaultOpen
            onOpenChange={(open) => {
              if (!open) setShow(false);
            }}
            title="Initially open example"
            closeLabel="Close initial"
            testID="default-overlay"
          >
            <View className="gap-4">
              <Input accessibilityLabel="Initial example field" />
              <Button testID="nested-open" onPress={() => setNested(true)}>
                Open nested sheet
              </Button>
              <Sheet
                open={nested}
                onOpenChange={setNested}
                title="Nested example"
                closeLabel="Close nested"
                testID="nested-overlay"
              >
                <Button onPress={() => setNested(false)}>
                  Finish nested example
                </Button>
              </Sheet>
            </View>
          </Dialog>
        ) : null}
      </View>
    </ThemeProvider>
  );
}
