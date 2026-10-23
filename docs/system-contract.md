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

### Website page compositions — proposed 0.8.3

`LocationSearch` is a controlled city/ZIP field with combined search and optional
device-location actions. Apps own lookup, geolocation permission, validation,
loading, errors and result announcements. Enter submits through the supplied
action. Dynamic validation/permission errors announce politely while preserving
the query and focus. Busy states prevent duplicate searches and location requests.
The visible field label includes the shared brand-red location pin. Optional
descriptions and result labels render only when supplied.

`LocationCard` / `LocationGrid density="compact"` show supplied addresses, published
hours, independently qualified status, optional local distance and phone, and
real direction/call links. Missing phone/distance/status stays absent. Four columns
fit a 1099px viewport; narrower containers wrap the facts. Address, hours/status
and phone facts have leading icons. Blue direction and red phone icon actions
keep 44px targets, store-and-address accessible names and tooltips. An optional
bright feature badge uses caller-supplied text rather than inferred capabilities.
The prior default and normal marketing card variants are preserved.

`LocationMap` wraps an app provider or fits supplied verified location pins using
Web Mercator raster tiles. Apps choose the provider URL and visible linked
attribution; the shared component neither fetches Core nor receives visitor
coordinates. Only measured visible viewport tiles are requested; there is no
prefetch/offline store. Respect the selected provider's current policy, default
browser caching and referrer. Automated checks stub provider imagery. Marker
links have explicit direction labels and only fully visible targets are focusable.
Each fully visible store retains a separate 24px transparent link target centered
at its exact supplied geographic coordinate. The only marker paint is a 10px
brand-red dot. No allocator, displaced target, leader, icon, cluster, tooltip or
visible text label changes that location. Close and coincident dots intentionally
overlap, as requested by the owner; every individual link remains in keyboard
order with a store-specific accessible name and Enter destination. Visible focus
rises above overlapping targets without moving the dot. The adjacent directory
retains full-size individual direction/call actions as the complete alternative.
Small bottom-right zoom/fit controls and minimal required bottom-edge attribution
remain in the map. Raster tiles alone are grayscale.
Wheel zoom anchors at the pointer, pointer/touch drag pans, arrows pan, and Home
restores all-store bounds. Map gestures retain page position; wheel input at a
zoom limit can continue to scroll the page. Explicit controls remain available
for keyboard and touch users. Loading and partial tile failure are explicit; Retry map
retries current failures. Server/no-script output requests no guessed viewport
tiles and points to the always-readable location directory. Native retains a
direction-link fallback.

`LocationHours` renders app-supplied dates and explicit labels. The app selects
today plus the following nine calendar dates in the business timezone, advances
the window at the local day boundary, and retains Core's unverified/missing
distinction. The component does not infer opening or merge reported Stand Status
with published hours. The default heading is “Store hours”; dates are brand red
and time labels bold. Description and source labels are optional caller data,
with no default helper copy or inferred timezone statement.

`FAQSection` uses the real shared Accordion with full-width, wrapping questions,
visible focus, 44px minimum targets and expanded/controlled-panel semantics.
Its opt-in progressive enhancement keeps every answer in server/no-script
content; browser hydration then enables single-open disclosure. Default Accordion
and native disclosure remain compatible. `SafetySection` groups numbered rules
in a consistent readable grid with an optional separate information column.
Hosts supply reviewed safety wording and business/policy destinations.

`FeaturedProductRow` limits the supplied selection to four compact cards. Apps
own their ranking and identity; the component creates no best-seller claim.
`OfferGrid` supplies equal-height social, guarantee and review compositions with
light-blue social/fountain fields and a white guarantee field. Social/review cards
have no decorative fallback when caller artwork is missing; the guarantee uses
original bold blue/red/white/navy money geometry. Caller `artwork`, optional
natural `aspectRatio`, and `artworkHref` supply linked images with contain scaling.
When any offer uses caller art, a shared top-right art row (up to 144×128,
matched to the tallest supplied image/money motif) across the whole group keeps
images readable and titles/body clear at 320px; complete titles
use the following full-width row. No aspect ratio crops or tints the source.
CategoryGrid already accepts SectionImage for approved category art; no
Hero/Campaign API changes are needed. Cleared app assets remain app-owned.
`UIReviewCatalog offerExample` forwards caller-owned review content and art to
both actual OfferGrid variants, without embedding those inputs in the package. No
private original bytes enter this public package. Legacy Pop-It/fountain Icon
names remain compatible but are not new default offer/specimen presentation. A shown
Instagram mark is a caller-supplied link. Headings, terms and optional actions
remain caller data. `ReviewLocationLinks` presents a responsive grid of supplied
store-specific review destinations and optional address labels. Neither section
infers reviews, offers or business claims. They do not share legacy app selectors.

