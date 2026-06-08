---
sidebar_position: 1
title: Overview
---

# Presenter

`presenter/present.html` is a single, self-contained file that presents the deck the way it's meant to be seen: **full-bleed slides with one floating header layer — nothing else.** No sidebar, no status bar, no toolbar.

![The presenter](/img/presenter.png)

## The viewport-grid model

The presenter is built on a deliberate, layered model (borrowed from a "viewport grid" canvas pattern) rather than a chrome-heavy editor:

| Layer | What | z-index |
| --- | --- | --- |
| **1 · Presentation** | the actual slide, in a `1280×720` `<iframe>`, top-anchored and scaled to the viewport | base |
| **2 · Measurement** | the viewport-grid border + crosshair + dimension readouts (toggle with `G`) | 680 |
| **3 · Floating header** | a recessive tilebar (brand, title, prev/next, counter, present, grid) | 700 |

That's the whole design. The slide owns the screen; the header floats and fades.

## How scaling works

Slides are authored at a fixed `1280×720`. The presenter computes a single scale factor and applies it with one transform:

```js
var s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
document.documentElement.style.setProperty('--s', s);
```

```css
#frameWrap{
  position:absolute; left:50%; top:0;
  width:1280px; height:720px;
  transform:translateX(-50%) scale(var(--s));
  transform-origin:top center;
}
```

The stage is **top-anchored** (`top:0`, `transform-origin:top center`) so there is never an empty gap above the slide — any leftover space falls below, where the page is already black. In a true 16:9 window the slide fills exactly.

## Why an iframe?

Each deck slide is a complete HTML document that brings its own `clippyslide.css`. Loading it into an iframe means the presenter renders the **exact** reproduction file — pixel-identical to opening `deck/16.html` on its own — with zero risk of style bleed between the presenter chrome and the slide.

The slide list is built in-page (no `fetch`, so it works from `file://`):

```js
for (var n = 1; n <= 24; n++)
  SLIDES.push(n === 7 ? 'slides/07-orchestration.html'
                      : 'deck/' + pad(n) + '.html');
```

## The header recedes

Per design feedback, the header is intentionally quiet: ~42% opacity, ghost buttons, a top fade-gradient instead of a solid pill. It brightens on hover and **auto-hides after idle**, returning on mouse-move. Press `H` to force it away entirely for a pure slide.

See [Controls](/presenter/controls) for the full key map and [Measurement Grid](/presenter/measurement-grid) for the layout-debugging overlay.
