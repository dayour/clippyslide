# clippydeck_harvest

A specification-first pipeline for harvesting reusable presentation structure from PPTX, PDF, HTML, images, video, and existing ClippyDeck artifacts.

The package separates four concerns:

- `layout.template.json`: geometry, visual roles, topology, and binding expressions.
- `design.tokens.json`: colors, typography, spacing, effects, and provenance.
- `content.synthetic.json`: publishable Adaptive Card-compatible text variables.
- `content.real.json`: optional restricted values, never committed or published.

Start with [SPEC.md](SPEC.md). Schemas and worked examples are in `schemas/` and `examples/`.

## Binding example

```json
{
  "type": "TextBlock",
  "id": "slide-title",
  "text": "${content.slides.slide001.title}"
}
```

The runtime helper in `extension/clippydeck-harvest.js` resolves bindings and applies a deterministic replacement map without network or storage access.
