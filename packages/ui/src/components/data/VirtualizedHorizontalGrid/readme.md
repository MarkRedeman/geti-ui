# packages/ui/src/components/data/VirtualizedHorizontalGrid/

## Responsibility

Provides a virtualised horizontal grid (items flow left-to-right with DOM recycling), built on `react-aria-components` (RAC) and a custom `HorizontalLayout` class. Used for large horizontally-scrolling image/card galleries.

## Design

Built on RAC, not Spectrum. Key building blocks:

- **`Virtualizer`** (from `react-aria-components`) — manages DOM recycling.
- **`HorizontalLayout`** (co-located `HorizontalLayout.ts`) — a custom class extending RAC's `Layout`. Implements the horizontal flow algorithm: items are laid out left-to-right in rows, with `itemWidth`, `itemHeight`, and `gap` controlling the grid geometry.
- **`orientation="horizontal"`** — passed to the inner `ListBox` to set scroll direction.
- **`listBoxItemStyles`** — a style object passed to every `ListBoxItem`, enabling caller control of item dimensions without changing the layout algorithm.
- **No infinite scroll** — unlike `VirtualizedListLayout`, this component has no `isLoading`/`onLoadMore` mechanism. It renders a fixed `items` array.
- **Render props** — same `renderItem`, `idFormatter`, `textValueFormatter` pattern as `VirtualizedListLayout`.

## Flow

```
props { items, renderItem, idFormatter, textValueFormatter,
        listBoxItemStyles, ariaLabel }
  → <Virtualizer layout={new HorizontalLayout(...)}>
      <ListBox orientation="horizontal" aria-label={ariaLabel}>
        {items.map(item =>
          <ListBoxItem id={idFormatter(item)}
                       textValue={textValueFormatter(item)}
                       style={listBoxItemStyles}>
            {renderItem(item)}
          </ListBoxItem>
        )}
      </ListBox>
    </Virtualizer>
```

## Integration

- Used for horizontal image strip / filmstrip views (e.g. video frame selectors, horizontally-scrolling thumbnail rows).
- `HorizontalLayout.ts` is a co-located private implementation — not exported from the component's public API.
- Contrast with `VirtualizedListLayout` (same data/ category) — that is vertical + infinite scroll; this is horizontal + fixed collection.
- Contrast with `CardView` — `CardView` uses CSS grid without virtualisation (best for small/medium counts); `VirtualizedHorizontalGrid` virtualises the DOM for large horizontal collections.
