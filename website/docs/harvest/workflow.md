---
sidebar_position: 4
title: Workflow
---

# Harvest Workflow

The reusable skill is [`skills/clippydeck-harvest/SKILL.md`](https://github.com/dayour/clippyslide/blob/main/skills/clippydeck-harvest/SKILL.md).

## Eight commands

1. **inspect** - establish authorization, source type, dimensions, classification, digest, and asset inventory.
2. **extract** - read exact geometry, tokens, effects, relationships, media, and source text.
3. **classify** - identify semantic regions, visual primitives, compound diagrams, and mutable content.
4. **bind** - move mutable text into Adaptive Card-compatible JSON variables.
5. **syntheticize** - produce deterministic generic names and privacy-safe values.
6. **reconstruct** - generate ClippySlide HTML, Adaptive Card JSON, assets, and previews.
7. **validate** - run schema, privacy, accessibility, topology, visual, and offline checks.
8. **package** - emit the manifest and self-contained `<name>-clippydeck.html`.

## Quality loop

For every slide:

1. render the authorized source;
2. render the reconstruction at the same dimensions;
3. compare geometry, typography, hierarchy, colors, media crops, and connector paths;
4. inspect the slide manually with fresh eyes;
5. record defects and confidence;
6. fix and re-render at least once;
7. mark the slide reviewed only when no high-severity defect remains.

## Public-release gate

A package cannot be published when it contains a forbidden term, restricted source asset, unresolved binding, broken connector endpoint, unreviewed low-confidence element, missing provenance, or a high-severity visual defect.
