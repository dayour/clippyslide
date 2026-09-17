# ClippySlide

**A ClippyFlow-first slide design system for premium, dark, agentic presentations.**

ClippySlide now defaults to **ClippyFlow**: a deep-navy spectrum canvas, translucent navy cards, spectrum-gradient titles, and nitrous-blue structural rims. The original CoE token extraction remains available as legacy assets, but new slides, the generator, the presenter, the docs, and the skill all use ClippyFlow by default.

![The full 24-slide deck, reproduced in ClippySlide](website/static/img/contact-sheet.png)

The aesthetic: 16:9 deep-navy spectrum canvas, translucent rounded cards, spectrum title text, a single electric nitrous accent for structure, and a brand-spectrum health bar. The core rule is simple: **ClippyFlow is the default; legacy CoE assets stay available under `clippyslide-legacy.*` names.**

## What's in here

| Folder | What |
| --- | --- |
| [`design-system/`](design-system) | ClippyFlow CSS component library + token profiles (JSON / XML / YAML), plus legacy CoE profiles |
| [`generator/`](generator) | `build-deck.js` -- a zero-dependency generator that emits the ClippyFlow deck from one content model; `build-clippydecks.js` -- packages any deck folder into a single self-contained HTML presentation |
| [`clippydeck_harvest/`](clippydeck_harvest) | complete SWE specification, schemas, and examples for extracting reusable layouts, design, diagrams, media, and privacy-safe content bindings |
| [`deck/`](deck) | the generated ClippyFlow slides (standalone HTML + PNG previews) |
| [`brand-deck/`](brand-deck) | the ClippyFlow brand deck and mood board |
| [`planner-card-math/`](planner-card-math) | ClippyFlow task planning flow deck (generated) |
| [`atlassian-connectors/`](atlassian-connectors) | pine-themed Atlassian connector deck |
| [`slides-clippyflow/`](slides-clippyflow) | bespoke ClippyFlow slides and reference boards |
| [`slides/`](slides) | legacy CoE hand-authored slides |
| [`presenter/`](presenter) | `present.html` -- a viewport-grid presenter: full-bleed slides + one floating header layer |
| [`skill/`](skill) | the Clawpilot `/clippyslide` authoring skill (8 commands + scripts + assets) |
| [`skills/clippydeck-harvest/`](skills/clippydeck-harvest) | the 8-command extraction, binding, syntheticization, reconstruction, and validation skill |
| [`extension/`](extension) | Adaptive Card theme assets plus the zero-dependency Harvest content-binding and privacy plugin |
| [`website/`](website) | the Docusaurus wiki documenting all of the above |

## Quick start

```bash
git clone https://github.com/dayour/clippyslide.git
cd clippyslide

# look at a ClippyFlow slide
start deck/01.html              # macOS: open deck/01.html

# present the whole deck (full-bleed + floating header)
start presenter/present.html

# regenerate the deck from the content model
cd generator && node build-deck.js

# package every deck into a single self-contained HTML file
node generator/build-clippydecks.js
```

Presenter controls: `<-/->` navigate - `F` present (fullscreen) - `L` deck library - `H` hide header - `G` toggle measurement grid.

## Deck library

Every deck is also published as a **single self-contained HTML file** with all
CSS, JavaScript, and images inlined -- open it from the web, from disk, or from
an email attachment, with no other files required.

Browse them at **<https://dayour.github.io/clippyslide/library>**, or press `L`
inside any deck to jump straight to another one.

`node generator/build-clippydecks.js` packages every deck, copies the results
into `website/static/decks/`, and regenerates the library page. The deck list
lives in the `DECKS` registry at the top of that script -- add an entry there and
rebuild. See [Deck Packaging](website/docs/generator/packaging.md) for details.

> **`file://` note:** the presenter loads slides into an iframe. Launch the browser with `--allow-file-access-from-files`, or serve the folder over HTTP (`npx serve .`).

## The wiki

Extensive documentation lives in [`website/`](website) (Docusaurus):

```bash
cd website
npm install
npm start        # http://localhost:3000/clippyslide/
```

It covers the [design tokens](website/docs/design-system/tokens.md), the [reproduction method](website/docs/reproduction/methodology.md), the [ClippyDeck Harvest architecture](website/docs/harvest/overview.md), the [generator archetypes](website/docs/generator/archetypes.md), the [presenter](website/docs/presenter/overview.md), the [skill commands](website/docs/skill/commands.md), and the Adaptive Card [extensions](website/docs/harvest/plugin.md).

## License

[MIT](LICENSE).