`ContentSection titleVisibility="hidden"` retains one semantic route heading
with a compact transparent content region. It removes the visual marketing
title band without requiring a consumer style override.

`SiteHeader` optionally hides social links and menu motion controls. The footer
keeps the existing shared motion setting. `announcementScrollBehavior="hide"`
follows the scroll position with a compositor translation clamped to the measured
announcement height. It never mutates the layout box, so a fixed host keeps one
stable measured spacer without scroll feedback. Opening the navigation resets
the translation; reduced/manual motion-off retains the static header. No easing,
scroll handler layout reads, or React state updates occur on animation frames.
No-social marketing headers use compact navigation at 1000px and above, including
1099px; a measured width check collapses unusually long links when they cannot
fit. Brand, navigation and actions retain explicit grid columns; actions keep
their intrinsic width when navigation is hidden, so a mobile-to-desktop resize
can restore the full navigation without fit-measurement feedback. Verify that
transition on one mounted header, with working controls and no page reload.
Other header variants retain their original breakpoint. A fixed web host
must keep the outer mount transparent with `pointer-events:none` and use
`ThemeProvider surface="transparent" pointerEvents="box-none"`; the shared scope
also passes pointer events through while the actual header remains interactive.
This prevents the untranslated outer layout box from painting or intercepting
content below a collapsed announcement. Check actual painted content and pointer
hits immediately below navigation, not just its transform. Default header
behavior is unchanged.

The new sections have stable actual-package `SectionDemo` / review catalog IDs,
consumed unchanged by docs, both self-contained examples and isolated Studio
review. The map catalog renders that actual implementation with synthetic local
SVG grid tiles, close exact-coordinate dots and zoom/fit; no
external tile provider or real business facts enter the specimen.
`pnpm verify:website:sections` covers narrow/wide bounds, four directory columns
at 1099px, equal offer rows, linked social/review destinations, search Enter, FAQ
keyboard/no-script, scroll invariance and painted content below the header,
reduced motion, painted dots at all sixteen actual coordinates, intentional
coincident overlap with individual keyboard destinations, wheel/pointer/touch/keyboard map gestures, announced search errors and
mocked-provider loading/failure/retry. These shared checks do not establish
consumer deployment, native device acceptance or owner approval.

Compatible primitive extensions support these compositions: `Icon color={null}`
preserves multicolor original geometry; `Link contentLayout="block"` accepts rich
RN content; `Badge leading` and `FormField labelLeading` accept decorative icons
while preserving existing text-label associations. Their omitted/default behavior
is unchanged. New Lucide geometry uses the existing pinned MIT source, and original
motif sources/notices remain in the package's icon custody manifest.

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
  logo, let campaign badges wrap into centered rows when available width is tight, use the responsive
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
The full copy remains its accessible label. A conservative uppercase advance
estimate for approved Montserrat supplies the CSS fallback before hydration/without JavaScript, including long copy. There is no
minimum font-size floor that could force text outside its band. Reviewed concise
seeded phone/desktop messages remain at least 11px; native uses static text.
Measured fitting and the editor warning use the actual computed font size after
font loading, content changes and container resizes, regardless of stylesheet
order. Content is never silently removed or invented.
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
It also checks the actual computed and reported font sizes, text-range containment
for the 85-character seed and near-160-character custom messages, both stylesheet
orders, standard and opaque classic-script hydration, delayed fonts, content
changes, resizes, no-JavaScript fallback, gold paint and positive boundary spaces.
Required release gates also include verify, web forms, full installed package and
public docs checks. Native export checks do not qualify installed device behavior.

### Campaign badge containment — candidate11 local revision

CampaignSection keeps all supplied badges visible without a horizontal scroll
region. Its shared React Native Inline wraps naturally within the actual container;
wide layouts keep one row when the labels fit. Each badge is bounded to the row
width and its full label may wrap, including an unusually long word. Text retains
the existing readable caption size; nothing is truncated or hidden. This supersedes
the earlier single scrollable rail direction. The real catalog uses realistic
long synthetic labels. Extracted-package browser checks measure every badge and
every painted text range at narrow/wide and nested widths and enlarged text.

