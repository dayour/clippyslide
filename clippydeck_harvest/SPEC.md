# clippydeck_harvest Software Engineering Specification

Status: Draft for implementation
Version: 1.0.0
Owners: ClippySlide maintainers

## 1. Purpose

`clippydeck_harvest` converts a reference presentation or visual artifact into a reusable, privacy-safe ClippyDeck design package. It harvests layout, geometry, typography, theme tokens, shapes, diagrams, dataflows, pictures, videos, backgrounds, and animation metadata while keeping business text and customer identifiers in separate JSON content files.

The system must reproduce design intent without baking customer names or sensitive wording into templates. A single harvested template can be hydrated with either an authorized real-content profile or a synthetic public profile.

## 2. Goals

1. Extract measurable design facts instead of approximating them by eye.
2. Preserve layout and visual relationships across PPTX, PDF, HTML, image, and video inputs.
3. Separate presentation structure from text and entity values.
4. Represent text bindings as Adaptive Card-compatible JSON variables.
5. Support deterministic real-to-synthetic entity substitution.
6. Produce standalone ClippyDeck HTML, editable Adaptive Card JSON, assets, tokens, and an evidence report.
7. Record provenance and confidence for every harvested property.
8. Validate visual similarity, privacy, accessibility, and package integrity.

## 3. Non-goals

- Bypassing document permissions, DRM, content exclusions, or tenant controls.
- Publishing customer content by default.
- Pixel-perfect recovery of unsupported proprietary effects without an explicit approximation record.
- Generating an editable source video from rendered pixels.
- Treating OCR output as authoritative without confidence and review metadata.

## 4. Inputs

| Type | Examples | Primary extraction path |
| --- | --- | --- |
| PPTX | `.pptx`, `.potx` | OOXML relationships, theme, masters, layouts, shapes, media, notes |
| PDF | `.pdf` | page boxes, text spans, vector paths, images, links |
| HTML | URL or local file | DOM, computed CSS, assets, browser screenshots |
| Image | PNG, JPEG, SVG | metadata, OCR, segmentation, palette, geometry inference |
| Video | MP4, WebM, GIF | metadata, scene/keyframe sampling, OCR, motion/event timeline |
| Existing deck | ClippyDeck HTML or Adaptive Card JSON | direct parse and normalization |

Every source receives a SHA-256 digest and source classification. Raw source files are never copied into public output unless explicitly authorized.

## 5. Outputs

A harvest package has this canonical shape:

```text
<output>/
  harvest.manifest.json
  design.tokens.json
  layout.template.json
  content.synthetic.json
  content.real.json              # optional, private, gitignored
  replacement-map.json           # optional, private, gitignored
  adaptive/
    slide-001.card.json
  assets/
    images/
    video/
    backgrounds/
    fonts/
  previews/
    slide-001.png
  evidence/
    source-inventory.json
    extraction-report.json
    visual-diff.json
    privacy-report.json
  deck/
    slide-001.html
    <deck-name>-clippydeck.html
```

`content.synthetic.json` is the publishable default. `content.real.json` and `replacement-map.json` are restricted artifacts and must be excluded from source control.

## 6. Architecture

```text
Acquire -> Normalize -> Extract -> Classify -> Bind -> Synthesize -> Reconstruct -> Validate -> Package
```

### 6.1 Acquire

- Confirm authorization and source sensitivity.
- Copy locked files to an isolated working directory.
- Hash inputs and enumerate embedded parts.
- Record renderer/tool versions for reproducibility.

### 6.2 Normalize

Convert each source page or slide to a common 16:9 coordinate space while retaining original dimensions and transforms. Normalize colors to sRGB plus alpha, lengths to both source units and normalized ratios, and time to milliseconds.

### 6.3 Extract

Extractors emit evidence records, not final design decisions:

- `pptx`: OOXML theme, master inheritance, placeholders, geometry, connectors, charts, media, transitions.
- `pdf`: vector paths, clipping masks, text spans, image XObjects, page transforms.
- `html`: DOM tree, computed styles, pseudo-elements, fonts, network assets, screenshots.
- `image`: OCR blocks, dominant palette, edges, regions, repeated components.
- `video`: container/codec metadata, scene boundaries, keyframes, captions, overlaid text, motion paths.

### 6.4 Classify

The classifier maps raw evidence into semantic roles:

