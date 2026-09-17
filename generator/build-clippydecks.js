const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = 'C:\\Users\\dayour\\Microsoft\\Darbot - FY27\\Documents\\planner_card_math.html';

/* Packaged decks are copied into the Docusaurus static tree so GitHub Pages
   serves them alongside the wiki. */
const STATIC_DECKS = path.join(ROOT, 'website', 'static', 'decks');
const SITE = 'https://dayour.github.io/clippyslide/';
const DECK_URL = SITE + 'decks/';

/* Canonical deck registry — single source of truth for the in-deck Library
   overlay and the generated wiki Library page. */
const DECKS = [
  { id:'deck', dir:'deck', file:'coe-framework-clippydeck.html',
    name:'Copilot CoE Framework', theme:'TileSlide', slides:24,
    blurb:'Center of Excellence operating model, from intake and governance through measurement.' },
  { id:'brand-deck', dir:'brand-deck', file:'clippyflow-brand-clippydeck.html',
    name:'ClippyFlow Brand Deck', theme:'ClippyFlow', slides:11,
    blurb:'Brand manifesto, spectrum palette, the Nitrous Rule, components, and usage guardrails.' },
  { id:'planner-card-math', dir:'planner-card-math', file:'task-planning-clippydeck.html',
    name:'Task Planning Flow Architecture', theme:'ClippyFlow', slides:8,
    blurb:'Generic planning paths from intake to an approved plan, with stable tile and card identifiers.' },
  { id:'atlassian-connectors', dir:'atlassian-connectors', file:'atlassian-connectors-clippydeck.html',
    name:'Atlassian Connectors', theme:'Pine', slides:7,
    blurb:'Connector landscape and integration patterns for Jira and Confluence.' },
  { id:'slides-clippyflow', dir:'slides-clippyflow', file:'clippyflow-samples-clippydeck.html',
    name:'ClippyFlow Sample Slides', theme:'ClippyFlow', slides:3,
    blurb:'Reference ClippyFlow slides: title, orchestration, and the spectrum board.' },
  { id:'slides', dir:'slides', file:'tileslide-samples-clippydeck.html',
    name:'TileSlide Sample Slides', theme:'TileSlide', slides:3,
    blurb:'Legacy TileSlide reference slides used as layout examples for new decks.' },
];

const THEME_SCRIPT = `<script>
  (() => {
    const param = new URLSearchParams(window.location.search).get("clawpilotTheme");
    const theme =
      param || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>`;

const THEME_CSS = `:root {
  color-scheme: light;
  --cp-bg: #f7f4ef;
  --cp-bg-elevated: #fcfbf8;
  --cp-surface: #ffffff;
  --cp-surface-soft: #f5f5f5;
  --cp-border: #dedede;
  --cp-border-strong: #919191;
  --cp-text: #242424;
  --cp-text-muted: #5c5c5c;
  --cp-text-soft: #6f6f6f;
  --cp-accent: #b11f4b;
  --cp-accent-hover: #9a1a41;
  --cp-accent-soft: rgba(177, 31, 75, 0.08);
  --cp-accent-fg: #ffffff;
  --cp-success: #16a34a;
  --cp-danger: #dc2626;
  --cp-warning: #f59e0b;
  --cp-link: #0078d4;
  --cp-shadow: 0 18px 48px rgba(0, 0, 0, 0.12);
  --cp-overlay: rgba(255, 255, 255, 0.8);
  --cp-panel: rgba(255, 255, 255, 0.86);
  --cp-panel-strong: rgba(255, 255, 255, 0.96);
  --cp-sheen: rgba(255, 255, 255, 0.55);
  --cp-highlight: rgba(177, 31, 75, 0.12);
}
html[data-theme="dark"] {
  color-scheme: dark;
  --cp-bg: #3d3b3a;
  --cp-bg-elevated: #343231;
  --cp-surface: #292929;
  --cp-surface-soft: #2e2e2e;
  --cp-border: #474747;
  --cp-border-strong: #5f5f5f;
  --cp-text: #dedede;
  --cp-text-muted: #919191;
  --cp-text-soft: #b0b0b0;
  --cp-accent: #fd8ea1;
  --cp-accent-hover: #fb7b91;
  --cp-accent-soft: rgba(253, 142, 161, 0.14);
  --cp-accent-fg: #1a1a1a;
  --cp-success: #4ade80;
  --cp-danger: #f87171;
  --cp-warning: #fbbf24;
  --cp-link: #4da6ff;
  --cp-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
  --cp-overlay: rgba(41, 41, 41, 0.88);
  --cp-panel: rgba(41, 41, 41, 0.72);
  --cp-panel-strong: rgba(41, 41, 41, 0.96);
  --cp-sheen: rgba(255, 255, 255, 0.04);
  --cp-highlight: rgba(253, 142, 161, 0.12);
}`;

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2'})[ext] || 'application/octet-stream';
}

