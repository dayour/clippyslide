---
sidebar_position: 2
title: Archetypes
---

# Archetypes

Each slide is rendered by one of ten archetype functions. An archetype is a layout pattern plus the data shape it needs. To add a slide, pick an archetype and supply its data — or write a new archetype if none fits.

## Catalog

| Archetype | Purpose | Key data |
| --- | --- | --- |
| `title` | title / section slide | `kicker`, `sub`, `main` |
| `feature` | capability slide: kicker, title, bullet lines, a screenshot placeholder, optional GA/preview status | `kicker`, `title`, `lines[]`, `shotCap`, `status` |
| `guidance` | instructional slide with a code/sample panel | `title`, `lines[]`, `shotCap` |
| `panelGrid` | the use-case grid of labeled tiles | `title`, `tiles[]` |
| `diagram` | flow/diagram slides (pills, tiles, rails) | bespoke per slide |
| `lifecycle` | environment-card columns over the health bar | `columns[]`, `health` |
| `healthmatrix` | a 3×3 config/validation matrix | `cols[]`, `rows[]`, `health` |
| `checklist` | multi-column numbered checklist | `groups[]` |
| `demo` | full-bleed "LIVE DEMO" slide with a capture placeholder | `title`, `sub` |
| `cta` | closing call-to-action with outcome + locations | `outcome`, `body[]`, `locations[]` |

## `lifecycle`

Renders one or more vertical columns of `.cs-env` cards over a `.cs-health` bar. Each column is placed at an explicit `x,y`; cards inside it stack.

```js
{f:lifecycle, n:18, title:'Agent Lifecycle Management', note:'…',
 columns:[
   {x:12, y:282, w:386, h:74, cards:[
     {k:'dev',     name:'Environment: HR', ver:'vNext Dev'},
     {k:'sandbox', name:'Environment: HR', ver:'vNext Sandbox'}]},
   // …
 ],
 health:'Configuration / validation health'}
```

:::danger The absolute-position bug
`.cs-env` is `position:absolute`. The lifecycle renderer stacks cards in a flex column, so each card **must** override to `position:relative` (the renderer now does this) or they all pile onto the same point and only the last is visible. This silently collapsed slides 16 and 18. If you write a new card-stacking archetype, remember this.
:::

## `healthmatrix`

Added specifically to fix slide 16. Instead of stacking, it places every cell at a computed `(x, y)`, forming a real grid: column headers, row labels with env-colored dots, and `.cs-env` cells tinted by row.

```js
{f:healthmatrix, n:16, title:'Configuration / validation health',
 note:'Single-solution detail tracked across Dev → Sandbox → Prod.',
 cols:['Environment','Solution','Validation'],
 rows:[
   {env:'dev',     label:'Dev',     cells:[{name:'Environment',ver:'vNext Dev'},     {name:'Agent / App',ver:'v1.0.0.1 · Policy Advisor'}, {name:'Schema',ver:'passing'}]},
   {env:'sandbox', label:'Sandbox', cells:[…]},
   {env:'prod',    label:'Prod',    cells:[…]} ],
 health:'Configuration / validation health'}
```

Geometry is computed from constants (`gx0`, `gy0`, `colW`, `colGap`, `rowH`, `rowGap`) so the matrix always fills the canvas above the health bar.

## `feature`

The workhorse for capability slides:

```js
{f:feature, n:19, kicker:'MODEL INNOVATION', title:'Cost Management & insights',
 lines:['Centrally track your Copilot Studio costs',
        'Analyze trends and spend drivers',
        'Assign capacity thresholds to prevent overages'],
 shotCap:'Cost dashboard', status:'Public preview | October 2025'}
```

`lines[]` become the bullet list; `shotCap` labels the screenshot placeholder; `status` renders a GA/preview chip.

## Adding an archetype

1. Write `function myType({n, …}) { … return page(n, 'cs-stage--glow', body); }`.
2. Reference it in a `SLIDES[]` entry via `f: myType`.
3. Run `node build-deck.js` and render the slide for a [visual QA pass](/skill/commands).
