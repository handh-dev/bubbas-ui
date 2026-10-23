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

## Browser hosts and reusable sections — 0.5.0

`@bubbasfw/ui/web` is the same RN/NativeWind implementation compiled for Vite and
Astro/Node SSR. Import `@bubbasfw/ui/web.css` once; no framework rewrite or host
Tailwind build is needed. React and React Native Web remain peers. The browser
entry includes upstream MIT NativeWind web interop; the universal entry keeps
its existing external native runtime. The public-safe foundation is Studio
0.5.0 at source `31be2db4c6626f5a48d871d6a7a27bac8b7a04b9`, with custody recorded
in `foundations.lock.json`. Foundation provenance does not approve this new UI
candidate's design or authorize app deployment. The exact owner-approved 0.5.0
artifact and its separate publication/deployment proof are recorded in
[the release record](releases/0.5.0.md).

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
stable component ID. The exact 0.5.0 marketing artifact has owner approval;
new revisions still require owner review before publication or app deployment.

Marketing sections scope the complete light palette through a nested provider,
including shared badges and Dialog content; the host font is inherited. Hidden
auxiliary navigation destinations remain available in the menu. The compact
header bounds semantic navigation against host-wide `nav` rules. Link's optional
`textVariant` selects its shared text scale; marketing captions avoid inheriting
the responsive body scale. Existing Link defaults are unchanged.

Marketing location-card theme wrappers retain the grid item's minimum-width and
flex constraints. Product detail columns and actions stack within the available
phone width; desktop retains the image/text columns. Hero actions follow the same
phone constraint. Browser qualification measures every visible interactive
control's bounds, since an app's overflow clipping can hide a layout failure.
Catalog SVG fixtures use fully encoded data URIs and must decode successfully.

## Annotated web candidate — 0.6.0

The owner approved the exact 0.6.0 design, which remains unchanged in the 0.6.1
compatibility patch. 0.6.0 was published, then deprecated after an existing web
form/SSR gate exposed dropped Button caller styles. npm latest returned to 0.5.0;
The owner subsequently approved exact 0.6.1 source/archive after fresh independent
review and consumer qualification; it supersedes the deprecated release. See
[the release record](releases/0.6.1.md). Later revisions require their own review.
The pinned Studio 0.5.0 foundation and default/native control variants remain.
Marketing buttons accept `appearance="marketing"`; secondary actions use original
blue. SectionAction accepts optional tone and social icon; absent facts remain absent.
Desktop header balances equal side tracks around its navigation and switches to
the accessible menu before collisions. All icon controls retain 44px minimum targets.
Hero marketing is white and fills almost the desktop fold; mobile remains content
driven. Product marketing image wells use 4:3, cards fill their row, prices rest at
the bottom, and supplied badges use gold with a single short gleam.

CampaignSection, SocialSection and FlagTicker render supplied copy, destinations
and badges. Ticker has pause/play, pauses on hover/focus, and reduced motion stops
all decorative movement while retaining the content. Never put aria-hidden on the
whole ticker because it contains a real pause control. RN's nativeID supplies
indexable anchors. No component fetches or infers seasonal/business data.

Icons come from licensed pinned Lucide and Simple Icons subsets under icons/.
RN Image renders generated 96px sources on all platforms without a font/SVG peer.
Default 24px icons are decorative within a labeled control; standalone icons need
accessibilityLabel. Source and raster checksums are checked by verify:shared.
The original brand artwork remains caller supplied and retains its own rights.

### Marketing button refinement

The existing marketing appearance interprets `size="lg"` as a featured action;
HeroSection selects it automatically. sm/md retain compact repeated actions.
The reference-inspired design uses 12px featured corners / 6px compact corners,
60px desktop / 48px phone featured minimum height, and 48px compact targets.
Original red/blue gradient shading and ambient glow are web effects; universal
native controls retain solid fills, the same geometry and subtle native shadow.
No gradient dependency or default application-control redesign is introduced.
Hover/press, white-separated focus, disabled/busy and reduced-motion states remain
part of the contract. Marketing labels stay on one line; callers keep copy concise.

### Ribbon ticker refinement

FlagTicker now renders a white text lane with navy words, red rails and reserved
navy star endcaps on both ends. Decorative angled trim stays inside the caps;
the 44px pause/play control has its own flow slot. Existing caller copy and order
are unchanged. Only the text track scrolls after web hydration; hover, focus and
manual pause stop it. No-JS, native and reduced-motion layouts wrap the complete
sequence, allowing the band to grow. There are no duplicate announcements.

### Web Pressable style forwarding

Button forwards the original caller style on web and default native controls.
Only native marketing controls compose the existing native shadow. The web
adapter retains object/array styles and resolves callback styles after NativeWind
class merging with the actual RNW interaction state. The existing web form gate
covers SSR/RTL styles, pointer/keyboard state, focus, inactive states and forms.
Run `pnpm verify:web:forms` in addition to package, font, consumer and docs gates;
a package build or Next gallery does not establish this distinct host contract.

