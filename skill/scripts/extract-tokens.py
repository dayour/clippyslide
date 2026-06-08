#!/usr/bin/env python3
"""
clippyslide :: extract-tokens
Extract design tokens (gradients, solid colors, theme palette, geometry, per-slide
text) VERBATIM from a reference .pptx by reading the OOXML directly from the zip.

This is the exact method used to reverse-engineer CoE_Framework.pptx into the
ClippySlide design system: no eyeballing, real hex/stop/alpha values from slideN.xml.

Usage:
    python extract-tokens.py <reference.pptx> [--slide N] [--out tokens.json]

Notes:
- If the .pptx is open/locked (PowerPoint/OneDrive), copy it first:
    Copy-Item src.pptx scratch.pptx -Force
- Gradient stop positions are in 1/1000 % (pos 48000 == 48%); alpha likewise.
- Angles are in 60,000ths of a degree (ang 2700000 == 45 deg in DrawingML terms).
"""
import sys, re, json, zipfile, argparse
from collections import Counter


def _slide_names(z):
    names = [n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)]
    return sorted(names, key=lambda n: int(re.search(r"(\d+)", n).group(1)))


def slide_text(z, name):
    x = z.read(name).decode("utf-8", "ignore")
    return [r for r in re.findall(r"<a:t>(.*?)</a:t>", x) if r.strip()]


def gradients(xml):
    out = []
    for g in re.findall(r"<a:gradFill.*?</a:gradFill>", xml, re.S):
        stops = []
        for pos, inner in re.findall(r'<a:gs pos="(\d+)">(.*?)</a:gs>', g, re.S):
            c = re.search(r'srgbClr val="([0-9A-Fa-f]{6})"', inner)
            a = re.search(r'alpha val="(\d+)"', inner)
            sc = re.search(r'schemeClr val="(\w+)"', inner)
            stops.append({
                "pos": round(int(pos) / 1000, 2),
                "color": ("#" + c.group(1)) if c else (("scheme:" + sc.group(1)) if sc else None),
                "alpha": round(int(a.group(1)) / 1000, 1) if a else 100.0,
            })
        ang = re.search(r'<a:lin ang="(-?\d+)"', g)
        path = re.search(r'<a:path path="(\w+)"', g)
        out.append({
            "kind": "linear" if ang else ("radial/" + path.group(1) if path else "shade"),
            "angleDeg": round(int(ang.group(1)) / 60000, 1) if ang else None,
            "stops": stops,
        })
    return out


def dedupe(grads):
    seen, uniq = set(), []
    for g in grads:
        key = json.dumps(g, sort_keys=True)
        if key not in seen:
            seen.add(key)
            uniq.append(g)
    return uniq


def theme_palette(z):
    try:
        t = z.read("ppt/theme/theme1.xml").decode("utf-8", "ignore")
    except KeyError:
        return {}
    cs = re.search(r"<a:clrScheme.*?</a:clrScheme>", t, re.S)
    pal = {}
    if cs:
        for name in ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3",
                     "accent4", "accent5", "accent6"]:
            m = re.search(rf'<a:{name}>(.*?)</a:{name}>', cs.group(0), re.S)
            if m:
                c = re.search(r'(?:srgbClr|sysClr|lastClr=")["\s]*val="?([0-9A-Fa-f]{6})"', m.group(1)) \
                    or re.search(r'lastClr="([0-9A-Fa-f]{6})"', m.group(1))
                pal[name] = ("#" + c.group(1)) if c else None
    return pal


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pptx")
    ap.add_argument("--slide", type=int, default=None, help="focus a single slide for gradients")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    z = zipfile.ZipFile(a.pptx)
    slides = _slide_names(z)

    # presentation size
    pres = z.read("ppt/presentation.xml").decode("utf-8", "ignore")
    sz = re.search(r'<p:sldSz cx="(\d+)" cy="(\d+)"', pres)
    canvas = None
    if sz:
        cx, cy = int(sz.group(1)), int(sz.group(2))
        canvas = {"emu": [cx, cy], "inches": [round(cx / 914400, 3), round(cy / 914400, 3)]}

    focus = a.slide
    grad_xml = ""
    if focus:
        grad_xml = z.read(f"ppt/slides/slide{focus}.xml").decode("utf-8", "ignore")
    else:
        grad_xml = "".join(z.read(n).decode("utf-8", "ignore") for n in slides)

    colors = Counter(re.findall(r'srgbClr val="([0-9A-Fa-f]{6})"', grad_xml))

    result = {
        "source": a.pptx,
        "slideCount": len(slides),
        "canvas": canvas,
        "themePalette": theme_palette(z),
        "topColors": [{"hex": "#" + h, "count": c} for h, c in colors.most_common(20)],
        "gradients": dedupe(gradients(grad_xml)),
        "slides": [{"n": int(re.search(r"(\d+)", n).group(1)),
                    "text": " | ".join(slide_text(z, n))[:240]} for n in slides],
    }

    out = json.dumps(result, indent=2, ensure_ascii=False)
    if a.out:
        open(a.out, "w", encoding="utf-8").write(out)
        print(f"wrote {a.out}  ({len(slides)} slides, {len(result['gradients'])} unique gradients)")
    else:
        print(out)


if __name__ == "__main__":
    main()
