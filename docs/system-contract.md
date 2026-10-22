# Bubba’s system contract

Brand Studio owns approved identity, original assets and canonical foundations.
`@bubbasfw/ui` implements universal React Native + NativeWind components and
shared task patterns. Apps own their data, authorization, routing, persistence,
business rules and native/service boundaries. No consumer reaches a Studio
runtime or imports a mutable sibling checkout during its build.

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
