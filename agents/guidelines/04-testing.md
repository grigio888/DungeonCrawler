# Testing

Vitest. Config in `vite.config.js` (`test.include: ['tests/**/*.{test,spec}.{js,ts}']`).

## Layout

Mirror `src/lib`:

```
tests/lib/items/weapons/
├── index.test.js
├── factory.test.js
└── validateDefinition.js   # shared validators (not a test file)
```

**No** `tests/.../001_stick/definition.test.js`.

## Index tests

Iterate the registry:

```js
it.each(Object.entries(WEAPONS))('[%s] registry key matches definition id', (key, def) => {
	expect(key).toBe(def.id);
});

it.each(Object.values(WEAPONS))('$id matches the expected weapon structure', (def) => {
	expectWeaponDefinition(def, def.id);
});
```

## Factory tests

Iterate the same index:

```js
it.each(Object.entries(WEAPONS))(
	'[%s] constructs from weapons index and matches definition',
	(registryKey, definition) => {
		expect(registryKey).toBe(definition.id);
		const weapon = new WeaponFactory(registryKey);
		expectWeaponFactoryMatchesDefinition(weapon, definition, registryKey);
	}
);
```

Plus static cases: missing id, invalid id.

## Shared validators

Put shape assertions in `validateDefinition.js` (or `validate<Entity>.js`):

- `expectWeaponDefinition(definition)` — structure from data guidelines
- `expectWeaponFactoryMatchesDefinition(weapon, definition)` — getters vs registry entry

Reuse domain enums (`SCALES`, `RARITY`, `ITEM_CATEGORIES`) in validators so tests fail when enums and data drift apart.

## After changes

```bash
npm run test:run
```

New registry entries require **no new test files** — only update validators if the **schema** changes.
