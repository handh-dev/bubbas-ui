## Current release — 0.6.1 · October 22, 2026

The owner approved exact 0.6.1 source/archive after fresh independent review and
all required gates. Its minimal web style-forwarding fix preserves the approved
annotated web design. Read [the release record](docs/releases/0.6.1.md) for npm,
source, tag, reference deployment and qualification identities and current limits.
No new design or package repack accompanies these documentation updates.

0.6.0 remains immutable and deprecated. Its later failing web form gate is
recorded honestly; its unmerged release-docs PR12 was closed as superseded.
Run `pnpm verify:web:forms` as a distinct required host gate alongside
`pnpm verify`, full `pnpm verify:package` and `pnpm verify:docs` for later changes.
Package publication, public reference deployment and each app adoption retain
separate evidence. Mobile/HQ/Bulk/social/print remain outside this web cutover.
Older release/candidate notes below are historical, not current registry state.

## Current web release — 0.5.0 · October 22, 2026

UI 0.5.0 is owner-approved and published. Read [the exact release record](docs/releases/0.5.0.md)
for immutable artifact/source identities, live Pages proof and known visible
limits. Current setup guidance is in README.md and the public setup page. The
published tarball retains disclosed legacy README examples; it was not repacked.
Older candidate and native-patch checklists below are historical.

## HH-51 native visual correction — 0.3.2

- [x] Preserve vertical/form/roving semantics; horizontal radio choices wrap with readable width.
- [x] Derive approved OFL static 400/500/600/700/900; preserve original source and private fonts.
- [x] Canonical SDK 57 native weight registration and separately scoped preview fallback.
- [ ] Exact clean source/full package/docs gates and independent review.
- [ ] Parent publication, mobile exact registry integration and real installed paint.

[Candidate contract](docs/releases/0.3.2-candidate.md). Native compile cap is exhausted;
source/prebuild-only metadata does not qualify a new native binary.

# Bubba’s universal UI workspace

## HH-51 native host-font patch — 0.3.1

Branch `codex/HH-51-native-font-contract`, starting at merged `762bfa3`.
Immutable 0.3.0 publication is preserved; parent owns fresh patch review and
publication, followed by mobile’s exact registry adoption and native acceptance.

- [x] Reproduce missing native font props; add scoped provider font contract.
- [x] Cover all shared native text/inputs, nested providers/Modals and overrides.
- [x] Load cleared Montserrat/OFL in canonical Expo example; no npm font binary.
- [x] Update public setup/reference/package guidance and forwarding regression.
- [ ] Exact clean-head package/docs qualification and independent fresh review.
- [ ] Publish 0.3.1, integrate mobile registry pin/provider and verify installed font.

Contract/release scope: [0.3.1 candidate](docs/releases/0.3.1-candidate.md).
Generated receipts stay under ignored `artifacts/verification/`.

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

`pnpm verify`: package build + package/example typechecks + font forwarding.
`pnpm verify:fonts`: compiled component/RN-shim prop forwarding and font provenance;
not installed font resolution or paint.
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

## Web cutover candidate — October22,2026

UI implementation for Studio/main website only. Candidate0.5.0 imports approved
Studio foundation0.5.0 and provides same-source browser adapter, complete reusable
sections and package-owned catalog. See docs/releases/0.5.0-candidate.md and
system-contract.md. Owner review remains required before publication; no npm or
Pages publication occurs on this branch. Excluded mobile/HQ/Bulk/social apps
retain their own pins. Existing dirty AGENTS.md was preserved separately.

## Mobile marketing refinement — 0.7.0 candidate

Extends the shared marketing implementation in an isolated worktree. Public
0.6.1 stays approved; no npm/Pages/app publication occurs during preparation.
Read docs/releases/0.7.0-candidate.md for the 18-item behavior scope, reference
provenance, required gates and review boundary. Existing framework/dependency
versions, native primitives, foundation custody and web Button forwarding remain.

## October 23 shared refinements — candidate6 preparation

Owner's twelve annotations refine the shared implementation, not app-local styles.
Same-row compact hero actions; metallic gold and continuous gold-only twinkles;
long-title fit; wide/transparent layout APIs; narrower ticker caps; hover feedback;
six licensed social icons. Owner then requested Core-backed announcement authoring:
shared safe segments, static measured banner and controlled selected-word editor;
Core/HQ own persistence and publication. Existing HQ controls remain excluded.
All proposed versions remain isolated and unpublished pending exact owner review.
Use `pnpm verify:web:marketing` plus existing fonts/forms/package/docs gates.

## Proposed 0.7.0 final10 — announcement fitting correction

