# Foundation provenance

Brand Studio owns approved Bubba’s sources. This package pins values at build
and release time; it has no runtime dependency on Studio or a private backend.

| Source | Version | SHA256 |
| --- | --- | --- |
| `bubbas-brand-studio/tokens/brand.tokens.json` | Brand release `1.0.0` | `4c478d32c7eeedb31de0de77873829a7b327235e301325bacde3dc672534ebc4` |
| Studio public-safe `foundations.json` | System `0.4.0`, owner-authorized scope 2026-10-22 | `87bd2d88507662443d7cc12a63b7c98c5cef6bfc53f43c5c4bc52fd9d65bf18f` |

`packages/ui/src/tokens.ts` pins brand colors, spacing, radii, touch targets,
layout and motion plus the complete light/dark semantic role maps. It is generated
from the immutable release in `packages/ui/foundations/`, with file approval,
rights and byte hashes in the original manifest. Source commit:
`78cb5bd276378e3da138a815859d5948aa4f7a98`. The lock and package.json metadata
pin the same source digest. `pnpm verify:foundations` rejects stale generation,
changed files, invalid contrast, role mismatch and custody drift. The working
interface baseline uses light surfaces and neutral charcoal dark surfaces;
old navy/glow recipes are not the dark interface baseline. A review note in the
workbench does not change or approve Studio source.

## Public docs assets

The shared npm package includes no font or artwork binaries. The docs site
separately includes:

- Montserrat from the cleared original font source, under SIL OFL1.1. The full
  license accompanies it in `apps/docs/public/fonts/OFL.txt`.
- Original wordmark and favicon geometry from approved brand release `1.0.0`,
  under the owner’s public distribution assurance (source evidence S14).
  These are identification assets, not MIT artwork. The public notice is
  `apps/docs/public/brand/NOTICE.txt`; no trademark license is granted.

Eurostile redistribution is not cleared and no font binary is included. Mascot
artwork, generated campaign work, private source catalogs and recovered website
assets marked proposed/unreviewed are excluded. Existing website layout and
interaction patterns informed implementation without copying those artworks.

The Expo example loads the exact cleared Montserrat/OFL bytes already used by
the docs, retained in `examples/expo/assets/fonts/`. Its registered native family
is passed to the shared ThemeProvider font contract. `pnpm verify:fonts` checks
the byte equality and React-to-native-primitive font prop forwarding; it does
not prove native font resolution or paint. The web docs load cleared Montserrat.
Font parity still needs installed consumer review.

The Expo SDK 57 example also contains mechanical static OFL instances at weights
400/500/600/700/900. Their manifest preserves original source/license/output SHA256,
fontTools recipe and PostScript metadata; no original identity asset is edited.
