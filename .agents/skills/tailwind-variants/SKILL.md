---
name: tailwind-variants
description: >
  Advanced component variant management with tailwind-variants.
  Trigger: When creating reusable components with multiple variants, props-based styling, design system components, complex conditional styling.
dependencies: [tailwind-4]
license: Apache-2.0
metadata:
  author: oma-solutions
  version: "1.0"
  scope: [web]
  auto_invoke: "Defining component variants or complex styled components"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

## When to Use Tailwind Variants

Use `tailwind-variants` when:

- ✅ Building design system components with multiple variants
- ✅ Components need props-based styling (size, color, state)
- ✅ Complex conditional styling logic
- ✅ Multi-part components (slots pattern)
- ✅ Compound variants (combinations of variants)

Use simple `cn()` when:

- ❌ One-off conditional classes
- ❌ Simple true/false conditions
- ❌ No reusable component

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Installation

```bash
npm install tailwind-variants
```

## Basic Usage with TypeScript integration

```typescript
// botton.variants.ts
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "font-medium rounded-lg",
  variants: {
    color: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-200 text-gray-800",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "md",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

// button.tsx
import { type ButtonVariantProps } from "./button.variants";

type ButtonProps = ButtonVariantProps & {
  className?: string
  // Other props
}

function Button({ className, ...props }: ButtonProps) {
  const buttonVariants = buttonVariants(props);
  return <button className={cn(buttonVariants, className)} {...props} />
}
```

## Slots Pattern (Multi-part Components)

```typescript
// card.variants.ts
export const cardVariants = tv({
  slots: {
    base: "rounded-lg border overflow-hidden",
    header: "px-6 py-4 border-b",
    body: "px-6 py-4",
    footer: "px-6 py-4 border-t bg-gray-50",
  },
  variants: {
    variant: {
      default: {
        base: "border-gray-200",
        header: "bg-white",
      },
      premium: {
        base: "border-gold-500 bg-gradient-to-br from-gold-50",
        header: "bg-gold-100",
      },
    },
  },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;

// card.tsx
import { type CardVariantProps } from "./card.variants";

type CardProps = CardVariantProps & {
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerClassName?: string
  // Other props
}

function Card({ className, headerClassName, bodyClassName, footerClassName, ...props }: CardProps) {
  const { base, header, body, footer } = cardVariants(props);
  return (
    <div className={cn(base(), className)}>
      <div className={cn(header(), headerClassName)} />
      <div className={cn(body(), bodyClassName)} />
      <div className={cn(footer(), footerClassName)} />
    </div>
  );
}
```
