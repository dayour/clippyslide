# Clippyflow Terminal Header — Spec

The **title-taskbar header** is the command surface atop every Clippyflow window —
terminal, browser, or app. One header, every surface.

> **The law.** NITROUS (214°) = **structure only** (active-tab underline, cluster
> rails, focus rings, hover outlines, the app "running" tick). SPECTRUM (the five
> logo hues) = **meaning only** (agent/app status + identity). Exactly **one lit
> element per cluster**. Every color resolves to a Clippyflow token — no raw hex.

Files: `design-system/clippyflow-header.css` (component) · requires
`clippyflow.css` (tokens) · pairs with `clippyflow-terminal.css`. Live spec deck:
`brand-deck/clippyflow-header-spec.html` (16 slides). Demo:
`examples/header-window.html`.

---

## 1. Anatomy

Two stacked rows inside `.cfh`:

```
┌ TITLEBAR ─ brand · window-title · tab-strip · window-controls ───────────┐
├ TASKBAR  ─ tools │ agents │ apps │ ……spacer…… │ readout │ controls ───────┤
└──────────────────────────────────────────────────────────────────────────┘
```

| Row | Class | Height token | Carries |
| --- | --- | --- | --- |
| Titlebar | `.cfh-titlebar` | `--cfh-bar` (44px) | identity + navigation |
| Taskbar | `.cfh-taskbar` | `--cfh-task` (50px) | action + state |

Single-row mode: add `.cfh--single` and omit the taskbar (compact chrome that
still ships brand, tabs, and controls).

---

## 2. Regions

### Brand — `.cfh-brand`
Window identity. Pick **one**: `.cfh-glyph` + `.cfh-wordmark` (spectrum glyph +
title-gradient wordmark) **or** `.cfh-dots` (magenta/cyan/green traffic lights).
Never both.

### Window title — `.cfh-title`
Mono, dim, with one full-contrast focus segment via `<b>`. Path form encouraged
(`clippyflow · ~/design-system/header.css`).

### Layers — `.cf-layers` / `.cf-layer`
Composable card layers in the terminal window bar (`.cf-win-bar`), sitting
immediately after the traffic lights. Distinct from document tabs: a layer is a
surface of the same card (Flow, deck, repo), not a second window.

| State | Class | Signal |
| --- | --- | --- |
| Active | `.active` | **nitrous** pill rim + glow (the one selected layer) and a **cyan** identity dot |
| Default | — | dim label, dim dot, no rim |
| Add | `.cf-layer-add` | `+`, dim until hover (nitrous) |

Exactly one `.active`. Inactive dots stay grey — a spectrum hue here would fake a second selection.

### Tabs — `.cfh-tabs` / `.cfh-tab`
Open surfaces. States:

| State | Class | Signal |
| --- | --- | --- |
| Active | `.active` | **nitrous** top-underline + surface-3 fill + cyan favicon (the one lit tab) |
| Loading | `.loading` | purple favicon, pulsing |
| Default | — | dim; hover lifts a nitrous rim |
| Pinned | `.pinned` | collapses to favicon (42px), title hidden |

New-tab affordance: `.cfh-newtab` (`+`).

### Window controls — `.cfh-wctl`
`— ▢ ×`, hard-right (`margin-left:auto`). Hover = nitrous wash; `.close` is the
only control that washes magenta.

### Tools — `.cfh-cluster` › `.cfh-tool`
**Verbs** (things you do): terminal `▌_`, browser `◉`, files `▢`, search `⌕`,
run `▶`. 30px nitrous-rimmed squares. Hover = nitrous focus halo. Exactly one
`.active` (nitrous inset).

### Agents — `.cfh-cluster` › `.cfh-agent`
Avatar (`.av` with identity tint `.cyan/.purple/.green`) + spectrum status dot
(`.st`) + name (`.nm`). **Status = meaning:**

| Status | Class | Hue | Meaning |
| --- | --- | --- | --- |
| Running | `.run` | green, glowing | actively working |
| Thinking | `.think` | purple, pulsing | reasoning |
| Idle | `.idle` | cyan | ready, waiting |
| Error | `.error` | magenta, glowing | needs you |
| Paused | `.paused` | grey avatar + dim dot | suspended |

