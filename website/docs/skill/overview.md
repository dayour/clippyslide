---
sidebar_position: 1
title: Overview
---

# Clawpilot Skill

ClippySlide ships as a [Clawpilot](https://github.com/) skill — an instruction set plus bundled assets and scripts that an agent loads to reproduce the look and build decks. It encodes the whole method so the rigor is repeatable, not a one-off.

The skill lives in [`skill/`](https://github.com/dayour/clippyslide/tree/main/skill) and is invoked as `/clippyslide`.

## What's bundled

| Path | What |
| --- | --- |
| `SKILL.md` | the instruction set: 8 commands + self-reflection notes |
| `assets/clippyslide.css` | the component library (mirror of `design-system/`) |
| `assets/clippyslide.tokens.json` / `.theme.xml` / `.profile.yaml` | the token profiles |
| `assets/examples/*.html` | three reference hero slides (title, orchestration, lifecycle) |
| `scripts/extract-tokens.py` | OOXML token extractor for any `.pptx` |
| `scripts/render.ps1` | HTML → PNG via headless Edge (working invocation baked in) |
| `scripts/pptx-to-png.ps1` | reference `.pptx` → per-slide PNG via PowerPoint COM |

## The governing rule

> **Don't guess a design — extract it.** Pull the real reference, read its tokens from the file, encode them once, then build everything from that contract.

The skill's first instruction is always: **read `assets/clippyslide.profile.yaml` first.** That YAML is the single source of truth for tokens, components, archetypes, and the QA checklist.

## The core workflow

The skill automates this loop:

1. **Ground in the real reference** — locate the source `.pptx`; copy it out of any lock first.
2. **Extract tokens** from the OOXML, not a screenshot.
3. **Encode once** into the CSS + profiles.
4. **Author slides as HTML** that link the CSS and compose the archetypes.
5. **Render** to PNG with headless Edge.
6. **QA visually** against the original with a **fresh-eyes sub-agent**, then self-reflect and revise — never declare done on the first render.

## Self-reflection is built in

Every command in `SKILL.md` carries `▸` notes that capture the exact failure modes discovered while building the system — locked files, the 1/1000% gradient units, the "navy is actually 10%-alpha" trick, the low-contrast dark-card trap, the Edge-headless invocation quirks. They're not advice; they're scar tissue. See [Commands](/skill/commands).