### FocusMarquee — candidate11 local review

FocusMarquee combines caller-supplied campaign facts in one solid brand-red band
with white pills and brand-navy text. It replaces the separate campaign badge row
and flag ticker in the requesting website, while those existing exports remain
backward compatible. No stars, separators or gradient enter the new component.

`items` is readonly plain text; no links or input controls are accepted. `speed`
is constant CSS pixels/second (default38, bounded0–240; zero is static), `direction`
is left/right, and `spacing` is the minimum visible edge gap, including the
last-to-first seam (default8px,0–96). Each wrapper reserves its pill’s maximum
scaled width; away from center the visible gap is larger.
`badgeAppearance` selects sm/md, pill/rounded and navy/red text. `centerEmphasis`
selects scale1–1.35(default1.12), lift0–16px(default4), and range0.1–1 of viewport
width(default0.5). Nonfinite values use defaults. These are shared presentation
options, never app-local overrides or business rules.

The measured repeating web lane moves continuously in either direction, including
while hovered. Pills smoothly scale/lift as their actual centers approach the
viewport center. A measured final gap and enough repeated groups cover the
viewport plus a complete loop. Layout is measured on initial render, container or
font changes; animation frames only write transforms using cached geometry.
Hidden documents and offscreen instances suspend frame work and resume without
catching up elapsed hidden time. Cleanup cancels frames, observers and listeners.

One canonical copy remains semantic. Every moving copy is decorative, hidden from
assistive technology and pointer-free. Motion off, OS reduced motion, no JavaScript
and native show the complete centered wrapping static copy without horizontal
scrolling. The existing global MarketingMotionControl remains the discoverable
manual control. Native intentionally uses this real static adaptation; native
animation/device acceptance is outside the web revision. Very long pills wrap
within their viewport; vertical inset reserves peak emphasis so nothing clips.

### FocusMarquee spring handoff — candidate14 local revision

The owner superseded continuous ticker pacing with a pop/stretch handoff rhythm.
`motion="spring"` is now the default: one fact is centered and readable, then the
next arrives with a brief stretch/pop as the outgoing pill compresses and gives
way. Each handoff has one small bounded overshoot and settles with zero-velocity
endpoints. `cadence` is seconds per fact (default2.30, bounded0.8–3); travel takes
2.16s by default, ending with a0.12s settle and a short0.14s centered rest. Distance and velocity vary
with label widths; cadence is the same per fact. `spring="poppy"|"gentle"` chooses
a bounded presentation preset, rather than exposing physics internals.

`motion="linear"` retains continuous px/second motion through the existing `speed`
option (default38). Positive speed is intentionally ignored by spring cadence;
`speed={0}` remains an explicit static fallback in either mode. Live linear speed
and direction stay position-continuous; spring direction is chosen at the next
handoff and cadence updates apply to the next cycle, preserving the drawn phase.

Spring default center emphasis is1.16 with peak transient horizontal stretch×1.06
and a short outgoing nudge≤2px. Optional existing centerEmphasis settings remain;
Maximum combined scaleX/Y and nudge are reserved before measuring the repeating
group; blur is decorative and adds no horizontal gap. Vertical inset also reserves
lift and filter spread. Configured spacing remains a minimum visible edge gap.
Long pills are capped using the complete peak footprint so their full text can
reach center without clipping. Empty/single/two-item sequences use the same loop.

`edgeBlur` is0–4px (default1). Only decorative moving pills soften gradually in
the outermost25% of the center-to-edge distance; the central region stays crisp. No filter touches canonical copy.
Stored/OS motion-off, no-JavaScript and native show every fact once in clear
centered wrapping pills. Cleanup removes transforms and filters, and hidden/offscreen
time never accumulates motion energy or a queue of missed facts. Initial animated
activation waits for the actual font; later resize/font changes retain drawn
position and retarget the next logical fact. Animation frames use cached geometry
and write transforms/filters only. Brand red, white/navy pills and caller-owned
facts remain unchanged, with no stars, endcaps, gradient or decorative separators.

### FocusMarquee fast flow — candidate15 local revision

Owner review shortened the centered rest, reduced actual reserve-driven gaps and
softened only the far edges. The default0.9s cadence keeps a0.14s quiet center
rest,0.76s travel and a0.12s settle tail with≤5px overshoot. Gentle uses smaller
stretch/nudge/overshoot. No visible-count cap or smaller type is introduced.
Actual extracted-package comparisons with candidate14 verify shorter observed
stationary time, smaller painted gaps and softer blur, alongside order, complete
text, composite maximum-footprint separation and lifecycle/static contracts.
This is a local proposal; owner approval and release remain separate.

