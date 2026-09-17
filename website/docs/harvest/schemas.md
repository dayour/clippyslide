---
sidebar_position: 3
title: Schemas and Bindings
---

# Schemas and Bindings

The v1 contracts live in [`clippydeck_harvest/schemas/`](https://github.com/dayour/clippyslide/tree/main/clippydeck_harvest/schemas).

| Schema | Purpose |
| --- | --- |
| `harvest-manifest.schema.json` | source provenance, privacy mode, slides, outputs, validation state |
| `layout-template.schema.json` | normalized slide geometry, semantic elements, and diagram relationships |
| `design-tokens.schema.json` | extracted visual tokens with evidence and confidence |
| `adaptive-content.schema.json` | real or synthetic content profile and entity inventory |
| `replacement-map.schema.json` | deterministic, typed substitutions and approval state |

## Binding syntax

Use dotted paths inside `${...}`:

```json
{
  "text": "${content.customer.displayName}",
  "altText": "Architecture for ${content.customer.displayName}"
}
```

An exact binding can resolve to a string, number, boolean, array, or object. An interpolated binding is converted to text. Missing bindings fail by default.

## Stable IDs

Element IDs describe function, not customer content:

```text
slide001-title
architecture-ingress
approval-gate
metric-adoption-rate
```

Do not derive IDs, filenames, CSS classes, or asset names from customer values.

## Runtime API

```js
const harvest = require('./extension/clippydeck-harvest');
const renderedCard = harvest.resolve(cardTemplate, contentProfile);
const synthetic = harvest.syntheticize(realProfile, replacementMap);
const bindings = harvest.collectBindings(cardTemplate);
const result = harvest.audit(renderedCard, forbiddenTerms);
```

See [Plugin](/harvest/plugin) for host integration.