function dataUri(file) {
  return `data:${mime(file)};base64,${fs.readFileSync(file).toString('base64')}`;
}

function inlineCssUrls(css, cssDir) {
  return css.replace(/url\((['"]?)(?!data:|https?:|#)([^)'"\s]+)\1\)/g, (m, q, ref) => {
    const target = path.resolve(cssDir, decodeURIComponent(ref));
    return fs.existsSync(target) ? `url("${dataUri(target)}")` : m;
  });
}

function inlineHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, href) => {
    if (/^(?:https?:|data:)/i.test(href)) return tag;
    const cssFile = path.resolve(dir, decodeURIComponent(href));
    if (!fs.existsSync(cssFile)) return tag;
    return `<style>${inlineCssUrls(fs.readFileSync(cssFile, 'utf8'), path.dirname(cssFile))}</style>`;
  });
  html = html.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi, (tag, src) => {
    if (/^(?:https?:|data:)/i.test(src)) return tag;
    const jsFile = path.resolve(dir, decodeURIComponent(src));
    return fs.existsSync(jsFile) ? `<script>${fs.readFileSync(jsFile, 'utf8')}<\/script>` : tag;
  });
  html = html.replace(/(<(?:img|source)\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (m, pre, src, post) => {
    if (/^(?:https?:|data:|blob:)/i.test(src)) return m;
    const asset = path.resolve(dir, decodeURIComponent(src));
    return fs.existsSync(asset) ? `${pre}${dataUri(asset)}${post}` : m;
  });
  return html;
}

function imageSlide(file, title) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>html,body{margin:0;width:100%;height:100%;background:#000}img{width:100%;height:100%;object-fit:contain;display:block}</style></head><body><img alt="${title}" src="${dataUri(file)}"></body></html>`;
}

function b64(s) { return Buffer.from(s, 'utf8').toString('base64'); }

function libraryMarkup(currentId) {
  const items = DECKS.map(d => {
    const cur = d.id === currentId;
    return `<a class="lib-card${cur ? ' current' : ''}" href="${DECK_URL}${d.file}"${cur ? ' aria-current="true"' : ''}>`
      + `<span class="lib-badge">${d.theme}</span>`
      + `<span class="lib-name">${d.name}</span>`
      + `<span class="lib-blurb">${d.blurb}</span>`
      + `<span class="lib-meta">${d.slides} slides${cur ? ' &middot; open' : ''}</span></a>`;
  }).join('');
  return `<div id="library" hidden><div class="lib-panel" role="dialog" aria-label="Deck library" aria-modal="true">`
    + `<div class="lib-head"><span class="brand">Library</span>`
    + `<span class="lib-sub">${DECKS.length} decks &middot; ${DECKS.reduce((a, d) => a + d.slides, 0)} slides</span>`
    + `<button id="libClose" aria-label="Close library">Close</button></div>`
    + `<div class="lib-grid">${items}</div>`
    + `<div class="lib-foot">Wiki &amp; decks: <code>${SITE}</code></div></div></div>`;
}

const LIBRARY_CSS = `#library{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:32px;background:var(--cp-overlay);backdrop-filter:blur(6px)}#library[hidden]{display:none}
.lib-panel{width:min(980px,100%);max-height:100%;overflow:auto;background:var(--cp-bg-elevated);border:1px solid var(--cp-border);border-radius:16px;box-shadow:var(--cp-shadow);padding:24px 26px 20px}
.lib-head{display:flex;align-items:center;gap:12px;margin-bottom:18px}.lib-head .brand{font-size:12px}.lib-sub{margin-right:auto;font:11px Consolas,"Courier New",Courier,monospace;color:var(--cp-text-soft)}
.lib-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}
.lib-card{display:flex;flex-direction:column;gap:7px;padding:16px 18px;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface);text-decoration:none;color:var(--cp-text);transition:border-color .15s,transform .15s}
.lib-card:hover{border-color:var(--cp-accent);transform:translateY(-2px)}
.lib-card.current{border-color:var(--cp-accent);background:var(--cp-accent-soft)}
.lib-badge{align-self:flex-start;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--cp-accent);background:var(--cp-accent-soft);border-radius:999px;padding:2px 9px}
.lib-name{font-size:14px;font-weight:700;line-height:1.3}.lib-blurb{font-size:12px;color:var(--cp-text-muted);line-height:1.45}
.lib-meta{margin-top:4px;font:10.5px Consolas,"Courier New",Courier,monospace;color:var(--cp-text-soft)}
.lib-foot{margin-top:18px;padding-top:12px;border-top:1px solid var(--cp-border);font:10.5px Consolas,"Courier New",Courier,monospace;color:var(--cp-text-soft)}`;