### FocusMarquee slightly eased flow — candidate16 local revision

The owner asked to ease15’s speed back, then a further small amount after a
1.05s local draft. Only the default cadence moves
from0.90 to1.20s per fact:1.06s travel plus the same0.14s quiet rest and0.12s
settle tail. Density, type, pop/stretch, overshoot, soft edges, complete fallback
and customization are unchanged. Actual original-package comparisons with15
verify a longer per-fact interval while preserving the short observed rest.
Publication and deployment remain paused.

### FocusMarquee exact owner cadence — candidate17 local revision

The owner then specified an exact1.80 seconds per fact. Shared default and
nonfinite fallback now use1.80s:1.66s travel with the same0.14s quiet rest and
0.12s settle tail. Every15 density, type, blur, geometry and pop/stretch setting
remains unchanged. Prior16 original and1.05/1.20 drafts remain historical; this
is a new local proposal with original-package timing proof. Release stays paused.

### FocusMarquee live tuning — candidate18 local baseline

`FOCUS_MARQUEE_DEFAULT_CADENCE` is the single shared default (2.3 seconds per
pill), reused for the component default, nonfinite fallback and actual catalog
state/label. Explicit `cadence` props update at the next handoff without remounting
or resetting motion. The existing Input/FormField in the real FocusMarquee
specimen edits that prop live: finite0.8–3 drafts apply, empty/invalid/out-of-range
drafts show an associated error and retain the last valid cadence. Appearance
changes preserve the draft. This is a local example control, not persisted Core
configuration or a production customer setting. Static/reduced-motion/native
content remains complete and clear while the example field stays usable.

Once this baseline is frozen, local input/DEV website query tuning can change the
prop without package edits, repacking or a new release cycle. Apps own any local
DEV query parser and identical SSR/hydration props; production must ignore that
DEV override. A chosen final motion version still needs a frozen review and the
owning release gates. Full release/Expo/Core/HQ/recovery qualification is deferred
while motion is being tuned; focused local evidence does not claim those gates.


### FocusMarquee motion lab — local tuning

The local raw-HTML lab controls the actual shared `FocusMarquee`; it does not
copy its motion or markup. Production adoption, publication and deployment
remain paused. Existing frozen candidate18 previews/artifacts stay unchanged.

`timing` exposes four sequential stages in seconds: `hold` is the centered quiet
rest; `exit` moves the lane through the first half of the next handoff; `enter`
finishes approaching the next fact; `settle` returns the small overshoot to center.
Both moving halves share one lane and a matching midpoint velocity, rather than
independently animating two pills. The cycle total is their sum. An explicit
`timing` object takes precedence over `cadence`; omitted values derive from the
legacy cadence, and omitting `timing` retains the existing 2.3-second default
and trajectory. At default cadence the stages are .14/1.02/1.02/.12 seconds.
`hold` clamps to0–5, `exit`/`enter` to .05–5, and `settle` to0–3. Thus all-zero
input still has a finite .1-second cycle. A zero settle disables positional
overshoot, avoiding a jump at arrival. Nonfinite values use stage defaults.
Timing and overshoot edits latch at the next cycle without remounting or jumping
the current track position. Direction changes select the next handoff; visual
geometry edits remeasure the existing lane.

`springTuning` overrides the chosen spring preset: `stretch`0–.5 (default .06),
`squash`0–.5 (.03), `overshoot`0–48px (5), `popLift`0–48px (6), and `nudge`0–24px
(2). Gentle defaults remain .03/.015/3/3/1. Overshoot additionally stays within
20% of the actual handoff distance; its default remains within4%. Endpoint
velocities are zero; the departure/approach join is continuous and monotonic.
`edgeBlur` accepts0–8px; `edgeBlurStart`0–1 (default .75) chooses where softness
begins as a fraction of center-to-edge distance, with1 keeping the lane crisp.
`centerEmphasis.scale` supports1–1.8 and `lift`0–48px; range, badge appearance,
spacing and direction retain their existing meanings. These are presentation
props, not persisted business data or Core settings.

