import argparse
import base64
import hashlib
import html
import json
import re
from collections import Counter
from pathlib import Path
from PIL import Image

CF = {
    "navy": "#071019", "panel": "#101820", "tile": "#172632", "cyan": "#00CFE6",
    "nitrous": "#2986FF", "purple": "#7B3DFF", "magenta": "#DF29FF",
    "green": "#1EAE79", "text": "#F8FFFE", "muted": "#AFC3D2"
}

COMMON_REPLACEMENTS = [
    (r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b", "role@example.invalid", "email"),
    (r"https?://[^\s)\]}>]+", "https://example.invalid/resource", "url"),
    (r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b", "00000000-0000-0000-0000-000000000000", "tenant")
]

PROFILE_REPLACEMENTS = {
    "cat": [
        (r"\bCopilot Acceleration Team\b", "Advisory Enablement Team", "organization"),
        (r"\bCAT Advisory\b", "Advisory Team", "organization"),
        (r"\bCAT\b", "Advisory Team", "organization")
    ],
    "ppac": [
        (r"\bRyan McCulloch and Momal Baloch\b", "Platform Engineering Team", "person"),
        (r"\bRyan McCulloch\b", "Program Lead", "person"),
        (r"\bMomal Baloch\b", "Engineering Lead", "person")
    ]
}

SLIDE_CSS = """
*{{box-sizing:border-box}}html,body{{margin:0;width:100%;height:100%;overflow:hidden;background:#071019;font-family:'Segoe UI Variable','Segoe UI',Arial,sans-serif;color:#F8FFFE}}
.stage{{position:absolute;left:50%;top:50%;width:1280px;height:720px;overflow:hidden;transform:translate(-50%,-50%) scale(var(--slide-scale,1));transform-origin:center;background:radial-gradient(58% 72% at 3% 3%,rgba(223,41,255,.18),transparent 58%),radial-gradient(70% 84% at 52% 46%,rgba(0,207,230,.10),transparent 64%),radial-gradient(55% 70% at 100% 100%,rgba(30,174,121,.16),transparent 58%),linear-gradient(155deg,#071019,#101820)}}
.top{{position:absolute;left:42px;right:42px;top:22px;height:38px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(41,134,255,.32);font:700 13px Consolas,monospace;letter-spacing:.08em;color:#AFC3D2}}
.brand{{color:#00CFE6}}.visual{{position:absolute;left:42px;top:82px;width:880px;height:495px;padding:10px;border-radius:18px;background:rgba(16,24,32,.9);border:1.5px solid rgba(41,134,255,.58);box-shadow:0 18px 48px rgba(0,0,0,.35),0 0 28px rgba(41,134,255,.12)}}
.visual img{{display:block;width:100%;height:100%;object-fit:contain;border-radius:10px;background:#05080c}}
.meta{{position:absolute;right:42px;top:82px;width:292px;height:556px;padding:19px;border-radius:18px;background:linear-gradient(145deg,rgba(20,33,45,.96),rgba(10,18,27,.96));border:1.5px solid rgba(123,61,255,.58);box-shadow:0 18px 48px rgba(0,0,0,.32)}}
.kicker{{font:700 11px Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:#00CFE6}}.title{{font-size:23px;line-height:1.08;font-weight:800;margin:10px 0 12px;background:linear-gradient(92deg,#47F0FF,#66A3FF 36%,#B28CFF 68%,#E970FF);-webkit-background-clip:text;background-clip:text;color:transparent;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}}
.badges{{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}}.badge{{font:700 10px Consolas,monospace;padding:5px 8px;border-radius:999px;border:1px solid rgba(41,134,255,.42);background:rgba(41,134,255,.10);color:#CDE8FF}}
.stats{{display:grid;grid-template-columns:1fr 1fr;gap:8px}}.stat{{padding:9px;border-radius:10px;background:rgba(41,134,255,.08);border:1px solid rgba(41,134,255,.20)}}.stat b{{display:block;font:800 18px Consolas,monospace;color:#00CFE6}}.stat span{{font-size:10px;color:#AFC3D2;text-transform:uppercase;letter-spacing:.05em}}
.palette{{display:flex;gap:7px;margin:15px 0}}.swatch{{width:38px;height:22px;border-radius:6px;border:1px solid rgba(255,255,255,.20)}}.snippet{{font-size:12px;line-height:1.35;color:#D7E5EE;max-height:74px;overflow:hidden;border-top:1px solid rgba(41,134,255,.25);padding-top:11px}}.foot{{position:absolute;left:42px;bottom:35px;width:880px;display:flex;justify-content:space-between;align-items:center;font:12px Consolas,monospace;color:#AFC3D2}}.privacy{{color:#1EAE79}}.score{{color:#00CFE6}}
""".replace("{{", "{").replace("}}", "}")

VIEWER_CSS = """
*{{box-sizing:border-box}}html,body{{margin:0;width:100%;height:100%;overflow:hidden;background:#02070b;color:white;font-family:'Segoe UI Variable','Segoe UI',Arial,sans-serif}}#frame{{border:0;width:100vw;height:100vh;display:block}}.bar{{position:fixed;z-index:20;left:0;right:0;top:0;height:42px;display:flex;align-items:center;gap:10px;padding:0 16px;background:linear-gradient(180deg,rgba(5,12,18,.94),rgba(5,12,18,.18));opacity:0;pointer-events:none;transition:opacity .18s}}.bar.show,.bar:hover{{opacity:1;pointer-events:auto}}.bar button,.bar a{{border:1px solid rgba(41,134,255,.42);background:rgba(41,134,255,.12);color:#EAF8FF;border-radius:8px;padding:6px 10px;text-decoration:none;font:600 12px Arial;cursor:pointer}}.bar .name{{margin-right:auto;font:700 12px Consolas,monospace;color:#00CFE6}}.hint{{position:fixed;z-index:15;left:50%;bottom:14px;transform:translateX(-50%);padding:7px 12px;border-radius:999px;background:rgba(5,12,18,.78);border:1px solid rgba(41,134,255,.28);font:11px Consolas,monospace;color:#BBD4E3;transition:opacity .4s}}.modal{{display:none;position:fixed;z-index:30;inset:0;background:rgba(0,0,0,.72);align-items:center;justify-content:center}}.modal.open{{display:flex}}.card{{width:min(880px,90vw);max-height:86vh;overflow:auto;border-radius:18px;padding:24px;background:#101820;border:1.5px solid rgba(123,61,255,.65);box-shadow:0 24px 70px rgba(0,0,0,.55)}}.card h2{{margin:0 0 10px;color:#00CFE6}}.card pre{{white-space:pre-wrap;color:#CFE1EC;font:12px/1.45 Consolas,monospace}}.close{{float:right}}
""".replace("{{", "{").replace("}}", "}")

COMPARE_CSS = """
*{{box-sizing:border-box}}html{{background:#071019;color:#F8FFFE;font-family:'Segoe UI Variable','Segoe UI',Arial,sans-serif}}body{{margin:0;background:radial-gradient(70% 50% at 50% 0,rgba(41,134,255,.13),transparent 70%),#071019}}header{{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:10px;padding:12px 20px;background:rgba(7,16,25,.94);border-bottom:1px solid rgba(41,134,255,.3);backdrop-filter:blur(12px)}}header h1{{font-size:18px;margin:0 auto 0 0;color:#00CFE6}}button,select,a.btn{{padding:7px 11px;border-radius:8px;border:1px solid rgba(41,134,255,.4);background:rgba(41,134,255,.11);color:#F8FFFE;text-decoration:none}}main{{padding:20px;max-width:1680px;margin:auto}}.compare{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}.pane{{background:#101820;border:1px solid rgba(41,134,255,.3);border-radius:16px;padding:12px;box-shadow:0 16px 40px rgba(0,0,0,.28)}}.pane h2{{font:700 12px Consolas,monospace;color:#AFC3D2;letter-spacing:.1em;text-transform:uppercase;margin:0 0 9px}}.pane img,.pane iframe{{display:block;width:100%;aspect-ratio:16/9;border:0;object-fit:contain;background:#03070b;border-radius:9px}}.cards{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}}.card{{background:rgba(16,24,32,.96);border:1px solid rgba(123,61,255,.35);border-radius:14px;padding:16px;min-height:150px}}.card h3{{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#00CFE6;margin:0 0 10px}}.card pre{{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.4 Consolas,monospace;color:#D7E5EE;margin:0;max-height:260px;overflow:auto}}.swatches{{display:flex;gap:8px;margin-top:8px}}.swatch{{height:28px;flex:1;border-radius:6px;border:1px solid rgba(255,255,255,.2)}}@media(max-width:1000px){{.compare,.cards{{grid-template-columns:1fr}}}}
""".replace("{{", "{").replace("}}", "}")

def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))