function presentation(title, slides, deckId) {
  const payload = JSON.stringify(slides.map(s => ({ title: s.title, data: b64(s.html) }))).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} - ClippyDeck</title>
${THEME_SCRIPT}
<style>
${THEME_CSS}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:"Segoe UI",Aptos,Calibri,-apple-system,BlinkMacSystemFont,sans-serif;background:var(--cp-bg);color:var(--cp-text)}
main{position:fixed;inset:0;background:var(--cp-bg)}#stage{position:absolute;left:50%;top:50%;width:1280px;height:720px;transform:translate(-50%,-50%) scale(var(--deck-scale,1));transform-origin:center;background:var(--cp-surface);box-shadow:var(--cp-shadow);border:1px solid var(--cp-border);overflow:hidden}iframe{width:1280px;height:720px;border:0;display:block;background:var(--cp-surface)}
header{position:fixed;z-index:10;top:0;left:0;right:0;height:36px;display:flex;align-items:center;gap:10px;padding:0 14px;background:linear-gradient(180deg,var(--cp-overlay) 0%,var(--cp-panel) 58%,transparent 100%);opacity:0;transition:opacity .25s ease}header:hover,header.show{opacity:1}header:not(:hover):not(.show){pointer-events:none}.brand{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--cp-accent);white-space:nowrap}.title{margin-right:auto;max-width:38vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--cp-text-muted);font-size:12px;font-weight:600}.count{font-family:Consolas,"Courier New",Courier,monospace;font-size:11px;color:var(--cp-text-muted);padding:2px 8px;border:1px solid var(--cp-border);border-radius:999px;background:var(--cp-surface-soft);white-space:nowrap}.sep{width:1px;height:16px;background:var(--cp-border)}button{height:24px;min-width:28px;padding:0 9px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--cp-border);border-radius:7px;background:transparent;color:var(--cp-text-muted);font:600 12px "Segoe UI",Aptos,Calibri,-apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer;transition:color .15s,border-color .15s,background .15s}button:hover{color:var(--cp-accent);border-color:var(--cp-accent);background:var(--cp-accent-soft)}button:disabled{opacity:.35;cursor:default}#hint{position:fixed;z-index:9;left:50%;bottom:14px;transform:translateX(-50%);font:11px Consolas,"Courier New",Courier,monospace;color:var(--cp-text-soft);background:var(--cp-panel);border:1px solid var(--cp-border);padding:4px 11px;border-radius:999px;transition:opacity .6s ease}.zone{position:fixed;z-index:5;top:36px;bottom:0;width:11%;border:0;background:transparent;cursor:pointer}.zone.prev{left:0}.zone.next{right:0}
${LIBRARY_CSS}
</style></head><body><main><div id="stage"><iframe id="frame" title="Slide"></iframe></div></main>
<button class="zone prev" id="zonePrev" aria-label="Previous slide"></button><button class="zone next" id="zoneNext" aria-label="Next slide"></button>
<header id="controls"><span class="brand">ClippyDeck</span><span class="title" id="title"></span><button id="prev" aria-label="Previous">&lsaquo;</button><span class="count" id="count"></span><button id="next" aria-label="Next">&rsaquo;</button><span class="sep"></span><button id="full">Present</button><button id="lib">Library</button></header>
${libraryMarkup(deckId)}
<div id="hint">&larr;/&rarr; navigate &middot; F present &middot; L library &middot; H pin bar</div>
<script>
const slides=${payload};let index=0;const frame=document.getElementById('frame'),count=document.getElementById('count'),title=document.getElementById('title'),controls=document.getElementById('controls');
function decode(v){const bytes=Uint8Array.from(atob(v),c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
function fit(){document.documentElement.style.setProperty('--deck-scale',Math.min(innerWidth/1280,innerHeight/720))}
function show(i){index=Math.max(0,Math.min(slides.length-1,i));frame.srcdoc=decode(slides[index].data);count.textContent=(index+1)+' / '+slides.length;title.textContent=slides[index].title;document.getElementById('prev').disabled=index===0;document.getElementById('next').disabled=index===slides.length-1}
function next(){show(index+1)}function prev(){show(index-1)}
document.getElementById('next').onclick=next;document.getElementById('prev').onclick=prev;document.getElementById('zoneNext').onclick=next;document.getElementById('zonePrev').onclick=prev;document.getElementById('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!library.hidden){e.preventDefault();setLibrary(false);return}if(!library.hidden)return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();next()}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();prev()}else if(e.key==='Home')show(0);else if(e.key==='End')show(slides.length-1);else if(e.key.toLowerCase()==='f')document.getElementById('full').click();else if(e.key.toLowerCase()==='l'){e.preventDefault();setLibrary(true)}else if(e.key.toLowerCase()==='h')controls.classList.toggle('show')});
const library=document.getElementById('library');
function setLibrary(open){library.hidden=!open;if(open)controls.classList.add('show')}
document.getElementById('lib').onclick=()=>setLibrary(true);
document.getElementById('libClose').onclick=()=>setLibrary(false);
library.addEventListener('click',e=>{if(e.target===library)setLibrary(false)});
let idleTimer;function reveal(){controls.classList.add('show');clearTimeout(idleTimer);idleTimer=setTimeout(()=>controls.classList.remove('show'),2500)}
document.addEventListener('mousemove',reveal);window.addEventListener('resize',fit);fit();show(0);
setTimeout(()=>{const h=document.getElementById('hint');if(h)h.style.opacity='0'},4200);
<\/script></body></html>`;
}

function packageDeck(dirName, specs, outputName, title, deckId) {
  const dir = path.join(ROOT, dirName);
  const slides = specs.map((spec, i) => {
    const file = path.resolve(dir, spec.file);
    if (fs.existsSync(file)) return { title: spec.title || path.basename(spec.file, '.html'), html: inlineHtml(file) };
    const png = path.resolve(dir, spec.fallback || `${String(i + 1).padStart(2, '0')}.png`);
    if (fs.existsSync(png)) return { title: spec.title || `Slide ${i + 1}`, html: imageSlide(png, spec.title || `Slide ${i + 1}`) };
    throw new Error(`Missing slide source and fallback: ${file}`);
  });
  const html = presentation(title, slides, deckId || dirName);
  fs.writeFileSync(path.join(dir, outputName), html);
  fs.mkdirSync(STATIC_DECKS, { recursive: true });
  fs.writeFileSync(path.join(STATIC_DECKS, outputName), html);
  console.log(`Built ${dirName}/${outputName} + website/static/decks/${outputName} (${slides.length} slides)`);
  return slides.length;
}

/* ClippyFlow design system — teal-to-violet identity, applied to the planner deck. */
const CF = {
  TEAL:'#00B4D8', VIOLET:'#7B2FF7', NAVY:'#0D1B2A', MIDNIGHT:'#1B2838', SLATE:'#415A77',
  ICE:'#E0FBFC', SNOW:'#F8FFFE', CORAL:'#FF6B6B', GOLD:'#FFD93D', MINT:'#6BCB77', PURPLE:'#C77DFF',
};

const CF_CSS = `:root{--cf-teal:${CF.TEAL};--cf-violet:${CF.VIOLET};--cf-navy:${CF.NAVY};--cf-midnight:${CF.MIDNIGHT};--cf-slate:${CF.SLATE};--cf-ice:${CF.ICE};--cf-snow:${CF.SNOW};--cf-coral:${CF.CORAL};--cf-gold:${CF.GOLD};--cf-mint:${CF.MINT};--cf-purple:${CF.PURPLE};--cf-hero:linear-gradient(135deg,${CF.TEAL} 0%,${CF.VIOLET} 100%);--cf-dark:linear-gradient(100deg,${CF.NAVY} 0%,${CF.MIDNIGHT} 100%);--cf-bar:linear-gradient(90deg,${CF.TEAL} 0%,${CF.VIOLET} 100%);--cf-head:"Trebuchet MS","Segoe UI",sans-serif;--cf-body:Calibri,"Segoe UI",sans-serif;--cf-mono:Consolas,"Courier New",monospace}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:var(--cf-body)}
.slide{position:relative;display:flex;flex-direction:column;width:1280px;height:720px;padding:56px 64px 44px;overflow:hidden}
.slide::after{content:"";position:absolute;left:0;right:0;bottom:0;height:8px;background:var(--cf-bar)}
.slide.light{background:var(--cf-snow);color:var(--cf-navy)}
.slide.ice{background:var(--cf-ice);color:var(--cf-navy)}
.slide.dark{background:var(--cf-dark);color:#fff}
.slide.hero{background:var(--cf-hero);color:#fff;justify-content:center;padding:64px 80px 56px}
.dots{position:absolute;right:70px;top:74px;display:grid;grid-template-columns:repeat(4,12px);gap:16px;opacity:.28}
.dots i{width:12px;height:12px;border-radius:50%;background:#fff;display:block}
.head{flex:0 0 auto}
.kicker{font-family:var(--cf-body);font-size:14px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}
.light .kicker,.ice .kicker{color:var(--cf-violet)}.dark .kicker{color:var(--cf-teal)}.hero .kicker{color:var(--cf-ice)}
h1{font-family:var(--cf-head);font-size:42px;line-height:1.06;font-weight:700;letter-spacing:.01em;margin:12px 0 10px;max-width:1080px}
.hero h1{font-size:56px;letter-spacing:.02em;max-width:900px}
.sub{font-size:20px;line-height:1.4;max-width:1000px}
.light .sub,.ice .sub{color:var(--cf-slate)}.dark .sub{color:var(--cf-ice)}.hero .sub{color:var(--cf-ice);font-size:23px;max-width:820px}
.meta{margin-top:34px;font-family:var(--cf-mono);font-size:14px;color:rgba(255,255,255,.82)}
.content{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:24px 0 8px}
.grid{display:grid;gap:20px}.cols2{grid-template-columns:repeat(2,1fr)}.cols3{grid-template-columns:repeat(3,1fr)}
.card{display:flex;flex-direction:column;padding:24px;border-radius:16px}
.light .card,.ice .card{background:#fff;box-shadow:0 6px 18px rgba(13,27,42,.08)}
.dark .card{background:var(--cf-midnight);border:1px solid rgba(224,251,252,.14)}
.cols3>.card{min-height:196px}.cols2>.card{min-height:252px}.flow>.card{min-height:196px}
.card>.bar{height:4px;width:52px;border-radius:999px;margin-bottom:16px;background:var(--cf-bar)}
.card.teal>.bar{background:var(--cf-teal)}.card.violet>.bar{background:var(--cf-violet)}
.card.mint>.bar{background:var(--cf-mint)}.card.coral>.bar{background:var(--cf-coral)}.card.gold>.bar{background:var(--cf-gold)}
h2{font-family:var(--cf-head);font-size:22px;font-weight:700;margin:0 0 10px}
.dark h2{color:#fff}.light h2,.ice h2{color:var(--cf-navy)}
.id{align-self:flex-start;margin-bottom:12px;padding:5px 10px;border-radius:999px;font:700 12px var(--cf-mono);letter-spacing:.02em}
.light .id,.ice .id{background:rgba(123,47,247,.1);color:var(--cf-violet)}
.dark .id{background:rgba(0,180,216,.16);color:var(--cf-teal)}
p,li{font-size:16px;line-height:1.5}
.light p,.light li,.ice p,.ice li{color:var(--cf-slate)}.dark p,.dark li{color:var(--cf-ice)}
ul{margin:8px 0 0;padding-left:20px}li+li{margin-top:7px}
.flow{display:flex;align-items:stretch;gap:16px}.flow .card{flex:1}
.step{display:flex;align-items:center;justify-content:center;width:42px;height:42px;margin-bottom:14px;border-radius:50%;font:700 17px var(--cf-head);color:#fff;background:var(--cf-teal)}
.card.violet .step{background:var(--cf-violet)}.card.mint .step{background:var(--cf-mint)}.card.coral .step{background:var(--cf-coral)}
.arrow{align-self:center;font-size:26px;font-weight:700;color:var(--cf-teal)}
.table{width:100%;border-collapse:collapse;border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(13,27,42,.08)}
.table th,.table td{text-align:left;padding:13px 16px;font-size:15px;border-bottom:1px solid rgba(65,90,119,.14)}
.table tr:last-child td{border-bottom:none}
.table th{font:700 12px var(--cf-body);letter-spacing:.12em;text-transform:uppercase;color:#fff;background:linear-gradient(90deg,${CF.TEAL},${CF.VIOLET})}
.table td{color:var(--cf-slate)}
code{font-family:var(--cf-mono);font-size:14px;color:var(--cf-violet)}.dark code{color:var(--cf-purple)}
.footer{flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;font:12px var(--cf-mono);letter-spacing:.04em}
.light .footer,.ice .footer{color:var(--cf-slate)}.dark .footer{color:rgba(224,251,252,.6)}`;

function cfSlide({ n, total, variant, kicker, title, subtitle, body = '', meta = '' }) {
  const hero = variant === 'hero';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${CF_CSS}</style></head><body>
<section class="slide ${variant}">${hero ? '<div class="dots">' + '<i></i>'.repeat(16) + '</div>' : ''}
<div class="head"><div class="kicker">${kicker}</div><h1>${title}</h1><div class="sub">${subtitle}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div>
${hero ? '' : `<div class="content">${body}</div>`}
${hero ? '' : `<div class="footer"><span>Task Planning Flow Architecture</span><span>${n} / ${total}</span></div>`}
</section></body></html>`;
}

function buildPlannerDeck() {
  if (!fs.existsSync(SOURCE)) throw new Error(`Planner source not found: ${SOURCE}`);
  const dir = path.join(ROOT, 'planner-card-math'); fs.mkdirSync(dir, {recursive:true});
  const T = 8;
  const slides = [
    cfSlide({n:1,total:T,variant:'hero',kicker:'Planning system',title:'Task Planning Flow Architecture',subtitle:'Generic planning paths from intake to an approved task plan, with stable tile and card identifiers.',meta:'ClippyFlow &middot; planner card math'}),
    cfSlide({n:2,total:T,variant:'light',kicker:'Overview',title:'Three routes, one governed output',subtitle:'Every request resolves into the same approved plan, no matter how it enters.',body:`<div class="grid cols3">
<div class="card teal"><div class="bar"></div><span class="id">Path A</span><h2>Scope ambiguous</h2><p>Disambiguate the intended deliverable, or guide the user through decision support.</p></div>
<div class="card gold"><div class="bar"></div><span class="id">Path B</span><h2>Guided intake</h2><p>Use a compact wizard or an open-ended planning interview.</p></div>
<div class="card mint"><div class="bar"></div><span class="id">Path C</span><h2>Clear request</h2><p>Move directly into objective, constraints, and success criteria.</p></div></div>`}),
    cfSlide({n:3,total:T,variant:'dark',kicker:'Entry and routing',title:'Classify before asking',subtitle:'Every request enters through the same clarity and context gate.',body:`<div class="flow">
<div class="card teal"><div class="step">1</div><span class="id">e1</span><h2>capturePlanningRequest()</h2><p>Accept a task, project, or work request.</p></div>
<div class="arrow">&rarr;</div>
<div class="card violet"><div class="step">2</div><span class="id">e2</span><h2>classifyPlanningIntent()</h2><p>Score clarity, context, complexity, and guided-intake need.</p></div>
<div class="arrow">&rarr;</div>
<div class="card coral"><div class="step">3</div><span class="id">e3</span><h2>Decision gate</h2><p>Route to Path A, B, or C.</p></div></div>`}),
    cfSlide({n:4,total:T,variant:'ice',kicker:'Path A',title:'Resolve ambiguous scope',subtitle:'Offer a deliverable choice, then continue planning or launch decision support.',body:`<div class="grid cols2">
<div class="card teal"><div class="bar"></div><span class="id">A1 &middot; a0 &rarr; a1t1 &rarr; a1t2 &rarr; a1t3</span><h2>User picks a deliverable shape</h2><ul><li>Confirm the selected planning lane.</li><li>Ask remaining core questions.</li><li>Rollups: <code>a1:q2/3</code>, <code>a1:q3/3</code>, or <code>a1c:q2/2</code>.</li><li>Draft the task plan.</li></ul></div>
<div class="card coral"><div class="bar"></div><span class="id">A2 &middot; a2t1 &rarr; a2t4</span><h2>Help me decide</h2><ul><li>Start a short decision-support sequence.</li><li>Collect <code>a2d:q1/n</code>, <code>a2d:q2/n</code>, and so on.</li><li>Reset into <code>a2p:q1/3</code> through <code>a2p:q3/3</code>.</li><li>Draft the task plan.</li></ul></div></div>`}),
    cfSlide({n:5,total:T,variant:'dark',kicker:'Path B',title:'Choose the right intake depth',subtitle:'Guided intake supports both compact clarification and adaptive interviewing.',body:`<div class="grid cols2">
<div class="card gold"><div class="bar"></div><span class="id">B1 &middot; b1t1 &rarr; b1t3</span><h2>Implicit guided intake</h2><ul><li>Run a mini intake wizard.</li><li>Ask <code>b1:q1/n</code>, <code>b1:q2/n</code>, and so on.</li><li>Draft after required details are complete.</li></ul></div>
<div class="card violet"><div class="bar"></div><span class="id">B2 &middot; b2t1 &rarr; b2t5</span><h2>Explicit &ldquo;Plan with me&rdquo;</h2><ul><li>Start an open-ended planning interview.</li><li>Generate dynamic follow-ups without a visible counter.</li><li>Capture task inputs, constraints, resources, and dependencies.</li><li>Draft the final plan.</li></ul></div></div>`}),
    cfSlide({n:6,total:T,variant:'light',kicker:'Direct and alternate entry',title:'Reuse the same planning engine',subtitle:'Clear requests skip disambiguation; planning tiles can preselect the lane.',body:`<div class="grid cols2">
<div class="card mint"><div class="bar"></div><span class="id">C1 &middot; c1t1 &rarr; c1t3</span><h2>Direct planning lane</h2><p>Ask three standard questions covering objective, constraints, and success criteria: <code>c1:q1/3</code>, <code>c1:q2/3</code>, <code>c1:q3/3</code>.</p></div>
<div class="card violet"><div class="bar"></div><span class="id">D &middot; d1 &rarr; d4</span><h2>Planning tile click</h2><p>A guided-plan tile starts B2 directly. Other preset templates prefill the brief and reuse <code>e1</code>, <code>e2</code>, and <code>e3</code>.</p></div></div>`}),
    cfSlide({n:7,total:T,variant:'dark',kicker:'Shared terminal',title:'Generate, review, approve',subtitle:'All paths converge on one consistent plan lifecycle.',body:`<div class="flow">
<div class="card teal"><div class="step">1</div><span class="id">g1</span><h2>generateTaskPlan()</h2><p>Synthesize work breakdown, assumptions, and next actions.</p></div>
<div class="arrow">&rarr;</div>
<div class="card violet"><div class="step">2</div><span class="id">g2</span><h2>Show plan card</h2><p>Present approve, revise, or reject actions.</p></div>
<div class="arrow">&rarr;</div>
<div class="card mint"><div class="step">3</div><span class="id">g3</span><h2>Approve and start</h2><p>Begin execution, export the plan, or open the delivery workspace.</p></div></div>`}),
    cfSlide({n:8,total:T,variant:'ice',kicker:'Schema reference',title:'Stable identifiers and rollups',subtitle:'Machine-readable IDs connect visual tiles to question-card sequences.',body:`<table class="table"><thead><tr><th>Pattern</th><th>Meaning</th><th>Examples</th></tr></thead><tbody>
<tr><td><code>e# / d# / g#</code></td><td>Entry, alternate-entry, or terminal tiles</td><td><code>e2</code>, <code>d4</code>, <code>g3</code></td></tr>
<tr><td><code>a1t2 / b2t4 / c1t3</code></td><td>Non-question tile inside a path</td><td>Path + optional variant + tile number</td></tr>
<tr><td><code>c1:q1/3</code></td><td>Visible question-card rollup</td><td>Question 1 of 3</td></tr>
<tr><td><code>a2d:q1/n</code></td><td>Named question-set variant</td><td>Decision-support sequence</td></tr>
<tr><td><code>data-step-id</code></td><td>Stable DOM identifier</td><td><code>data-step-id="c1t2"</code></td></tr>
<tr><td><code>data-card-rollup</code></td><td>Cards represented by a tile</td><td>Comma-separated card IDs</td></tr></tbody></table>`}),
  ];
  slides.forEach((html, i) => fs.writeFileSync(path.join(dir, `${String(i+1).padStart(2,'0')}.html`), html));
  fs.writeFileSync(path.join(dir, 'deck.context.json'), JSON.stringify({title:'Task Planning Flow Architecture',theme:'clippyflow',source:SOURCE,slides:slides.map((_,i)=>({n:i+1,file:`${String(i+1).padStart(2,'0')}.html`}))}, null, 2));
  packageDeck('planner-card-math', slides.map((_,i)=>({file:`${String(i+1).padStart(2,'0')}.html`,title:`Task Planning ${i+1}`})), deckFile('planner-card-math'), 'Task Planning Flow Architecture');
}

function deckFile(id) {
  const d = DECKS.find(x => x.id === id);
  if (!d) throw new Error(`Unknown deck id: ${id}`);
  return d.file;
}

/* Library page for the Docusaurus wiki — generated from the same DECKS
   registry as the in-deck Library overlay, so the two cannot drift. */
function writeLibraryDoc(counts) {
  const cards = DECKS.map(d => `  <a class="deckCard" href={useBaseUrl('/decks/${d.file}')}>
    <span className="deckBadge">${d.theme}</span>
    <span className="deckName">${d.name}</span>
    <span className="deckBlurb">${d.blurb}</span>
    <span className="deckMeta">${counts[d.id] || d.slides} slides</span>
  </a>`).join('\n');
  const total = DECKS.reduce((a, d) => a + (counts[d.id] || d.slides), 0);
  const doc = `---
id: library
title: Deck Library
sidebar_label: Library
sidebar_position: 3
description: Every ClippySlide deck as a single self-contained HTML presentation.
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Every deck below is a **single self-contained HTML file**. All stylesheets,
scripts, and images are inlined, so a deck opens from this site, from disk, or
from an email attachment with no other files and no network access.

<div className="deckGrid">
${cards}
</div>

## Controls

| Key | Action |
| --- | --- |
| \`←\` \`→\` \`PageUp\` \`PageDown\` \`Space\` | Previous / next slide |
| \`Home\` \`End\` | First / last slide |
| \`F\` | Fullscreen |
| \`L\` | Open this library from inside any deck |
| \`H\` | Pin the control bar |

The control bar hides itself and returns on pointer movement. Clicking the left
or right edge of the stage also navigates.

## Building

\`\`\`bash
node generator/build-clippydecks.js
\`\`\`

This packages every deck folder, copies the results into
\`website/static/decks/\`, regenerates the ClippyFlow \`planner-card-math\`
slides, and rewrites this page.

To add a deck, append an entry to the \`DECKS\` registry at the top of
[\`generator/build-clippydecks.js\`](https://github.com/dayour/clippyslide/blob/main/generator/build-clippydecks.js)
and rebuild. The registry drives the in-deck Library overlay and this page at
once.

---

*${DECKS.length} decks · ${total} slides · generated by \`generator/build-clippydecks.js\`.*
`;
  fs.writeFileSync(path.join(ROOT, 'website', 'docs', 'library.mdx'), doc);
  console.log(`Built website/docs/library.mdx (${DECKS.length} decks, ${total} slides)`);
}

const counts = {};

const deckIndex = JSON.parse(fs.readFileSync(path.join(ROOT, 'deck', 'index.json'), 'utf8'));
counts['deck'] = packageDeck('deck',
  deckIndex.slides.map(s => ({ file: s.file, title: `Slide ${s.n}`, fallback: `${String(s.n).padStart(2, '0')}.png` })),
  deckFile('deck'), deckIndex.title, 'deck');

const brand = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand-deck', 'clippyflow-brand-deck.context.json'), 'utf8'));
counts['brand-deck'] = packageDeck('brand-deck',
  brand.slides.map(s => ({ file: `${s.id}.html`, title: s.title, fallback: `${s.id}.png` })),
  deckFile('brand-deck'), brand.name, 'brand-deck');

const atl = JSON.parse(fs.readFileSync(path.join(ROOT, 'atlassian-connectors', 'deck.context.json'), 'utf8'));
counts['atlassian-connectors'] = packageDeck('atlassian-connectors',
  atl.slides.map(s => ({ file: `${s.id}.html`, title: s.title, fallback: `${s.id}.png` })),
  deckFile('atlassian-connectors'), atl.deck, 'atlassian-connectors');

function folderDeck(id, title) {
  const specs = fs.readdirSync(path.join(ROOT, id))
    .filter(f => f.endsWith('.html') && !f.endsWith('-clippydeck.html'))
    .sort()
    .map(f => ({ file: f, title: path.basename(f, '.html') }));
  counts[id] = packageDeck(id, specs, deckFile(id), title, id);
}
folderDeck('slides-clippyflow', 'ClippyFlow Sample Slides');
folderDeck('slides', 'TileSlide Sample Slides');

buildPlannerDeck();
counts['planner-card-math'] = 8;

writeLibraryDoc(counts);


