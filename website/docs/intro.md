---
id: intro
slug: /intro
sidebar_position: 1
title: Introduction
---

# ClippySlide

**ClippySlide is a slide design system reverse-engineered from a real, premium PowerPoint deck — and then productized.** Every color, gradient, radius, and stop position in this system was lifted verbatim from the OOXML of a customer-grade deck (`CoE_Framework.pptx`). Nothing here was eyeballed.

> The governing principle of the whole project: **extract real design tokens from the source, never vibe-code them.**

![The full 24-slide deck, reproduced in ClippySlide](/img/contact-sheet.png)

## What's in the box

ClippySlide is five things that share one set of tokens:

| Layer | What it is | Where |
| --- | --- | --- |
| **Design system** | A CSS component library + machine-readable token profiles (JSON / XML / YAML) | [`design-system/`](/design-system/tokens) |
| **Deck generator** | A data-driven Node generator that emits the full 24-slide deck from one content model | [`generator/`](/generator/overview) |
| **Presenter** | A clean, viewport-grid presenter: full-bleed slides + a single floating header layer | [`presenter/`](/presenter/overview) |
| **Clawpilot skill** | An 8-command skill that encodes the whole workflow (extract → theme → build → render → validate → export → present) | [`skill/`](/skill/overview) |
| **TileSlide extension** | A theme for the Adaptive-Card TileSlide app, so live AC decks can wear the CoE look | [`extension/`](/extension/coe-theme) |

## The aesthetic

The CoE look is deceptively simple and very specific:

- **Pure-black canvas** (`#000000`), 16:9, 1280×720.
- **Glowing gradient-border panels** — a thin, bright gradient ring around a near-black body.
- **Magenta-gradient titles** — `#F77181 → #CA5BCD → #818EFF`, weight 800.
- **A rainbow "health bar"** — `#E33B3B → #E8932F → #E7D63B → #A9D63B → #22C24E`.
- **Environment cards** color-coded Dev / Sandbox / Prod.

The single most important trick: **the "dark navy" panel bodies are not navy at all.** They are the same bright border colors painted as a *radial gradient at 10% alpha over black*. See [Design Tokens](/design-system/tokens) for the receipts.

## Why it exists

The first attempt at this deck was generic and "vibe-coded." The breakthrough came from refusing to guess: reading the slide XML straight from the `.pptx` zip and lifting the exact tokens. The result was clean enough that the next step was obvious — turn the method into a reusable system so the same rigor applies to every future deck.

Start with the [Quick Start](/quick-start), or jump to the [Reproduction Method](/reproduction/methodology) to see how the tokens were extracted.
