---
name: game-registry-tests
description: >-
  Writes or updates Vitest tests for registry-backed domains using generic
  index/factory iteration. Use when adding tests, test folders, validateDefinition
  helpers, or when the user asks to test items, weapons, classes, or factories.
---

# Game registry tests

Read [agents/guidelines/04-testing.md](../../guidelines/04-testing.md).

## Workflow

1. Mirror `src/lib/...` under `tests/lib/...`.
2. **index.test.js** — `Object.entries` for key/id alignment; `Object.values` + shared structure validator.
3. **factory.test.js** — `Object.entries(REGISTRY)`; construct with registry key; match definition via helper.
4. **validate\*.js** — Shared expect helpers (not `*.test.js`).

## Do not

- Create `tests/.../001_foo/definition.test.js`
- Hardcode entity IDs that the registry already lists

## Factory test template

```js
it.each(Object.entries(REGISTRY))(
	'[%s] constructs from index and matches definition',
	(registryKey, definition) => {
		expect(registryKey).toBe(definition.id);
		const instance = new Factory(registryKey);
		expectInstanceMatchesDefinition(instance, definition, registryKey);
	}
);
```

## After edits

```bash
npm run test:run
```

## Reference

`tests/lib/items/weapons/`
