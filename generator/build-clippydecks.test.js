const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { plannerSlides, presentation, inlineHtml } = require('./build-clippydecks');

const ROOT = path.join(__dirname, '..');
const slides = plannerSlides();
const titles = [
  'Task Planning Flow Architecture',
  'Three routes, one governed output',
  'Classify before asking',
  'Resolve ambiguous scope',
  'Choose the right intake depth',
  'Reuse the same planning engine',
  'Generate, review, approve',
  'Stable identifiers and rollups',
];

test('all eight planner slides use the actual brand-deck stylesheets and terminal anatomy', () => {
  const reference = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand-deck', 'clippyflow-brand-deck.context.json'), 'utf8'));
  assert.equal(slides.length, 8);
  slides.forEach((slide, i) => {
    const stylesheets = [...slide.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(match => match[1]);
    assert.deepEqual(stylesheets, reference.stylesheets);
    assert.ok(slide.includes(`<h1 class="cf-title planner-title">${titles[i]}</h1>`));
    assert.match(slide, /class="cf-stage cf-scan/);
    assert.match(slide, /class="cf-win"/);
    assert.match(slide, /class="cf-win-bar"/);
    assert.match(slide, /class="cf-win-body planner-body"/);
    assert.match(slide, /class="cf-panel /);
    assert.doesNotMatch(slide, /slide (?:light|ice)|--cf-snow|--cf-ice|Trebuchet|#[0-9a-f]{3,8}\b/i);
  });
});

test('planning routes, function names and card identifiers are retained', () => {
  const text = slides.join('\n');
  for (const token of [
    'Path A', 'Path B', 'Path C',
    'capturePlanningRequest()', 'classifyPlanningIntent()', 'generateTaskPlan()',
    'e1', 'e2', 'e3', 'g1', 'g2', 'g3',
    'a0', 'a1t1', 'a1t2', 'a1t3', 'a2t1', 'a2t4',
    'a1:q2/3', 'a1:q3/3', 'a1c:q2/2', 'a2d:q1/n', 'a2d:q2/n', 'a2p:q1/3', 'a2p:q3/3',
    'b1t1', 'b1t3', 'b1:q1/n', 'b1:q2/n', 'b2t1', 'b2t5',
    'c1t1', 'c1t3', 'c1:q1/3', 'c1:q2/3', 'c1:q3/3', 'd1', 'd4',
    'data-step-id', 'data-card-rollup',
  ]) assert.ok(text.includes(token), `Missing planning content: ${token}`);
  assert.equal((slides[7].match(/<tr>/g) || []).length, 7);
});

test('planner viewer uses fixed ClippyFlow tokens, not OS-selected gray and pink', () => {
  const viewer = presentation('Planning', [], 'planner-card-math', true);
  assert.match(viewer, /data-theme="clippyflow"/);
  assert.match(viewer, /--cp-bg:var\(--cf-navy-deep\)/);
  assert.match(viewer, /--cp-accent:var\(--clippy-cyan-br\)/);
  assert.doesNotMatch(viewer, /prefers-color-scheme|#fd8ea1|#3d3b3a/i);
});

test('responsive viewer fills the viewport without a second scaling or border layer', () => {
  const viewer = presentation('Planning', [], 'planner-card-math', true, true);
  assert.match(viewer, /data-layout="responsive"/);
  assert.match(viewer, /#stage\{position:absolute;inset:0;overflow:hidden\}/);
  assert.match(viewer, /iframe\{width:100%;height:100%;border:0;/);
  assert.doesNotMatch(viewer, /--deck-scale|function fit\(\)/);
  assert.match(viewer, /@media\(max-width:640px\)/);
  assert.match(viewer, /\.lib-grid\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(viewer, /frame\.contentDocument\.addEventListener\('mousemove',reveal\)/);
  assert.match(viewer, /frame\.contentDocument\.addEventListener\('keydown',handleKey\)/);
  assert.match(viewer, /if\(!pinned\)idleTimer=setTimeout/);

  const fixed = presentation('Legacy', [], 'deck');
  assert.doesNotMatch(fixed, /data-layout="responsive"/);
  assert.match(fixed, /--deck-scale/);
  assert.match(fixed, /Math\.min\(innerWidth\/1280,innerHeight\/720\)/);
});

test('each planner source fills wide, tall, compact and resized viewports with uniform scaling', () => {
  const sizes = [[1280,720], [1800,900], [1920,1080], [1440,900], [1024,768], [800,450], [600,900], [2560,1080]];
  const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);
  for (const html of slides) {
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    const stage = {style:{}};
    const viewport = {clientWidth:1280, clientHeight:720};
    let onResize;
    vm.runInNewContext(script, {
      document: {documentElement:viewport, querySelector:selector => {
        assert.equal(selector, '.cf-stage');
        return stage;
      }},
      window: {addEventListener:(event, callback) => {
        assert.equal(event, 'resize');
        onResize = callback;
      }},
    });
    assert.equal(typeof onResize, 'function');
    assert.equal(stage.style.transform, 'scale(1)');
    for (const [width, height] of sizes) {
      viewport.clientWidth = width;
      viewport.clientHeight = height;
      onResize();
      const scale = Number(stage.style.transform.match(/^scale\(([^)]+)\)$/)[1]);
      const logicalWidth = parseFloat(stage.style.width);
      const logicalHeight = parseFloat(stage.style.height);
      close(scale, Math.min(width / 1280, height / 720));
      close(logicalWidth * scale, width);
      close(logicalHeight * scale, height);
      assert.ok(logicalWidth >= 1280 - 0.000001);
      assert.ok(logicalHeight >= 720 - 0.000001);
    }
    const visibleStyle = {...stage.style};
    viewport.clientWidth = viewport.clientHeight = 0;
    onResize();
    assert.deepEqual(stage.style, visibleStyle);
    viewport.clientWidth = 1280;
    viewport.clientHeight = 720;
    onResize();
    assert.equal(stage.style.transform, 'scale(1)');
  }
});

test('generated sources and both packaged copies contain the current eight slides', () => {
  const normalize = text => text.replace(/\r\n/g, '\n');
  slides.forEach((slide, i) => {
    const file = path.join(ROOT, 'planner-card-math', `${String(i + 1).padStart(2, '0')}.html`);
    assert.equal(normalize(fs.readFileSync(file, 'utf8')), normalize(slide), `Stale source slide ${i + 1}`);
    const inlined = inlineHtml(file);
    assert.doesNotMatch(inlined, /<link\b/);
    assert.match(inlined, /--cf-bg:/);
    assert.match(inlined, /\.cf-win-bar\s*\{/);
  });
  const deckFile = 'task-planning-clippydeck.html';
  const local = fs.readFileSync(path.join(ROOT, 'planner-card-math', deckFile), 'utf8');
  const published = fs.readFileSync(path.join(ROOT, 'website', 'static', 'decks', deckFile), 'utf8');
  assert.equal(normalize(local), normalize(published));
  assert.match(local, /data-layout="responsive"/);
  assert.doesNotMatch(local, /--deck-scale/);
  const payload = JSON.parse(local.match(/const slides=(.*);let index=0;/)[1]);
  assert.equal(payload.length, 8);
  payload.forEach((slide, i) => {
    assert.equal(slide.title, titles[i]);
    const html = Buffer.from(slide.data, 'base64').toString('utf8');
    assert.match(html, /class="cf-stage cf-scan/);
    assert.match(html, /\.cf-win-bar\s*\{/);
    assert.match(html, /stage\.style\.width = \(width \/ scale\)/);
    assert.doesNotMatch(html, /<link\b|<img\b|slide (?:light|ice)/);
    assert.ok(html.includes(titles[i]));
  });
});
