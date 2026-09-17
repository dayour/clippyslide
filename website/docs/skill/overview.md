---
sidebar_position: 1
title: Overview
---

# Clawpilot Skill

ClippySlide ships as a Clawpilot skill invoked as `/clippyslide`. The skill now defaults to ClippyFlow: deep-navy spectrum slides, translucent cards, spectrum title text, and nitrous-blue structure.

The authoring skill lives in [`skill/`](https://github.com/dayour/clippyslide/tree/main/skill). Reference extraction and synthetic-content work uses the dedicated [`skills/clippydeck-harvest/`](https://github.com/dayour/clippyslide/tree/main/skills/clippydeck-harvest) skill.

## What's bundled

| Path | What |
| --- | --- |
| `SKILL.md` | Instruction set: 8 commands plus implementation notes |
| `assets/clippyslide.css` | Default ClippyFlow component library |
| `assets/clippyslide.tokens.json` / `.theme.xml` / `.profile.yaml` | ClippyFlow token profiles |
| `assets/clippyslide-legacy.*` | Preserved CoE / TileSlide extraction artifacts |
| `assets/examples/*.html` | ClippyFlow reference slides |
| `scripts/extract-tokens.py` | Legacy OOXML token extractor for `.pptx` reproduction work |
| `scripts/render.ps1` | HTML to PNG via headless Edge |
| `scripts/pptx-to-png.ps1` | Reference `.pptx` to per-slide PNG via PowerPoint COM |
| `../skills/clippydeck-harvest/SKILL.md` | Source harvesting, content binding, syntheticization, media extraction, and public-release validation |

## The governing rule

Use ClippyFlow by default. Start by reading `assets/clippyslide.profile.yaml`; it is the source of truth for tokens, components, archetypes, and the QA checklist.

Use the legacy CoE extraction path only when the user explicitly asks to reproduce or compare against a reference PowerPoint design.

## The core workflow

1. Read `assets/clippyslide.profile.yaml`.
2. Author one HTML file per slide with `cf-` components.
3. Render to PNG with headless Edge.
4. Validate the ClippyFlow checklist: spectrum background, translucent surfaces, visible nitrous structure, no nitrous data fills, AA contrast, and zero emoji.
5. Revise and re-render until the output matches the profile.
