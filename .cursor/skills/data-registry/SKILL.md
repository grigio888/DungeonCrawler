---
name: game-data-registry
description: >-
  Adds or updates registry-backed game data (definitions, index.js, types.js) in
  src/lib. Use when creating entities under src/lib (weapons, classes, skills,
  items), editing definition.js or index.js, or when the user mentions registries,
  definitions, or content IDs.
---

# Game data registry

Canonical guidelines: [agents/guidelines/01-data-registries.md](../../../agents/guidelines/01-data-registries.md), [agents/guidelines/03-js-types.md](../../../agents/guidelines/03-js-types.md).

## Workflow

1. **Definition** — Add `NNN_slug/definition.js` with unique `id` matching project conventions.
2. **Index** — Import in `index.js`; register as `[definition.id]: definition` inside `/** @type {const} */ ({ ... })`.
3. **Types** — Ensure `types.js` exists with `EntityId` / `EntityDefinition` from the index.
4. **Factory** — If missing, add factory with `id in REGISTRY` check and getters.
5. **Verify** — `npm run test:run` (generic tests should cover new entries).

## Checklist

- [ ] Registry key === `definition.id`
- [ ] `const` assertion on registry object
- [ ] Enums from `$lib/core/enum/` by domain (not ad-hoc strings)
- [ ] No per-entity test files added

## Reference

`src/lib/content/items/weapons/`
