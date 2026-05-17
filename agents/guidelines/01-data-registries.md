# Data registries

## Folder layout

```
src/lib/items/weapons/
├── index.js              # registry (aggregate)
├── types.js              # WeaponId, WeaponDefinition
├── factory.js
└── 001_stick/
    ├── definition.js     # static export default { ... }
    └── prompt.md         # optional, not tested
```

## Definition shape (weapons)

Required fields:

- `id`, `name`, `description` (non-empty strings)
- `tier` (non-negative integer)
- `category` — use domain enums (`ITEM_CATEGORIES.WEAPON`)
- `rarity` — use `RARITY` from `$lib/enums`
- `scales` — every key in `SCALES`, values are numbers ≥ 0
- `damage` — `{ min, max }`, both ≥ 0, `min <= max`

## Index file

```js
import stickDefinition from './001_stick/definition';

const WEAPONS = /** @type {const} */ ({
	[stickDefinition.id]: stickDefinition
});

export default WEAPONS;
```

Rules:

- Registry **key** must equal `definition.id`.
- Use `/** @type {const} */` so `keyof typeof` stays a literal union.
- Import each definition; do not inline large objects in `index.js`.

## Adding a new entry

1. Create `NNN_name/definition.js` with a unique `id`.
2. Import it in `index.js` and add `[definition.id]: definition`.
3. Run tests — generic tests pick up new entries automatically.
4. Update ID pattern in `tests/.../validateDefinition.js` only if the convention changes.