### Apps — `.cfh-cluster` › `.cfh-app`
**Nouns** (places you go). Identity = a spectrum tint (`.cyan/.purple/.magenta/
.green`) — identity, **not** status. The running indicator `.run` is a **nitrous**
tick (structure, shared by all apps).

### Readout — `.cfh-readout`
Mono status: model · connection · clock. `.k` = cyan key (the meaningful label),
`.on` = green `●` connected. Degraded states use orange. Sits between the spacer
and the controls rail.

### Controls — `.cfh-cluster` › `.cfh-ctrl` / `.cfh-avatar`
Alerts (`.badge` = magenta count, needs attention) · theme `◐` (cycles system ·
light · dark · clippyflow) · settings `⚙` · `.cfh-avatar` (cyan gradient, nitrous
rim). Hard-right, no text label — glyphs are universal.

### Structure helpers
`.cfh-rail` — 1px **nitrous** vertical divider between clusters.
`.cfh-spacer` — flex spacer that absorbs all slack.

---

## 3. States & interaction

- `:hover` — nitrous wash or rim halo.
- `:focus-visible` — 2px nitrous ring, 2px offset.
- `.active` — nitrous inset/underline. **One per cluster.**

| Keys | Action |
| --- | --- |
| ⌘/Ctrl + T | new tab |
| ⌘/Ctrl + 1–9 | jump to tab |
| ⌘/Ctrl + K | search / palette |
| Tab / ⇧Tab | walk clusters left → right |

---

## 4. Layout & responsive

Collapse order, narrow → wide:

1. Drop cluster text labels (tools / agents / apps).
2. Collapse agent names to avatars only.
3. Move readout into an overflow `⋯` menu.
4. Scroll the tab strip; pin actives.
5. Fold tools/apps into a single launcher.

**Never drop:** brand · active tab · window controls (close must always reach) ·
alerts (attention can't hide).

---

## 5. Token contract

Override these on `:root` to retheme the whole header in one place:

| Token | Default | Purpose |
| --- | --- | --- |
| `--cfh-bar` | 44px | titlebar height |
| `--cfh-task` | 50px | taskbar height |
| `--cfh-pad` | 14px | horizontal padding |
| `--cfh-gap` | 8px | item gap inside a cluster |
| `--cfh-radius` | 9px | tab / button radius |
| `--cfh-ico` | 30px | launcher square size |
| `--cf-ps1` | `clippyflow:~$ ` | prompt glyph (terminal layer) |

All color resolves to the base Clippyflow tokens (`--nitrous*`, `--clippy-*`,
`--cf-*`). Retune nitrous → ice-blue once in `:root` and the entire header
follows.

---

## 6. Do / Don't

**Do** — use nitrous for the active-tab underline, rails & focus · use spectrum
for agent/app status & identity · keep one lit element per cluster.

**Don't** — fill a tab or tool with nitrous (it's structure only) · use a status
hue as decoration · light up two active tabs at once.

---

## 7. Minimal markup

```html
<header class="cfh">
  <div class="cfh-titlebar">
    <div class="cfh-brand"><span class="cfh-glyph"></span><span class="cfh-wordmark">CLIPPYFLOW</span></div>
    <div class="cfh-tabs">
      <div class="cfh-tab active"><span class="fav"></span><span class="t">Flow</span><span class="x">×</span></div>
      <span class="cfh-newtab">+</span>
    </div>
    <div class="cfh-wctl"><span>—</span><span>▢</span><span class="close">×</span></div>
  </div>
  <div class="cfh-taskbar">
    <div class="cfh-cluster"><span class="lbl">tools</span>
      <span class="cfh-tool active">▌_</span><span class="cfh-tool">◉</span>
    </div>
    <span class="cfh-rail"></span>
    <div class="cfh-cluster"><span class="lbl">agents</span>
      <span class="cfh-agent run"><span class="av cyan"><span class="st"></span></span><span class="nm">orchestrator</span></span>
    </div>
    <span class="cfh-spacer"></span>
    <div class="cfh-readout"><span><span class="k">opus</span>-4.8</span><span class="on">connected</span><span>09:41</span></div>
    <span class="cfh-rail"></span>
    <div class="cfh-cluster">
      <span class="cfh-ctrl">◔<span class="badge">3</span></span>
      <span class="cfh-ctrl">⚙</span><span class="cfh-avatar"></span>
    </div>
  </div>
</header>
```
