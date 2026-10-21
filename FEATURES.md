# Features

| Feature | Implementation | Verification |
| --- | --- | --- |
| Universal Button | packages/ui/src/components/Button.tsx | pnpm verify:web; native export proves bundle compatibility only |
| Foundation tokens and Tailwind preset | packages/ui/src/tokens.ts; packages/ui/tailwind-preset.cjs | pnpm verify:package |
| Public npm artifact | packages/ui/package.json; tsup.config.ts | pnpm pack; pnpm verify:package |
| Next.js consumer | examples/next | pnpm verify:package; pnpm verify:web |
| Expo consumer | examples/expo | pnpm verify:package; installed native behavior remains separate |
