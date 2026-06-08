---
sidebar_position: 4
title: Context Profiles
---

# Context Profiles

The same token set is published in three machine-readable formats so that tools, agents, and humans can all consume one source of truth. They live in [`design-system/`](https://github.com/dayour/clippyslide/tree/main/design-system).

| File | Format | Audience |
| --- | --- | --- |
| `clippyslide.tokens.json` | JSON | programmatic consumers, validators, generators |
| `clippyslide.theme.xml` | XML | OOXML-adjacent tooling / theme mapping |
| `clippyslide.profile.yaml` | YAML | the human/agent authoring contract |

:::note A note on the name
The design system was developed under the working name **TileSlide** and renamed to **ClippySlide** to avoid clashing with the existing TileSlide Adaptive-Card app. The profiles still carry `name: TileSlide` and a `darbotlm.github.io/tileslide/...` schema URL as their **original provenance** — they are the literal extraction artifacts. The behavior is identical; only the project name changed.
:::

## `clippyslide.tokens.json`

The structured token database. It records not just the values but **where they came from**:

```json
{
  "name": "TileSlide",
  "version": "1.0.0",
  "source": {
    "deck": "CoE_Framework.pptx",
    "account": "Oceaneering",
    "extractedFrom": "ppt/slides/slide3.xml + theme1.xml",
    "method": "verbatim OOXML gradient-stop extraction"
  },
  "canvas": { "width": 1280, "height": 720, "ratio": "16:9", "background": "#000000" },
  "gradient": {
    "heroBorder": { "type": "linear", "angle": 135,
      "stops": [ {"pos":0,"color":"#F77181"}, {"pos":48,"color":"#CA5BCD"}, {"pos":100,"color":"#818EFF"} ] },
    "panelFillBlue": { "type": "radial", "alpha": 0.10,
      "stops": [ {"pos":0,"color":"#818EFF"}, {"pos":100,"color":"#39B0FF"} ],
      "note": "same border colors at 10% alpha over black = the inner glow" }
  }
}
```

Note the `pos` values are real percentages converted from the source XML's 1/1000-percent units, and the `panelFillBlue.note` documents the radial-glow trick inline.

## `clippyslide.profile.yaml`

The authoring contract — the "rules of the system" in prose, consumed by the [Clawpilot skill](/skill/overview) and read by agents before they author a slide:

```yaml
apiVersion: tileslide/v1
kind: DesignProfile
metadata:
  name: TileSlide
  source: CoE_Framework.pptx (Oceaneering, 01FY26)
  extractedBy: verbatim OOXML gradient extraction
principles:
  - Pure-black canvas with generous negative space; never a flat grey.
  - The signature is the glowing gradient BORDER, not a solid stroke.
  - Panel bodies glow from within (border colors @ 10% alpha radial over black).
  - Titles are magenta-gradient and bold; section sub-heads are underlined.
  - One coral accent bar may bleed partially off the left edge.
  - Zero emoji. High contrast. Premium, dark, restrained.
```

Those `principles` are the guardrails the [Design Guardian automation](/automation/design-guardian) and any authoring agent are expected to honor.

## `clippyslide.theme.xml`

An XML projection of the same palette and gradients, shaped for OOXML-adjacent tooling that prefers a theme-style document. It mirrors the JSON values exactly.

## Why three formats?

Because the consumers differ:

- A **generator** wants typed JSON it can `require()`.
- A **theme mapper** wants XML it can transform.
- An **agent or a human** wants YAML prose it can reason about.

Keeping them in lockstep is the job of the [Design Guardian](/automation/design-guardian), which fails if any of the three drifts from `clippyslide.css`.
