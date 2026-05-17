# JSDoc types

Types live in domain `types.js`, derived from the registry (single source of truth).

## `types.js`

```js
/** @typedef {keyof typeof import('./index.js').default} WeaponId */

/** @typedef {import('./index.js').default[WeaponId]} WeaponDefinition */

export {};
```

## Using types in factories

```js
/** @typedef {import('./types.js').WeaponId} WeaponId */
/** @typedef {import('./types.js').WeaponDefinition} WeaponDefinition */

export default class WeaponFactory {
	/** @type {WeaponDefinition} */
	_weaponDefinition;

	/** @param {WeaponId | ''} [id] */
	constructor(id = '') {
		/* ... */
	}

	/** @returns {WeaponId} */
	get id() {
		return this._weaponDefinition.id;
	}
}
```

## Cross-domain imports

```js
/** @typedef {import('./weapons/types.js').WeaponId} WeaponId */
```

## New domain checklist

1. `const REGISTRY = /** @type {const} */ ({ ... })` in `index.js`
2. `types.js` with `EntityId` + `EntityDefinition`
3. JSDoc on factory constructor, private field, and `id` getter

Run `npm run check` after type changes.
