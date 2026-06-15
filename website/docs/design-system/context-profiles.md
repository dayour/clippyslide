---
sidebar_position: 4
title: Context Profiles
---

# Context Profiles

The default ClippyFlow token set is published in CSS, JSON, YAML, and XML-adjacent forms so tools, agents, and humans can consume one contract. The files live in [`design-system/`](https://github.com/dayour/clippyslide/tree/main/design-system).

| File | Format | Audience |
| --- | --- | --- |
| `clippyslide.css` | CSS | HTML slides and the presenter |
| `clippyslide.tokens.json` | JSON | programmatic consumers, validators, generators |
| `clippyslide.profile.yaml` | YAML | human/agent authoring contract |
| `clippyslide.theme.xml` | XML | OOXML-adjacent theme mapping |

The original CoE extraction artifacts remain available as `clippyslide-legacy.css`, `clippyslide-legacy.tokens.json`, `clippyslide-legacy.profile.yaml`, and `clippyslide-legacy.theme.xml`.

## `clippyslide.tokens.json`

The structured ClippyFlow token database records spectrum hues, nitrous structural tokens, surfaces, gradients, charts, status roles, geometry, and component names:

```json
{
  "name": "Clippyflow",
  "colorScheme": "dark",
  "nitrous": {
    "base": { "token": "--nitrous", "purpose": "accent base -- outlines, focus rings, scrollbars, message-bubble rims" }
  },
  "gradient": {
    "spectrum": { "note": "panel rim + accent bar + kicker text" },
    "title": { "note": "display-title text gradient" }
  }
}
```

## `clippyslide.profile.yaml`

The authoring contract is read by agents and humans before authoring a slide:

```yaml
apiVersion: clippyflow/v1
kind: DesignProfile
metadata:
  name: Clippyflow
principles:
  - Deep-navy SPECTRUM canvas -- magenta top-left, cyan center, green bottom-right.
  - Nitrous equals structure: rims, focus rings, scrollbars, dividers, section underlines.
  - Brand-action / CTA fill is cyan, not nitrous.
  - Zero emoji. High contrast (AA). Premium, dark, restrained.
```

## `clippyslide.theme.xml`

The XML projection maps ClippyFlow into an OOXML-adjacent color scheme and gradient list. It is intentionally not the old CoE extraction; the CoE XML lives under the legacy filename.

## Why keep legacy profiles?

Legacy CoE assets are still useful for reproduction-method documentation, comparison, and customer-specific decks that intentionally need the original extracted look. They are no longer the default path for new ClippySlide work.
