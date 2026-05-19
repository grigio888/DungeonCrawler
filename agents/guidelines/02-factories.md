# Factories

Factories turn registry IDs into objects with getters (no mutation of definitions).

## Constructor pattern

```js
import REGISTRY from '$lib/content/items/weapons';

/**
 * @param {WeaponId | ''} [id]
 */
constructor(id = '') {
	if (!id) {
		throw new Error('Weapon ID is required');
	}

	if (!(id in REGISTRY)) {
		throw new Error('Invalid weapon ID');
	}

	this._weaponDefinition = REGISTRY[id];
}
```

Use `id in REGISTRY` — not `Object.keys(REGISTRY).includes(id)` unless you cast keys for JSDoc.

## Getters

Expose every field callers need from the definition. Today weapons expose: `id`, `name`, `description`, `category`, `rarity`, `scales`, `damage`.

If a field exists on the definition but not on the factory, document why or add a getter.

## Parent factories

`ItemFactory` delegates to domain registries (weapons first). When adding armor, etc., branch on category or registry membership — do not copy weapon fields into unrelated types.
