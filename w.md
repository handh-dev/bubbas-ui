# Bubba’s universal UI workspace

Current scope: expand public `@bubbasfw/ui` to a 32-component universal catalog,
complete Web/Expo examples and a public static visual review workbench. Shared
components use React Native primitives + NativeWind. Shane’s confirmed primary
use is inspecting and correcting appearance; simple implementation guidance is
secondary. The chosen workbench composition is Preview + filmstrip. GitHub Pages
at `handh-dev.github.io/bubbas-ui` is the selected host.

The `0.2.0` source is an owner-approved release candidate. At qualification
closeout, public npm remains `0.1.0`; the owner has now approved publishing
`0.2.0` and the docs. Publication and deployment still require verified receipts.
Browser-local Keep/Change notes and JSON export provide feedback without a backend.

## Decisions

- Public package under `packages/ui`; root and examples remain private workspaces.
- NativeWind 4.2.7 + Tailwind 3.4.17; React 19.2.3 / RN 0.86.3 baseline.
- Compiled ESM/CJS with nativewind JSX interop; peers remain external.
- Source ships for Tailwind scanning; exports include platform-neutral tokens and
  CJS Tailwind preset. Next example uses Pages Router and webpack explicitly.
- Brand Studio owns approved brand. Seed values are pinned in docs/brand-sources.md.
- Owner selected MIT for the code on 2026-10-21. Shared package ships no font/artwork
  binaries. Docs separately include cleared Montserrat/OFL and original logo geometry
  under an explicit notice; trademark rights remain separate.
- Package is configured public, and no npm release or deployment is automated.

## First public release

`@bubbasfw/ui@0.1.0` was published to public npm on 2026-10-21 with explicit
owner authorization. At that release, registry metadata reported `latest` as `0.1.0`,
MIT licensing, and 15 package files. See the
[npm package](https://www.npmjs.com/package/@bubbasfw/ui) and
[release record](docs/releases/0.1.0.md). That version installs with
`pnpm add @bubbasfw/ui@0.1.0`; its consumer setup includes platform peers and
NativeWind.

Unauthenticated registry readback and a downloaded registry tarball passed:
the tarball matches the reviewed artifact byte-for-byte and all 15 files match
the release source. Evidence: `artifacts/verification/run-XhlD5G/published-readback.json`.
Future releases remain owner-reviewed; no push or merge publishes automatically.
For that first release, native simulator/device interaction and native release
qualification were untested. The current candidate has separate evidence below.

## 0.2.0 candidate validation

The reviewed tarball contains 34 files and matches the installed native proof
artifact: SHA256 `53b55a108ed85542035d899c6b61b3a3e8e453c5f0cf70be6b6d5ce473242a2e`.
`artifacts/verification/run-BABCPf/report.json` passed isolated Next production
build/browser behavior and Expo iOS/Android Hermes exports. The latest docs sweep
passed 35 routes, review controls, multi-tab feedback preservation, storage-failure
recovery/export and 320/390/1440 layouts with zero page errors. Scope and retained
evidence are recorded in [the candidate record](docs/releases/0.2.0-candidate.md).

The visual correction batch adds real inert filmstrip specimens, blue selections
with readable labels and distinct focus, first-screen mobile previews and one
Input per comparison state. Expo safe areas and status-bar foreground now follow
the selected theme. Fresh independent code reviews cover the final component,
hydration, persistence, docs and scoped visual/test fixes. The independent visual
follow-up accepted all four scored corrections; that verdict has bounded scope.

The exact candidate also passed an installed iPhone 17 / iOS 27 Release simulator
harness: all 32 components mounted, with representative native interactions and
light/dark safe-area/status-bar rendering checked. See
`artifacts/native-review/report.json` for method and limits. This does not qualify
Android runtime, physical devices or native assistive technologies. The owned
simulator was deleted, unrelated states stayed unchanged, and heavy fixtures were
moved to recoverable Trash. Publication and public docs deployment are now
owner-approved and pending verified publication receipts.

## Commands and evidence

`pnpm verify`: package build + package/example typechecks.
`pnpm verify:package`: installed tarball and independent consumer bundler checks.
`pnpm verify:web`: actual browser Button behavior and visual styles.
`pnpm dev:web` / `pnpm dev:expo`: owned local example previews.
`pnpm dev:docs`: visual workbench on port 4313 with /bubbas-ui base path.
`pnpm verify:docs`: production static export plus browser review workflows.
`pnpm sync:showcase`: align self-contained Web/Expo demos with the canonical catalog.
Check the candidate record for the exact observed native runtime scope and its
limits. Bundler/export checks and installed runtime checks are reported separately.
Generated artifacts and local visual-review packets are ignored.

<!-- wstack:begin setup -->
Wstack: 0.2.0
Features: [FEATURES.md](FEATURES.md)
Terms: [GLOSSARY.md](GLOSSARY.md)
CLI: `pnpm run`
<!-- wstack:end setup -->
