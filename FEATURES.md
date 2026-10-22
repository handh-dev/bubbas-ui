# Features

The 32-component docs are live at
[handh-dev.github.io/bubbas-ui](https://handh-dev.github.io/bubbas-ui/).
The verified public registry release is `@bubbasfw/ui@0.3.0`; its publication
receipt is retained in `artifacts/releases/0.3.0/`. The current 0.3.1 host-font
patch is a candidate until independently reviewed and published. Current scope
and qualification paths are in the [candidate record](docs/releases/0.3.1-candidate.md).
Earlier [0.2.0 receipts](docs/releases/0.2.0.md) remain historical.

| Feature | Implementation | Verification |
| --- | --- | --- |
| 32 universal components | packages/ui/src/components | Package/example typechecks; isolated packed Next production behavior; iOS/Android Hermes exports |
| Light/dark/system semantic themes | packages/ui/src/theme.tsx; src/tokens.ts; preset | Browser appearance/persistence; current installed mobile behavior remains separate qualification |
| Scoped loaded host font | packages/ui/src/theme.tsx; internal/native-text.tsx; forms/Input.tsx | pnpm verify:fonts records compiled component native-prop forwarding, nested Modal/provider inheritance, overrides and unchanged defaults; installed glyph/weight/paint acceptance remains required |
| Visual review workbench | apps/docs/src/Workbench.tsx | Content routes, desktop/phone captures, review workflows and component comparisons via pnpm verify:docs |
| Browser-local review notes and export | apps/docs/src/review.ts | Reload/download; two-tab preservation; failed storage writes and legacy migration retain feedback for export |
| Static component routes and platform guidance | apps/docs/pages | Production export + route/review checks; live deployment is separately receipted |
| Complete self-contained consumer galleries | examples/next; examples/expo | Isolated packed Next production behavior + Expo Hermes exports; Expo loads cleared Montserrat/OFL and passes its alias; installed native behavior is separate |
| Public npm artifact | packages/ui/package.json; tsup.config.ts | pnpm verify:package checks exact members, custody, compiled font forwarding, isolated consumers and native exports; publication readback is separate |
| Pinned brand provenance | docs/brand-sources.md; public asset notice | Source/distribution review; MIT code, separate logo notice and Montserrat OFL |
