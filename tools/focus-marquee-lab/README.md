# Local FocusMarquee tuning lab

From the UI worktree, run `pnpm dev:marquee`, then open
<http://127.0.0.1:8930/> in the Codex browser. Leave this process running while
reviewing. Stop with Ctrl+C; restart with the same command. If needed select a
free port with `MARQUEE_LAB_PORT=8931 pnpm dev:marquee`.

This is a plain HTML developer shell outside `packages/ui`. Its React root renders
**the actual shared source** `FocusMarquee`, `ThemeProvider` and existing motion
preference with the same NativeWind/RNW adapter as the shared web build. It has no
second animation, direct pill transform override, consumer pin, Core connection,
remote assets or server writes. The preview remains visible above the controls.
Existing frozen candidates and other local preview servers are not changed.

- Timing: standing, leaving, entering and settle seconds; the total is derived.
  Leaving and entering are sequential half-lane stages, not independent pills.
  A change takes effect on the next cycle without remounting the component.
- Focus/spring: size, rise, focus reach, horizontal stretch, vertical compression,
  overshoot, arrival pop and outgoing push. Layout: actual gap, size/shape/color,
  direction and responsive width. Edge blur: amount and where softness begins.
- Continuous/linear mode enables pixels/second and disables spring-only fields.
- Pause/Play controls only this preview. The plain HTML motion button uses the
  existing shared preference; operating-system reduced motion always wins.
- Sliders and adjacent numeric inputs update props immediately, without a package
  build, repack, commit or server restart. Invalid numbers keep the last valid
  value. The viewport is capped to the browser panel width and reports its actual
  width, so expand the browser to inspect the Wide preset.
- Settings save only in this browser's local storage. Reset restores the current
  2.3-second baseline. Copy/import versioned JSON or copy a local review URL.
  Clipboard/storage failures have an editable textarea/in-memory fallback.
  Labels are plain sample text, one per line, and do not edit business data.

The loopback-only server bundles source in memory at startup and watches source
changes. Reload after changing source; controls never trigger a rebuild. Shared
Tailwind CSS and server-rendered static fallback compile at startup; restart after
changing shared styles/fallback source. Only explicit lab routes are served; no
filesystem browser or write endpoint exists. JavaScript off shows the complete
actual shared component static copy. Assets load locally; an already-open tab
continues working offline.

`pnpm verify:marquee:lab` starts its own temporary loopback server and bundled
Chromium, checks real controls/persistence/import/URL/actual rendering plus
narrow/wide, motion and static fallback, and closes its owned browser/server.
Optional evidence: `MARQUEE_LAB_EVIDENCE=/absolute/path pnpm verify:marquee:lab`.
This focused developer-tool check is not release/native/Core/HQ qualification.
Publication and deployment remain paused until the owner reviews a final design.
