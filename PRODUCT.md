# @bubbasfw/ui

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Shane is the primary user of the public documentation site. He reviews the
design system visually, checks how components look and feel, and identifies
changes. Developers implementing the components are a secondary audience.

## Product Purpose

Provide a public visual workbench for reviewing Bubba’s reusable interface
components, with straightforward implementation guidance for web and Expo.
The component package itself supports React web and native Expo applications.

## Operating Context

The package is public npm software named `@bubbasfw/ui`, licensed under MIT.
The initial `0.1.0` release contains a Button and foundation tokens. This work
expands the shared catalog and provides examples on both supported platforms.
The owner chose GitHub Pages at `handh-dev.github.io/bubbas-ui` for the site.

## Capabilities and Constraints

- Shared components use React Native primitives and NativeWind. Base UI, Radix
  UI, and native HTML tags are excluded from shared component implementations.
- The site prioritizes visual previews, component states and review controls;
  code examples and API guidance support implementation without leading the page.
- Review notes stay in the reviewer’s browser and can be exported. There is no
  public notes service or private application backend.
- The site is a static export. Existing Bubba applications are not migrated by
  this work, and no operational data is fabricated for examples.
- Package and site publication require the owner’s review of the concrete result.

## Brand Commitments

Use the existing Bubba’s identity and the current Brand Studio foundations.
Studio owns the approved source catalog; consumers adopt pinned releases.
The current working system supplies light and charcoal dark interface treatments.
The existing website is useful evidence for familiar layout and interaction
patterns, not authority to redistribute every recovered asset.

## Evidence on Hand

Brand Studio’s approved brand release is `1.0.0`; its current interface token
baseline is `0.3.0`. Montserrat is cleared under SIL OFL. Original logo geometry
has a separate owner-assurance notice. Commercial display fonts, mascot artwork,
and unreviewed recovered website artwork are not included in public downloads.

## Product Principles

- Make real component appearance and behavior easy to inspect.
- Keep web and native examples aligned with the package’s actual APIs.
- Preserve brand identity and distinguish visual approval from distribution rights.
- Explain implementation at the point where it helps a reviewer or developer.
- Keep public demonstration content independent of private operational facts.

## Accessibility & Inclusion

Preserve accessible labels, visible keyboard focus, meaningful control states,
readable contrast, reduced motion, and minimum touch targets. Bundle compatibility
does not establish native simulator, device, or assistive-technology acceptance.
