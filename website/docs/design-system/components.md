---
sidebar_position: 2
title: Components
---

# Components

`clippyslide.css` is a small component library. Every class is prefixed `cs-`. Components are positioned absolutely inside a `.cs-stage` (the 1280×720 canvas), which is how a slide deck differs from a flowing web page.

## The stage

```html
<div class="cs-stage cs-stage--glow"> ... </div>
```

| Class | Effect |
| --- | --- |
| `.cs-stage` | 1280×720 black canvas, sets the font and antialiasing |
| `.cs-stage--glow` | adds the content-slide violet corner glows (top-right + bottom-left) |
| `.cs-stage--title` | a stronger dual glow for title/section slides |

## Gradient-border panel

The hero component. A `.cs-panel` is the gradient ring; its `.cs-in` child is the black body with the radial glow.

```html
<div class="cs-panel blue" style="left:80px;top:120px;width:520px;height:300px">
  <div class="cs-in" style="padding:24px">
    <div class="cs-title">Use Case Description</div>
    <div class="cs-body">…</div>
  </div>
</div>
```

| Variant | Border |
| --- | --- |
| `.cs-panel.blue` | `--cs-grad-blue` + blue glow |
| `.cs-panel.hero` | `--cs-grad-hero` (3-stop) + magenta glow |
| `.cs-panel.white` | solid white inner panel (for diagram slides) |

The ring is implemented as **padding holding the gradient** with the `.cs-in` body sitting on top — not a CSS border — which is why the corners stay crisp at the 16px radius.

## Typography

| Class | Use |
| --- | --- |
| `.cs-title` | gradient-clipped magenta title (weight 800). `.cs-title.white` overrides to solid white |
| `.cs-kicker` | cyan section eyebrow |
| `.cs-h2` | white subheading. `.cs-h2.under` adds the 2px gradient-offset underline |
| `.cs-label` | bold 17px label |
| `.cs-body` | soft-white body copy |
| `.cs-mono` | monospace (code, versions) |

## Diagram primitives

| Class | Use |
| --- | --- |
| `.cs-pill.blue` / `.cs-pill.mag` | rounded process pills (Trigger / Plan / Act) |
| `.cs-tile` | light-blue knowledge/tools tile (`#CFE8F7`, dark text) |
| `.cs-orx` | vertical "Orchestrator" rail label |
| `.cs-divider` | gradient rule with magenta end-dots (via `::before`/`::after`) |
| `.cs-accent-left` | coral accent bar that bleeds off the left edge |

## Lifecycle & status

| Class | Use |
| --- | --- |
| `.cs-env.dev` / `.sandbox` / `.prod` | environment cards (see [tokens](/design-system/tokens)) |
| `.cs-health` | the full-width rainbow health bar, pinned to the stage bottom |
| `.cs-greenpanel` | the green "Agent Layers" side panel |
| `.cs-agentcard` | white connected-agent card (icon + label) |

:::warning The `.cs-env` gotcha
`.cs-env` is `position:absolute`. If you stack several in a flex column **without** giving each one explicit coordinates (or overriding to `position:relative`), they all pile on top of each other and you only see the last one. This bug silently collapsed slides 16 and 18 until it was caught — see [Archetypes → lifecycle / healthmatrix](/generator/archetypes).
:::

## Putting it together

A minimal "use case" slide:

```html
<div class="cs-stage cs-stage--glow">
  <div class="cs-panel hero" style="left:64px;top:90px;width:1152px;height:120px">
    <div class="cs-in" style="padding:18px 28px">
      <div class="cs-kicker">DESIGN</div>
      <div class="cs-title">Use Case Description</div>
    </div>
  </div>
  <div class="cs-health"><span class="lbl">Configuration / validation health</span></div>
</div>
```

Full class signatures are in the [CSS Reference](/design-system/css-reference).
