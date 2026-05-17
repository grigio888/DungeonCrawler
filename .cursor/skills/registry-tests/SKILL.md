---
name: game-registry-tests
description: >-
  Writes or updates Vitest tests for registry-backed domains using generic
  index/factory iteration. Use when adding tests, test folders, validateDefinition
  helpers, or when the user asks to test items, weapons, classes, or factories.
---

# Game registry tests

Canonical guidelines: [agents/guidelines/04-testing.md](../../../agents/guidelines/04-testing.md).

## Workflow

1. Mirror `src/lib/...` under `tests/lib/...`.
2. **index.test.js** — `Object.entries` for key/id; `Object.values` + structure validator.
3. **factory.test.js** — `Object.entries(REGISTRY)`; construct with registry key.
4. **validate\*.js** — Shared expect helpers (not `*.test.js`).

## Do not

- Create `tests/.../001_foo/definition.test.js`
- Hardcode entity IDs the registry already exports

## After edits

```bash
npm run test:run
```

## Reference

`tests/lib/items/weapons/`
