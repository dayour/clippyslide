---
sidebar_position: 2
title: Environment Notes
---

# Environment Notes

Hard-won operational notes from building ClippySlide on Windows. These are the things that cost time the first time.

## Rendering `.pptx` -> PNG

- **LibreOffice is not required and was not used.** Render via **PowerPoint COM**:
  ```powershell
  $ppt = New-Object -ComObject PowerPoint.Application
  $pres = $ppt.Presentations.Open($src, $true, $false, $false)
  $pres.Slides.Item(3).Export($out, "PNG", 1280, 720)
  ```
- **Locked files** -- PowerPoint/OneDrive hold an exclusive lock. `Copy-Item` the deck to a scratch path before opening it with `zipfile` or COM.

## Rendering HTML -> PNG (headless Edge)

The reliable invocation:

```powershell
& msedge --headless=new --disable-gpu --no-sandbox `
  --user-data-dir="$tmp" `              # isolated; Edge is usually already running
  --allow-file-access-from-files `      # so iframes/links resolve on file://
  --force-device-scale-factor=2 --window-size=1280,720 `
  --virtual-time-budget=6000 `
  --screenshot="$absolutePath" "$url" 2>$null
```

- The `--screenshot` path **must be absolute**.
- URL-encode spaces in `file://` paths: `OneDrive%20-%20Microsoft`.
- The **Playwright MCP browser fails** for this local-file screenshot workflow -- use Edge headless directly.

## OOXML units

| Attribute | Unit | Convert |
| --- | --- | --- |
| gradient stop `pos` | 1/1000 % | `48000` -> `48%` |
| line `ang` | 1/60000 deg | `8100000` -> `135deg` |
| `alpha val` | 1/1000 % | `10000` -> `10%` |
| `srgbClr val` | hex sans `#` | `F77181` -> `#F77181` |

## Markdown image embeds (Clawpilot)

Inline images render only from the workspace dir and need URL-encoded spaces:

```
![x](file:///C:/Users/dayour/OneDrive%20-%20Microsoft/Documents/Clawpilot/...)
```

A frequent typo is dropping `/OneDrive` and writing `C:/Users/dayour%20-%20Microsoft/...` -- which breaks the image.

## Toolchain versions

Built and verified on: **Node 25**, **npm 11**, **Python 3.14** (+ Pillow), **Rust 1.94** (for the TileSlide `cargo check`). The generator itself has **zero dependencies** and runs on Node >= 18.

## The presenter on `file://`

The presenter loads slides into an iframe. From `file://`, either launch the browser with `--allow-file-access-from-files`, or serve the folder over HTTP (`npx serve .`). Over HTTP no flags are needed.
