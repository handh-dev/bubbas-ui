import { useState } from "react";
import {
  Button,
  Stack,
  Dialog,
  Input,
  Sheet,
  Text,
  ThemeProvider,
} from "@bubbasfw/ui/web";
export default function OverlayCheck() {
  const [show, setShow] = useState(true);
  const [nested, setNested] = useState(false);
  return (
    <ThemeProvider>
      <Stack gap={6} style={{ padding: 32 }}>
        <Text>Overlay compatibility fixture</Text>
        <Button testID="default-reopen" onPress={() => setShow(true)}>
          Open initial dialog
        </Button>
        <Stack style={{ minHeight: 1400 }}>
          <Text>Background scroll content.</Text>
        </Stack>
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
            <Stack gap={4}>
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
            </Stack>
          </Dialog>
        ) : null}
      </Stack>
    </ThemeProvider>
  );
}
