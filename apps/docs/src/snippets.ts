import type { ComponentName } from "./showcase/catalog";
const examples: Record<ComponentName, string> = {
  Text: '<Text variant="body" tone="default">Hello, Bubba’s.</Text>',
  Heading: "<Heading level={1}>Your page title</Heading>",
  Stack: "<Stack gap={4}><Text>First</Text><Text>Second</Text></Stack>",
  Inline: "<Inline gap={3} wrap><Badge>One</Badge><Badge>Two</Badge></Inline>",
  Container: "<Container reading><Text>Your content</Text></Container>",
  Card: "<Card padding={6}><Text>Related content</Text></Card>",
  Divider: '<Divider orientation="horizontal" />',
  Button:
    '<Button variant="primary" size="md" onPress={save}>Save changes</Button>',
  IconButton:
    '<IconButton accessibilityLabel="Close" onPress={close}>{closeIcon}</IconButton>',
  Link: '<Link href="https://example.com" external>Visit example</Link>',
  Badge: '<Badge tone="success">Ready</Badge>',
  Avatar: '<Avatar name="Alex Example" size="md" />',
  ListItem: '<ListItem title="Example" description="Details" onPress={open} />',
  Input:
    '<Input value={name} onChangeText={setName} accessibilityLabel="Name" />',
  Textarea:
    '<Textarea value={notes} onChangeText={setNotes} numberOfLines={4} accessibilityLabel="Notes" />',
  FormField:
    '<FormField label="Name" hint="Use a recognizable name." required>\n  <Input value={name} onChangeText={setName} />\n</FormField>',
  Checkbox:
    '<Checkbox checked={included} onCheckedChange={setIncluded} label="Include this option" />',
  Switch:
    '<Switch checked={enabled} onCheckedChange={setEnabled} label="Show details" />',
  RadioGroup:
    '<RadioGroup label="Size" options={options} value={size} onValueChange={setSize} />',
  Select:
    '<Select label="Size" options={options} value={size} onValueChange={setSize} />',
  Tabs: '<Tabs items={[{ value: "overview", label: "Overview", content: <Text>Overview</Text> }]} />',
  Accordion:
    '<Accordion items={[{ value: "details", title: "Details", content: <Text>More here.</Text> }]} />',
  Dialog:
    '<Dialog open={open} onOpenChange={setOpen} title="Review changes">\n  <Button onPress={() => setOpen(false)}>Done</Button>\n</Dialog>',
  Sheet:
    '<Sheet open={open} onOpenChange={setOpen} title="Review changes">\n  <Text>Your content</Text>\n</Sheet>',
  Alert:
    '<Alert tone="info" title="A useful message" description="What happens next." />',
  Toast:
    '<Toast open={open} onOpenChange={setOpen} duration={0} title="Saved" tone="success" />',
  Spinner: '<Spinner label="Loading details" size="small" />',
  Progress: '<Progress value={60} max={100} label="Upload progress" />',
  Skeleton: '<Skeleton className="h-5 w-3/4" />',
  EmptyState:
    '<EmptyState title="Nothing here yet" description="Add your first item.">\n  <Button onPress={add}>Add an item</Button>\n</EmptyState>',
  Breadcrumbs:
    '<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Current page" }]} />',
  Pagination: "<Pagination page={page} count={5} onPageChange={setPage} />",
};
export function snippetFor(name: ComponentName, platform: "Web" | "Expo") {
  const names = [
    ...new Set(
      [...examples[name].matchAll(/<([A-Z]\w*)\b/g)].map((match) => match[1]),
    ),
  ];
  return `import { ${names.join(", ")} } from '@bubbasfw/ui';\n\n${platform === "Web" ? '// Inside an interactive React component. App Router: add "use client".\n' : "// Inside an Expo screen with NativeWind configured.\n"}${examples[name]}`;
}