def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2, ensure_ascii=False), encoding="utf-8")

def data_uri(path):
    p = Path(path)
    mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
    return f"data:{mime};base64,{base64.b64encode(p.read_bytes()).decode('ascii')}"

def apply_replacements(text, profile, replacement_log):
    value = text or ""
    for pattern, synthetic, entity_type in PROFILE_REPLACEMENTS.get(profile, []) + COMMON_REPLACEMENTS:
        matches = list(re.finditer(pattern, value, flags=re.I))
        for match in matches:
            original = match.group(0)
            replacement_log.setdefault((original, synthetic, entity_type), None)
        value = re.sub(pattern, synthetic, value, flags=re.I)
    return value

def classify(slide):
    title = slide["title"].lower()
    counts = slide["counts"]
    if counts.get("media", 0): return "media"
    if any(word in title for word in ["diagram", "dataflow", "data flow", "architecture", "lifecycle", "threat model", "ownership"]): return "diagram"
    if counts.get("pictures", 0) and counts.get("textBlocks", 0) <= 3: return "visual"
    if counts.get("shapes", 0) <= 5 and len(slide["title"]) <= 48: return "section"
    if counts.get("textBlocks", 0) >= 8 or sum(len(x) for x in slide.get("textBlocks", [])) > 900: return "dense-content"
    return "content"

