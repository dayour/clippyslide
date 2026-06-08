---
id: quick-start
slug: /quick-start
sidebar_position: 2
title: Quick Start
---

# Quick Start

Everything in ClippySlide is plain files — HTML, CSS, a single Node script, and JSON/YAML profiles. No build toolchain is required to use the design system; Node is only needed to regenerate the deck.

## Prerequisites

- **Node.js** ≥ 18 (the generator uses no dependencies; tested on Node 25).
- A **Chromium-based browser** (Edge/Chrome) to view the slides and presenter.
- Optional: **Python 3** + Pillow for contact sheets, and PowerPoint COM or LibreOffice for `.pptx → PNG` rendering.

## Clone

```bash
git clone https://github.com/dayour/clippyslide.git
cd clippyslide
```

## Look at the deck

The generated deck lives in [`deck/`](https://github.com/dayour/clippyslide/tree/main/deck) as standalone HTML files (each links `../design-system/clippyslide.css`). Open any of them directly:

```bash
# Windows
start deck/01.html
# macOS
open deck/01.html
```

## Present the deck

Open the presenter for a clean, full-bleed, navigable view of all 24 slides:

```bash
start presenter/present.html      # Windows
open  presenter/present.html      # macOS
```

Controls: `←/→` navigate · `F` present (fullscreen) · `H` hide the header · `G` toggle the measurement grid. See [Presenter → Controls](/presenter/controls).

:::tip File paths
The presenter loads slides into an `<iframe>`. When opening from `file://`, launch the browser with `--allow-file-access-from-files` (Edge/Chrome) so the iframe can load sibling slide files, or serve the folder over HTTP (`npx serve`).
:::

## Regenerate the deck

All 23 generated slides (slide 7 is bespoke) come from one script:

```bash
cd generator
node build-deck.js
# -> writes ../deck/NN.html + ../deck/index.json
```

Edit the `SLIDES[]` content model inside [`build-deck.js`](/generator/content-model), not the HTML outputs. See [Deck Generator](/generator/overview).

## Use the design system in your own slide

```html
<!DOCTYPE html><html><head>
  <link rel="stylesheet" href="design-system/clippyslide.css">
</head><body>
  <div class="cs-stage cs-stage--glow">
    <div class="cs-panel blue" style="left:80px;top:120px;width:520px;height:300px">
      <div class="cs-in" style="padding:24px">
        <div class="cs-title">Hello, CoE</div>
        <div class="cs-body">A glowing gradient-border panel, straight from the token set.</div>
      </div>
    </div>
  </div>
</body></html>
```

See [Components](/design-system/components) for the full class list.

## Build this wiki locally

```bash
cd website
npm install
npm start          # dev server at http://localhost:3000/clippyslide/
npm run build      # static build into website/build
```