The independent final9 review found that important generic font utilities kept
long announcements at 12px despite their measured inline size. Final10 scopes the
shared font cascade, measures at the actual painted 14px base, reports computed
size, and supplies a conservative no-JavaScript fallback without an overflow-
causing minimum floor. Gold paint, inline spaces and the six-social header remain.
The real-browser announcement-fit gate reproduces final9's overflow and covers
85-character seed/near-160-character content, both stylesheet orders, opaque
classic-script hydration, delayed fonts, content/width changes and honest editor
warnings. The seeded concise phone message stays readable.

Owner review, normal full-package/docs checks, fresh independent review and
consumer qualification remain separate; this is not a publication/deployment.

## Candidate11 local review — campaign badges

Owner paused release and requested that every campaign badge/full label stay
visible on phones without horizontal scrolling. Shared CampaignSection wraps by
available width; the catalog/contract and extracted browser bounds checks cover
realistic labels, long words, enlarged text and narrower nested containers.
Existing candidate10 archive/previews stay immutable. No publication or deployment.

## FocusMarquee — local candidate11

Owner resumed local work for one solid-red, endlessly moving white pill lane with
subtle center focus. Shared FocusMarquee owns all presentation/options, global
motion/static fallback, layout observation and inert duplicates. Apps supply
facts. The backward-compatible CampaignSection wrap fix is retained. No release
or consumer deployment is authorized by this local revision.

## FocusMarquee candidate14 — local spring direction

Owner's next visual review requests centered spring handoffs, pop/stretch and
soft outer edges. Shared default is now a finite cadence/preset sequence, keeping
linear as an explicit option and all prior footprint/motion/static contracts.
Actual recording and serial frames are required before freezing this local
proposal; no publication/deployment is authorized.

## FocusMarquee candidate15 — local fast flow

Short centered rests, denser actual geometry and gentle outer-edge blur refine
the same shared finite handoff engine. Preserve14 original artifacts/previews;
compare actual motion/gaps/filter values against14 before freezing this local
proposal. Publication and deployment remain paused.

## FocusMarquee candidate16 — slightly eased local cadence

Owner requested only a small slowdown: default1.20s per fact, retaining15’s
short0.14s centered rest and all density/blur/pop settings. Preserve15 original
and successful isolated reruns; qualify a new16 artifact for local review only.

## FocusMarquee candidate17 — exact owner1.80s cadence

The owner specified1.80 seconds. Only shared default/fallback cadence changes;
retain short0.14s rest and all15 density/blur/pop settings.16 original/evidence
remain preserved as superseded. Build/prove actual timing, then freeze new17
original for local review; release remains paused.

## FocusMarquee candidate18 — quick local live tuning

Single shared default2.3s; existing cadence prop and actual Input/FormField catalog
control enable local trials without repeated package changes. Preserve17 originals
and HQ17. Focused actual-package build/type/live-edit/invalid/static checks and a
fresh read-only review apply; full release/Expo/Core/HQ/recovery gates wait for
accepted motion. Website DEV override belongs to its consumer, ignored in prod.

## Sparkler offer — local candidate21

Extend shared PromotionBanner, same-component catalog and contracts for the
owner's navy/gold/red composition reference and original caller-supplied vector.
Private art stays outside the public package. Focused shared build/type/browser
responsive/focus/hover/static/missing-art checks apply; exact selection20 marquee
settings are preserved. Consumer integration and fresh read-only review follow.
This is a local proposal: publication/deployment and full release gates remain
paused/deferred.


## Sparkler offer — local candidate22 owner correction

Owner superseded21’s dark navy field: use solid official brand blue and remove
both static Sparkles glyphs from the offer (badge and background). Keep gold
animated sparkles, original caller art, white/gold headline, gold/red sweep and
white action. Preserve original21 artifact and all selected20 marquee settings.
This correction is local only; publication/deployment remain paused.


## Sparkler offer — local candidate23 badge reuse

Owner requests existing product deal badge for Free gift. Reuse actual shared
MarketingProductBadge with its metallic paint/gleam/twinkles and an optional
static-icon flag (true by default for existing products; false in this card).
Retain every22 composition choice and selected20 marquee. Focused badge motion,
manual/reduced preference, bounds and keyboard checks qualify local preparation
only. Original22 preserved; publication/deployment remain paused.


## Sparkler offer — local candidate24 badge size

Owner asks for a modestly larger Free gift badge. Extend actual reusable
MarketingProductBadge with sm default preserving products and lg in the offer:
16px/36px base,18px/40px at440px containing inline size. Same metallic effects,
icon=false and other23 composition/marquee unchanged. Focused actual dimensions,
responsive bounds and existing motion/keyboard checks; no unrelated broad suite.
Preserve23 original; publication/deployment stay paused.