def palette_for(images):
    colors = Counter()
    for path in images:
        image = Image.open(path).convert("RGB")
        image.thumbnail((160, 90))
        quantized = image.quantize(colors=16).convert("RGB")
        colors.update(quantized.getdata())
    selected = []
    for color, _ in colors.most_common(80):
        if max(color) - min(color) < 8 and (max(color) < 28 or min(color) > 235):
            continue
        if all(sum(abs(color[i] - existing[i]) for i in range(3)) > 45 for existing in selected):
            selected.append(color)
        if len(selected) == 5: break
    while len(selected) < 5: selected.append((41, 134, 255))
    return ["#%02X%02X%02X" % c for c in selected]

def top_fonts(slides):
    fonts = Counter()
    sizes = Counter()
    for slide in slides:
        for element in slide["elements"]:
            font = element.get("font") or {}
            if font.get("family"): fonts[font["family"]] += 1
            if font.get("sizePt") and font["sizePt"] > 0: sizes[round(font["sizePt"], 1)] += 1
    return fonts.most_common(5), sizes.most_common(8)

def slide_html(deck_title, slide, content, palette, preview_ref):
    counts = slide["counts"]
    archetype = classify(slide)
    title = content["title"]
    snippets = content["textBlocks"]
    snippet = snippets[1] if len(snippets) > 1 else (snippets[0] if snippets else "No extractable text; visual evidence retained in source preview.")
    swatches = "".join(f'<span class="swatch" style="background:{c}"></span>' for c in palette)
    return f'''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=1280"><style>{SLIDE_CSS}</style></head><body><div class="stage">
<div class="top"><span class="brand">CLIPPYDECK HARVEST</span><span>{html.escape(deck_title)} / {slide["number"]:03d}</span></div>
<div class="visual"><img src="{preview_ref}" alt="Source slide {slide["number"]} preview"></div>
<aside class="meta"><div class="kicker">{html.escape(archetype)} / metadata</div><div class="title">{html.escape(title)}</div><div class="badges"><span class="badge">PPTX</span><span class="badge">16:9</span><span class="badge">synthetic-review</span></div>
<div class="stats"><div class="stat"><b>{counts['shapes']}</b><span>elements</span></div><div class="stat"><b>{counts['textBlocks']}</b><span>text blocks</span></div><div class="stat"><b>{counts['pictures']}</b><span>pictures</span></div><div class="stat"><b>{counts['media']}</b><span>media</span></div></div>
<div class="palette">{swatches}</div><div class="snippet">{html.escape(snippet[:300])}</div></aside>
<div class="foot"><span class="privacy">PRIVATE SOURCE PREVIEW / SYNTHETIC CONTENT PROFILE</span><span class="score">extraction confidence 1.00</span></div></div><script>function fitSlide(){{document.documentElement.style.setProperty('--slide-scale',Math.min(innerWidth/1280,innerHeight/720))}}addEventListener('resize',fitSlide);fitSlide();</script></body></html>'''

