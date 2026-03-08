# packages/ui/src/utils/

## Responsibility

Shared utility functions used internally by components and optionally by consumers. Currently contains a single module: `distinct-colors.ts`.

## Design

**`distinct-colors.ts`** provides three exports:

| Export                                       | Purpose                                                                                                                                                                |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DISTINCT_COLORS`                            | A curated palette of 21 perceptually distinct hex colours drawn from the Geti brand and product colour sets                                                            |
| `getDistinctColorBasedOnHash(value: string)` | Deterministically maps any string to a colour from `DISTINCT_COLORS` using a Java-style string hash (`Math.imul(31, s) + charCode`). Same input → same colour, always. |
| `getRandomDistinctColor()`                   | Returns a random colour from the palette. Used when determinism is not required.                                                                                       |
| `getHEXFormat(color: string)`                | Strips an 8-digit hex colour (with `ff` alpha suffix) down to a 6-digit hex. Useful for normalising colour values returned by the color picker components.             |

The hash function is a well-known fast non-cryptographic hash (Bernstein/djb2 variant), chosen for speed and distribution quality over the small palette.

## Flow

```
PhotoPlaceholder receives a `name` string prop
  → getDistinctColorBasedOnHash(name)
  → returns a stable hex colour for the avatar background
```

## Integration

- **Internal**: `PhotoPlaceholder` (`components/ui/PhotoPlaceholder/`) uses `getDistinctColorBasedOnHash` to assign deterministic avatar background colours based on user name strings.
- **Public API**: `getDistinctColorBasedOnHash`, `getRandomDistinctColor`, `DISTINCT_COLORS`, and `getHEXFormat` are **not** re-exported from `src/index.ts` — they are internal utilities. Consumers who need them must copy the logic or request a public export.
- **Color picker**: `getHEXFormat` is a natural companion to the color picker components in `form/pickers/` — it normalises RGBA hex values that color inputs may produce.
