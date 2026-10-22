import { useState } from 'react';
import { View } from 'react-native';
import { AppearanceControl, AsyncState, Button, Card, PageHeader, RadioGroup, Text, ThemeProvider, type Appearance, type AsyncStatus } from '@bubbasfw/ui';

/** Real shared patterns with explicitly labeled demonstration data. */
export function PatternsDemo() {
  const [appearance, setAppearance] = useState<Appearance>('system');
  const [status, setStatus] = useState<AsyncStatus>('ready');
  const [retries, setRetries] = useState(0);
  return <View className="gap-6" testID="patterns-demo">
    <AppearanceControl testID="pattern-appearance" value={appearance} onValueChange={setAppearance} />
    <ThemeProvider appearance={appearance} testID="pattern-theme" className="gap-6 rounded-xl border border-ui-line p-5">
      <PageHeader title="Campaign review" level={2} eyebrow="Sample workspace"
        description="Review the message and its sources before release."
        actions={<Button variant="outline" onPress={() => setStatus('loading')}>Refresh sample</Button>} />
      <RadioGroup label="Sample retrieval state" value={status} onValueChange={(value) => setStatus(value as AsyncStatus)}
        orientation="horizontal" options={['ready', 'loading', 'empty', 'error', 'offline'].map((value) => ({ value, label: value }))} />
      <AsyncState testID="pattern-async" status={status}
        title={status === 'loading' ? 'Refreshing sample content…' : status === 'empty' ? 'No sample campaigns' : status === 'offline' ? 'Offline · showing a saved sample' : status === 'error' ? 'Sample source unavailable' : undefined}
        description={status === 'error' ? 'The sample request failed. Your draft remains available.' : status === 'offline' ? 'Reconnect before treating saved details as current.' : undefined}
        onRetry={() => { setRetries((value) => value + 1); setStatus('ready'); }}
        sourceLabel={status === 'empty' ? undefined : 'Source: local demonstration fixture'}
        freshnessLabel={status === 'offline' || status === 'error' ? 'Saved sample · current campaign facts not verified' : undefined}>
        {status !== 'empty' ? <Card padding={4}>
          <Text variant="label">Bring your people. Make a memory.</Text>
          <Text tone="muted">Evergreen sample copy. No live offer, schedule, or price.</Text>
          <Text testID="pattern-zero">Verified sample orders: 0</Text>
          <Text>Current retail price: unavailable</Text>
        </Card> : null}
      </AsyncState>
      <Text testID="pattern-retries" variant="small" tone="muted">{`Sample retries: ${retries}`}</Text>
    </ThemeProvider>
  </View>;
}
