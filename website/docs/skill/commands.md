---
sidebar_position: 2
title: The 8 Commands
---

# The 8 Commands

Each command in `SKILL.md` is self-contained and now assumes the ClippyFlow default unless a legacy CoE reproduction is explicitly requested.

## 1. `new` - scaffold a deck

Create a `<deck>/slides/` folder, copy or link `clippyslide.css`, and seed slide 1 from the closest ClippyFlow example in `assets/examples/*.html`. One slide equals one HTML file.

## 2. `extract` - pull tokens from a `.pptx`

Legacy reproduction path:

```bash
python scripts/extract-tokens.py <ref.pptx> --slide 3 --out tokens.json
```

Use this only when a user wants to reproduce a reference deck. ClippyFlow work starts from the bundled profile instead.

## 3. `theme` - apply or swap tokens

Re-skin by editing the CSS `:root` variables and keeping CSS, JSON, YAML, and XML profiles in sync.

## 4. `add-slide` - add a slide of an archetype

Copy the closest example, swap content, keep the `.cf-stage` wrapper, and compose `cf-` components such as panels, pills, tiles, environment cards, health bars, chips, and agent cards.

## 5. `render` - HTML to PNG

```powershell
pwsh scripts/render.ps1 -Path <file-or-folder> -All -Width 1280 -Height 720 -Scale 2
```

Use the Edge-headless path with an isolated profile and absolute screenshot paths.

## 6. `validate` - run the QA checklist

Render and check the profile: deep-navy spectrum background, translucent surfaces, visible nitrous rims/dividers/underlines, no nitrous data fills, AA contrast, and zero emoji.

## 7. `export` - deck to standalone HTML or `.pptx`

- HTML: concatenate slide stages into one paged document with CSS inlined.
- `.pptx`: rebuild through the `pptx` skill or pptxgenjs using `clippyslide.theme.xml` as the color scheme.

## 8. `present` - presenter mode

Use the viewport-grid presenter (`presenter/present.html`) for full-bleed ClippyFlow slides with one floating header layer. The TileSlide Adaptive-Card extension remains available for legacy CoE decks.
