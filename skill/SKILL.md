---
name: "clippyslide"
description: "Reproduce a premium dark, glowing-gradient-border slide design system (the 'ClippySlide' look, reverse-engineered verbatim from CoE_Framework.pptx) and build decks/diagrams in it. USE WHEN: the user wants slides/diagrams/HTML in the black-canvas + gradient-glow-panel + magenta-gradient-title aesthetic; wants to extract design tokens from a reference .pptx; wants to faithfully replicate an existing deck's design language instead of generic 'vibe-coded' output; or wants a reusable design framework"
---

# ClippySlide

A design-system skill for reproducing the **ClippySlide** look: pure-black canvas,
rounded-rect panels with thin **bright gradient borders that glow**, panel bodies that
glow from within, and **magenta-gradient bold titles**. Reverse-engineered *verbatim*
(real OOXML hex/stop/alpha values — never eyeballed) from `CoE_Framework.pptx`.

The governing principle: **don't guess a design — extract it.** Pull the real reference,
read its tokens from the file, encode them once, then build everything from that contract.

## Skill assets (in this skill folder)

- `assets/clippyslide.css` — the component library (panels, titles, pills, diagram tiles,
  env cards, rainbow health bar). Link this in every slide HTML.
- `assets/clippyslide.tokens.json` — machine-readable tokens (colors, gradient stops, geometry).
- `assets/clippyslide.theme.xml` — OOXML-aligned theme (round-trips back toward PowerPoint).
- `assets/clippyslide.profile.yaml` — the authoring contract + QA checklist + command surface.
- `assets/examples/*.html` — three reference hero slides (title, orchestration diagram, lifecycle).
- `scripts/extract-tokens.py` — OOXML gradient/token extractor for any reference `.pptx`.
- `scripts/render.ps1` — HTML→PNG via Edge headless (working invocation baked in).
- `scripts/pptx-to-png.ps1` — reference `.pptx`→per-slide PNG via PowerPoint COM.

**Always read `assets/clippyslide.profile.yaml` first** — it is the single source of truth for
tokens, components, archetypes, and the QA checklist.

## The design system (summary — full values in the profile/tokens)

| Element | Value |
|---|---|
| Canvas | pure `#000`, 16:9 (1280×720) |
| Blue border | linear 135° `#818EFF → #39B0FF` |
| Hero border | linear 135° `#F77181 → #CA5BCD@48% → #818EFF` |
| Title text | linear 90° `#F77181 → #CA5BCD → #818EFF`, weight 800 |
| Panel body fill | **same border colors, RADIAL, at 10% alpha over black** (the inner glow) |
| Health bar | linear `#E33B3B→#E8932F→#E7D63B→#A9D63B→#22C24E` |
| Env cards | Dev = brick-red gradient, Sandbox = steel-blue, Prod = green-bordered |
| Type | Segoe UI Variable; section sub-heads underlined; **no underline on display titles** |

Six archetypes cover a full deck: `title`, `panelGrid`, `orchestratorDiagram`,
`contentPanel`, `lifecycleHealthBar`, `ctaBootcamp`.

## Core workflow (the exact steps this skill automates)

1. **Ground in the real reference.** Locate the source `.pptx`. If it is open/locked
   (PowerPoint/OneDrive), copy to a scratch path first (`Copy-Item src.pptx scratch.pptx -Force`).
2. **Extract tokens** from the OOXML, not from a screenshot:
   `python scripts/extract-tokens.py scratch.pptx --slide 3 --out tokens.json`
