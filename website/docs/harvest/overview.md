---
sidebar_position: 1
title: Overview
---

# ClippyDeck Harvest

`clippydeck_harvest` turns an authorized presentation or visual artifact into a reusable, privacy-safe ClippyDeck package. It extracts design facts from PPTX, PDF, HTML, images, video, ClippyDeck HTML, and Adaptive Card JSON.

The full engineering contract is maintained in [`clippydeck_harvest/SPEC.md`](https://github.com/dayour/clippyslide/blob/main/clippydeck_harvest/SPEC.md).

## What is harvested

- canvas, grids, margins, alignment, grouping, and z-order;
- typography, colors, gradients, transparency, borders, shadows, and spacing;
- shapes, icons, pictures, backgrounds, charts, and media;
- diagram nodes, connector endpoints, direction, labels, and dataflow topology;
- video metadata, poster frames, captions, scenes, and timed overlays;
- text roles and customer-specific entities.

## The separation rule

Visual structure and business content are stored independently:

```text
layout.template.json       geometry, roles, topology, ${content.path} bindings
design.tokens.json         visual tokens and extraction provenance
content.synthetic.json     safe default values for preview and publication
content.real.json          optional restricted profile, never committed
replacement-map.json       deterministic real-to-synthetic substitutions
```

Adaptive Card templates use ordinary string bindings:

```json
{
  "type": "TextBlock",
  "id": "title",
  "text": "${content.slides.slide001.title}"
}
```

The same layout can therefore render authorized real content locally or a synthetic public profile without editing the template.

## Components

| Component | Location | Purpose |
| --- | --- | --- |
| SWE specification | `clippydeck_harvest/SPEC.md` | Requirements, architecture, data model, security, acceptance criteria |
| Schemas | `clippydeck_harvest/schemas/` | Manifest, content profile, and replacement-map contracts |
| Skill | `skills/clippydeck-harvest/SKILL.md` | Eight-command extraction and reconstruction playbook |
| Runtime plugin | `extension/clippydeck-harvest.js` | Binding resolution, syntheticization, binding inventory, privacy audit |
| Examples | `clippydeck_harvest/examples/` | Synthetic profile, layout, manifest, and replacement map |

Continue with [Architecture](/harvest/architecture) and [Workflow](/harvest/workflow).
