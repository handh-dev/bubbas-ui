# Foundation provenance

Brand Studio owns approved Bubba’s sources. This package pins values at build
and release time; it has no runtime dependency on Studio or a private backend.

| Source | Version | SHA256 |
| --- | --- | --- |
| `bubbas-brand-studio/tokens/brand.tokens.json` | Brand release `1.0.0` | `4c478d32c7eeedb31de0de77873829a7b327235e301325bacde3dc672534ebc4` |
| Studio public-safe `foundations.json` | System `0.4.0`, owner-authorized scope 2026-10-22 | `256ff37b35361afefaad4655aee5eb5c669901a4a2cd0a829a3953d4abce922f` |

`packages/ui/src/tokens.ts` pins brand colors, spacing, radii, touch targets,
layout and motion plus the complete light/dark semantic role maps. It is generated
from the immutable release in `packages/ui/foundations/`, with file approval,
rights and byte hashes in the original manifest. Source commit:
`eabb939785648624888a35f5f4a8c4d4607fd858`. The lock and package.json metadata
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

Native examples use their platform font until a consuming app loads a licensed
font. The web docs load cleared Montserrat. Font parity must be reviewed in a
consumer after its chosen font is installed.
