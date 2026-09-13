// ==============================================================================
// 3LINE GADGETS — UI PRIMITIVE: BUTTON
// components/ui/button.tsx
// ==============================================================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:scale-[0.98]',
        violet:
          'bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:scale-[0.98]',
        destructive:
          'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]',
        outline:
          'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
        outlineDark:
          'border border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800 hover:border-slate-600',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200/80',
        subtle:
          'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100',
        ghost:
          'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
        link: 'text-violet-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          buttonVariants({ variant, size, className }),
          (children.props as any).className
        ),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
