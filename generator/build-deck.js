/* ========================================================================
   clippyslide :: build-deck.js
   Data-driven generator for the full 24-slide ClippyFlow deck in the ClippySlide system.
   One content model + archetype renderers -> ../deck/NN.html (link design-system/clippyslide.css).
   Run:  node build-deck.js
   ======================================================================== */
const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, '..', 'deck');
fs.mkdirSync(OUT, { recursive: true });
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* -- shared page scaffold -- */
function page(n, stageClass, body, extraCss = '') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>ClippyFlow ${n}</title><link rel="stylesheet" href="../design-system/clippyslide.css">
<style>html,body{margin:0;background:#000}
.pg{position:absolute;right:22px;bottom:14px;font-size:13px;color:var(--cf-fg-dim)}
.kick{font-weight:700;font-size:26px;letter-spacing:1px;
  background:var(--cf-grad-title);-webkit-background-clip:text;background-clip:text;color:transparent;width:max-content}
.big{font-weight:800;font-size:52px;line-height:1.02;color:#fff;margin:2px 0 0}
.sub{font-weight:700;font-size:26px;color:#fff;margin-top:2px}
.lines{margin-top:34px;display:flex;flex-direction:column;gap:20px;max-width:520px}
.ln{font-size:21px;line-height:1.3;color:var(--cf-fg-soft)}
.foot{position:absolute;left:56px;bottom:42px}
.foot .rule{width:392px;height:2px;border-radius:2px;background:var(--cf-grad-blue);margin-bottom:8px}
.foot .txt{font-weight:700;font-size:21px;background:var(--cf-grad-title);
  -webkit-background-clip:text;background-clip:text;color:transparent;width:max-content}
.shot{position:absolute;border-radius:12px;overflow:hidden;
  background:radial-gradient(130% 130% at 70% 20%,rgba(129,142,255,.16),rgba(57,176,255,.06) 70%,rgba(0,0,0,0));
  border:1px solid rgba(129,142,255,.35);box-shadow:0 10px 40px rgba(0,0,0,.5),0 0 22px rgba(80,140,255,.18);
  display:flex;align-items:center;justify-content:center}
.shot .cap{color:var(--cf-fg-dim);font-size:15px;letter-spacing:.4px;text-transform:uppercase}
${extraCss}</style></head><body>
<div class="cf-stage ${stageClass}">${body}<div class="pg">${n} / 24</div></div></body></html>`;
}

/* -- archetypes -- */
function title({n, kicker, sub, main}) {
  const body = `<div class="cf-accent-left" style="top:300px;height:150px"></div>
  <svg style="position:absolute;left:96px;top:140px;width:560px;height:460px;opacity:.15" viewBox="0 0 200 200" fill="none" stroke="#5a4b8a" stroke-width="2">
   <path d="M100 18C150 40 168 96 150 150C132 188 68 188 50 150C32 96 50 40 100 18Z"/>
   <path d="M100 40C60 70 60 130 100 168C140 130 140 70 100 40Z"/><path d="M62 96C82 86 118 86 138 96"/></svg>
  <div style="position:absolute;left:360px;top:250px">
   <div class="kick" style="font-size:30px;margin-bottom:84px">${esc(kicker)}</div>
   <div style="font-weight:700;font-size:42px;color:var(--cf-cyan);line-height:1.12">${esc(sub)}</div>
   <div style="font-weight:800;font-size:42px;color:#fff;line-height:1.12">${esc(main)}</div></div>`;
  return page(n, 'cf-stage--title', body);
}

function feature({n, kicker, title, sub, lines, shotCap = 'Product UI', status}) {
  const ls = lines.map(l => `<div class="ln">${esc(l)}</div>`).join('');
  const body = `<div class="cf-accent-left" style="top:230px;height:170px"></div>
  <div style="position:absolute;left:56px;top:40px">
   ${kicker ? `<div class="kick">${esc(kicker)}</div>` : ''}
   <div class="big">${esc(title)}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}
   <div class="lines">${ls}</div></div>
  <div class="shot" style="left:686px;top:150px;width:540px;height:400px"><span class="cap">${esc(shotCap)}</span></div>
  ${status ? `<div class="foot"><div class="rule"></div><div class="txt">${esc(status)}</div></div>` : ''}`;
  return page(n, 'cf-stage--glow', body);
}

function guidance({n, title, lines, panelTitle, mono}) {
  const ls = lines.map(l => `<div class="ln" style="max-width:480px">${esc(l)}</div>`).join('');
  const ms = mono.map(m => `<div style="font-family:'Cascadia Code',Consolas,monospace;font-size:13px;line-height:1.5;color:${m.startsWith('#')?'var(--cf-cyan)':'var(--cf-fg-soft)'}">${esc(m)||'&nbsp;'}</div>`).join('');
  const body = `<div class="cf-accent-left" style="top:250px;height:150px"></div>
  <div style="position:absolute;left:56px;top:64px"><div class="big" style="font-size:46px">${esc(title)}</div>
   <div class="lines">${ls}</div></div>
  <div class="cf-panel blue" style="left:640px;top:48px;width:586px;height:624px">
   <div class="cf-in" style="padding:22px 26px;overflow:hidden">
    <div class="cf-h2 under" style="margin-bottom:14px">${esc(panelTitle)}</div>${ms}</div></div>`;
  return page(n, 'cf-stage--glow', body);
}

function panelGrid({n, title, hero, cols}) {
  // cols: array of columns, each array of {label, hero?}
  let html = `<div class="cf-panel hero" style="left:14px;top:14px;width:1252px;height:120px">
    <div class="cf-in"><div class="cf-h2 under" style="position:absolute;left:20px;top:16px;font-size:24px">${esc(hero)}</div></div></div>`;
  const colW = Math.floor((1252 - (cols.length-1)*16) / cols.length);
  cols.forEach((col, ci) => {
    const x = 14 + ci*(colW+16);
    const rowH = Math.floor((560 - (col.length-1)*16) / col.length);
    col.forEach((cell, ri) => {
      const y = 150 + ri*(rowH+16);
      const cls = cell.hero ? 'hero' : 'blue';
      html += `<div class="cf-panel ${cls}" style="left:${x}px;top:${y}px;width:${colW}px;height:${rowH}px">
        <div class="cf-in"><div class="cf-label" style="position:absolute;left:16px;top:13px">${esc(cell.label)}</div></div></div>`;
    });
  });
  return page(n, '', html);
}

function diagram({n, title, pills, tiles, sideTitle, sideItems, sideKind}) {
  const pillH = pills.map((p,i)=>`<div class="cf-pill ${p.k}">${esc(p.t)}</div>`).join('');
  const tileH = tiles.map(t=>`<div class="cf-tile">${esc(t)}</div>`).join('');
  let side = '';
  if (sideKind === 'green') {
    side = `<div class="cf-greenpanel" style="left:924px;top:150px;width:306px;height:430px">
      ${sideItems.map(s=>`<div class="cf-body" style="color:#fff;font-size:18px">${esc(s)}</div>`).join('')}</div>`;
  } else {
    side = `<div style="position:absolute;left:924px;top:150px;width:306px;display:flex;flex-direction:column;gap:14px">
      ${sideItems.map(s=>`<div class="cf-agentcard"><span class="ico" style="background:linear-gradient(135deg,#CA5BCD,#818EFF)"></span>${esc(s)}</div>`).join('')}</div>`;
  }
  const body = `<div class="cf-accent-left" style="top:300px;height:150px"></div>
  <div class="cf-panel blue" style="left:40px;top:64px;width:840px;height:596px"><div class="cf-in" style="padding:22px 26px">
    <div style="font-weight:800;font-size:40px;line-height:1;margin-bottom:16px;background:var(--cf-grad-title);-webkit-background-clip:text;background-clip:text;color:transparent;width:max-content">${esc(title)}</div>
    <div style="position:relative;width:100%;height:466px;background:#fff;border-radius:12px;overflow:hidden">
     <div style="position:absolute;left:14px;top:140px;height:300px;width:28px;writing-mode:vertical-rl;transform:rotate(180deg);display:flex;align-items:center;justify-content:center;font-size:18px;color:#14161D;border-left:2px solid #14161D">Orchestrator</div>
     <div style="position:absolute;inset:16px 18px 16px 56px;display:flex;flex-direction:column">
      <div style="display:grid;grid-template-columns:repeat(${pills.length},1fr);gap:14px;height:50px">${pillH}</div>
      <div style="display:flex;align-items:center;gap:10px;margin-top:14px;color:#14161D;font-size:17px">Knowledge<span class="cf-divider" style="flex:1"></span>Tools<span class="cf-divider" style="flex:2"></span></div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px">${tileH}</div>
     </div></div></div></div>
  <div style="position:absolute;left:930px;top:108px;font-weight:800;font-size:26px;background:var(--cf-grad-title);-webkit-background-clip:text;background-clip:text;color:transparent">${esc(sideTitle)}</div>
  ${side}`;
  return page(n, 'cf-stage--glow', body);
}

function lifecycle({n, title, note, columns, health}) {
  let cols = '';
  columns.forEach(col => {
    cols += `<div style="position:absolute;left:${col.x}px;top:${col.y}px;display:flex;flex-direction:column;gap:12px">`;
    col.cards.forEach(c => {
      cols += `<div class="cf-env ${c.k}" style="position:relative;width:${col.w||386}px;height:${col.h||72}px"><span class="name">${esc(c.name)}</span><span class="ver">${esc(c.ver)}</span></div>`;
    });
    cols += `</div>`;
  });
  const body = `<div style="position:absolute;left:24px;top:16px;font-weight:700;font-size:36px;color:#fff">${esc(title)}</div>
  ${note?`<div style="position:absolute;left:24px;top:96px;width:360px;font-size:18px;color:var(--cf-fg-soft)">${esc(note)}</div>`:''}
  ${cols}<div class="cf-health"><span class="lbl">${esc(health)}</span></div>`;
  return page(n, 'cf-stage--glow', body);
}

/* health/validation 3x3 matrix (Environment - Solution - Validation across Dev->Sandbox->Prod) */
function healthmatrix({n, title, note, cols, rows, health}) {
  const gx0 = 176, gy0 = 206, colW = 332, colGap = 22, rowH = 132, rowGap = 16;
  const dot = { dev:'#C77866', sandbox:'#7C9AC2', prod:'#2FA84F' };
  let head = '';
  cols.forEach((c, ci) => {
    const x = gx0 + ci * (colW + colGap);
    head += `<div style="position:absolute;left:${x}px;top:${gy0-44}px;width:${colW}px;font-weight:700;font-size:18px;letter-spacing:.8px;color:var(--cf-cyan);text-transform:uppercase">${esc(c)}</div>`;
  });
  let grid = '';
  rows.forEach((r, ri) => {
    const y = gy0 + ri * (rowH + rowGap);
    grid += `<div style="position:absolute;left:40px;top:${y + rowH/2 - 14}px;width:120px;display:flex;align-items:center;gap:9px">
      <span style="width:11px;height:11px;border-radius:50%;background:${dot[r.env]};box-shadow:0 0 9px ${dot[r.env]}"></span>
      <span style="font-weight:700;font-size:17px;color:#fff;letter-spacing:.4px">${esc(r.label)}</span></div>`;
    r.cells.forEach((cell, ci) => {
      const x = gx0 + ci * (colW + colGap);
      grid += `<div class="cf-env ${r.env}" style="left:${x}px;top:${y}px;width:${colW}px;height:${rowH}px;padding:18px 22px;gap:4px">
        <span class="name">${esc(cell.name)}</span><span class="ver">${esc(cell.ver)}</span></div>`;
    });
  });
  const body = `<div style="position:absolute;left:40px;top:30px;font-weight:800;font-size:38px;color:#fff">${esc(title)}</div>
  ${note?`<div style="position:absolute;left:40px;top:86px;width:760px;font-size:18px;color:var(--cf-fg-soft)">${esc(note)}</div>`:''}
  ${head}${grid}<div class="cf-health"><span class="lbl">${esc(health)}</span></div>`;
  return page(n, 'cf-stage--glow', body);
}

function checklist({n, title, sub, groups}) {
  let cols = '';
  const colW = Math.floor((1200 - (groups.length-1)*24) / groups.length);
  groups.forEach((g, gi) => {
    const x = 40 + gi*(colW+24);
    const items = g.items.map((it,ii)=>`<div style="display:flex;gap:10px;font-size:18px;color:var(--cf-fg-soft);margin-bottom:11px"><span style="color:var(--cf-cyan);font-weight:700">${ii+1}.</span>${esc(it)}</div>`).join('');
    cols += `<div class="cf-panel blue" style="left:${x}px;top:170px;width:${colW}px;height:480px"><div class="cf-in" style="padding:20px 24px">
      <div class="cf-h2 under" style="margin-bottom:16px">${esc(g.head)}</div>${items}</div></div>`;
  });
  const body = `<div class="cf-accent-left" style="top:60px;height:80px"></div>
  <div style="position:absolute;left:40px;top:48px"><div class="big" style="font-size:44px">${esc(title)}</div>
   ${sub?`<div class="cf-body" style="font-size:18px;margin-top:6px">${esc(sub)}</div>`:''}</div>${cols}`;
  return page(n, 'cf-stage--glow', body);
}

function demo({n, title, sub}) {
  const body = `<div class="cf-accent-left" style="top:300px;height:150px"></div>
  <div style="position:absolute;left:0;right:0;top:70px;text-align:center">
   <div class="kick" style="margin:0 auto;font-size:24px">LIVE DEMO</div>
   <div class="big" style="font-size:60px;text-align:center">${esc(title)}</div>
   ${sub?`<div class="sub" style="text-align:center;color:var(--cf-fg-soft)">${esc(sub)}</div>`:''}</div>
  <div class="shot" style="left:240px;top:250px;width:800px;height:400px"><span class="cap">Copilot Studio &middot; live capture</span></div>`;
  return page(n, 'cf-stage--title', body);
}

function cta({n, title, sub, body, outcome, locations}) {
  const locs = locations.map(l=>`<div style="margin-bottom:9px"><div style="font-size:15px;color:#fff;font-weight:600">${esc(l.place)}</div><div style="font-size:13px;color:var(--cf-fg-dim)"><i>${esc(l.date)}</i></div></div>`).join('');
  const bd = body.map(p=>`<div class="cf-body" style="font-size:17px;margin-bottom:12px;max-width:430px">${esc(p)}</div>`).join('');
  const html = `<div class="cf-accent-left" style="top:60px;height:90px"></div>
  <div style="position:absolute;left:48px;top:44px;width:840px">
   <div class="big" style="font-size:40px;color:var(--cf-cyan)">${esc(title)}</div>
   <div class="sub" style="font-size:22px;margin-top:6px">${esc(sub)}</div></div>
  <div class="cf-tile" style="position:absolute;left:48px;top:170px;width:560px;height:42px;justify-content:flex-start;padding-left:16px;font-weight:600"><b>Outcome:</b>&nbsp;${esc(outcome)}</div>
  <div style="position:absolute;left:48px;top:240px"><div class="shot" style="position:relative;width:380px;height:380px"><span class="cap">Bootcamp series</span></div></div>
  <div style="position:absolute;left:470px;top:236px">${bd}</div>
  <div style="position:absolute;left:980px;top:150px;text-align:center;width:250px">
   <div style="font-size:22px;color:#fff">Register today!</div>
   <div style="font-size:14px;color:var(--cf-cyan)"><i>aka.ms/CopilotStudioBootcamp</i></div>
   <div class="shot" style="position:relative;margin:14px auto 0;width:150px;height:150px"><span class="cap">QR</span></div></div>
  <div class="cf-panel blue" style="left:980px;top:336px;width:250px;height:300px"><div class="cf-in" style="padding:14px 16px">
   <div class="cf-h2 under" style="font-size:16px;margin-bottom:12px">Proposed Locations / Dates</div>${locs}</div></div>`;
  return page(n, 'cf-stage--glow', html);
}

/* ==== CONTENT MODEL -- all 24 slides ==== */
const SLIDES = [
 {f:title, n:1, kicker:'COPILOT AGENT DEVELOPMENT', sub:'ClippyFlow', main:'Agent Orchestration'},
 {f:diagram, n:2, title:'Agent Layers', pills:[{t:'Topic',k:'blue'},{t:'Topic',k:'blue'},{t:'Agent',k:'mag'},{t:'Agent',k:'mag'}],
   tiles:['Public websites','SharePoint','Dataverse','Files','Connector','Flow','Prompt','MCP'],
   sideTitle:'Core layers', sideKind:'green',
   sideItems:['Topics provide direction','Knowledge is the "intelligence" layer','Tools are the actions / output','Additional agents enable agent-to-agent collaboration']},
 {f:panelGrid, n:3, hero:'Use Case Description', cols:[
   [{label:'Knowledge & Data Sources'},{label:'Tools & Agents'},{label:'Actions, flows, triggers',hero:true}],
   [{label:'Topics'},{label:'Restrictions / requirements'},{label:'Environment and Channels'},{label:'Analytics & Evals'}],
   [{label:'Instructions',hero:true}] ]},
 {f:guidance, n:4, title:'Instruction Guidance',
   lines:['Purpose -- authoritative, reduce ambiguity; semantic keywords matter','Instructions -- micro-step with goal, action, outcome','Guidelines -- "how" the agent responds: tone, restrictions','Process -- don\'t outline full step-by-step; those are topics','Expectations -- consider what you expect from the agent'],
   panelTitle:'Example instruction set',
   mono:['# Purpose','Assist employees with accurate, policy-compliant guidance','across HR, Legal, and company policy. Cite verifiable sources.','','# General Guidelines','- Maintain a professional, supportive tone','- Base responses on the most recent authoritative policy','- Include citations to the source whenever possible','','# Step-by-Step','## 1. Identify the request','- Goal: understand the user\'s question','- Action: ask clarifying questions if ambiguous','## 2. Search knowledge','- Action: search SharePoint / HR policy repositories','## 3. Analyze & summarize','- Goal: interpret policy, extract key points']},
 {f:feature, n:5, kicker:'AGENT ORCHESTRATION', title:'Multi-agent scenarios', sub:'Connect agents across services',
   lines:['Build effective end-to-end transformation','Enable agents to talk to each other in Copilot Studio','Exchange data, collaborate on tasks, distribute work','Cross-platform orchestration across the agent ecosystem'], shotCap:'Orchestration canvas'},
 {f:diagram, n:6, title:'Copilot Studio Agent', pills:[{t:'Topic',k:'blue'},{t:'Topic',k:'blue'},{t:'Orchestrator',k:'mag'},{t:'Agent',k:'mag'}],
   tiles:['Public websites','SharePoint','Dataverse','Files','Connector','MCP','Flow','Rest API'],
   sideTitle:'Connected agent', sideKind:'cards',
   sideItems:['Copilot Studio agents','M365 Agents SDK','AI Foundry agents','Fabric Data agents','Agent2Agent (A2A)']},
 // slide 7 = bespoke hand-built (slides-clippyflow/07-orchestration.html); included in index, not regenerated.
 {f:feature, n:8, kicker:'AGENT ORCHESTRATION', title:'Break into child agents', sub:'when...',
   lines:['A single developer or small cohesive team owns the solution','You want to logically group tools, instructions, or knowledge','...into clearly defined child agents within a larger agent','You do not need independent lifecycle or scaling per capability'], shotCap:'Child-agent topology'},
 {f:feature, n:9, kicker:'AGENT ORCHESTRATION', title:'Redirect to an Agent', sub:'Available now',
   lines:['Hand off the conversation from one agent to another','Preserve context across the redirect','Compose specialized agents into a single experience'], shotCap:'Redirect configuration'},
 {f:feature, n:10, kicker:'MODEL CHOICE', title:'Model Choice & Multi-Agents', sub:'',
   lines:['Latest AI LLM models available in Copilot Studio','Available as OpenAI and Anthropic launch them','Expand model choice beyond OpenAI models','Give makers the right model for each scenario'], shotCap:'Model picker'},
 {f:feature, n:11, kicker:'KNOWLEDGE & TOOLS', title:'Knowledge & Tools', sub:'',
   lines:['Leverage out-of-box SharePoint connector RAG','Reason over structured data with the code interpreter','Interact with the agent consistently across channels & apps','Custom prompts over your enterprise data'], shotCap:'Knowledge sources'},
 {f:feature, n:12, kicker:'IT ADMINS', title:'Agent control system', sub:'The Copilot Hub',
   lines:['A central Copilot Hub to manage your AI transformation','Discover new AI capabilities','Manage AI settings','Track adoption','Admin-centric design for ROI evaluation'], shotCap:'Copilot Hub', status:'Generally available | October 2025'},
 {f:feature, n:13, kicker:'MODEL INNOVATION', title:'Granular AI Controls', sub:'',
   lines:['Manage at scale via groups or individual environments','Control what makers can use at each step','Customize a welcome experience with guidelines','Limit and govern model and capability access'], shotCap:'AI controls', status:'Public preview | October 2025'},
 {f:demo, n:14, title:'Evaluations', sub:'Quality, before you ship'},
 {f:feature, n:15, kicker:'IT ADMINS', title:'Enhanced agent inventory', sub:'See all your agents',
   lines:['See all the tenant\'s agents, apps, and flows','Via UX or APIs','Fast and up to date','Large scale (millions)'], shotCap:'Agent inventory', status:'Generally available | November 2025'},
 {f:healthmatrix, n:16, title:'Configuration / validation health', note:'Single-solution detail tracked across Dev -> Sandbox -> Prod.',
   cols:['Environment','Solution','Validation'],
   rows:[
    {env:'dev',     label:'Dev',     cells:[{name:'Environment',ver:'vNext Dev'},    {name:'Agent / App',ver:'v1.0.0.1 - Policy Advisor'},{name:'Schema',ver:'passing'}]},
    {env:'sandbox', label:'Sandbox', cells:[{name:'Environment',ver:'vNext Sandbox'},{name:'Agent / App',ver:'v1.0.0.1 - Policy Advisor'},{name:'Policy',ver:'passing'}]},
    {env:'prod',    label:'Prod',    cells:[{name:'Environment',ver:'vNext Prod'},   {name:'Agent / App',ver:'v1.0.0.2 - Policy Advisor'},{name:'Publish gate',ver:'ready'}]} ],
   health:'Configuration / validation health'},
 {f:checklist, n:17, title:'Agent Publishing and Polishing', sub:'The pre-publish checklist makers complete before going live.',
   groups:[{head:'Identity', items:['Agent Name','Channel(s)','Icon','Color','Developer name']},
           {head:'Compliance', items:['Website URL','Privacy Statement URL','Terms of use URL','Short Description','Long Description']}]},
 {f:lifecycle, n:18, title:'Agent Lifecycle Management with Power Platform', note:'As use cases and adoption increase, trust boundaries shift.',
   columns:[
    {x:12,y:282,w:386,h:74,cards:[{k:'dev',name:'Environment: HR',ver:'vNext Dev'},{k:'sandbox',name:'Environment: HR',ver:'vNext Sandbox'},{k:'dev',name:'Environment: Legal',ver:'vNext Dev'},{k:'sandbox',name:'Environment: Legal',ver:'vNext Sandbox'}]},
    {x:432,y:204,w:386,h:72,cards:[{k:'dev',name:'Environment: Business Analyst',ver:'vNext Dev'},{k:'sandbox',name:'Environment: Business Analyst',ver:'vNext Sandbox'},{k:'dev',name:'Environment: Operations',ver:'vNext Dev'},{k:'sandbox',name:'Environment: Operations',ver:'vNext Sandbox'},{k:'prod',name:'Environment: MVP Ring1',ver:'vNext Prod'}]},
    {x:858,y:118,w:386,h:66,cards:[{k:'dev',name:'Environment',ver:'vNext Dev'},{k:'sandbox',name:'Environment',ver:'vNext Sandbox'},{k:'prod',name:'Environment: All Users NAM',ver:'vNext Prod'},{k:'dev',name:'Environment',ver:'vNext Dev'},{k:'sandbox',name:'Environment',ver:'vNext Sandbox'},{k:'prod',name:'Environment: All Users',ver:'vNext Prod'}]} ],
   health:'Configuration/validation health'},
 {f:feature, n:19, kicker:'MODEL INNOVATION', title:'Cost Management & insights', sub:'',
   lines:['Centrally track your Copilot Studio costs','Analyze trends and spend drivers','Assign capacity thresholds to prevent overages','Handle bursts using on-demand capacity'], shotCap:'Cost dashboard', status:'Public preview | October 2025'},
 {f:feature, n:20, kicker:'AGENT ANALYTICS', title:'Meaningful Analytics', sub:'',
   lines:['Out-of-box analytics to drill down on performance','See how the agent is performing and perceived','Track resolution, escalation, and engagement','Close the loop from insight to improvement'], shotCap:'Analytics'},
 {f:feature, n:21, kicker:'EVALUATIONS IN MCS', title:'Ensuring agent quality', sub:'before deployment',
   lines:['Makers evaluate agent quality directly within Copilot Studio','Run structured tests across key scenarios','Catch regressions early','Build confidence before go-live'], shotCap:'Evaluation runs'},
 {f:feature, n:22, kicker:'WORKSHOPS', title:'Hands-on, instructor-led', sub:'Free - beginner-level',
   lines:['Events delivered by a certified Microsoft partner','Digital and in-person workshops available globally','Offered in multiple languages','For business experts and IT developers alike'], shotCap:'Workshop'},
 {f:feature, n:23, kicker:'OUTCOME', title:'Interactive Virtual Sessions', sub:'60-90 minutes',
   lines:['Participants explore new platform capabilities','Learn governance, adoption frameworks, integration strategies','Gain practical best practices for building impactful agents','Designed to help organizations adopt with confidence'], shotCap:'Session'},
 {f:cta, n:24, title:'Copilot Studio Architecture Bootcamp', sub:'Drive innovation with the global architecture community',
   outcome:'De-risk implementations - Deploy scalable solutions - Go-live efficiently',
   body:['An advanced 3-day bootcamp empowering Solution Architects to deliver successful Copilot Studio implementations.',
         'Covers generative orchestration, multi-agent patterns, MCP, computer-using agents (CUA), and extensibility via Microsoft Foundry, M365 Agents SDK, and Agent2Agent (A2A).',
         'Hands-on labs throughout to apply concepts and build expertise.'],
   locations:[{place:'Redmond, WA (PST) + Virtual',date:'Week of Jan 27-30, 2026'},{place:'Atlanta, GA (EST) + Virtual',date:'Week of Apr 6-9, 2026'},{place:'Virtual (PST)',date:'Week of Jun 8-11, 2026'},{place:'Virtual (CET)',date:'Week of Feb 24-27, 2026'},{place:'APAC - Tokyo + Virtual',date:'Week of Mar 16-19, 2026'},{place:'EU - Amsterdam/London + Virtual',date:'Week of May 18-21, 2026'}]},
];

let count = 0;
for (const s of SLIDES) {
  const html = s.f(s);
  const nm = String(s.n).padStart(2, '0');
  fs.writeFileSync(path.join(OUT, `${nm}.html`), html);
  count++;
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({
  title: 'ClippyFlow -- ClippySlide', description: 'ClippySlide deck using the ClippyFlow brand-flagship design system.',
  version: '1.0.0', theme: 'clippyflow', generated: new Date().toISOString().slice(0,10),
  slides: SLIDES.map(s => ({ n: s.n, file: `${String(s.n).padStart(2,'0')}.html`, archetype: s.f.name })).concat([{n:7,file:'../slides-clippyflow/07-orchestration.html',archetype:'diagram (bespoke)'}]).sort((a,b)=>a.n-b.n)
}, null, 2));
console.log(`Generated ${count} slides + index.json -> ${OUT}`);
