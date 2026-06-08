---
sidebar_position: 2
title: The 8 Commands
---

# The 8 Commands

Each command in `SKILL.md` is self-contained and carries self-reflection notes (`▸`) — the failure modes learned while building the system. Honor them.

## 1 · `new` — scaffold a deck

Create a `<deck>/slides/` folder, copy/link `clippyslide.css`, seed slide 1 from the closest `assets/examples/*.html`. One slide = one HTML file.

> ▸ Start from the closest **example**, not a blank file — the glow/border recipe is easy to get subtly wrong from scratch.

## 2 · `extract` — pull tokens from a `.pptx`

```bash
python scripts/extract-tokens.py <ref.pptx> --slide 3 --out tokens.json
```

Returns canvas size, theme palette, top colors, **unique gradients with stops + alpha**, and per-slide text.

> ▸ Copy locked files first; gradient `pos`/`alpha` are in 1/1000 % (`48000` = 48%); the "dark navy panel" is almost always a **bright color at ~10% alpha**, not a real navy.

## 3 · `theme` — apply / swap the token set

Re-skin by editing the CSS `:root` vars (or regenerating from a new `tokens.json`). All components derive from the four-color ramp + gradients, so a palette swap cascades.

> ▸ Keep the **profiles in sync** with the CSS — they are the contract other tools read.

## 4 · `add-slide` — add a slide of an archetype

Copy the archetype's example, swap content, keep the `.cs-stage` wrapper and component classes. Map content to components: pills, tiles, env cards, health bar, side panel.

> ▸ Respect ≥0.5in edge margins; only the coral accent bar may bleed off-edge.

## 5 · `render` — HTML → PNG

```powershell
pwsh scripts/render.ps1 -Path <file-or-folder> -All -Width 1280 -Height 720 -Scale 2
```

> ▸ Edge is usually already running → **must** use an isolated `--user-data-dir`; the `--screenshot` path **must** be absolute; URL-encode spaces; the Playwright MCP browser fails here — use this Edge-headless path.

## 6 · `validate` — run the QA checklist

Render, then check every item in the profile's `qa:` list (pure-black bg, gradients read as gradients ~1.6–2px, inner radial glow present, AA contrast, even grid, **zero emoji**). Run a **fresh-eyes visual sub-agent** — you see what you expect, not what's there. Then fix → re-render → re-check (at least one full cycle).

> ▸ The known trap is **low-contrast dark cards on black** (brick-red dev cards). If a fill is near-black, lighten the gradient's bright stop or add a subtle stroke.

## 7 · `export` — deck → standalone HTML or `.pptx`

- **HTML** — concatenate slide stages into one paged document with the CSS inlined.
- **`.pptx`** — rebuild via pptxgenjs using `clippyslide.theme.xml`; gradient borders → DrawingML `gradFill` line, panel fill → 10%-alpha `path="circle"`.

> ▸ PowerPoint has no CSS `background-clip:text`; render gradient titles as a gradient fill on the text run, or fall back to flat `#CA5BCD`.

## 8 · `present` — presenter mode

The canonical present path is the [**viewport-grid presenter**](/presenter/overview) (`presenter/present.html`): full-bleed slides + one floating header layer, no chrome. Alternatively, hand off to the [TileSlide AC extension](/extension/coe-theme) for live, editable Adaptive-Card decks in the same look.

> ▸ Keep the presentation layer clean — slide owns the screen, the header floats and fades. Don't reintroduce a sidebar/status/toolbar.

---

## Environment gotchas

Carried from the build, these live at the bottom of `SKILL.md`:

- **No LibreOffice** — use `pptx-to-png.ps1` (PowerPoint COM) for `.pptx`→PNG.
- **Locked source files** — `Copy-Item` to scratch before reading/zipping.
- **Edge headless** is the reliable HTML→PNG path; isolated profile + absolute screenshot path.
- **Zero emoji**, ever. High contrast. Premium, dark, restrained.
