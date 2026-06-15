---
sidebar_position: 3
title: Content Model
---

# Content Model

The deck is data. `SLIDES[]` is an array of plain objects, each naming a renderer (`f`) and carrying that renderer's fields. This page documents the shape so you can edit the deck without reading the renderer source.

## A slide entry

```js
{ f: feature,           // the archetype renderer function
  n: 19,                // slide number (drives filename + page label)
  kicker: 'MODEL INNOVATION',
  title: 'Cost Management & insights',
  sub: '',
  lines: [ 'bullet one', 'bullet two', 'bullet three' ],
  shotCap: 'Cost dashboard',
  status: 'Public preview | October 2025' }
```

The only universal fields are `f` (renderer) and `n` (number). Everything else is archetype-specific -- see [Archetypes](/generator/archetypes).

## The manifest (`deck/index.json`)

After writing the slides, the generator emits a manifest the [presenter](/presenter/overview) consumes:

```json
{
  "title": "ClippyFlow -- ClippySlide",
  "version": "1.0.0",
  "theme": "clippyflow",
  "slides": [
    { "n": 1, "file": "01.html", "archetype": "title" },
    { "n": 7, "file": "../slides-clippyflow/07-orchestration.html", "archetype": "diagram (bespoke)" },
    { "n": 16, "file": "16.html", "archetype": "healthmatrix" }
  ]
}
```

`archetype` is just `s.f.name`, so the manifest self-documents which renderer produced each slide. Slide 7 is appended by hand with its bespoke path.

## Editing recipes

**Change wording on a capability slide** -- find the `feature` entry, edit `lines[]`, rerun:

```bash
node build-deck.js
```

**Add a slide** -- insert a new object in `SLIDES[]` with the next `n`, pick a renderer, supply its data.

**Reorder** -- change the `n` values (and array order). The build loop keys output filenames off `n`.

**Swap an archetype** -- change `f` and reshape the entry's data to match the new renderer.

## Escaping

All text passes through `esc()` before being interpolated into HTML, so `&`, `<`, `>` in your copy are safe. Don't pre-escape your strings.

## Determinism

The generator is pure: same `SLIDES[]` in, same 23 files out. There is no randomness and no network dependency. The manifest's `generated` date changes on each run; everything else should be explained by content or renderer changes.
