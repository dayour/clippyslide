---
sidebar_position: 2
title: Controls
---

# Controls

The presenter is keyboard-first, with a fallback header and invisible edge click-zones.

## Keyboard

| Key | Action |
| --- | --- |
| `->` `Space` `PageDown` | next slide |
| `<-` `PageUp` | previous slide |
| `Home` | first slide |
| `End` | last slide |
| `F` | toggle **present** (fullscreen) |
| `G` | toggle the **measurement grid** |
| `L` | open the **deck library** |
| `H` | hide / show the floating header |
| `Esc` | close the library, or exit fullscreen |

## Mouse

- **Header buttons** -- `‹` / `›` step, `present` goes fullscreen, `grid` toggles the overlay.
- **Edge click-zones** -- the left and right 12% of the screen are invisible prev/next buttons, so you can click-advance without aiming at the header.
- **Mouse-move** -- reveals the header if it has auto-hidden.

## Presenting

Press `F` (or the `present` button) to go fullscreen. In presentation:

- The header auto-hides after ~2.8s of no mouse movement and returns when you move the mouse.
- Press `H` for a guaranteed-clean slide (no header at all).
- Press `G` to drop the measurement grid if it's on.

:::tip Clean present recipe
Open the presenter -> `G` to turn the grid off -> `F` to go fullscreen -> present with `<-/->`. The header will fade on its own.
:::

## Opening from `file://`

The presenter loads slides into an iframe. Browsers restrict `file://` iframe access by default. Two ways around it:

```powershell
# 1) launch the browser with the flag
msedge --new-window --allow-file-access-from-files `
  "file:///.../clippyslide/presenter/present.html"
```

```bash
# 2) serve the folder over HTTP (no flag needed)
cd clippyslide
npx serve .
# then open http://localhost:3000/presenter/present.html
```
