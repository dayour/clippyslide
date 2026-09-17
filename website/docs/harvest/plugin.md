---
sidebar_position: 6
title: Runtime Plugin
---

# Harvest Runtime Plugin

`extension/clippydeck-harvest.js` is a zero-dependency UMD module for browsers and Node.js. It is deliberately pure: no network calls, filesystem access, storage, or telemetry.

## API

### `resolve(template, contentProfile, options)`

Recursively resolves `${content.path}` bindings. Missing values throw unless `options.strict` is `false`.

### `syntheticize(contentProfile, replacementMap)`

Clones a profile and applies typed substitutions without modifying the real profile.

### `collectBindings(template)`

Returns every binding and its JSON-path locations. Use this to detect missing and orphan values before rendering.

### `audit(value, forbiddenTerms)`

Performs a case-insensitive recursive scan and returns `{pass, findings}`. Hosts should supply authorized forbidden terms only in memory and should not log them.

## TileSlide integration

Load the plugin before card hydration, choose the approved content profile, resolve the card JSON, then pass the resolved card to Adaptive Cards. Keep visual decoration separate: ClippyFlow or legacy CoE theme modules style the rendered card, while Harvest controls content binding and privacy.

```html
<script src="clippydeck-harvest.js"></script>
<script>
  const card = ClippyDeckHarvest.resolve(cardTemplate, contentProfile);
  adaptiveCard.parse(card);
</script>
```

The plugin manifest is `extension/clippydeck-harvest.plugin.json`; a bound sample card is in `extension/harvest-sample/`.
