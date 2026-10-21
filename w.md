# Bubba’s universal UI workspace

User scope: scaffold public npm package `@bubbasfw/ui` and public design system
using React Native primitives + NativeWind for Next.js and Expo. Initial delivery
is package/configuration, foundation tokens, and one shared Button. Full component
catalog, consumer migration, and native release/device qualification are separate
work. The owner authorized the first public npm release on 2026-10-21.

## Decisions

- Public package under `packages/ui`; root and examples remain private workspaces.
- NativeWind 4.2.7 + Tailwind 3.4.17; React 19.2.3 / RN 0.86.3 baseline.
- Compiled ESM/CJS with nativewind JSX interop; peers remain external.
- Source ships for Tailwind scanning; exports include platform-neutral tokens and
  CJS Tailwind preset. Next example uses Pages Router and webpack explicitly.
- Brand Studio owns approved brand. Seed values are pinned in docs/brand-sources.md.
- Owner selected MIT for the code on 2026-10-21. No font/artwork binaries;
  their distribution rights and trademark rights remain separate.
- Package is configured public, and no npm release or deployment is automated.

## First public release preparation

The owner explicitly authorized publication of `@bubbasfw/ui@0.1.0` to public
npm on 2026-10-21. This records authorization and preparation, not registry
success. Inspect the exact tarball and preserve publication/registry readback
evidence before recording the release as published. Future releases remain
owner-reviewed; no push or merge publishes automatically.

## Commands and evidence

`pnpm verify`: package build + package/example typechecks.
`pnpm verify:package`: installed tarball and independent consumer bundler checks.
`pnpm verify:web`: actual browser Button behavior and visual styles.
`pnpm dev:web` / `pnpm dev:expo`: owned local example previews.
Check retained verification evidence and report covered platforms separately from
unobserved native simulator/device behavior. Generated artifacts are ignored.

<!-- wstack:begin setup -->
Wstack: 0.2.0
Features: [FEATURES.md](FEATURES.md)
Terms: [GLOSSARY.md](GLOSSARY.md)
CLI: `pnpm run`
<!-- wstack:end setup -->
