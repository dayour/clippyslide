# ClippySlide

**A slide design system reverse-engineered from a real premium PowerPoint deck — then productized.**

Every color, gradient, radius, and stop position in ClippySlide was lifted *verbatim* from the OOXML of a customer-grade deck (`CoE_Framework.pptx`). Nothing was eyeballed. The governing principle: **extract real design tokens from the source, never vibe-code them.**

![The full 24-slide deck, reproduced in ClippySlide](website/static/img/contact-sheet.png)

The aesthetic: pure-black 16:9 canvas, glowing gradient-border panels, magenta-gradient titles, a rainbow "health bar," and color-coded environment cards. The single most important detail — the "dark navy" panel bodies are not navy; they're the bright border colors painted as a **radial gradient at 10% alpha over black**.

## What's in here

| Folder | What |
| --- | --- |
| [`design-system/`](design-system) | the CSS component library + token profiles (JSON / XML / YAML) |
| [`generator/`](generator) | `build-deck.js` — a zero-dependency generator that emits the 24-slide deck from one content model |
| [`deck/`](deck) | the generated slides (standalone HTML + PNG previews) |
| [`slides/`](slides) | bespoke hand-authored slides (e.g. the orchestration diagram) |
| [`presenter/`](presenter) | `present.html` — a viewport-grid presenter: full-bleed slides + one floating header layer |
| [`skill/`](skill) | the Clawpilot `/clippyslide` skill (8 commands + scripts + assets) |
| [`extension/`](extension) | a theme for the TileSlide Adaptive-Card app, so live AC decks can wear the CoE look |
| [`website/`](website) | the Docusaurus wiki documenting all of the above |

## Quick start

```bash
git clone https://github.com/dayour/clippyslide.git
cd clippyslide

# look at a slide
start deck/01.html              # macOS: open deck/01.html

# present the whole deck (full-bleed + floating header)
start presenter/present.html

# regenerate the deck from the content model
cd generator && node build-deck.js
```

Presenter controls: `←/→` navigate · `F` present (fullscreen) · `H` hide header · `G` toggle measurement grid.

> **`file://` note:** the presenter loads slides into an iframe. Launch the browser with `--allow-file-access-from-files`, or serve the folder over HTTP (`npx serve .`).

## The wiki

Extensive documentation lives in [`website/`](website) (Docusaurus):

```bash
cd website
npm install
npm start        # http://localhost:3000/clippyslide/
```

It covers the [design tokens](website/docs/design-system/tokens.md), the [reproduction method](website/docs/reproduction/methodology.md), the [generator archetypes](website/docs/generator/archetypes.md), the [presenter](website/docs/presenter/overview.md), the [skill commands](website/docs/skill/commands.md), and the [TileSlide extension](website/docs/extension/coe-theme.md).

## License

[MIT](LICENSE).