3. **Encode once** into `clippyslide.css` + the JSON/XML/YAML profiles (already bundled;
   regenerate only if the reference's tokens differ).
4. **Author slides as HTML** that `<link>`s `clippyslide.css` and composes the archetype
   components. One file per slide under a `slides/` folder.
5. **Render** to PNG: `pwsh scripts/render.ps1 -Path slides -All`.
6. **QA visually** against the original (render the source with `pptx-to-png.ps1`), run the
   profile's checklist, **use a fresh-eyes sub-agent** for the visual pass, then self-reflect
   and revise. Never declare done on the first render.

---

## The 8 commands

Each command below is self-contained. Self-reflection notes (`▸`) capture the failure modes
learned while building the system — honor them.

### 1. `new` — scaffold a deck from an archetype
- Create `<deck>/` with a `slides/` folder; copy `assets/clippyslide.css` alongside (or link by
  relative path). Seed slide 1 from the matching `assets/examples/*.html`.
- Pick archetypes from the profile; keep one slide = one HTML file.
- ▸ Reflect: start from the closest **example**, not a blank file — the glow/border recipe is
  easy to get subtly wrong from scratch.

### 2. `extract` — pull tokens from a reference `.pptx`
- `python scripts/extract-tokens.py <ref.pptx> [--slide N] --out tokens.json`.
- Returns canvas size, theme palette, top colors, **unique gradients with stops+alpha**, and
  per-slide text. Use `--slide N` to focus the signature slide.
- ▸ Reflect: copy locked files first; gradient `pos`/`alpha` are in 1/1000 % (48000 = 48%);
  the "dark navy panel" is almost always a **bright color at ~10% alpha**, not a real navy.

### 3. `theme` — apply / swap the token set
- To re-skin: edit the CSS `:root` vars (or regenerate from a new `tokens.json`). All components
  derive from the ramp (`--cs-peri/-cyan/-coral/-mag`) + gradients, so a palette swap cascades.
- ▸ Reflect: keep the **profiles in sync** with the CSS — they are the contract other tools read.

### 4. `add-slide` — add a slide of a given archetype
- Copy the archetype's example, swap content, keep the `.cs-stage` wrapper + component classes.
- Map content to components: pills (`.cs-pill.blue/.mag`), tiles (`.cs-tile`), env cards
  (`.cs-env.dev/.sandbox/.prod`), health bar (`.cs-health`), side panel (`.cs-greenpanel`).
- ▸ Reflect: respect ≥0.5in edge margins; only the coral accent bar may bleed off-edge.

### 5. `render` — HTML → PNG
- `pwsh scripts/render.ps1 -Path <file-or-folder> [-All] [-Width 1280 -Height 720 -Scale 2]`.
- ▸ Reflect: Edge is usually already running → MUST use an isolated `--user-data-dir`; the
  `--screenshot` path MUST be absolute (`$PWD`); URL-encode spaces (`OneDrive%20-%20Microsoft`);
  Playwright MCP browser fails here — use this Edge-headless path.

### 6. `validate` — run the QA checklist
- Render, then check every item in the profile's `qa:` list (pure-black bg, gradients read as
  gradients ~1.6–2px, inner radial glow present, AA contrast, even grid, **zero emoji**).
- Run a **fresh-eyes visual sub-agent** (e.g. via the task tool) — you will see what you expect,
  not what is there. Then fix → re-render → re-check (at least one full fix-and-verify cycle).
- ▸ Reflect: the known trap is **low-contrast dark cards on black** (brick-red dev cards). If a
  fill is near-black, lighten the gradient's bright stop or add a subtle stroke.

### 7. `export` — deck → standalone HTML or `.pptx`
- HTML: concatenate slide stages into one scrollable/paged document with the CSS inlined.
- `.pptx`: rebuild via the `pptx` skill / pptxgenjs using `clippyslide.theme.xml` as the color
  scheme; gradient borders → DrawingML `gradFill` line, panel fill → 10%-alpha `path="circle"`.
- ▸ Reflect: PowerPoint has no CSS `background-clip:text`; render gradient titles as the gradient
  fill on the text run, or fall back to a flat `#CA5BCD`.

### 8. `present` — presenter mode
- Hand off to the **tileslide** UI extension (Tauri/Vite Adaptive-Card app at `E:\tileslide`)
  using the `tileslide-coe` theme registry + post-render decoration, OR open the exported
  standalone HTML full-screen.
- ▸ Reflect: in the AC-based extension, gradient borders are CSS via `border-box/padding-box`
  on elements tagged `id: cs-panel-*` → `data-cs-role`, scoped by `[data-theme="tileslide-coe"]`.
  Keep ONE Adaptive-Card pipeline; do not add a raw-HTML slide type.

---

## Environment gotchas (carried from the build)

- **No LibreOffice.** Use `pptx-to-png.ps1` (PowerPoint COM) for `.pptx`→PNG.
- **Locked source files.** `Copy-Item` to scratch before reading/zipping.
- **Edge headless** is the reliable HTML→PNG path; isolated profile + absolute screenshot path.
- **Markdown image embeds** render only from the Clawpilot workspace dir and need URL-encoded
  spaces: `![x](file:///C:/Users/dayour/OneDrive%20-%20Microsoft/Documents/Clawpilot/...)`.
- **Zero emoji**, ever. High contrast. Premium, dark, restrained.

## Standing rigor

For any non-trivial visual work, consult `dayour-design` (visual critique) and `dayour-swe`
(implementation/architecture), **self-reflect on every render**, present an updated version, and
keep the bundled profiles authoritative.
