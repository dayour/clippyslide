---
sidebar_position: 2
title: Integration
---

# Integrating the Theme

How the `clippyslide-coe` theme wires into the TileSlide app. This is a record of the integration so it can be reproduced or ported.

## Frontend (`index.html`)

The app is a single-file Tauri/Vite frontend. The theme adds:

1. **`THEMES` registry + `coeHostConfig`** -- defined next to the existing Fluent host config.
2. **`state.theme`** -- deck-level, defaults to `fluent-dark`.
3. **`renderCardToHost(hostId, payload, { themeName })`** -- applies the theme's host config, sets `data-theme` on the host, and runs `decorateCoe()` after render. Only the **main slide host** is themed; the toolbar/sidebar/status chrome stays neutral.
4. **A Theme toggle** in the toolbar (`cycle_theme`) and persistence through save / load / sample-load / **export**.
5. **A bundled CoE sample deck** at `src/decks/coe-sample/` and a `#load=coe` deep-link.

:::tip Export fidelity
The app's HTML export scrapes the first `<style>` block -- so keeping the CoE CSS inside that block means exported decks carry the theme automatically. The export's render function also embeds the active theme's host config and the `decorateCoe` pass, so a themed deck round-trips without the app.
:::

## Backend (`src-tauri/src/deck.rs`)

Three Rust changes make the manifest theme-aware:

```rust
pub struct Deck {
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub theme: Option<String>,           // deck-level theme name
    #[serde(default, alias = "cards")]   // accept the front-end "cards" key
    pub slides: Vec<SlideRef>,
}
```

Plus the standalone HTML exporter pins `adaptivecards@3.0.4` (not `@latest`) so exports don't drift with upstream releases. `cargo check` passes clean.

## The bundled sample

`extension/coe-sample/` is a two-slide deck authored entirely in plain Adaptive Card JSON with `coe-*` marker ids:

| File | Demonstrates |
| --- | --- |
| `01-usecase.json` | blue panel, cyan kicker, magenta title, underlined h2, Trigger->Plan->Act pills, divider, knowledge/tools tiles |
| `02-lifecycle.json` | hero panel, dev/sandbox/prod environment cards, rainbow health bar |

Both wrap their content in a transparent `coe-stage` container so panels size to content instead of inheriting the slide's full height.

## Verifying

The theme was validated in isolation (an HTML harness rendering the two sample cards with the same CSS + host config + decorator) **before** touching the 1,400-line `index.html`, then re-verified live in the app via the `#load=coe` deep-link. The order matters: prove the hard part (the visual theme) in isolation, then integrate.

## Harvest content binding

`extension/clippydeck-harvest.js` adds a theme-independent content layer. It resolves `${content.path}` strings before an Adaptive Card is parsed, applies deterministic synthetic substitutions, inventories bindings, and scans resolved output for forbidden customer terms. Keep this separate from visual decoration: Harvest selects content; `coe-theme.js` or a ClippyFlow theme styles the resulting card.

See [Harvest Runtime Plugin](/harvest/plugin) for the API and security contract.

## Presenter vs. extension

Two ways to present a ClippySlide deck:

- The [**viewport-grid presenter**](/presenter/overview) -- for the pixel-faithful HTML deck. This is the canonical, clean present path.
- The **TileSlide extension** -- for live, editable Adaptive-Card decks that need in-app authoring.

They share the look, not the layout engine.
