---
sidebar_position: 1
title: Overview
---

# Deck Generator

`generator/build-deck.js` is a **zero-dependency Node script** that emits 23 of the deck's 24 slides from a single content model. Slide 7 (the bespoke orchestration diagram) is hand-authored and referenced by path.

## Why generate?

A 24-slide deck authored by hand drifts: spacing wanders, a token gets fat-fingered, one slide ends up slightly off-system. Driving the deck from **one content array through a set of archetype renderers** guarantees every slide shares the same geometry, tokens, and scaffold. Fix the renderer once, every slide of that type updates.

## Run it

```bash
cd generator
node build-deck.js
```

Output:

```
Generated 23 slides + index.json -> ../deck
```

It writes `../deck/NN.html` for each slide plus `../deck/index.json` (the manifest the [presenter](/presenter/overview) reads).

## Anatomy

```js
// 1. a shared page scaffold every slide uses
function page(n, stageClass, body, extraCss = '') { … }

// 2. one renderer per archetype
function title({n, kicker, sub, main}) { … }
function feature({n, kicker, title, sub, lines, shotCap, status}) { … }
function healthmatrix({n, title, note, cols, rows, health}) { … }
// …

// 3. the content model: an array of slide objects, each naming its renderer
const SLIDES = [
  {f:title, n:1, kicker:'COPILOT AGENT DEVELOPMENT', sub:'Oceaneering', main:'Agent Orchestration'},
  {f:healthmatrix, n:16, title:'Configuration / validation health', cols:[…], rows:[…]},
  // …
];

// 4. the build loop
for (const s of SLIDES) {
  fs.writeFileSync(`deck/${pad(s.n)}.html`, s.f(s));
}
```

Each slide entry carries a reference to its renderer function (`f`) and the data that renderer needs. The loop just calls `s.f(s)`.

## The page scaffold

`page()` wraps every slide in the same document shell: it links `../design-system/clippyslide.css`, sets the black body, injects a few slide-local helper classes (`.kick`, `.big`, `.shot`, …), and wraps the body in `<div class="cs-stage ${stageClass}">` with a `N / 24` page number.

## Edit the model, not the output

:::warning
The files in `deck/*.html` are **generated**. Editing them directly will be overwritten on the next `node build-deck.js`. Change the `SLIDES[]` data or the archetype functions instead.
:::

The exception is slide 7 — it is bespoke (`slides/07-orchestration.html`) and is not regenerated; the manifest references it by relative path.

Continue to [Archetypes](/generator/archetypes) for the renderer catalog, or [Content Model](/generator/content-model) for the data shape.
