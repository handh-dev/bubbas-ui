# Bubba’s system contract

Brand Studio owns approved identity, original assets and canonical foundations.
`@bubbasfw/ui` implements universal React Native + NativeWind components and
shared task patterns. Apps own their data, authorization, routing, persistence,
business rules and native/service boundaries. No consumer reaches a Studio
runtime or imports a mutable sibling checkout during its build.

## Host typography

`ThemeProvider fontFamily` is the loaded host font name, inherited by nested
providers. Every shared native text/input resolves it explicitly: Views cannot
provide RN font inheritance. This includes control labels, form hints/errors,
feedback and Modal content. Explicit `style.fontFamily` overrides the default;
the code variant keeps monospace. Omission preserves prior platform/host defaults.
Hosts load and license fonts, and style app-owned raw native text/navigation.
`useTheme().fontFamily` exposes the resolved default. The Expo SDK 57 example derives static Montserrat 400/500/600/700/900 from the
unchanged approved variable font using a pinned fontTools recipe, with OFL and
per-file source/weight/PostScript hashes. Its expo-font plugin registers Android's
BubbasBody XML weight family and iOS's embedded Montserrat family. App code checks
native registration before supplying the platform family; it never replaces an
XML family with a single-file runtime alias. The separate regular preview alias
is only a fallback for Expo Go/older hosts, not multiweight native qualification.
No font binary enters the npm package.

`pnpm verify:fonts` renders the real component catalog/patterns into RN primitive
shims and records supplied native props. It covers inherited/nested/modal/explicit
fonts and inputs on iOS/Android branches, plus unchanged defaults and code intent.
It proves component prop forwarding; installed font resolution, weights, glyphs,
large-text fit and paint require actual device/emulator acceptance.

The public reference is maintained with this implementation:

- [Foundations](https://handh-dev.github.io/bubbas-ui/foundations/): source pins,
  type scale, semantic colors, space, shape, layout, motion and rights.
- [System reference](https://handh-dev.github.io/bubbas-ui/reference/): behavior,
  accessibility, state, keyboard, data and contribution contracts.
- [Task patterns](https://handh-dev.github.io/bubbas-ui/patterns/): working
  AppearanceControl, PageHeader and AsyncState with complete Web/Expo examples.
- [Compositions](https://handh-dev.github.io/bubbas-ui/compositions/): reusable
  website sections, public/operational density, asset choice, social/print
  handoff and generation guidance.
- [32 component specimens](https://handh-dev.github.io/bubbas-ui/): live inputs,
  actions, selection, overlays, content and feedback, with state comparisons.

## Foundation custody

`packages/ui/foundations/` contains the immutable public-safe Studio release:
the original manifest, canonical JSON, ESM, CSS, Tailwind adapter and NOTICE.
`foundations.lock.json` pins its version, brand release, source commit, manifest
SHA256 and canonical foundation SHA256. `package.json#bubba` exposes the same
identity to consumers. Package version and system version remain separate.

```sh
# Deliberate refresh from a reviewed, versioned release directory:
pnpm sync:foundations --import /path/to/reviewed/release --source-repo /path/to/brand-studio
pnpm verify:foundations
pnpm verify
pnpm verify:package
pnpm verify:docs
```

Import verifies an exact file allowlist, file-level approval and distribution
rights, every size/checksum, source repository/full commit, theme role parity,
hex values, canonical aliases, declared WCAG contrast pairs, target minimums,
focus contrast and reduced-motion contract before copying anything. It generates
the backwards-compatible token API and exact public documentation downloads.
Checks fail for stale generation, changed manifests or consumer metadata drift.
The Tailwind preset derives color roles, typography, radii, breakpoints and
feedback duration from those tokens. No restricted font/artwork binary ships.
Import also checks the exact Git object and approved source catalog from the
declared Studio commit; a nonexistent or unrelated commit is rejected. This
deliberate refresh step reads that source checkout. Ordinary builds read only
the immutable vendor. ESM, CSS and Tailwind bytes must independently derive from
the canonical schema, even if someone refreshes their manifest checksums.

## Pattern contracts

AppearanceControl is controlled. The host persists Light/Dark/System, handles
storage failure and passes the selection to ThemeProvider. System follows OS
changes. Safe-area/status-bar/portal/offline/install surfaces use the same theme.
Scoped previews can deliberately use a different appearance.

PageHeader provides a heading, optional eyebrow, description and wrapping action
region. One level-1 heading identifies a page; nested uses select a lower level.
Consumers provide actual navigation/actions and permission rules.

AsyncState uses explicit ready/loading/empty/error/offline states. It keeps
caller-supplied children, labels source and freshness explicitly, and offers a
retry only when supplied. Retained content after failure is identified as saved
or unverified. Missing is never converted to zero; timestamp presence does not
prove freshness. Live hours/status, retail/case prices, offer expiry and data
source qualification stay in the owning business boundary.

Horizontal RadioGroup choices reserve readable label space, wrap whole choices
and constrain their width to the parent. The radio indicator cannot shrink.
Vertical layout, explicit option/text classes, form hints, disabled state and
roving keyboard navigation remain supported. Check narrow and scaled text in the
actual native host as well as the web specimen.

## Extending the system

Find an existing component, pattern or consumer first. Extend the shared source
when a need repeats; do not copy a local fork. Integrate the requesting app and
update the canonical showcase, both self-contained examples, relevant reference
and actual behavior verification. Preserve compatible APIs and include exact
source/package identities with visual/journey evidence. New approved identity
comes through Studio rather than a consumer or a review note.

Keep secondary forms/dialogs, loading/empty/error/offline states, keyboard and
assistive semantics, text scaling, narrow layouts, appearance, installed shells
and source honesty in scope. Next production behavior and Expo exports are
separate from installed-device or native assistive-technology acceptance.

## Browser hosts and reusable sections — 0.5.0 candidate

`@bubbasfw/ui/web` is the same RN/NativeWind implementation compiled for Vite and
Astro/Node SSR. Import `@bubbasfw/ui/web.css` once; no framework rewrite or host
Tailwind build is needed. React and React Native Web remain peers. The browser
entry includes upstream MIT NativeWind web interop; the universal entry keeps
its existing external native runtime. The public-safe foundation is Studio
0.5.0 at source `31be2db4c6626f5a48d871d6a7a27bac8b7a04b9`, with custody recorded
in `foundations.lock.json`. Foundation provenance does not approve this new UI
candidate's design or authorize app deployment.

SiteHeader/Footer, HeroSection, ContentSection, ProductCard/Grid, CategoryCard/Grid,
LocationCard/Grid, ProductDetail and PromotionBanner own reusable presentation.
Callers supply links, cleared image URIs/alt text, content, preformatted retail
prices, addresses, published-hours labels and separately qualified reported
stand-status labels. Missing optional facts stay absent; grids have explicit
empty labels. No component fetches Core or infers facts from the clock.
`ProductCard` and `ProductGrid` render caller-supplied badge text through the
existing neutral `Badge`; an absent badge adds no label or inferred claim.
`ContentSection headingLevel` preserves page hierarchy. Header links wrap visibly
at narrow widths. `ProductDetail` gallery actions need a hydrated host; server
consumers must retain their own checked gallery behavior until hydrated.

Button `href` renders a real navigational anchor on web and uses native Linking
on devices. `type` preserves native form intent through the `/web` entry, including submit, reset and browser validation. The universal root entry remains an app-action primitive; hosts requiring HTML form semantics use `/web`. Disabled links omit their href;
loading/disabled actions remain inert. Host workflows own form submission,
authorization and persistence. Do not restyle section internals in consumers.

The canonical catalog now ships in the package: `reviewCatalog` supplies stable
component/section IDs and `UIReviewCatalog componentId` renders the actual
implementation with visibly labelled sample data. Docs, both examples and Studio
consume those same examples. Studio stores review comments outside this package,
keyed to its exact candidate identity and catalog ID. This package grants no
owner approval and creates no runtime dependency on Studio.

### Server-rendered browser styles

React Native Web produces structural rules as well as the prebuilt utility CSS.
A Node/Astro SSR host must include `StyleSheet.getSheet()` from its same installed
`react-native-web` instance in the server document (both returned id and textContent),
after rendering shared content. This preserves image positioning and RNW layout
before hydration; importing web.css alone supplies only the shared utilities.
Do not run a second RNW or React instance for server components. The `/web` adapter
keeps upstream internals external so style extraction sees the same registry.
Known caller images render their URI in SSR without waiting for an effect.

`pnpm verify:web:forms` checks built `/web` server button types, image source
preservation, real browser click/Enter submission, required validation, reset,
preventDefault, default app actions and inactive controls. It uses a local
fixture without changing business records and closes its browser/server.

Browser bundlers select `/web` and `/web-primitives` browser conditions, which
share the host RNW ESM contexts. Node SSR selects the default CJS-backed contexts.
Import package subpaths rather than aliasing direct dist files across environments.
The packed browser fixture also checks that inherited RTL logical padding agrees
with an upstream host Pressable; the SSR fixture checks the same inherited RTL.

### Public marketing variants

Sections accept `variant="marketing"` for the existing public composition. The
normal variant retains its prior layout. SiteHeader owns the compact announcement
and desktop navigation plus an accessible mobile Dialog; Astro hosts hydrate the
actual header with identical data to enable its menu. Shared Dialog supplies
Escape dismissal, focus containment and focus return. Caller search controls and
real navigation links remain caller supplied. The footer retains indexable links
when scripting is unavailable.

HeroSection accepts caller-owned `logoImage` and `actions`. Its title remains an
indexable, visually hidden H1 when the original logo is shown. The caller supplies
cleared artwork; this package distributes no brand image or licensed font.
ContentSection supplies the navy/blue route title band; Product/Category grids
use four desktop columns and two phone columns, with full-width square artwork.
ProductDetail places artwork before text and uses image thumbnails. SiteFooter
accepts `linkGroups`, `socialLinks` and `copyright`, with children for caller-owned
season information. Missing facts remain absent. Every existing catalog section
shows both variants using clearly labelled synthetic fixtures under the same
stable component ID. Marketing remains a new review candidate until owner review.

Marketing sections scope the complete light palette through a nested provider,
including shared badges and Dialog content; the host font is inherited. Hidden
auxiliary navigation destinations remain available in the menu. The compact
header bounds semantic navigation against host-wide `nav` rules. Link's optional
`textVariant` selects its shared text scale; marketing captions avoid inheriting
the responsive body scale. Existing Link defaults are unchanged.