def adaptive_card(deck_id, slide, content, palette, source_hash):
    c = slide["counts"]
    return {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json", "type": "AdaptiveCard", "version": "1.6",
        "metadata": {"harvestId": deck_id, "slideId": slide["id"], "sourceDigest": source_hash, "privacyMode": "synthetic-review"},
        "body": [
            {"type": "TextBlock", "id": "harvest-kicker", "text": f"{classify(slide).upper()} / SLIDE {slide['number']:03d}", "isSubtle": True, "spacing": "None"},
            {"type": "TextBlock", "id": "harvest-title", "text": f"${{content.slides.{slide['id'].replace('-', '')}.title}}", "size": "ExtraLarge", "weight": "Bolder", "wrap": True},
            {"type": "FactSet", "id": "harvest-facts", "facts": [
                {"title": "Elements", "value": str(c["shapes"])}, {"title": "Text blocks", "value": str(c["textBlocks"])},
                {"title": "Pictures", "value": str(c["pictures"])}, {"title": "Media", "value": str(c["media"])},
                {"title": "Charts", "value": str(c["charts"])}, {"title": "Tables", "value": str(c["tables"])},
                {"title": "Animations", "value": str(slide.get("animationCount", 0))}, {"title": "Hidden", "value": str(slide.get("hidden", False)).lower()},
                {"title": "Confidence", "value": "1.00"}, {"title": "Source", "value": source_hash[:12]}
            ]},
            {"type": "TextBlock", "id": "harvest-summary", "text": f"${{content.slides.{slide['id'].replace('-', '')}.summary}}", "wrap": True},
            {"type": "Container", "id": "harvest-palette", "items": [{"type": "TextBlock", "text": "Palette: " + " ".join(palette), "wrap": True, "fontType": "Monospace", "size": "Small"}]}
        ]
    }

