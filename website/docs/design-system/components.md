---
sidebar_position: 2
title: Components
---

# Components

`clippyslide.css` is the default ClippyFlow component library. New slides should use the `cf-` class prefix and absolute positioning inside a fixed `1280x720` `.cf-stage`.

## Stage

```html
<div class="cf-stage"> ... </div>
<div class="cf-stage cf-stage--hero"> ... </div>
```

| Class | Effect |
| --- | --- |
| `.cf-stage` | 1280x720 deep-navy spectrum canvas |
| `.cf-stage--hero` | Stronger spectrum bloom for title and section slides |
| `.cf-stage--title` / `.cf-stage--glow` | Compatibility aliases for generated layouts |

## Panels

```html
<div class="cf-panel spectrum" style="left:80px;top:120px;width:560px;height:300px">
  <div class="cf-title">Use Case Description</div>
  <div class="cf-body">Translucent navy surface with a spectrum rim.</div>
</div>
```

| Variant | Use |
| --- | --- |
| `.cf-panel` | Translucent navy card with nitrous rim |
| `.cf-panel.spectrum` | Spectrum-rim hero panel |
| `.cf-panel.solid` | Opaque nested panel for diagrams |
| `.cf-panel.blue` / `.cf-panel.hero` | Generator compatibility aliases |

## Typography

| Class | Use |
| --- | --- |
| `.cf-title` | Spectrum-gradient display title |
| `.cf-title.white` | Solid foreground title |
| `.cf-kicker` | Uppercase spectrum-gradient eyebrow |
| `.cf-h2` | Subheading |
| `.cf-h2.under` | Subheading with nitrous underline |
| `.cf-label` | Bold label |
| `.cf-body` | Soft foreground body copy |
| `.cf-mono` | Monospace code or version text |

## Diagram primitives

| Class | Use |
| --- | --- |
| `.cf-pill.cyan` / `.purple` / `.magenta` / `.nitrous` | Rounded process pills |
| `.cf-pill.blue` / `.mag` | Generator compatibility aliases |
| `.cf-tile` | Navy tile with nitrous-tint border |
| `.cf-orx` | Vertical orchestrator rail label |
| `.cf-divider` | Nitrous rule with endpoint dots |
| `.cf-accent-left` | Spectrum accent bar bleeding slightly off the left edge |

## Lifecycle and status

| Class | Use |
| --- | --- |
| `.cf-env.dev` / `.sandbox` / `.prod` | Environment cards with magenta, nitrous, or green spine |
| `.cf-health` | Brand-spectrum health/progress bar pinned to the stage bottom |
| `.cf-agentcard` | Connected-agent card |
| `.cf-chip` / `.cf-badge` | Compact metadata and identity pills |
| `.cf-scroll` | Nitrous scrollbar styling for scroll regions |
| `.cf-focusable` | Nitrous focus-visible ring |

## Minimal slide

```html
<div class="cf-stage cf-stage--hero">
  <div class="cf-panel spectrum" style="left:64px;top:90px;width:720px;height:220px">
    <div class="cf-kicker">DESIGN</div>
    <div class="cf-title">ClippyFlow Default</div>
    <div class="cf-body">Deep navy, spectrum title text, and nitrous structure.</div>
  </div>
  <div class="cf-health"><span class="lbl">Spectrum health bar</span></div>
</div>
```

Full class signatures are in the [CSS Reference](/design-system/css-reference).
