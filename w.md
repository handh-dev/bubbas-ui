# Bubba’s universal UI workspace

## Complete-system delivery — October 22, 2026

Owner: universal UI implementation agent, branch
`codex/bubba-design-system-20261022`. Parent chat coordinates a fresh independent
review, integration, publication and public deployment. Prior 0.2.0 receipts
below remain historical and do not qualify the 0.3.0 candidate.

- [x] Preserve 32 React Native/NativeWind components and platform externals.
- [x] Implement AppearanceControl, PageHeader and AsyncState with honest source,
  freshness, missing/zero and retained-content behavior.
- [x] Complete public reference, patterns, composition/asset/generation guidance.
- [x] Import/pin initial Studio public-safe foundation 0.4.0, generate and verify custody.
- [x] Qualify initial exact package through independent Next install/behavior and Expo exports.
- [x] Qualify public docs routes, review workflows and phone/desktop layouts.
- [x] Re-pin corrected Studio source 78cb5bd2/scoped website recipes and requalify package; final independent review pending.
- [ ] Fresh independent implementation/design review and consequential fixes.
- [ ] Merge reviewed source, publish npm candidate, deploy Pages through gh-pages.
- [ ] Verify exact public tarball and live documentation at final identities.

Maintained contracts: docs/system-contract.md and packages/ui/foundations.lock.json.
Current qualification and remaining source dependency: docs/releases/0.3.0-candidate.md.
No art/font binary enters the shared package. Restricted assets stay with their
owning private source and public docs retain only separately cleared assets.

Current scope: public `@bubbasfw/ui` has a 32-component universal catalog,
complete Web/Expo examples and a public static visual review workbench. Shared
components use React Native primitives + NativeWind. Shane’s confirmed primary
use is inspecting and correcting appearance; simple implementation guidance is
secondary. The chosen workbench composition is Preview + filmstrip. GitHub Pages
is live at [handh-dev.github.io/bubbas-ui](https://handh-dev.github.io/bubbas-ui/).

The owner-approved npm `0.2.0` release and public docs deployment are verified.
The public registry reports `latest: 0.2.0`, MIT licensing, and a tarball matching
the approved artifact byte-for-byte. Install with `pnpm add @bubbasfw/ui@0.2.0`.
See the [current release record](docs/releases/0.2.0.md) for separate publication,
deployment and qualification receipts.
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
- npm publication remains an explicit owner-reviewed step. Pages builds the
  approved static `gh-pages` branch; source pushes do not publish the package.

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

## 0.2.0 qualification and publication

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
moved to recoverable Trash.

Feature [PR #1](https://github.com/handh-dev/bubbas-ui/pull/1) merged as
`64d436b21022612e53bea9e4b88797318674d654`. Pages serves static deployment
`ffc3d823bf95520fb55769aba181443dec5af72d` from `gh-pages:/`. All 91 public files
byte-match the approved output; all 35 live routes and representative browser
interactions passed. The final npm artifact is 34 files / 51,199 bytes, SHA256
`9dcbc90c28de2e0f68ad104995b6b5a3b27d865a86401af9d3ce4c4a3ca7cae1`.
Only its README differs from the runtime-qualified 53 artifact; all 33 other files
match byte-for-byte. Fresh unauthenticated registry readback and the downloaded
tarball both returned HTTP 200; `latest` is `0.2.0`, and the registry artifact
matches that final hash. Receipt:
`artifacts/releases/0.2.0/published-readback.json`.

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
