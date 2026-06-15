---
sidebar_position: 1
title: Design Tokens
---

# Design Tokens

ClippySlide defaults to **ClippyFlow**. The canonical token files are:

| File | Purpose |
| --- | --- |
| `design-system/clippyslide.css` | Default ClippyFlow CSS entrypoint |
| `design-system/clippyslide.tokens.json` | Default machine-readable ClippyFlow token profile |
| `design-system/clippyslide.profile.yaml` | Default human/agent authoring contract |
| `design-system/clippyslide.theme.xml` | OOXML-adjacent ClippyFlow theme projection |

The original CoE extraction is preserved under `clippyslide-legacy.*` names.

## Spectrum

| Token | CSS variable | Role |
| --- | --- | --- |
| Cyan | `--clippy-cyan` | Brand fills and subtle backgrounds |
| Bright cyan | `--clippy-cyan-br` | CTA and brand-action fill |
| Blue | `--clippy-blue` | Link and action endpoint |
| Purple | `--clippy-purple` | Primary brand hue |
| Magenta | `--clippy-magenta` | Danger and high-energy accent |
| Green | `--clippy-green` | Success and positive status |
| Orange | `--clippy-orange` | Warning and chart-5 only |

## Nitrous structure

Nitrous is the one structural accent:

| Token | CSS variable | Purpose |
| --- | --- | --- |
| Base | `--nitrous` | Rims, dividers, underlines, focus rings |
| Strong | `--nitrous-strong` | Hover and focus emphasis |
| Glow | `--nitrous-glow` | Soft halo for active cards |
| Rim | `--nitrous-rim` | Thin, solid-feeling outline |
| Tint | `--nitrous-tint` | Subtle border and separator |

Rule: nitrous is never a chart or data hue. Charts use cyan, green, magenta, purple, and orange.

## Gradients

| Token | Definition | Used for |
| --- | --- | --- |
| `--cf-grad-spectrum` | cyan to nitrous to purple to magenta | panel rims, accent bars, kicker text |
| `--cf-grad-title` | bright cyan to blue to purple to magenta | display title text |
| `--cf-grad-action` | bright cyan to blue | CTA fill |
| `--cf-grad-health` | magenta to purple to nitrous to cyan to green | health and progress bars |
| `--cf-bg` | magenta TL, cyan center, green BR over navy | stage background |

## Surfaces and geometry

| Token | Value |
| --- | --- |
| `--cf-navy` | `hsl(200,16%,8%)` |
| `--cf-navy-deep` | `hsl(206,30%,5%)` |
| `--cf-surface` | `hsla(200,16%,12%,.94)` |
| `--cf-surface-2` | `hsla(200,18%,16%,.92)` |
| `--cf-radius` | `16px` |
| `--cf-radius-sm` | `10px` |
| `--cf-rim` | `1.5px` |
| `--cf-pad` | `20px` |

Surfaces stay translucent so the spectrum background remains visible behind cards.

## Typography

| Token | Value |
| --- | --- |
| `--cf-font` | `"Segoe UI Variable","Segoe UI",system-ui,sans-serif` |
| `--cf-mono` | `"Cascadia Code","Consolas",ui-monospace,monospace` |
| Title | weight 800, 46px, gradient-clipped |
| Kicker | weight 700, 30px, uppercase spectrum gradient |
| H2 | weight 700, 22px; `.under` adds a nitrous rule |
| Body | weight 400, 16px, soft foreground |

## Compatibility aliases

`clippyslide.css` includes compatibility aliases for generated ClippySlide layouts:

| Alias | Maps to |
| --- | --- |
| `.cf-stage--title` / `.cf-stage--glow` | ClippyFlow stage backgrounds |
| `.cf-panel.blue` | Nitrous-rim panel |
| `.cf-panel.hero` | Spectrum-rim panel |
| `.cf-pill.blue` / `.cf-pill.mag` | Cyan / magenta ClippyFlow pills |
| `.cf-greenpanel` | Legacy side-panel layout restyled as ClippyFlow |

Use native `cf-` classes for new slides. The aliases exist so the generator and older layout archetypes can remain stable while using the ClippyFlow default.
