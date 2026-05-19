# Code style

## No nested ternary operators

Never chain ternary expressions (`a ? b ? c : d : e` or multiline equivalents). They are hard to read and easy to mis-parse.

Use instead:

- `if` / `else if` / `else` for multi-branch logic
- A small helper when the same pattern repeats (e.g. roll vs average damage)

```js
// Bad
const value = conditionA ? (conditionB ? foo() : bar()) : baz();

// Good
let value;
if (conditionA) {
	value = conditionB ? foo() : bar();
} else {
	value = baz();
}
```

A single ternary is fine when both branches are simple literals or identifiers.
