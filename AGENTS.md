# Contributor and agent guidance

- Coding start: run `2brain` where available. Wstack project context is in w.md.
- Keep shared UI entirely on React Native universal primitives and NativeWind.
  Do not introduce HTML primitives, Base UI, or Radix UI into packages/ui.
- Keep React, React Native, React Native Web, and NativeWind external to builds.
  Preserve source scanning, JSX runtime interop, client boundaries, and matching
  ESM/CJS declaration exports when changing package configuration.
- Use pnpm and the committed lockfile. Run applicable build/typecheck and real
  consumer checks. Build success does not establish native device acceptance.
- Brand Studio owns approved sources. Preserve source pins; never add restricted
  fonts or artwork, secrets, credentials, or private source catalogs to this
  public repository or package. Code license and trademark rights are distinct.
- Read docs/system-contract.md before design changes. Immutable public-safe
  foundations live in packages/ui/foundations; refresh with sync:foundations,
  never hand-edit src/tokens.ts. Build checks reject stale outputs, rights or
  digest drift. Reuse/extend shared components and patterns, integrate the
  requesting app, and update canonical showcase/examples/reference together.
- Publishing requires owner review. No automatic npm publication on push/merge.
- Preserve other contributors’ changes. Use implementation subagents and a fresh
  independent read-only review for code changes while Wstack is active.
- Browser automation reuses available browser tools. Project Playwright checks
  use bundled Chromium or Chrome for Testing, close browsers in finally, and
  preserve normal user browser profiles. Do not launch installed Google Chrome.

<!-- wstack:begin setup -->
Wstack project notes → [w.md](w.md).
<!-- wstack:end setup -->

<!-- bubba-design:begin -->
Bubba’s design work: load the installed `bubba-design` skill before changing UI,
brand, components, social/print compositions or their guidance. Its maintained
source is `handh-dev/bubbas-brand-studio/skills/bubba-design/SKILL.md`.
Reuse/extend the shared system, pin reviewed exports, integrate this app, and
update shared examples/contracts. Preserve Core boundaries and artwork rights.
<!-- bubba-design:end -->

## Current shared web release

Read [the exact 0.7.0 release record](docs/releases/0.7.0.md) before changing a pin
or claiming adoption. Published 0.6.0 is deprecated for dropped web Button caller
styles and remains immutable. The 0.6.1 style-forwarding fix remains preserved
in the owner-reviewed 0.7.0 marketing revision. Run `pnpm verify:web:forms` for the separate SSR,
RTL, caller-style, state and form contract as well as applicable package/font,
installed-consumer and docs gates. A gallery build alone does not cover it.
Repository docs may clarify historical candidate wording retained inside a
published archive; never repack/replace an already-published version. App pins,
app deployment and live acceptance stay in their owning repositories.
