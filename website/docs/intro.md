---
id: intro
slug: /intro
sidebar_position: 1
title: Introduction
---

# ClippySlide

**ClippySlide is a ClippyFlow-first slide design system for premium, dark, agentic presentations.** New decks use a deep-navy spectrum canvas, translucent cards, spectrum title text, and nitrous-blue structural accents by default.

> The active rule: **use ClippyFlow by default; keep the original CoE extraction available as legacy reference material.**

![The full 24-slide deck, reproduced in ClippySlide](/img/contact-sheet.png)

## What's in the box

ClippySlide is five things that share one default ClippyFlow token set:

| Layer | What it is | Where |
| --- | --- | --- |
| **Design system** | The ClippyFlow CSS component library + machine-readable token profiles (JSON / XML / YAML), with legacy CoE files preserved | [`design-system/`](/design-system/tokens) |
| **Deck generator** | A data-driven Node generator that emits the full ClippyFlow deck from one content model | [`generator/`](/generator/overview) |
| **Presenter** | A clean, viewport-grid presenter: full-bleed slides + a single floating header layer | [`presenter/`](/presenter/overview) |
| **Clawpilot skill** | An 8-command skill that encodes the build, render, validate, export, and present workflow | [`skill/`](/skill/overview) |
| **TileSlide extension** | A legacy CoE theme for the Adaptive-Card TileSlide app | [`extension/`](/extension/coe-theme) |

## The aesthetic

The ClippyFlow look is deliberately restrained and specific:

- **Deep-navy spectrum canvas**, 16:9, 1280x720.
- **Translucent navy cards** with thin nitrous-blue structural rims.
- **Spectrum-gradient titles** using cyan, nitrous, purple, and magenta.
- **A brand-spectrum health bar** that runs magenta to purple to nitrous to cyan to green.
- **Environment cards** with magenta, nitrous, and green spines for Dev / Sandbox / Prod.

The single most important trick: **nitrous is structure, not data.** Use it for rims, dividers, underlines, focus rings, and scrollbars. Charts and semantic fills use the brand spectrum instead. See [Design Tokens](/design-system/tokens) for the details.

## Why it exists

The original ClippySlide work proved the method by extracting exact tokens from a real `.pptx`. ClippyFlow takes that rigor and makes it the product default: a reusable brand-flagship theme that can still coexist with the legacy CoE extraction.

Start with the [Quick Start](/quick-start), or jump to the [Reproduction Method](/reproduction/methodology) to see how the tokens were extracted.
