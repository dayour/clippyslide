---
sidebar_position: 1
title: File Map
---

# File Map

Where everything lives in the repository.

```
clippyslide/
├-- README.md
├-- LICENSE
├-- design-system/                 # the token-extracted source of truth
|   ├-- clippyslide.css            #   component library (cs-* classes)
|   ├-- clippyslide.tokens.json    #   structured tokens + provenance
|   ├-- clippyslide.theme.xml      #   OOXML-aligned theme projection
|   +-- clippyslide.profile.yaml   #   authoring contract + QA checklist
├-- generator/
|   ├-- build-deck.js              # data-driven 24-slide generator (zero deps)
|   +-- build-clippydecks.js       # packages deck folders into single-file decks
├-- deck/                          # generated output (do not hand-edit)
|   ├-- NN.html                    #   one standalone slide per file
|   ├-- NN.png                     #   rendered preview
|   ├-- index.json                 #   manifest the presenter reads
|   +-- *-clippydeck.html          #   packaged single-file presentation
├-- brand-deck/                    # ClippyFlow brand + mood board (11 slides)
├-- planner-card-math/             # ClippyFlow task planning deck (8 slides)
├-- atlassian-connectors/          # pine-themed connector deck (7 slides)
├-- slides-clippyflow/             # ClippyFlow reference slides
├-- slides/                        # bespoke, hand-authored slides
|   ├-- 01-title.html
|   ├-- 07-orchestration.html      #   the one slide the generator references
|   +-- 18-lifecycle.html
├-- presenter/
|   +-- present.html               # viewport-grid presenter (full-bleed + floating header)
├-- skill/                         # the Clawpilot /clippyslide skill
|   ├-- SKILL.md                   #   8 commands + self-reflection notes
|   ├-- assets/                    #   bundled CSS + profiles + example slides
|   +-- scripts/                   #   extract-tokens.py, render.ps1, pptx-to-png.ps1
├-- extension/                     # TileSlide Adaptive-Card theme
|   ├-- coe-theme.css              #   scoped [data-theme=clippyslide-coe] styles
|   ├-- coe-theme.js               #   host config + decorateCoe()
|   +-- coe-sample/                #   two-slide AC sample deck
+-- website/                       # this Docusaurus wiki
    ├-- docs/                      #   the wiki content
    |   +-- library.mdx            #     generated deck library page
    ├-- static/decks/              #   packaged decks published to Pages
    ├-- docusaurus.config.js
    +-- sidebars.js
```

## The "edit here, not there" rules

| If you want to change... | Edit | Not |
| --- | --- | --- |
| a slide's content | `generator/build-deck.js` (`SLIDES[]`) | `deck/NN.html` |
| a token | **both** CSS copies + the profiles | one copy |
| the look of all panels | `design-system/clippyslide.css` | individual slides |
| slide 7 | `slides/07-orchestration.html` | the generator |
| the presenter | `presenter/present.html` | -- |
| the deck list / Library | `DECKS` in `generator/build-clippydecks.js` | `website/docs/library.mdx` |
| a packaged deck | the deck's slide sources, then rebuild | `*-clippydeck.html` |

## Two CSS copies

`design-system/clippyslide.css` and `skill/assets/clippyslide.css` are intentional duplicates (the skill is self-contained). They **must** stay byte-identical; the [Design Guardian](/automation/design-guardian) checks this weekly.