- layout regions: canvas, header, footer, title, body, sidebar, grid, card, callout;
- primitives: text, shape, line, connector, icon, picture, background, video, chart;
- compound visuals: diagram, dataflow, process, timeline, matrix, architecture, comparison;
- content roles: customer name, product, person, geography, metric, date, quote, body copy.

Each classification includes `confidence`, `sourceEvidence`, and `reviewStatus`.

### 6.5 Bind

All mutable text is replaced by bindings such as `${content.customer.displayName}`. Template files may contain fallback synthetic text, but must not contain real customer identifiers.

Bindings use dotted paths and are resolved against a selected content profile. Adaptive Card JSON remains valid JSON because bindings are ordinary string values.

### 6.6 Synthesize

Create a synthetic profile using deterministic entity rules:

- customer names -> `Contoso`, `Fabrikam`, or configured generic labels;
- people -> role-based names such as `Program Lead`;
- tenant, domain, URL, email, project, geography, and account IDs -> typed placeholders;
- metrics -> preserve scale and formatting while perturbing values only when policy requires;
- quoted text -> replace or remove unless publication is authorized.

The replacement map stores type, original digest, synthetic value, scope, and approval state. Plain original values are optional and restricted.

### 6.7 Reconstruct

Renderers consume `layout.template.json`, `design.tokens.json`, assets, and the chosen content profile to produce:

1. ClippySlide HTML with semantic `cf-*` components where possible.
2. Adaptive Card JSON with stable element IDs and text bindings.
3. A self-contained `<name>-clippydeck.html` package.
4. Optional PPTX output when requested.

Unsupported effects must be recorded as `approximation` entries, with the selected fallback and expected visual impact.

### 6.8 Validate

Validation is mandatory and staged:

- schema validation;
- missing binding and orphan binding checks;
- no real identifiers in publishable templates or synthetic profiles;
- asset digest and license/provenance checks;
- text overflow and minimum font-size checks;
- WCAG contrast checks;
- connector and diagram topology checks;
- screenshot comparison at 1280x720 and 2x scale;
- visual review of every slide, including one fix-and-recheck cycle;
- standalone/offline load check for packaged HTML.

## 7. Canonical data model

### 7.1 Harvest manifest

`harvest.manifest.json` identifies the source, outputs, privacy class, toolchain, and validation status. Its schema is `schemas/harvest-manifest.schema.json`.

### 7.2 Layout template

`layout.template.json` stores immutable visual structure:

```json
{
  "schemaVersion": "1.0.0",
  "deck": {"id": "reference-deck", "width": 1280, "height": 720},
  "slides": [{
    "id": "slide-001",
    "archetype": "architecture-dataflow",
    "background": {"kind": "gradient", "token": "gradient.canvas"},
    "elements": [{
      "id": "title",
      "kind": "text",
      "role": "title",
      "bounds": {"x": 64, "y": 72, "w": 820, "h": 96},
      "styleRef": "text.title",
      "value": "${content.slides.slide001.title}"
    }],
    "relationships": [{"from": "source", "to": "processor", "kind": "dataflow"}]
  }]
}
```

Coordinates are pixels in the normalized deck space. Ratios may be included for responsive rendering.

### 7.3 Adaptive content profile

`content.synthetic.json` follows `schemas/adaptive-content.schema.json`. Values are typed and addressable by dotted paths. The content file can include Adaptive Card expressions later, but the v1 renderer resolves `${...}` bindings before card rendering.

### 7.4 Replacement map

`replacement-map.json` follows `schemas/replacement-map.schema.json`. Public packages should use digests rather than original values. A private map may retain original values only with explicit authorization.

## 8. Media harvesting

### Pictures and backgrounds

- Preserve original bytes when extraction is lossless and permitted.
- Record crop rectangles, transparency, effects, and z-order separately.
- Deduplicate by SHA-256.
- Classify decorative versus content-bearing images.
- OCR only content-bearing images; keep OCR as a binding candidate, not as a destructive rewrite.

### Video and animation

- Extract poster frame, dimensions, duration, codec, captions, and source relationship.
- Sample scene boundaries and important keyframes.
- Represent autoplay, loop, mute, trim, and start time as declarative properties.
- Package media only when licensing and size policy permit; otherwise use a poster plus external asset reference.

### Diagrams and dataflows

- Preserve nodes, ports, connectors, arrowheads, labels, routing, grouping, and reading order.
- Store topology independently of absolute geometry.
- Distinguish semantic flow from decorative lines.
- Validate that every connector endpoint resolves and that directed paths are acyclic when the diagram type requires it.

