---
sidebar_position: 1
title: Methodology
---

# The Reproduction Method

The single idea that makes ClippySlide work: **don't eyeball a design -- read its source.** A `.pptx` is a zip of XML. Every color, gradient stop, and dimension is in there as a number. Extracting those numbers gives a pixel-faithful reproduction that no amount of "looks about right" can match.

[ClippyDeck Harvest](/harvest/overview) generalizes this method across PPTX, PDF, HTML, images, video, diagrams, and Adaptive Cards, and separates mutable customer content into real and synthetic JSON profiles.

## Step 1 -- A `.pptx` is a zip

```python
import zipfile
with zipfile.ZipFile("CoE_Framework.pptx") as z:
    names = [n for n in z.namelist() if n.startswith("ppt/slides/")]
    xml = z.read("ppt/slides/slide3.xml").decode("utf-8")
```

:::warning Locked files
PowerPoint / OneDrive hold an exclusive lock on open decks. Copy the file to a scratch location first (`Copy-Item`) before opening it with `zipfile` or COM.
:::

## Step 2 -- Read the gradient fills

Gradient fills live in `<a:gradFill>` elements. The key is understanding OOXML's units:

| OOXML attribute | Unit | Example | Means |
| --- | --- | --- | --- |
| `<a:gs pos="48000">` | 1/1000 of a percent | `48000` | stop at **48%** |
| `<a:lin ang="8100000">` | 1/60000 of a degree | `8100000` | **135deg** |
| `<a:alpha val="10000">` | 1/1000 of a percent | `10000` | **10%** alpha |
| `<a:srgbClr val="F77181">` | hex (no `#`) | `F77181` | `#F77181` |

So the hero border's `pos="48000"` magenta stop becomes the `48%` you see in `--cs-grad-hero`. Nothing is guessed.

## Step 3 -- Decode the "navy" panels

The biggest find: panels that *look* navy are black with a 10%-alpha radial gradient of the **border colors**. In the XML this is a `<a:gradFill>` with `<a:path d="circle">` and `<a:alpha val="10000">` stops in the same hues as the border. Reproduce it as:

```css
background: radial-gradient(120% 130% at 18% 0%,
  rgba(129,142,255,.10), rgba(57,176,255,.10));
```

This is the difference between "premium" and "flat." See [Context Profiles](/design-system/context-profiles) for where the legacy CoE extraction artifacts are preserved.

## Step 4 -- Render the source for visual diff

To compare your reproduction against truth, render the real slides to PNG:

```powershell
# PowerPoint COM (no LibreOffice required)
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($src, $true, $false, $false)
$pres.Slides.Item(3).Export($out, "PNG", 1280, 720)
```

Then render your HTML reproduction with headless Edge and put them side by side:

```powershell
& msedge --headless=new --no-sandbox --force-device-scale-factor=2 `
  --window-size=1280,720 --screenshot="$out" "file:///.../slide.html"
```

## Step 5 -- Promote the numbers into tokens

Once the diff matches, the extracted values become the [token profiles](/design-system/context-profiles) and the [CSS](/design-system/css-reference). From that point on, every slide in the deck is built from the same numbers -- which is what makes a 24-slide deck look like one deck.

## The anti-pattern

The first reproduction attempt skipped all of this and approximated the look by eye. It was "fine" and instantly read as AI-generated. The lesson, encoded into the [skill](/skill/overview) and the [profiles](/design-system/context-profiles): **extract, don't approximate.**
