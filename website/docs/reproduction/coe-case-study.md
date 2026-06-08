---
sidebar_position: 2
title: Case Study — CoE Framework
---

# Case Study: CoE Framework

The deck that started it all: `CoE_Framework.pptx`, an Oceaneering customer deck about building and governing Copilot Studio agents. ClippySlide reproduces all 24 slides.

![The reproduced deck](/img/contact-sheet.png)

## The hero slide (slide 3)

Slide 3 — "Use Case Description" — was the proof of concept. It has every signature element: a gradient-border panel, the magenta title, light knowledge/tools tiles, and the radial-glow body. Matching it verbatim is what unlocked the rest of the deck.

![Use case slide](/img/slides/usecase.png)

## The title slide

A pure-black canvas, a faint lens motif at 15% opacity, dual violet corner glows, and the gradient kicker over a cyan/white wordmark.

![Title slide](/img/slides/title.png)

## The orchestration diagram (slide 7, bespoke)

Slide 7 is hand-built rather than generated — a flow diagram with pills, tiles, a vertical orchestrator rail, and the knowledge/tools divider. It's the one slide the generator references by path instead of emitting.

![Orchestration](/img/slides/orchestration.png)

## The health matrix (slide 16)

Slide 16 tracks a single solution's config/validation health across **Dev → Sandbox → Prod**. It's a 3×3 matrix: `Environment / Solution / Validation` columns × three environments, color-coded by env, over the rainbow health bar.

![Health matrix](/img/slides/healthmatrix.png)

:::note A bug worth remembering
This slide was originally near-empty: `.cs-env` is `position:absolute`, so the nine cards all stacked on top of each other and only three showed. The fix was a dedicated `healthmatrix` archetype that places each cell with explicit coordinates. The same bug was collapsing slide 18. See [Archetypes](/generator/archetypes).
:::

## The lifecycle slide (slide 18)

Agent Lifecycle Management — environment cards staggered across trust boundaries (HR, Legal, Business Analyst, Operations, MVP Ring 1, All Users), over the health bar.

![Lifecycle](/img/slides/lifecycle.png)

## What the deck covers

The 24 slides map to the real CoE narrative:

| Slides | Topic |
| --- | --- |
| 1 | Title — Oceaneering Agent Orchestration |
| 2 | Agent layers |
| 3–8 | Use-case design, orchestration, child agents |
| 9–15 | Platform capabilities (redirect, model picker, knowledge, hub, AI controls, evaluations, inventory) |
| 16 | Configuration / validation health |
| 17 | Publishing checklist |
| 18 | Lifecycle management |
| 19–23 | Cost, analytics, evaluations, workshops, sessions |
| 24 | Architecture Bootcamp call-to-action |

Each was rebuilt with the same [tokens](/design-system/tokens) and rendered against the original for a visual diff. The full content model is in [`build-deck.js`](/generator/content-model).
