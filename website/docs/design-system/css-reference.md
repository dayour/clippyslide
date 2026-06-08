---
sidebar_position: 3
title: CSS Reference
---

# CSS Reference

The complete `clippyslide.css` source is the canonical reference. This page summarises the public surface so you don't have to read the file to use it. The file lives at [`design-system/clippyslide.css`](https://github.com/dayour/clippyslide/blob/main/design-system/clippyslide.css) and is mirrored in the skill at `skill/assets/clippyslide.css` — the two **must stay in sync**.

## CSS custom properties

All tokens are declared on `:root` so you can override them per-deck:

```css
:root{
  --cs-peri:#818EFF; --cs-cyan:#39B0FF; --cs-coral:#F77181; --cs-mag:#CA5BCD;
  --cs-grad-blue:  linear-gradient(135deg,#818EFF,#39B0FF);
  --cs-grad-hero:  linear-gradient(135deg,#F77181 0%,#CA5BCD 48%,#818EFF 100%);
  --cs-grad-title: linear-gradient(90deg,#F77181 0%,#CA5BCD 50%,#818EFF 100%);
  --cs-grad-health:linear-gradient(90deg,#E33B3B,#E8932F 22%,#E7D63B 44%,#A9D63B 68%,#22C24E);
  --cs-radius:16px; --cs-radius-sm:10px; --cs-border:1.6px; --cs-pad:20px;
  --cs-glow-blue:0 0 18px rgba(80,140,255,.28);
  --cs-glow-hero:0 0 22px rgba(202,91,205,.34);
  --cs-font:"Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif;
}
```

## Class index

| Class | Type | Notes |
| --- | --- | --- |
| `.cs-stage` | container | 1280×720 black canvas |
| `.cs-stage--glow` | modifier | content-slide corner glows |
| `.cs-stage--title` | modifier | stronger title glows |
| `.cs-panel` | container | gradient ring; needs a `.cs-in` child |
| `.cs-panel.blue` `.hero` `.white` | modifier | ring style |
| `.cs-in` | container | the black body + radial glow |
| `.cs-accent-left` | decoration | coral bar bleeding off-left |
| `.cs-title` `.cs-title.white` | text | gradient / solid title |
| `.cs-kicker` `.cs-h2` `.cs-h2.under` | text | eyebrow / subhead |
| `.cs-label` `.cs-body` `.cs-mono` | text | label / body / mono |
| `.cs-pill.blue` `.cs-pill.mag` | primitive | process pill |
| `.cs-tile` | primitive | light tile |
| `.cs-orx` | primitive | vertical rail label |
| `.cs-divider` | primitive | gradient rule + dots |
| `.cs-greenpanel` | container | green side panel |
| `.cs-agentcard` | container | white agent card |
| `.cs-env.dev` `.sandbox` `.prod` | container | environment card |
| `.cs-health` | container | rainbow bar; `.lbl` for the caption |

## Positioning model

Slides are **absolute layouts at a fixed 1280×720**. You position by `left` / `top` / `width` / `height` in pixels, exactly like PowerPoint placeholders. The [presenter](/presenter/overview) scales the whole stage to the viewport with a single `transform: scale()`, so authoring is always in slide pixels.

```html
<div class="cs-panel blue" style="left:80px;top:120px;width:520px;height:300px">…</div>
```

## Keeping the two copies in sync

There are two physical copies of this CSS:

1. `design-system/clippyslide.css` — used by the deck and presenter.
2. `skill/assets/clippyslide.css` — bundled with the Clawpilot skill.

The [Design Guardian automation](/automation/design-guardian) diffs them weekly and flags drift. If you edit one, edit both.
