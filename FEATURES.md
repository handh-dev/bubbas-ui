# Features

The expanded `0.2.0` catalog is an unpublished candidate. Public npm remains
`0.1.0` at qualification closeout; the owner approved publication and public docs
deployment, with verification receipts still pending. Exact artifact
identity, evidence and platform limits are in the [candidate record](docs/releases/0.2.0-candidate.md).

| Feature | Implementation | Verification |
| --- | --- | --- |
| 32 universal components | packages/ui/src/components | Package/example typechecks; isolated packed Next production behavior; iOS/Android Hermes exports |
| Light/dark/system semantic themes | packages/ui/src/theme.tsx; src/tokens.ts; preset | Browser appearance/persistence; installed iOS Release light/dark check; native safe areas/status bar follow selected theme |
| Visual review workbench | apps/docs/src/Workbench.tsx | 35-route browser sweep; desktop/mobile captures; real inert miniatures, blue selections, first-screen mobile preview and single-field comparisons |
| Browser-local review notes and export | apps/docs/src/review.ts | Reload/download; two-tab preservation; failed storage writes and legacy migration retain feedback for export |
| Static component routes and platform guidance | apps/docs/pages | Production static export; home, 32 components, foundations and setup; Web/Expo disclosures |
| Complete self-contained consumer galleries | examples/next; examples/expo | Packed consumers, web pointer/keyboard behavior; all 32 mounted in installed iOS Release with representative behavior checks; themed native safe areas |
| Public npm artifact | packages/ui/package.json; tsup.config.ts | 34-file candidate inspected and installed independently; public 0.1.0 record retained; owner-approved publication pending verified receipt |
| Pinned brand provenance | docs/brand-sources.md; public asset notice | Source/distribution review; MIT code, separate logo notice and Montserrat OFL |
