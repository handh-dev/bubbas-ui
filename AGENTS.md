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
