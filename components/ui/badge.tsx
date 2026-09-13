// ==============================================================================
// 3LINE GADGETS — UI PRIMITIVE: BADGE
// components/ui/badge.tsx
// ==============================================================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-violet-600 text-white shadow-xs',
        violet:
          'border-violet-200 bg-violet-50 text-violet-700',
        secondary:
          'border-slate-200 bg-slate-100 text-slate-700',
        destructive:
          'border-rose-200 bg-rose-50 text-rose-700',
        outline: 'text-slate-600 border-slate-200 bg-white',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning:
          'border-amber-200 bg-amber-50 text-amber-700',
        in_stock:
          'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold',
        low_stock:
          'border-amber-200 bg-amber-50 text-amber-700 font-semibold',
        out_of_stock:
          'border-rose-200 bg-rose-50 text-rose-700 font-semibold',
        inStock:
          'border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold',
        lowStock:
          'border-amber-200 bg-amber-50 text-amber-700 font-semibold',
        outOfStock:
          'border-rose-200 bg-rose-50 text-rose-700 font-semibold',

      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
