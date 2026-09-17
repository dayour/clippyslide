---
sidebar_position: 5
title: Privacy and Synthetic Content
---

# Privacy and Synthetic Content

The public artifact is synthetic by design. Real content is a separate optional profile and is never the default.

## Modes

| Mode | Intended use | Publishable |
| --- | --- | --- |
| `private-real` | authorized local reconstruction and comparison | No |
| `synthetic-review` | design review with deterministic generic content | Not until validation passes |
| `public-release` | Pages, repository, email, and shared packages | Yes |

## Replacement policy

Substitution is entity-aware:

- organization and customer names use consistent synthetic companies;
- people become role labels or synthetic identities;
- tenant IDs, domains, URLs, emails, subscriptions, and account numbers use typed placeholders;
- geography is generalized when needed;
- metrics retain formatting and visual scale unless policy requires perturbation;
- quotes are replaced or removed unless publication is authorized.

Text inside screenshots and pictures is not exempt. A content-bearing image must be redacted, recreated, or excluded.

## Repository controls

The repository ignores `*.real.json`, `replacement-map.private.json`, and `harvest-private/`. Public validation also scans templates, CSS, filenames, IDs, comments, alt text, metadata, content profiles, and extracted OCR text for forbidden values and derivatives.

Logs should record binding paths and salted digests, not original values.
