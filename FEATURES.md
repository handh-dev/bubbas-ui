# Features

The 32-component docs are live at
[handh-dev.github.io/bubbas-ui](https://handh-dev.github.io/bubbas-ui/).
The owner-approved npm release is public as `@bubbasfw/ui@0.2.0` with the `latest`
tag and MIT licensing. The downloaded registry tarball exactly matches the
approved artifact. Artifact identity, public receipts and platform limits are in
the [release record](docs/releases/0.2.0.md).

| Feature | Implementation | Verification |
| --- | --- | --- |
| 32 universal components | packages/ui/src/components | Package/example typechecks; isolated packed Next production behavior; iOS/Android Hermes exports |
| Light/dark/system semantic themes | packages/ui/src/theme.tsx; src/tokens.ts; preset | Browser appearance/persistence; installed iOS Release light/dark check; native safe areas/status bar follow selected theme |
| Visual review workbench | apps/docs/src/Workbench.tsx | 35-route browser sweep; desktop/mobile captures; real inert miniatures, blue selections, first-screen mobile preview and single-field comparisons |
| Browser-local review notes and export | apps/docs/src/review.ts | Reload/download; two-tab preservation; failed storage writes and legacy migration retain feedback for export |
| Static component routes and platform guidance | apps/docs/pages | Live 35-route verification; all 91 served files match approved static output; Web/Expo disclosures |
| Complete self-contained consumer galleries | examples/next; examples/expo | Packed consumers, web pointer/keyboard behavior; all 32 mounted in installed iOS Release with representative behavior checks; themed native safe areas |
| Public npm artifact | packages/ui/package.json; tsup.config.ts | Final 34-file artifact inspected; README-only difference from runtime-qualified package; public npm latest 0.2.0 tarball matches approved bytes |
| Pinned brand provenance | docs/brand-sources.md; public asset notice | Source/distribution review; MIT code, separate logo notice and Montserrat OFL |