## Mobile marketing refinement candidate — 0.7.0

Unpublished; exact owner review remains required. The October 23 refinement extends
shared presentation and the actual package catalog, rather than creating app-local
styles. The existing 0.6.1 Button object/array/callback/RTL/form forwarding remains.

- Marketing hero action pairs stay on one row at every supported width. The shared
  compact hero treatment has 48px targets, bounded horizontal padding and fluid
  10–14px web labels. Callers keep labels short; no label truncation or wrapping.
  Native retains the same row, 48px targets and compact 11px label adaptation.
- Honor badges use a rich gold metallic gradient, beveled edge and narrow reflective
  band with dark #352300 text. Product badges use the approved gold family, an
  occasional reflective pass and continuous independently staggered four-point
  gold twinkles. PromotionBanner uses the same gold-only vocabulary. Short bounded
  radial side bursts remain interaction feedback; no particles intercept input.
- Product and category grids use two columns through 760px, three through 1199px,
  then four. Full titles wrap safely, including unusually long words. ThemeProvider also accepts `surface="transparent"` for standalone
  sections without painting a canvas behind them; its default remains canvas. Container and
  ContentSection support `width="wide"` (1600px maximum with 16px gutters).
  ContentSection supports `surface="transparent"` for action-only areas.
- FlagTicker reserves 24px phone / 48px desktop navy star caps. Its text keeps moving
  on hover. The persistent Motion switch in navigation/footer controls the ticker,
  gold twinkles/reflections, side bursts and action travel. The same stored preference
  is mirrored onto the document root for static SSR sections. OS reduced motion
  overrides it; restricted storage uses the existing in-memory fallback.
- Mobile navigation links have a subtle blue hover/keyboard-focus highlight.
  Header, footer and SocialSection render all caller-supplied social links, including
  the licensed Instagram, Facebook, X, YouTube, TikTok and Spotify icon subset.
  Account URLs and category artwork remain caller-owned, never inferred business data.
- Phones retain the accessible H1 and supplied mascot, omit only the repeated hero
  logo, keep the campaign badges on one keyboard-scrollable rail, use the responsive
  two-column footer without an extra white logo well, and retain compact contained
  PDP artwork/gallery/video/actions. Dialog focus/scroll locking and 200ms exit stay.

### Static promotional announcement and authoring

`AnnouncementContent` accepts either a backward-compatible plain string or safe
`AnnouncementSegment[]` (`{text, tone:'default'|'yellow'}`). SiteHeader accepts
`announcement` and optional `announcementCompact` of that type. AnnouncementBanner
exports the same real presentation for authoring previews. Neither performs a fetch.
Core owns publication, segments and revisions; the host supplies current content.
No raw HTML is accepted or rendered. Yellow words use approved #FED766 on a small
opaque #03256C backing (normal-text contrast above 10:1); the bar stays original blue.

The announcement is static and single-line, with no marquee or manual scrolling.
Measured web fitting uses a shorter caller-reviewed phone message through 760px or
when the full message would fall below 11px; otherwise it fits the full message.
The full copy remains its accessible label. A conservative character-count CSS
fallback keeps reviewed concise phone/desktop copy at least 11px before hydration/without JavaScript; native
uses the static text adaptation. Content is never silently removed or invented.
Arbitrary long copy cannot fit a phone at a readable size: authors supply concise
phone copy, and the editor warns when its actual 320px preview drops below 11px.

`AnnouncementEditor` is controlled (`value`, `onValueChange`) and uses the shared
RN Textarea, FormField and Buttons. Select words, then Make yellow/Make white. It
retains selection/focus, preserves highlight runs through ordinary edits, handles
UTF-16 selection boundaries without splitting surrogate pairs, and rejects over
160 Unicode code points or over 24 normalized segments. Controls, line breaks, Unicode line/paragraph
separators and angle brackets are rejected with visible feedback and the prior
valid value remains. Adjacent equal tones merge.
It supports disabled/busy/error states, a configurable `previewWidth` and optional
caller children for publication controls. Apps own enable/save/revision/conflicts,
validation and persistence. Its preview is the actual AnnouncementBanner. Two
editors may author primary and optional phone messages. Existing hosts with broad
legacy CSS may isolate the actual web bundle in a scoped document as Studio does;
never duplicate the editor or import a different implementation for its showcase.

`pnpm verify:web:marketing` covers actual 320/375/390/747/950/1024/1200/1661 layouts,
long-title bounds, same-row CTA/label fit, static/no-JS announcement fit, six socials,
continuous gold-only twinkles, stored/OS motion stop, menu hover, selected-word
formatting, Unicode editing, authoring validation/states and small-text warning.
Required release gates also include verify, web forms, full installed package and
public docs checks. Native export checks do not qualify installed device behavior.