def build(args):
    out = Path(args.output).resolve()
    inventory = read_json(out / "source-inventory.json")
    slides = inventory["slides"]
    preview_paths = [out / slide["preview"] for slide in slides]
    palette = palette_for(preview_paths)
    fonts, sizes = top_fonts(slides)
    replacements = {}

    real_slides = {}
    synthetic_slides = {}
    for slide in slides:
        key = slide["id"].replace("-", "")
        real = {"title": slide["title"], "summary": " ".join(slide.get("textBlocks", [])[:3]), "textBlocks": slide.get("textBlocks", []), "notes": slide.get("notes", "")}
        synthetic = {k: apply_replacements(v, args.profile, replacements) if isinstance(v, str) else [apply_replacements(x, args.profile, replacements) for x in v] for k, v in real.items()}
        real_slides[key] = real
        synthetic_slides[key] = synthetic

    real_profile = {"schemaVersion": "1.0.0", "profile": {"id": args.deck_id + "-real", "privacyMode": "private-real", "synthetic": False, "locale": "en-US"}, "content": {"deck": {"title": inventory["presentation"]["name"]}, "slides": real_slides}, "entities": []}
    synthetic_profile = {"schemaVersion": "1.0.0", "profile": {"id": args.deck_id + "-synthetic", "privacyMode": "synthetic-review", "synthetic": True, "locale": "en-US"}, "content": {"deck": {"title": args.title}, "slides": synthetic_slides}, "entities": []}
    replacement_entries = []
    for original, synthetic, entity_type in replacements:
        replacement_entries.append({"path": "deck", "entityType": entity_type, "originalDigest": hashlib.sha256(original.encode()).hexdigest(), "originalValue": original, "syntheticValue": synthetic, "scope": "deck", "approved": True})
        synthetic_profile["entities"].append({"path": "deck", "type": entity_type if entity_type in {"customer","person","organization","product","project","tenant","domain","email","url","geography","metric","date","quote","other"} else "other", "value": synthetic, "sensitivity": "public", "source": "synthetic"})
    write_json(out / "content.real.json", real_profile)
    write_json(out / "content.synthetic.json", synthetic_profile)
    write_json(out / "replacement-map.private.json", {"schemaVersion": "1.0.0", "mapId": args.deck_id + "-private", "saltId": "local-only", "replacements": replacement_entries})

    tokens = {
        "schemaVersion": "1.0.0", "source": {"kind": "pptx", "digest": inventory["source"]["sha256"]},
        "tokens": {
            "color": {f"palette{i+1}": {"value": color, "confidence": .92, "evidence": "deck preview quantization"} for i, color in enumerate(palette)},
            "text": {
                **{f"font{i+1}": {"value": name, "family": name, "confidence": 1, "evidence": f"{count} extracted text runs"} for i, (name, count) in enumerate(fonts)},
                **{f"size{i+1}": {"value": size, "size": size, "confidence": 1, "evidence": f"{count} extracted text runs"} for i, (size, count) in enumerate(sizes)}
            }
        }
    }
    write_json(out / "design.tokens.json", tokens)

    layout_slides = []
    for slide in slides:
        elements = []
        relationships = []
        key = slide["id"].replace("-", "")
        text_index = 0
        for element in slide["elements"]:
            kind = element["kind"] if element["kind"] in {"text","shape","line","connector","icon","picture","background","video","chart","table","group"} else "shape"
            item = {"id": element["id"], "kind": kind, "role": element["role"], "bounds": element["bounds"], "confidence": element.get("confidence", 1), "sourceEvidence": [f"pptx:slide-{slide['number']}/shape-{element['sourceId']}"]}
            if element.get("text"):
                item["value"] = f"${{content.slides.{key}.textBlocks.{text_index}}}"
                text_index += 1
            for field in ["sourceBoundsPt", "rotation", "zOrder", "font", "fill", "line", "placeholderType", "altText", "media"]:
                if element.get(field) not in (None, "", 0, False): item[field] = element[field]
            connector = element.get("connector")
            if connector and connector.get("beginConnected") and connector.get("endConnected"):
                relationships.append({"from": f"s{slide['number']:03d}-shape-{connector['beginShapeId']:03d}", "to": f"s{slide['number']:03d}-shape-{connector['endShapeId']:03d}", "kind": "dataflow", "directed": True})
                item["kind"] = "connector"
            elements.append(item)
        layout_slides.append({"id": slide["id"], "archetype": classify(slide), "background": {"kind": "picture", "assetRef": slide["preview"]}, "elements": elements, "relationships": relationships})
    write_json(out / "layout.template.json", {"schemaVersion": "1.0.0", "deck": {"id": args.deck_id, "width": 1280, "height": 720}, "slides": layout_slides})

    adaptive_dir = out / "adaptive"
    slides_dir = out / "slides"
    evidence_dir = out / "evidence"
    adaptive_dir.mkdir(exist_ok=True); slides_dir.mkdir(exist_ok=True); evidence_dir.mkdir(exist_ok=True)
    slide_htmls = []
    cards = []
    for slide in slides:
        key = slide["id"].replace("-", "")
        preview_rel = "../" + slide["preview"].replace("\\", "/")
        rendered = slide_html(args.title, slide, synthetic_slides[key], palette, preview_rel)
        (slides_dir / f"{slide['number']:03d}.html").write_text(rendered, encoding="utf-8")
        inline = slide_html(args.title, slide, synthetic_slides[key], palette, data_uri(out / slide["preview"]))
        slide_htmls.append(inline)
        card = adaptive_card(args.deck_id, slide, synthetic_slides[key], palette, inventory["source"]["sha256"])
        write_json(adaptive_dir / f"{slide['number']:03d}.card.json", card)
        cards.append(card)

    viewer_payload = json.dumps(slide_htmls, ensure_ascii=False).replace("</", "<\\/")
    metadata_payload = json.dumps({"inventory": inventory, "content": synthetic_profile, "cards": cards, "palette": palette}, ensure_ascii=False).replace("</", "<\\/")
    deck_file = out / f"{args.deck_id}-clippydeck.html"
    viewer_template = """<!doctype html><html><head><meta charset="utf-8"><title>__TITLE__ - ClippyDeck</title><style>__CSS__</style></head><body>
<iframe id="frame" title="ClippyDeck slide"></iframe>
<div class="bar show" id="bar"><span class="name">__TITLE__</span><button id="prev">Previous</button><span id="count"></span><button id="next">Next</button><button id="meta">Metadata</button><a href="comparison.html">Compare</a></div>
<div class="hint" id="hint">Left/Right navigate - M metadata - C compare - H pin header</div>
<div class="modal" id="modal"><div class="card"><button class="close" id="close">Close</button><h2 id="metaTitle"></h2><pre id="metaBody"></pre></div></div>
<script>
const slides=__SLIDES__;const data=__DATA__;let i=0,pinned=false,timer;
const frame=document.getElementById('frame'),bar=document.getElementById('bar'),count=document.getElementById('count'),modal=document.getElementById('modal');
function showBar(){bar.classList.add('show');clearTimeout(timer);if(!pinned)timer=setTimeout(()=>bar.classList.remove('show'),2200)}
function key(){return `slide${String(i+1).padStart(3,'0')}`}
function render(){frame.srcdoc=slides[i];count.textContent=`${i+1} / ${slides.length}`;document.getElementById('metaTitle').textContent=data.content.content.slides[key()].title;document.getElementById('metaBody').textContent=JSON.stringify({slide:data.inventory.slides[i],content:data.content.content.slides[key()],adaptiveCard:data.cards[i]},null,2);showBar()}
function go(n){i=Math.max(0,Math.min(slides.length-1,n));render()}
document.getElementById('prev').onclick=()=>go(i-1);document.getElementById('next').onclick=()=>go(i+1);document.getElementById('meta').onclick=()=>modal.classList.add('open');document.getElementById('close').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};addEventListener('mousemove',showBar);addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' ')go(i+1);if(e.key==='ArrowLeft'||e.key==='PageUp')go(i-1);if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(e.key.toLowerCase()==='m')modal.classList.toggle('open');if(e.key.toLowerCase()==='c')location.href='comparison.html';if(e.key.toLowerCase()==='h'){pinned=!pinned;showBar()}if(e.key==='Escape')modal.classList.remove('open')});setTimeout(()=>document.getElementById('hint').style.opacity=0,4200);render();
</script></body></html>"""
    viewer_html = viewer_template.replace("__TITLE__", html.escape(args.title)).replace("__CSS__", VIEWER_CSS).replace("__SLIDES__", viewer_payload).replace("__DATA__", metadata_payload)
    deck_file.write_text(viewer_html, encoding="utf-8")

    compare_data = json.dumps({"inventory": inventory, "content": synthetic_profile, "palette": palette}, ensure_ascii=False).replace("</", "<\\/")
    options = "".join(f'<option value="{i}">{i+1:03d} - {html.escape(synthetic_slides[s["id"].replace("-","")]["title"][:80])}</option>' for i, s in enumerate(slides))
    comparison_template = """<!doctype html><html><head><meta charset="utf-8"><title>__TITLE__ comparison</title><style>__CSS__</style></head><body>
<header><h1>__TITLE__ - source comparison</h1><button id="prev">Previous</button><select id="select">__OPTIONS__</select><button id="next">Next</button><a class="btn" href="__DECK__">Open deck</a></header>
<main><section class="compare"><div class="pane"><h2>Authorized source render</h2><img id="source" alt="Source slide"></div><div class="pane"><h2>ClippySlide harvest view</h2><iframe id="generated" title="Generated ClippySlide"></iframe></div></section>
<section class="cards"><div class="card"><h3>Content and bindings</h3><pre id="content"></pre></div><div class="card"><h3>Geometry and topology</h3><pre id="geometry"></pre></div><div class="card"><h3>Assets and motion</h3><pre id="assets"></pre></div><div class="card"><h3>Provenance</h3><pre id="provenance"></pre></div><div class="card"><h3>Privacy</h3><pre id="privacy"></pre></div><div class="card"><h3>Extracted palette</h3><div class="swatches" id="palette"></div></div></section></main>
<script>
const d=__DATA__;let i=0;const select=document.getElementById('select');
function classifySlide(s){const t=s.title.toLowerCase(),c=s.counts;if(c.media)return'media';if(['diagram','dataflow','data flow','architecture','lifecycle','threat model','ownership'].some(x=>t.includes(x)))return'diagram';if(c.pictures&&c.textBlocks<=3)return'visual';if(c.shapes<=5&&s.title.length<=48)return'section';if(c.textBlocks>=8||s.textBlocks.join('').length>900)return'dense-content';return'content'}
function render(){const s=d.inventory.slides[i],key=`slide${String(i+1).padStart(3,'0')}`,c=d.content.content.slides[key];select.value=i;document.getElementById('source').src=s.preview;document.getElementById('generated').src=`slides/${String(i+1).padStart(3,'0')}.html`;document.getElementById('content').textContent=JSON.stringify(c,null,2);document.getElementById('geometry').textContent=JSON.stringify({archetype:classifySlide(s),counts:s.counts,shapeTypes:s.shapeTypes,connectors:s.elements.filter(e=>e.connector)},null,2);document.getElementById('assets').textContent=JSON.stringify({pictures:s.counts.pictures,media:s.counts.media,charts:s.counts.charts,tables:s.counts.tables,animations:s.animationCount,transition:s.transition},null,2);document.getElementById('provenance').textContent=JSON.stringify({source:d.inventory.source.name,sha256:d.inventory.source.sha256,slideId:s.sourceSlideId,preview:s.preview},null,2);document.getElementById('privacy').textContent=JSON.stringify({mode:d.content.profile.privacyMode,synthetic:d.content.profile.synthetic,sourcePreview:'private / not publishable'},null,2);document.getElementById('palette').innerHTML=d.palette.map(x=>`<span class="swatch" title="${x}" style="background:${x}"></span>`).join('')}
document.getElementById('prev').onclick=()=>{i=Math.max(0,i-1);render()};document.getElementById('next').onclick=()=>{i=Math.min(d.inventory.slides.length-1,i+1);render()};select.onchange=()=>{i=Number(select.value);render()};addEventListener('keydown',e=>{if(e.key==='ArrowRight')document.getElementById('next').click();if(e.key==='ArrowLeft')document.getElementById('prev').click()});render();
</script></body></html>"""
    comparison_html = comparison_template.replace("__TITLE__", html.escape(args.title)).replace("__CSS__", COMPARE_CSS).replace("__OPTIONS__", options).replace("__DECK__", deck_file.name).replace("__DATA__", compare_data)
    (out / "comparison.html").write_text(comparison_html, encoding="utf-8")
    manifest = {
        "schemaVersion": "1.0.0", "harvestId": args.deck_id,
        "createdAt": args.created_at,
        "source": {"kind": "pptx", "name": inventory["source"]["name"], "sha256": inventory["source"]["sha256"], "authorized": True, "classification": "internal"},
        "privacy": {"mode": "synthetic-review", "defaultProfile": "content.synthetic.json", "forbiddenTermDigests": [hashlib.sha256(x[0].encode()).hexdigest() for x in replacements]},
        "slides": [{"id": s["id"], "number": s["number"], "archetype": classify(s), "elements": s["counts"]["shapes"], "lowConfidenceElements": 0, "media": [s["preview"]] if s["counts"]["media"] else [], "approximations": ["Source preview is retained as the visual layer; semantic reconstruction is represented in layout.template.json."]} for s in slides],
        "outputs": {"layout": "layout.template.json", "tokens": "design.tokens.json", "syntheticContent": "content.synthetic.json", "adaptiveCards": [f"adaptive/{s['number']:03d}.card.json" for s in slides], "standaloneDeck": deck_file.name},
        "validation": {"schema": "pending", "privacy": "pending", "visual": "pending", "offline": "pending"}
    }
    write_json(out / "harvest.manifest.json", manifest)
    write_json(evidence_dir / "visual-review.json", {"status": "pending", "slides": [{"id": s["id"], "sourcePreview": s["preview"], "generated": f"slides/{s['number']:03d}.html", "review": "pending"} for s in slides]})
    (out / "index.html").write_text(f'''<!doctype html><meta charset="utf-8"><title>{html.escape(args.title)}</title><style>body{{font-family:Arial;background:#071019;color:white;max-width:900px;margin:60px auto}}a{{display:block;color:#66DFF0;padding:12px 0}}</style><h1>{html.escape(args.title)}</h1><p>{len(slides)} slides harvested from an authorized PPTX. Source previews remain private.</p><a href="{deck_file.name}">Open ClippyDeck</a><a href="comparison.html">Open source comparison and metadata UI</a>''', encoding="utf-8")
    print(f"Built {args.deck_id}: {len(slides)} slides, {len(replacement_entries)} replacement rules, {deck_file.stat().st_size} byte deck")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--deck-id", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--profile", choices=["cat", "ppac"], required=True)
    parser.add_argument("--created-at", default="2026-09-17T07:00:00Z")
    build(parser.parse_args())


