---
name: "clippydeck-harvest"
description: "Extract and reconstruct reusable presentation systems from authorized PPTX, PDF, HTML, image, video, ClippyDeck, or Adaptive Card sources. Harvest exact layout, tokens, shapes, diagrams, dataflows, media, and backgrounds while moving mutable text and customer identifiers into separate Adaptive Card-compatible JSON profiles. USE WHEN: harvest a deck, extract a slide design, reproduce a reference presentation, anonymize customer slides, create synthetic deck content, convert a deck into reusable templates, or inventory visual assets."
---

# ClippyDeck Harvest

Use this skill to turn an authorized visual source into a reusable, privacy-safe ClippyDeck package. Read `../../clippydeck_harvest/SPEC.md` before implementation work and use the schemas in `../../clippydeck_harvest/schemas/`.

## Required outcome

Produce separate files for:

1. visual structure: `layout.template.json`;
2. design tokens: `design.tokens.json`;
3. publishable text: `content.synthetic.json`;
4. optional restricted text: `content.real.json`;
5. entity substitutions: `replacement-map.json` or a private equivalent;
6. Adaptive Card templates with `${content.path}` bindings;
7. extracted assets and provenance;
8. validation reports and a self-contained `<name>-clippydeck.html`.

Never embed real customer names in layout, CSS, filenames, IDs, comments, alt text, or generated public artifacts.

## Commands

### 1. `inspect`

- Confirm the user is authorized to process the source.
- Identify source type, dimensions, slide/page count, classification, and embedded media.
- Hash the source with SHA-256.
- For PPTX, inspect the OOXML package without executing macros or OLE objects.
- For HTML, inventory DOM, computed CSS, fonts, and network assets.
- For video, inventory codec, duration, dimensions, captions, and scene boundaries.
- Stop if access is restricted or authorization is unclear.

Output: `evidence/source-inventory.json`.

### 2. `extract`

- Extract exact geometry, transforms, z-order, theme inheritance, typography, fills, gradients, strokes, shadows, transparency, crop data, connectors, charts, notes, and media relationships.
- Preserve source units and normalized 1280x720 coordinates.
- Render the source at 1280x720 and 2x scale for comparison.
- Every extracted fact must include provenance and confidence.
- Do not approximate a value that can be read from source metadata.

Output: raw evidence plus `design.tokens.json` candidates.

### 3. `classify`

- Classify regions and primitives: title, body, card, callout, icon, picture, background, video, line, connector, chart.
- Identify compound patterns: architecture, process, timeline, matrix, comparison, diagram, dataflow.
- Build diagram topology separately from pixel geometry.
- Mark decorative versus content-bearing assets.
- Mark mutable text and customer-related entities.

Output: `layout.template.json` draft and a review queue for low-confidence elements.

### 4. `bind`

- Move all mutable text to a content profile.
- Replace template values with `${content.<path>}` bindings.
- Keep stable semantic IDs, for example `slide001-title` rather than text-derived IDs.
- Generate Adaptive Card 1.6 JSON with bindings stored as ordinary strings.
- Run `ClippyDeckHarvest.collectBindings()` and verify every binding resolves.

Output: Adaptive Card templates and `content.real.json` or an authorized source profile.

### 5. `syntheticize`

- Build a deterministic, type-aware replacement map.
- Use generic names such as Contoso and Fabrikam, role labels for people, and safe placeholders for tenant IDs, domains, email, geography, and URLs.
- Preserve wording length and metric format where layout fidelity depends on it.
- Replace or redact text embedded inside images.
- Run `ClippyDeckHarvest.audit()` with all known real terms and derivatives.

Output: `content.synthetic.json`, the default profile for preview and publication.

### 6. `reconstruct`

- Rebuild with existing ClippyFlow components and tokens before introducing bespoke CSS.
- Preserve hierarchy, alignment, whitespace, reading order, connector direction, crop, and media behavior.
- Record unsupported effects and chosen approximations.
- Resolve the Adaptive Card template with `extension/clippydeck-harvest.js`.
- Generate HTML slides and optional PPTX only after the data model is stable.

Output: editable cards, HTML slides, previews, and asset manifests.

### 7. `validate`

Run all gates:

- JSON schema and parse validation;
- unresolved and orphan binding checks;
- public-artifact scan for real identifiers;
- asset digest, provenance, and license checks;
- WCAG contrast, overflow, minimum font size, and reading-order checks;
- connector endpoint and topology checks;
- source versus reconstruction screenshot comparison;
- visual review of every slide followed by at least one fix-and-recheck cycle;
- packaged deck offline-load test.

A `public-release` package fails if any real identifier, restricted asset, unresolved binding, broken relationship, or high-severity visual defect remains.

### 8. `package`

- Make `content.synthetic.json` the default.
- Exclude `content.real.json`, private replacement maps, source files, and restricted assets.
- Package the deck with `node generator/build-clippydecks.js` or the equivalent registry entry.
- Emit `harvest.manifest.json` and reports.
- Add the deck to the Library only after all public-release gates pass.

## Source-specific playbooks

### PPTX

Inspect `ppt/theme`, `ppt/slideMasters`, `ppt/slideLayouts`, `ppt/slides`, relationships, media, charts, and embedded fonts. Resolve inherited properties in presentation order. Treat OOXML units precisely: EMUs for geometry, 1/60000 degree for angles, and 1/1000 percent for stops and alpha.

### PDF

Preserve page boxes and transforms. Separate vector paths from raster images. Retain text spans and font metadata. Record clipping masks and transparency groups.

### HTML

Capture DOM plus computed styles. Resolve CSS variables, pseudo-elements, web fonts, SVG, canvas, and background images. Save a content-only browser screenshot; never include browser chrome or account data.

### Images

Use OCR and segmentation as hypotheses. Record confidence and bounding boxes. Infer repeated components and palette, but require review before promotion to tokens.

### Video

Extract metadata, captions, poster frames, scenes, and meaningful keyframes. Store timing and playback behavior declaratively. Do not publish embedded media without explicit rights.

## Privacy modes

- `private-real`: real content permitted locally; no publication.
- `synthetic-review`: synthetic content is default; private map may remain local.
- `public-release`: synthetic-only package with strict term scanning and restricted-file exclusion.

## Failure rules

- Do not bypass content exclusions or permissions.
- Do not execute macros, embedded objects, source scripts, or remote resources.
- Do not place source names in filenames or IDs.
- Do not publish OCR text without review.
- Do not claim pixel fidelity when visual comparison is incomplete.
- Do not delete or overwrite a source file.

## Definition of done

The package conforms to the schemas, all bindings resolve, public artifacts contain no forbidden terms, media provenance is recorded, every slide was visually reviewed, the self-contained deck works offline, and the manifest records all approximations and validation outcomes.
