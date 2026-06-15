---
sidebar_position: 1
title: CoE Theme
---

# TileSlide Extension -- CoE Theme

[TileSlide](https://github.com/DarbotLM/tileslide) is a separate Tauri + Vite app that renders slides as **live Adaptive Cards**. ClippySlide extends it with a `clippyslide-coe` theme so an editable AC deck can wear the exact CoE look -- black canvas, gradient-border panels, magenta titles, rainbow health bar.

![The CoE theme on Adaptive Cards](/img/extension-theme.png)

The extension assets live in [`extension/`](https://github.com/dayour/clippyslide/tree/main/extension): `coe-theme.css`, `coe-theme.js`, and a bundled `coe-sample/` deck.

## The design problem

Adaptive Cards are **flow-laid** -- there's no absolute positioning like the HTML deck. So the extension adapts the CoE *look* (colors, glows, gradient borders, the health bar) onto AC's flowing layout, rather than trying to reproduce pixel coordinates.

## Three pieces

### 1 - A theme registry

A `THEMES` map holds two host configs -- the app's `fluent-dark` default and `clippyslide-coe` (transparent AC containers so the scoped CSS can paint the glow). The active theme is **deck-level state**, persisted through save / load / export.

### 2 - A post-render decoration pass

This is the crux. An Adaptive Card element's `id` survives to the rendered DOM as the element's `id` (verified empirically via `--dump-dom`). So authors mark a panel in plain card JSON:

```json
{ "type": "Container", "id": "coe-panel-hero", "items": [
  { "type": "TextBlock", "id": "coe-title-magenta", "text": "Agent Lifecycle" }
]}
```

After render, `decorateCoe()` copies each `coe-<role>` id to a `data-coe-role` attribute (stripping a trailing `--N` disambiguator so duplicate roles are allowed):

```js
function decorateCoe(root){
  root.querySelectorAll('[id^="coe-"]').forEach(function(el){
    el.setAttribute('data-coe-role', el.id.replace(/^coe-/,'').replace(/--\d+$/,''));
  });
}
```

### 3 - Scoped CSS with the mask-ring trick

Styling keys off `[data-theme="clippyslide-coe"] [data-coe-role="..."]`. Gradient borders use a **mask-ring** so AC's own padding is never touched (the rubber-duck critique flagged that overriding AC padding breaks layout):

```css
[data-theme="clippyslide-coe"] [data-coe-role^="panel"]::before{
  content:""; position:absolute; inset:0; border-radius:16px; padding:1.6px;
  background:var(--cs-grad-blue);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none;
}
```

## The role vocabulary

| `data-coe-role` | Styles |
| --- | --- |
| `panel-blue` / `panel-hero` / `panel-white` | gradient-ring panels |
| `title-magenta` | gradient-clipped title |
| `kicker` / `h2-under` | cyan eyebrow / underlined subhead |
| `healthbar` | the rainbow bar |
| `env-dev` / `env-sandbox` / `env-prod` | environment cards |
| `pill-blue` / `pill-mag` / `tile` / `divider` | diagram primitives |

Author a card with these ids and it renders in full CoE styling. See [Integration](/extension/integration) for wiring it into the app.