Maximum horizontal stretch+nudge and vertical squash rebound+lift+blur spread
are reserved before measuring the repeating groups. Zero blur/overshoot/stretch/
squash/pop/nudge are valid neutral settings. Static, no-JavaScript, OS/manual
motion-off and native retain every fact once, clear and wrapping. Hidden time
never catches up; geometry stays cached during frames. The lab may use ordinary
HTML sliders outside `packages/ui`; shared UI remains React Native/NativeWind.
Focused package/type and actual browser tuning checks qualify only this local
experiment; full release/native/Core/HQ/recovery gates remain deferred.

### Selected campaign presentation — local selection20

`FOCUS_MARQUEE_CAMPAIGN_PRESET` exports the owner-selected presentation only:
1.1s hold, .25s exit, .25s enter, .04s settle (1.64s total), 1px minimum gap,
1.5px edge blur from .75, md rounded navy pills, 1.16 focus scale/4px lift/.5
range, and spring stretch .06/squash .03/overshoot4/popLift3/nudge4. Direction
is left; linear speed remains38. Spread it into the actual component:

```tsx
<FocusMarquee {...FOCUS_MARQUEE_CAMPAIGN_PRESET} items={callerOwnedFacts} />
```

The primary shared specimen and local lab defaults/Reset use that same preset.
The lab retains existing browser-local settings; its six sample labels and950px
preview width are local metadata, not package facts. Generic omitted-timing
behavior and `FOCUS_MARQUEE_DEFAULT_CADENCE` remain2.3s, shown as a separate
comparison. No engine change or publication/deployment is part of this selection.

### Sparkler offer composition — local candidate21

`PromotionBanner variant="marketing" emphasis="sparkler"` owns the solid brand-blue
panel, existing metallic product badge for the eyebrow (without its optional static icon), white title with a gold second line, optional original art,
and the white/navy action on a gold-edged red lower sweep. Supply `title`,
`titleAccent`, `eyebrow`, `description` and `action`; apps retain the offer facts
and actual destination. The default generic promotion remains unchanged.

Optional `artwork` is caller-owned `{uri, alt, aspectRatio, rotation}`. Supply the
original width/height ratio and orientation in degrees; the component contains
it without stretching/recoloring its source. Decorative offer art is hidden from
assistive technology because the heading/body carry the offer. Invalid or nonfinite
ratios use a square fallback; nonfinite rotations use zero degrees. Missing/failed art
retains complete text and action and opens the description width. No required
business content belongs only in artwork. The responsive composition adapts to
its own container, including narrow cards inside desktop layouts; the call to
action stays after the copy with a full target and visible keyboard focus.

`UIReviewCatalog` and `SectionDemo` accept `promotionExample` caller fixture data
for the same actual component. Public defaults contain synthetic text and shared
icons only. Private caller assets never enter the universal package, public
catalog or generated artwork; selecting an asset does not change its catalog
approval or redistribution rights. Existing gold twinkles follow manual/system
motion preferences; the art, copy and action remain usable with no JavaScript.
Use `node scripts/verify-promotion.mjs` for focused shared checks; optionally pass
an external `PROMOTION_ARTWORK_PATH` and `PROMOTION_EVIDENCE` for private proofs.
Local preview qualification does not grant publication or deployment approval.


### Sparkler offer deal badge — local candidate23

The supplied offer eyebrow reuses the exact `MarketingProductBadge` used by
product cards/details: metallic gold paint, shared moving gleam and gold twinkles.
The internal badge’s optional `icon` defaults to true for existing products; the
sparkler offer explicitly passes false, preserving the owner’s no-static-icon
choice. No new badge paint/effect implementation or consumer override is added.
The existing manual/system motion preference disables both gleam and twinkles.
Bright blue, caller-owned artwork, headline/body/action and selected20 marquee
remain unchanged. Original22 stays immutable; local preparation is not release.


### Larger offer badge — local candidate24

`MarketingProductBadge` adds a reusable `size="lg"` option, used by the actual
sparkler offer and therefore its same-component catalog example. The default
`sm` retains existing product badges unchanged. Large uses 16px text / 20px line
and 12px horizontal / 8px vertical padding (36px height); in a containing inline
size of at least440px it uses 18px / 24px (40px height). This lets the offer badge
read at the supporting-copy scale, while the headline remains dominant. Native
uses the real 16px/36px base adaptation; this local web check does not qualify
native devices. Metallic paint, moving gleam, gold twinkles and motion preferences
are the same existing implementation, with no static icon in the offer.
All other23 composition and selected20 marquee settings remain unchanged;
original23 stays immutable, publication/deployment remain paused.
