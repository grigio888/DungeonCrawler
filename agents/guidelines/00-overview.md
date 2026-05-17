# Overview

SvelteKit game (`src/lib/`). Game data is **plain JS objects** with JSDoc types (`checkJs: true`), not TypeScript source files.

## Principles

1. **Registry + definition** — Each entity lives in its own folder (`001_stick/definition.js`). A sibling `index.js` aggregates every entry by `definition.id`.
2. **Factory per domain** — Constructors resolve IDs through the registry (`id in REGISTRY`), expose getters, throw on missing/invalid IDs.
3. **Shared types** — Domain `types.js` derives `EntityId` and `EntityDefinition` from the registry.
4. **Generic tests only** — No per-entity test files. Tests iterate `Object.entries(REGISTRY)` and shared validators.
5. **Mirror paths** — `tests/lib/...` mirrors `src/lib/...`.

## ID conventions (weapons example)

| Kind   | Pattern        | Example   |
| ------ | -------------- | --------- |
| Weapon | `i_w_<digits>` | `i_w_001` |

Extend this table when adding item categories or other domains.

## Imports

- App code: `$lib/...` (SvelteKit alias)
- Tests: same `$lib/...` alias (Vitest via SvelteKit Vite config)

## Do not

- Use nested ternary operators — see [05-code-style.md](05-code-style.md).
- Use `switch (id) { case Object.keys(REGISTRY).includes(id): }` — compares id to boolean; always wrong.
- Add `tests/.../001_foo/definition.test.js` for a single entity.
- Hardcode entity IDs in tests when the registry can be iterated.
