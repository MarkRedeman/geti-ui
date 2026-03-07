### Phase 7 - Initial migration to tailwind like css

Next I'd like to start to refactor our components to be more flexible wrt their styling. Currently we are very limited 

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```Button.tsx
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../../lib/utils';

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center gap-2 ',
  variants: {
    variant: {
      primary: 'px-6 py-3 bg-accent hover:bg-accent-light text-accent-text font-medium transition-all duration-200',
      secondary: 'border-2 border-elevated text-text-secondary hover:border-accent hover:text-accent',
      ghost: 'px-6 py-3 text-text-secondary hover:text-text font-medium transition-colors',
      elevated: 'border-2 border-elevated text-text-secondary hover:border-accent hover:text-accent bg-elevated ',
    },
    size: {
      sm: 'px-4 py-2 text-sm',
      md: '',
      lg: 'px-8 py-4',
    },
    lift: {
      true: 'hover:-translate-y-0.5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    lift: false,
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  lift?: boolean;
  leftIcon?: React.ComponentType<{ className?: string }>;
  rightIcon?: React.ComponentType<{ className?: string }>;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      lift,
      href,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size, lift }), className);

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
        {LeftIcon && <LeftIcon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
        {children}
        {RightIcon && <RightIcon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...props}
      >
        {LeftIcon && <LeftIcon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
        {children}
        {RightIcon && <RightIcon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

