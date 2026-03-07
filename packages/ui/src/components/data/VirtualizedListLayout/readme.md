# packages/ui/src/components/data/VirtualizedListLayout/

## Responsibility

Provides a virtualised vertical list with infinite-scroll support, built on `react-aria-components` (RAC) primitives. Designed for large item collections where DOM recycling is needed and where more control over item rendering is required than Spectrum's `ListView` offers.

## Design

Built on RAC, not Spectrum. Key building blocks:

- **`Virtualizer` + `ListLayout`** (from `react-aria-components`) — manages DOM recycling and scroll position. `layoutOptions: ListLayoutOptions` (rowHeight, etc.) are passed directly to `ListLayout`.
- **`useLoadMore`** (from `@react-aria/utils`) — fires `onLoadMore` when the user scrolls near the bottom. Triggered by the sentinel item.
- **Loading sentinel** — when `isLoading` is true, a `<ListBoxItem id="loader">` is appended to the list. It renders `renderLoading()` (default: `<Loading mode="inline" size="M">`). The sentinel is the mechanism that `useLoadMore` watches.
- **Render props** — `renderItem(item: T) => ReactNode` and `idFormatter(item: T) => Key` decouple the component from item shape. `textValueFormatter(item: T) => string` provides accessible text for each item.
- **`containerHeight?: string`** — controls the scroll container height (default fills available space).
- **`useRef`** — the scroll container ref is passed to both `Virtualizer` and `useLoadMore`.

## Flow

```
props { items, renderItem, idFormatter, textValueFormatter,
        layoutOptions, containerHeight, isLoading, onLoadMore,
        renderLoading, selected, ariaLabel }
  → useLoadMore({ isLoading, onLoadMore }, scrollRef)
  → <div ref={scrollRef} style={{ height: containerHeight, overflow: 'auto' }}>
      <Virtualizer layout={new ListLayout(layoutOptions)}>
        <ListBox aria-label={ariaLabel} selectedKeys={selected}>
          {items.map(item =>
            <ListBoxItem id={idFormatter(item)} textValue={textValueFormatter(item)}>
              {renderItem(item)}
            </ListBoxItem>
          )}
          {isLoading && <ListBoxItem id="loader">{renderLoading()}</ListBoxItem>}
        </ListBox>
      </Virtualizer>
    </div>
```

## Integration

- Used for large dataset image grids, annotation lists, and model history views where virtualisation is required.
- `Loading` (feedback/) is the default `renderLoading` fallback.
- Contrast with `VirtualizedHorizontalGrid` (same data/ category) — this component is vertical + infinite scroll; `VirtualizedHorizontalGrid` is horizontal with a custom `HorizontalLayout`.
- Contrast with Spectrum `ListView` — this component uses RAC for full rendering control; `ListView` uses Spectrum's built-in virtualisation with Spectrum styling.