## 9. Privacy and synthetic-name policy

Privacy modes:

| Mode | Behavior |
| --- | --- |
| `private-real` | Authorized local use; real profile may be loaded; never published |
| `synthetic-review` | Default working mode; deterministic synthetic substitutions |
| `public-release` | Synthetic profile only; strict identifier scan; no private artifacts |

Required controls:

1. Real values live only in `content.real.json` or an external secret/content store.
2. Templates, CSS, diagrams, filenames, element IDs, comments, alt text, and metadata must not contain real customer names.
3. Public validation scans case-insensitively for original values and known derivatives.
4. Entity replacement is type-aware and deterministic across the entire deck.
5. Visual assets containing customer text are either redacted, replaced, or excluded.
6. Logs contain hashes and binding paths, not original values.
7. `*.real.json`, `replacement-map.private.json`, and `harvest-private/` are gitignored.

## 10. Plugin contract

`extension/clippydeck-harvest.js` exposes a small runtime API:

```js
ClippyDeckHarvest.resolve(template, content)
ClippyDeckHarvest.syntheticize(content, replacementMap)
ClippyDeckHarvest.audit(value, forbiddenTerms)
ClippyDeckHarvest.collectBindings(template)
```

The plugin is pure and deterministic. It performs no network calls, does not read local files, and never persists real content. Host applications are responsible for loading profiles and enforcing authorization.

## 11. Skill contract

`skills/clippydeck-harvest/SKILL.md` defines these commands:

1. `inspect` - inventory source type, permissions, dimensions, and embedded assets.
2. `extract` - produce raw evidence and exact tokens.
3. `classify` - identify layout regions, components, diagrams, media, and content roles.
4. `bind` - move mutable text into Adaptive Card-compatible JSON variables.
5. `syntheticize` - create and validate a deterministic generic content profile.
6. `reconstruct` - generate ClippySlide HTML, Adaptive Cards, and media manifests.
7. `validate` - run schema, privacy, accessibility, topology, and visual checks.
8. `package` - emit the standalone ClippyDeck and publishable harvest package.

## 12. CLI proposal

```text
clippydeck-harvest inspect <source> --out <dir>
clippydeck-harvest extract <source> --out <dir> [--slides 1,3-8]
clippydeck-harvest bind <harvest-dir> --profile synthetic
clippydeck-harvest reconstruct <harvest-dir> --format html,adaptive-card
clippydeck-harvest validate <harvest-dir> --mode public-release
clippydeck-harvest package <harvest-dir> --single-file
```

Exit codes: `0` success, `1` validation failure, `2` invalid input, `3` authorization/policy block, `4` extraction failure.

## 13. Observability

Every stage writes structured JSON Lines events containing run ID, stage, source digest, slide ID, duration, status, and non-sensitive diagnostics. Metrics include extraction coverage, low-confidence elements, unresolved bindings, privacy findings, visual difference score, and package size.

## 14. Security requirements

- Parse untrusted archives with file-count, expanded-size, and path traversal limits.
- Never execute embedded macros, scripts, OLE objects, or external links.
- Disable network access during deterministic extraction and packaging.
- Sanitize SVG and HTML before embedding.
- Validate MIME type from bytes, not extension alone.
- Enforce output paths under the selected harvest directory.
- Record external references rather than fetching them without authorization.

## 15. Acceptance criteria

A v1 implementation is complete when:

- all five schemas validate the included examples;
- plugin unit tests pass;
- one PPTX or HTML reference can be represented as layout, tokens, content, and assets;
- changing `content.synthetic.json` changes text without editing layout files;
- a forbidden real customer term causes public-release validation to fail;
- the standalone deck works without network access;
- every slide has a reviewed screenshot and no unresolved high-severity visual defects;
- the Docusaurus wiki documents architecture, workflow, schemas, privacy, plugin, and skill usage.

## 16. Delivery phases

1. Foundation: schemas, plugin bindings, syntheticization, docs, examples.
2. PPTX extractor: OOXML geometry, text, theme, media, connectors, charts.
3. HTML/PDF/image extractors: computed CSS, vector/text extraction, OCR/segmentation.
4. Video and animation: scenes, poster frames, timed overlays, motion metadata.
5. Reconstruction: adaptive cards, ClippySlide HTML, standalone package.
6. Quality gates: visual diff, privacy scanner, accessibility and topology validation.

Each phase must preserve backwards compatibility with the v1 schemas or include a documented migration.