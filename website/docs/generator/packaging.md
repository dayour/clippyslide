---
sidebar_position: 4
title: Deck Packaging
---

# Deck Packaging

`generator/build-clippydecks.js` turns a folder of slide files into a **single
self-contained HTML presentation**. Every stylesheet, script, and image is
inlined, so the result opens from GitHub Pages, from disk, or from an email
attachment with no other files and no network access.

```bash
node generator/build-clippydecks.js
```

One command packages every registered deck, publishes the results into
`website/static/decks/`, regenerates the ClippyFlow `planner-card-math` slides,
and rewrites [the Library page](/library).

To rebuild only the eight planner slides and their local/published single-file
decks without changing another deck:

```bash
node generator/build-clippydecks.js --planner-only
node --test generator/build-clippydecks.test.js
```

The planner uses the same `clippyflow.css` and `clippyflow-terminal.css` as
`brand-deck`: a dark spectrum canvas, terminal window chrome, spectrum titles,
translucent panels, and nitrous-blue rims. These styles are linked in individual
slides and inlined in the packaged deck. Do not substitute the separate light
PowerPoint preset or apply the theme only to the viewer. The planner viewer also
stays dark regardless of the operating-system color preference.

The planner also uses a **viewport-filling canvas**. Its 1280x720 reference
controls a single uniform text/graphics scale; the layout expands along the
other axis to fill wide or tall browser frames. Only the brand deck's intentional
22-unit terminal inset remains. There is no second fixed-ratio frame, extra
viewer border, cropped content, or stretched typography. Individual slide HTML
files and the packaged deck use the same resize behavior, including when embedded
in an iframe.
Mouse and keyboard events inside the responsive slide iframe also reach the
viewer controls. `H` pins or unpins the bar; moving the pointer over slide content
reveals it without requiring a click on the page background.

The planner content is stored in the generator; its original HTML path is
provenance, not a build dependency. Visual review must compare **all eight**
rendered slides with the brand deck, including the overview, function labels,
question-card identifiers, and schema table. A slide loading successfully does
not establish theme fidelity, readability, or freedom from clipping.
Review at the reference 1280x720 size **and** non-16:9 sizes such as 1800x900
and 1024x768, plus a compact viewport. Confirm the canvas reaches all four
viewport edges, the terminal has even gutters, and all text and controls fit.

## The deck registry

`DECKS`, at the top of the script, is the single source of truth. It drives the
Library overlay inside every deck *and* the Library page on this site, so the
two cannot drift.

```js
const DECKS = [
  { id:'deck', dir:'deck', file:'coe-framework-clippydeck.html',
    name:'Copilot CoE Framework', theme:'TileSlide', slides:24,
    blurb:'Center of Excellence operating model, from intake and governance through measurement.' },
  // ...
];
```

| Field | Purpose |
| --- | --- |
| `id` | Stable key; also the value passed to `packageDeck` for "you are here" highlighting |
| `dir` | Source folder, relative to the repository root |
| `file` | Output filename, written to both `dir/` and `website/static/decks/` |
| `name` `theme` `blurb` | Library card copy |
| `slides` | Expected slide count; the build overwrites it with the real count |

To add a deck: drop the slide HTML in a folder, append a registry entry, and
rebuild.

## How inlining works

| Source | Becomes |
| --- | --- |
| `<link rel="stylesheet" href="x.css">` | `<style>` with the file contents |
| `<script src="x.js">` | inline `<script>` |
| `<img src="x.png">` | `src="data:image/png;base64,..."` |
| `url(x.svg)` inside CSS | `url(data:image/svg+xml;base64,...)` |

`https:`, `data:`, and `blob:` URLs are left untouched. A slide with no HTML
source falls back to its rendered `NN.png`.

Packaged slides are stored as a base64 JSON payload and rendered through
`iframe.srcdoc`, which keeps each slide's CSS isolated from the viewer shell and
from its neighbours. `</` is escaped in the payload so the embedded HTML cannot
terminate the `<script>` block early.

## Viewer controls

| Key | Action |
| --- | --- |
| `←` `→` `PageUp` `PageDown` `Space` | Previous / next slide |
| `Home` `End` | First / last slide |
| `F` | Fullscreen |
| `L` | Open the Library overlay |
| `H` | Pin the control bar |
| `Escape` | Close the Library |

Fixed-layout decks contain-scale their 1280x720 stage; the planner instead fills
the available viewport as described above. The control bar is a top scrim
that stays hidden until the pointer moves and fades again after a short idle, so
it never competes with slide content. Clicking the left or right edge of the
stage navigates; those click-zones start below the bar so they cannot swallow
clicks on its buttons.

## Where decks are published

GitHub Pages serves `website/build`, so a deck is only reachable once it is
copied into `website/static/`. The build does that automatically:

```
website/static/decks/<file>  ->  https://dayour.github.io/clippyslide/decks/<file>
```

Library links use that absolute URL, which means the Library still works from a
deck that has been downloaded and opened from disk.

## Guardrails

- Never hand-edit a `*-clippydeck.html`; it is generated output.
- Slide sources must reference assets with paths that resolve from the slide's
  own folder, otherwise the asset is silently left as an external reference.
  The build is strict about missing slides but not about missing assets.
- `*-clippydeck.html` files are excluded when scanning a folder for slides, so
  rebuilding never packages a deck inside itself.
