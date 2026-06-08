---
sidebar_position: 1
title: Design Tokens
---

# Design Tokens

Every value below was extracted **verbatim** from `CoE_Framework.pptx` by reading the slide XML out of the `.pptx` zip. OOXML stores gradient stops in 1/1000 of a percent and angles in 60,000ths of a degree — those were converted to CSS. See [Reproduction Method](/reproduction/methodology) for how.

## The signature four

The entire palette is built from four colors:

| Token | Hex | Role |
| --- | --- | --- |
| `--cs-peri` | `#818EFF` | periwinkle |
| `--cs-cyan` | `#39B0FF` | cyan-blue |
| `--cs-coral` | `#F77181` | coral-pink |
| `--cs-mag` | `#CA5BCD` | magenta |

## Gradients

| Token | Definition | Used for |
| --- | --- | --- |
| `--cs-grad-blue` | `linear-gradient(135deg, #818EFF, #39B0FF)` | standard panel borders |
| `--cs-grad-hero` | `linear-gradient(135deg, #F77181 0%, #CA5BCD 48%, #818EFF 100%)` | hero panel borders |
| `--cs-grad-title` | `linear-gradient(90deg, #F77181 0%, #CA5BCD 50%, #818EFF 100%)` | title text |
| `--cs-grad-health` | `linear-gradient(90deg, #E33B3B, #E8932F 22%, #E7D63B 44%, #A9D63B 68%, #22C24E)` | the rainbow health bar |

:::note Stop positions are real
The hero gradient's `48%` magenta stop and the health bar's `22/44/68%` stops are not aesthetic guesses — they are the converted `pos` attributes from the source XML (`48000` = 48%).
:::

## The radial-glow trick (the most important token)

The panels look like they have a "dark navy" fill. **They do not.** The body is pure black with the *same border colors* painted as a **radial gradient at 10% alpha**:

```css
.cs-panel > .cs-in::before{
  content:""; position:absolute; inset:0; border-radius:inherit;
  background:radial-gradient(120% 130% at 18% 0%,
      rgba(129,142,255,.10) 0%, rgba(57,176,255,.10) 100%);
}
```

This is why the deck reads as "premium" rather than flat: every panel has a faint internal light source that matches its border. Reproduce a panel with a solid navy fill and it dies instantly.

## Surfaces & geometry

| Token | Value |
| --- | --- |
| `--cs-black` | `#000000` (canvas) |
| `--cs-ink` | `#07070C` (near-black base) |
| `--cs-white-panel` | `#FFFFFF` (diagram inner panels) |
| `--cs-tile-light` | `#CFE8F7` (knowledge/tools tiles) |
| `--cs-radius` | `16px` |
| `--cs-radius-sm` | `10px` |
| `--cs-border` | `1.6px` (gradient ring thickness, ≈2px at source) |
| `--cs-pad` | `20px` |

## Environment cards

The lifecycle slides color-code by environment:

| Env | Background | Border |
| --- | --- | --- |
| Dev | `linear-gradient(135deg, #A85546, #5E2A22)` (brick-red) | `#C77866` |
| Sandbox | `linear-gradient(135deg, #4E6E96, #2A3F5C)` (steel-blue) | `#7C9AC2` |
| Prod | `linear-gradient(135deg, #1E1410, #0A0A0A)` | `#2FA84F` (green) |

:::info Contrast fix
The Dev gradient was lightened from the source's near-black brick to `#A85546 → #5E2A22` so the white card text stays legible on the black canvas. This is the one deliberate deviation from verbatim tokens, and it's documented here for honesty.
:::

## Typography

| Token | Value |
| --- | --- |
| `--cs-font` | `"Segoe UI Variable","Segoe UI",system-ui,sans-serif` |
| Title | weight 800, 46px, gradient-clipped |
| Kicker | weight 700, 30px, cyan |
| H2 | weight 700, 22px (`.under` adds a 2px underline) |
| Body | weight 400, 16px, `rgba(255,255,255,.82)` |
| Mono | `"Cascadia Code","Consolas",monospace` |

## Glow shadows

| Token | Value |
| --- | --- |
| `--cs-glow-blue` | `0 0 18px rgba(80,140,255,.28)` |
| `--cs-glow-hero` | `0 0 22px rgba(202,91,205,.34)` |

The same four tokens are mirrored, byte-for-byte, in the [machine-readable profiles](/design-system/context-profiles) (`clippyslide.tokens.json`, `.theme.xml`, `.profile.yaml`).
