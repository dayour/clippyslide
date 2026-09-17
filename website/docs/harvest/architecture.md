---
sidebar_position: 2
title: Architecture
---

# Harvest Architecture

The pipeline is deterministic and evidence-driven:

```text
Acquire -> Normalize -> Extract -> Classify -> Bind -> Synthesize -> Reconstruct -> Validate -> Package
```

## Stage responsibilities

| Stage | Responsibility | Output |
| --- | --- | --- |
| Acquire | authorization, hash, source inventory, safe copy | `source-inventory.json` |
| Normalize | coordinate, color, unit, and time normalization | normalized evidence |
| Extract | exact source facts and relationships | raw extraction records |
| Classify | semantic regions, primitives, media, diagrams, text roles | layout draft and review queue |
| Bind | replace mutable values with `${content.path}` | templates and real/private profile |
| Synthesize | deterministic type-aware substitutions | synthetic profile and map |
| Reconstruct | ClippySlide HTML and Adaptive Cards | editable output and previews |
| Validate | schemas, privacy, accessibility, topology, visual diff | validation reports |
| Package | standalone deck and publishable package | manifest and release bundle |

## Extractor adapters

- **PPTX:** resolves OOXML theme, master, layout, placeholder, slide, relationship, media, chart, and transition inheritance.
- **PDF:** extracts page transforms, vector paths, clipping masks, text spans, fonts, and image objects.
- **HTML:** captures DOM, computed CSS, pseudo-elements, fonts, SVG/canvas, assets, and a browser render.
- **Image:** uses OCR, region segmentation, palette, and geometry inference with confidence metadata.
- **Video:** records container metadata, scene boundaries, keyframes, captions, motion, and timed overlays.

All adapters emit the same normalized evidence model. Low-confidence inference is never silently promoted to an exact token.

## Diagram model

Diagram topology is independent of geometry. Nodes have stable IDs and optional ports; relationships store `from`, `to`, `kind`, direction, label, routing, and source evidence. This allows a harvested dataflow to be re-laid out without losing semantic meaning.

## Trust boundaries

Extraction runs without executing macros, OLE objects, source scripts, or remote resources. Public packaging has no access to private content profiles. The runtime binding plugin has no network, filesystem, or storage permission.
