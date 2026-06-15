---
name: "clippyslide"
description: "Build ClippyFlow-first slide decks, diagrams, and HTML presentation artifacts in the ClippySlide design system. USE WHEN: the user wants premium dark agentic slides with a deep-navy spectrum canvas, translucent cards, spectrum title text, nitrous-blue structure, or a reusable slide design framework. Legacy CoE extraction assets remain available under clippyslide-legacy names."
---

# ClippySlide

A design-system skill for producing the **ClippyFlow** default ClippySlide look:
deep-navy spectrum canvas, translucent navy cards, spectrum-gradient titles, and
one electric nitrous-blue accent for structure.

The governing principle: **use ClippyFlow by default.** The original CoE OOXML extraction
remains available as legacy reference material, but new work should start from the
ClippyFlow profile and `cf-` components.

## Skill assets (in this skill folder)

- `assets/clippyslide.css` -- the default ClippyFlow component library. Link this in every slide HTML.
- `assets/clippyslide.tokens.json` -- machine-readable ClippyFlow tokens.
- `assets/clippyslide.theme.xml` -- OOXML-adjacent ClippyFlow theme projection.
- `assets/clippyslide.profile.yaml` -- the ClippyFlow authoring contract + QA checklist + command surface.
- `assets/clippyslide-legacy.*` -- preserved CoE / TileSlide extraction artifacts.
- `assets/examples/*.html` -- ClippyFlow reference slides (title, orchestration, lifecycle, spectrum board).
- `scripts/extract-tokens.py` -- OOXML gradient/token extractor for any reference `.pptx`.
- `scripts/render.ps1` -- HTML->PNG via Edge headless (working invocation baked in).
- `scripts/pptx-to-png.ps1` -- reference `.pptx`->per-slide PNG via PowerPoint COM.

**Always read `assets/clippyslide.profile.yaml` first** -- it is the single source of truth for
tokens, components, archetypes, and the QA checklist.

## The design system (summary -- full values in the profile/tokens)

| Element | Value |
|---|---|
| Canvas | deep-navy spectrum, 16:9 (1280x720) |
| Spectrum | cyan / blue / purple / magenta / green brand hues |
| Nitrous | 214deg blue for structure: rims, dividers, focus rings, scrollbars |
| Title text | cyan to nitrous to purple to magenta, weight 800 |
| Panels | translucent navy surfaces with nitrous or spectrum rims |
| Health bar | magenta to purple to nitrous to cyan to green |
| Env cards | Dev = magenta spine, Sandbox = nitrous spine, Prod = green spine |
| Type | Segoe UI Variable; section sub-heads get a nitrous rule; no underline on display titles |

Six archetypes cover a full deck: `title`, `panelGrid`, `orchestratorDiagram`,
`contentPanel`, `lifecycleHealthBar`, `ctaBootcamp`.

## Core workflow (the exact steps this skill automates)

1. **Read the ClippyFlow profile.** Start with `assets/clippyslide.profile.yaml`.
2. **Author slides as HTML** that `<link>`s `clippyslide.css` and composes `cf-` components.
3. **Render** to PNG: `pwsh scripts/render.ps1 -Path slides -All`.
4. **Validate** against the profile checklist: spectrum background, translucent surfaces,
   visible nitrous structure, AA contrast, no emoji, no nitrous data fills.
5. **Use legacy extraction only when requested.** The CoE extractor and legacy profiles are
   preserved for reference-deck reproduction work.

---

## The 8 commands

Each command below is self-contained. Reflection notes capture the failure modes
learned while building the system -- honor them.

### 1. `new` -- scaffold a deck from an archetype
- Create `<deck>/` with a `slides/` folder; copy or link `assets/clippyslide.css`.
- Seed slide 1 from the closest ClippyFlow example in `assets/examples/*.html`.
- Pick archetypes from the profile; keep one slide = one HTML file.
- Reflect: start from an example, not a blank file; the spectrum/nitrous balance is easy to overdo.

### 2. `extract` -- pull tokens from a reference `.pptx`
- Legacy path: `python scripts/extract-tokens.py <ref.pptx> [--slide N] --out tokens.json`.
- Returns canvas size, theme palette, top colors, **unique gradients with stops+alpha**, and
  per-slide text. Use `--slide N` to focus the signature slide.
- Reflect: copy locked files first; gradient `pos`/`alpha` are in 1/1000 % (48000 = 48%);
  the "dark navy panel" is almost always a **bright color at ~10% alpha**, not a real navy.

### 3. `theme` -- apply / swap the token set
- To re-skin: edit the CSS `:root` vars. Components derive from the spectrum, nitrous,
  surface, gradient, and typography tokens, so a palette swap cascades.
- Reflect: keep the profiles in sync with the CSS; they are the contract other tools read.

### 4. `add-slide` -- add a slide of a given archetype
- Copy the archetype's example, swap content, keep the `.cf-stage` wrapper + `cf-` components.
- Map content to components: pills, tiles, env cards, health bar, panels, chips, and agent cards.
- Reflect: respect the stage margins; only the spectrum accent bar may bleed off-edge.

### 5. `render` -- HTML -> PNG
- `pwsh scripts/render.ps1 -Path <file-or-folder> [-All] [-Width 1280 -Height 720 -Scale 2]`.
- Reflect: Edge is usually already running -> MUST use an isolated `--user-data-dir`; the
  `--screenshot` path MUST be absolute (`$PWD`); URL-encode spaces (`OneDrive%20-%20Microsoft`);
  Playwright MCP browser fails here -- use this Edge-headless path.

### 6. `validate` -- run the QA checklist
- Render, then check every item in the profile's `qa:` list (deep-navy spectrum background,
  translucent surfaces, visible nitrous structure, no nitrous data fills, AA contrast, **zero emoji**).
- Run a **fresh-eyes visual sub-agent** (e.g. via the task tool) -- you will see what you expect,
  not what is there. Then fix -> re-render -> re-check (at least one full fix-and-verify cycle).
- Reflect: the known trap is **low-contrast dark cards on navy**. If a
  fill is near-black, lighten the gradient's bright stop or add a subtle stroke.

### 7. `export` -- deck -> standalone HTML or `.pptx`
- HTML: concatenate slide stages into one scrollable/paged document with the CSS inlined.
- `.pptx`: rebuild via the `pptx` skill / pptxgenjs using `clippyslide.theme.xml` as the color
  scheme; spectrum and title gradients need DrawingML equivalents.
- Reflect: PowerPoint has no CSS `background-clip:text`; render gradient titles as the gradient
  fill on the text run or use a high-contrast brand fallback.

### 8. `present` -- presenter mode
- Open the viewport-grid presenter or exported standalone HTML full-screen.
- The TileSlide Adaptive-Card extension remains available for legacy CoE decks.

---

## Environment gotchas (carried from the build)

- **No LibreOffice.** Use `pptx-to-png.ps1` (PowerPoint COM) for `.pptx`->PNG.
- **Locked source files.** `Copy-Item` to scratch before reading/zipping.
- **Edge headless** is the reliable HTML->PNG path; isolated profile + absolute screenshot path.
- **Markdown image embeds** render only from the Clawpilot workspace dir and need URL-encoded
  spaces: `![x](file:///C:/Users/dayour/OneDrive%20-%20Microsoft/Documents/Clawpilot/...)`.
- **Zero emoji**, ever. High contrast. Premium, dark, restrained.

## Standing rigor

For any non-trivial visual work, consult `dayour-design` (visual critique) and `dayour-swe`
(implementation/architecture), **self-reflect on every render**, present an updated version, and
keep the bundled profiles authoritative.
