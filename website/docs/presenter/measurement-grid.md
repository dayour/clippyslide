---
sidebar_position: 3
title: Measurement Grid
---

# Measurement Grid

The presenter ships with a **viewport-grid measurement overlay** — a layer that draws the exact bounds of the scaled slide so you can verify, by eye and by number, that the slide, the header, and the layers all line up. Toggle it with `G` (it's on by default).

## What it shows

| Element | Meaning |
| --- | --- |
| Cyan rectangle | the true bounds of the scaled `1280×720` stage |
| Magenta crosshair | the stage's horizontal + vertical centre lines |
| `stage 1280×720 → 1742×980` (top-left) | logical size → rendered size at the current scale |
| `scaled 1742×980 (16:9)` (bottom-right) | the rendered dimensions and aspect confirmation |
| `1840×980 | ×1.361` (header) | the viewport size and the scale factor in use |

## Why it exists

When you scale a fixed-size stage into an arbitrary browser window, it's easy to introduce a one-pixel gap, an off-centre transform, or a header that overlaps content. The measurement layer makes those mistakes **measurable instead of guessable**:

- The cyan border must hug the slide edges with no gap → confirms `transform-origin` and anchoring are correct.
- The header's readout (`×1.361`) must match the stage readout's scale → confirms the header and slide share one coordinate space.
- The bottom-right badge confirms the rendered size stays `16:9`.

## How it's built

The overlay is a sibling of the slide frame that uses the **same transform**, so it tracks the stage exactly:

```css
#measure{
  position:absolute; left:50%; top:0; width:1280px; height:720px;
  transform:translateX(-50%) scale(var(--s));
  transform-origin:top center;
  pointer-events:none;
}
```

Because it shares `--s` and the same origin, the cyan rectangle is the stage's real on-screen footprint — not an approximation.

## Turning it off

For a clean present, press `G` or click `grid` in the header. The overlay is `pointer-events:none`, so it never intercepts clicks even when visible.
