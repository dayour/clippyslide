---
sidebar_position: 1
title: Design Guardian
---

# Design Guardian Automation

ClippySlide includes a weekly automation -- the **Design Guardian** -- that protects the system from drift. A design system is only as good as its discipline; the Guardian enforces it so humans don't have to remember.

## What it checks

Every Monday morning it runs three checks:

1. **Token drift** -- diffs the CSS `:root` variables against `clippyslide.tokens.json`. If a color or gradient stop changed in one but not the other, it flags the mismatch.
2. **Asset integrity** -- confirms the two physical copies of the CSS (`design-system/clippyslide.css` and `skill/assets/clippyslide.css`) are identical. Editing one and forgetting the other is the most common drift.
3. **Deck QA** -- regenerates the deck (`node build-deck.js`) and compares the output to the committed slides. Because the generator is [deterministic](/generator/content-model#determinism), any diff is real signal: either an intentional change that wasn't committed, or an accidental one.

## Why automate it

The whole project rests on **one set of numbers** flowing through CSS, three profiles, a generator, a presenter, and an extension theme. Six consumers, one source of truth. Without a guard, they drift apart silently -- exactly the "looks about right" failure mode the system was built to avoid.

## The principles it enforces

The Guardian reads the `principles` block from `clippyslide.profile.yaml` and treats them as invariants:

- Pure-black canvas; never a flat grey.
- The signature is the glowing gradient **border**, not a solid stroke.
- Panel bodies glow from within (border colors @ 10% alpha radial over black).
- Titles are magenta-gradient and bold; sub-heads underlined.
- One coral accent bar may bleed off the left edge.
- **Zero emoji.** High contrast. Premium, dark, restrained.

## Output

The Guardian doesn't auto-fix -- it reports. A clean week is silent; a drift produces a short summary of exactly which file diverged from which, so the fix is a one-line correction rather than an archaeology project.
