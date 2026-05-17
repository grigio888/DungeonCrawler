# Game — agent context

Use this folder on **every** change to game data, factories, or tests. Cursor loads it via `.cursor/rules/` and `.cursor/skills/`.

## Layout

| Path                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| [guidelines/](guidelines/) | Project conventions (registries, factories, types, tests)               |
| [skills/](skills/)         | Task workflows (add content, add tests) — mirrored in `.cursor/skills/` |

## When to read what

| You are…                                         | Read                                                                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adding or editing a definition / index / factory | [guidelines/01-data-registries.md](guidelines/01-data-registries.md), [guidelines/02-factories.md](guidelines/02-factories.md), [guidelines/03-js-types.md](guidelines/03-js-types.md) |
| Adding or changing tests                         | [guidelines/04-testing.md](guidelines/04-testing.md)                                                                                                                                   |
| New domain (classes, skills, items…)             | All guidelines + copy the weapons pattern                                                                                                                                              |

## Commands

```bash
npm run test:run   # run Vitest once
npm test           # Vitest watch
npm run check      # svelte-check + JS types
```

## Reference implementation

Weapons are the template: `src/lib/items/weapons/` and `tests/lib/items/weapons/`.
