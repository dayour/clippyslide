---
sidebar_position: 3
title: CSS Reference
---

# CSS Reference

The canonical CSS file is [`design-system/clippyslide.css`](https://github.com/dayour/clippyslide/blob/main/design-system/clippyslide.css). It is the default ClippyFlow entrypoint and is mirrored in the skill at `skill/assets/clippyslide.css`.

## Core custom properties

```css
:root{
  --clippy-cyan:hsl(186,100%,45%);
  --clippy-cyan-br:hsl(186,100%,58%);
  --clippy-blue:hsl(206,100%,42%);
  --clippy-purple:hsl(257,100%,62%);
  --clippy-magenta:hsl(291,100%,58%);
  --clippy-green:hsl(142,71%,40%);
  --nitrous:hsl(214,100%,58%);
  --nitrous-rim:hsla(214,100%,60%,.55);
  --cf-surface:hsla(200,16%,12%,.94);
  --cf-grad-spectrum:linear-gradient(100deg,var(--clippy-cyan),var(--nitrous),var(--clippy-purple),var(--clippy-magenta));
  --cf-grad-title:linear-gradient(92deg,hsl(186,100%,64%),hsl(214,100%,70%),hsl(257,100%,76%),hsl(291,100%,72%));
}
```

## Class index

| Class | Type | Notes |
| --- | --- | --- |
| `.cf-stage` | container | 1280x720 ClippyFlow canvas |
| `.cf-stage--hero` | modifier | stronger hero bloom |
| `.cf-panel` | container | translucent navy surface with nitrous rim |
| `.cf-panel.spectrum` | modifier | spectrum-rim hero surface |
| `.cf-panel.solid` | modifier | opaque nested surface |
| `.cf-accent-left` | decoration | spectrum accent bar |
| `.cf-title` / `.cf-title.white` | text | gradient or solid title |
| `.cf-kicker` / `.cf-h2` / `.cf-h2.under` | text | eyebrow and subhead |
| `.cf-label` / `.cf-body` / `.cf-mono` | text | label, body, mono |
| `.cf-pill.*` | primitive | process pill variants |
| `.cf-tile` | primitive | diagram tile |
| `.cf-orx` | primitive | vertical rail label |
| `.cf-divider` | primitive | nitrous rule with dots |
| `.cf-agentcard` | container | connected-agent card |
| `.cf-env.dev` / `.sandbox` / `.prod` | container | environment card |
| `.cf-health` | container | spectrum health bar |
| `.cf-chip` / `.cf-badge` | primitive | compact metadata |
| `.cf-scroll` | utility | nitrous scrollbar |
| `.cf-focusable` | utility | focus-visible ring |

## Compatibility aliases

The generator emits stable ClippySlide layout patterns. `clippyslide.css` includes compatibility aliases so those layouts render as ClippyFlow:

| Alias | Purpose |
| --- | --- |
| `.cf-stage--title` / `.cf-stage--glow` | Generated title/content stage modifiers |
| `.cf-panel.blue` / `.cf-panel.hero` / `.cf-panel.white` | Generated panel variants |
| `.cf-panel > .cf-in` | Generated inner-panel wrapper |
| `.cf-pill.blue` / `.cf-pill.mag` | Generated pill variants |
| `.cf-greenpanel` | Generated side panel |

## Positioning model

Slides are absolute layouts at a fixed 1280x720. Position by `left`, `top`, `width`, and `height` in pixels, matching PowerPoint placeholder thinking:

```html
<div class="cf-panel spectrum" style="left:80px;top:120px;width:520px;height:300px">...</div>
```

The [presenter](/presenter/overview) scales the stage with a single transform, so authoring remains in slide pixels.

## Keeping copies in sync

There are two canonical copies:

1. `design-system/clippyslide.css` for decks, the presenter, and docs.
2. `skill/assets/clippyslide.css` for the Clawpilot skill.

If you edit one, edit both. The legacy CoE CSS remains as `clippyslide-legacy.css`.
