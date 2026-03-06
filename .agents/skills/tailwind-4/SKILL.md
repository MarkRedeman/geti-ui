---
name: tailwind-4
description: >
  Tailwind CSS 4 patterns and best practices.
  Trigger: When styling with Tailwind (className, variants, cn()), especially when dynamic styling or CSS variables are involved (no var() in className).
license: Apache-2.0
metadata:
  author: prowler-cloud
  version: "1.0"
  scope: [root, ui]
  auto_invoke: "Working with Tailwind classes"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Styling Decision Tree

```
Tailwind class exists?  → className="..."
Dynamic value?          → style={{ width: `${x}%` }}
Conditional styles?     → cn("base", condition && "variant")
Static only?            → className="..." (no cn() needed)
Library can't use class?→ style prop with var() constants
```

## Critical Rules

### Never Use var() in className

```typescript
// ❌ NEVER: var() in className
<div className="bg-[var(--color-primary)]" />
<div className="text-[var(--text-color)]" />

// ✅ ALWAYS: Use Tailwind semantic classes
<div className="bg-primary" />
<div className="text-slate-400" />
```

### Never Use Hex Colors

```typescript
// ❌ NEVER: Hex colors in className
<p className="text-[#ffffff]" />
<div className="bg-[#1e293b]" />

// ✅ ALWAYS: Use Tailwind color classes
<p className="text-white" />
<div className="bg-slate-800" />
```

## The cn() Utility

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### When to Use cn()

```typescript
// ✅ Conditional classes
<div className={cn("base-class", isActive && "active-class")} />

// ✅ Merging with potential conflicts
<button className={cn("px-4 py-2", className)} />  // className might override

// ✅ Multiple conditions
<div className={cn(
  "rounded-lg border", {
    "bg-blue-500 text-white": variant === "primary",
    "bg-gray-200 text-gray-800": variant === "secondary",
    "opacity-50 cursor-not-allowed": disabled,
  }
)} />
```

### When NOT to Use cn()

```typescript
// ❌ Static classes - unnecessary wrapper
<div className={cn("flex items-center gap-2")} />

// ✅ Just use className directly
<div className="flex items-center gap-2" />
```

## Style Constants for Charts/Libraries

When libraries don't accept className (like Recharts):

```typescript
// ✅ Constants with var() - ONLY for library props
const CHART_COLORS = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  text: "var(--color-text)",
  gridLine: "var(--color-border)",
};

// Usage with Recharts (can't use className)
<XAxis tick={{ fill: CHART_COLORS.text }} />
<CartesianGrid stroke={CHART_COLORS.gridLine} />
```

## Dynamic Values

```typescript
// ✅ style prop for truly dynamic values
<div style={{ width: `${percentage}%` }} />
<div style={{ opacity: isVisible ? 1 : 0 }} />

// ✅ CSS custom properties for theming
<div style={{ "--progress": `${value}%` } as React.CSSProperties} />
```

## Common Patterns

### Flexbox

```typescript
<div className="flex items-center justify-between gap-4" />
<div className="flex flex-col gap-2" />
<div className="inline-flex items-center" />
```

### Grid

```typescript
<div className="grid grid-cols-3 gap-4" />
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" />
```

### Spacing

```typescript
// Padding
<div className="p-4" />           // All sides
<div className="px-4 py-2" />     // Horizontal, vertical
<div className="pt-4 pb-2" />     // Top, bottom

// Margin
<div className="m-4" />
<div className="mx-auto" />       // Center horizontally
<div className="mt-8 mb-4" />
```

### Typography

```typescript
<h1 className="text-2xl font-bold text-white" />
<p className="text-sm text-slate-400" />
<span className="text-xs font-medium uppercase tracking-wide" />
```

### Borders & Shadows

```typescript
<div className="rounded-lg border border-slate-700" />
<div className="rounded-full shadow-lg" />
<div className="ring-2 ring-blue-500 ring-offset-2" />
```

### Focus Management (Keyboard Navigation)

```typescript
// ❌ Ring is always visible (even with mouse)
<button className="focus:ring-2 ring-blue-500" />

// ✅ Ring solo con teclado (mejor UX)
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none" />
<input className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" />

// ✅ Pattern común para links
<a className="rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none" />
```

### States

```typescript
<button className="hover:bg-blue-600 active:scale-95" />
<div className="group-hover:opacity-100" />
```

### Animations

```typescript
<div className="transition-all duration-300 ease-in-out" />
<div className="animate-spin" />           // Loading spinner
<div className="animate-pulse" />          // Skeleton loader
<div className="animate-bounce" />         // Attention grabber

// ✅ Custom timing
<div className="transition duration-150 ease-out hover:ease-in" />
```

### Responsive

- Viewport-based

```typescript
<div className="w-full md:w-1/2 lg:w-1/3" />
<div className="hidden md:block" />
<div className="text-sm md:text-base lg:text-lg" />
```

- Container-based

```typescript
<div className="@container">
  <div className="@md:flex @lg:grid" />
  <p className="text-sm @md:text-base @lg:text-lg" />
</div>
```

- Usage

```typescript
// Card component adapts to viewport
function ProductCard() {
  return (
    <div className="@container rounded-lg border p-4">
      {/* Adapts to the width of the card, not to the viewport */}
      <div className="@md:flex @md:gap-4">
        <img className="@md:w-1/3" />
        <div className="@md:w-2/3">
          <h3 className="text-lg @md:text-xl">Product</h3>
          <p className="text-sm @md:text-base">Description</p>
        </div>
      </div>
    </div>
  );
}

// Layout use responsive (viewport)
function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Each card adapts to its own size */}
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
}
```

### Fluid Typography/Spacing

```typescript
// ✅ resonsive without media queries
<h1 className="text-[clamp(1.5rem,5vw,3rem)]" />
<div className="p-[clamp(1rem,2vw,2rem)]" />
```

### Dark Mode

```typescript
<div className="bg-white dark:bg-slate-900" />
<p className="text-gray-900 dark:text-white" />

// ✅ Pattern para transiciones suaves
<div className="bg-white dark:bg-slate-900 transition-colors" />
```

## Arbitrary Values (Escape Hatch)

```typescript
// ✅ OK for one-off values not in design system
<div className="w-[327px]" />
<div className="top-[117px]" />
<div className="grid-cols-[1fr_2fr_1fr]" />

// ✅ OK: Propiedades no en Tailwind
<div className="[mask-image:linear-gradient(to_bottom,black,transparent)]" />

// ❌ Don't use for colors - use theme instead
<div className="bg-[#1e293b]" />  // NO
```

## Related Skills

- [tailwind-variants](./../tailwind-variants/SKILL.md) - Advanced component variant management
- React Aria - Headless UI componets with all accessibility features and functionality, ready to use with Tailwind CSS
