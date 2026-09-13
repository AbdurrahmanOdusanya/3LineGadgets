// ==============================================================================
// 3LINE GADGETS — PRODUCT AVAILABILITY BADGE
// components/storefront/product/ProductStockBadge.tsx
// ==============================================================================

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ProductStockBadgeProps {
  stockQuantity: number;
  lowStockThreshold?: number;
}

export function ProductStockBadge({
  stockQuantity,
  lowStockThreshold = 5,
}: ProductStockBadgeProps) {
  if (stockQuantity <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <XCircle className="w-3.5 h-3.5 text-slate-500" />
        <span>Out of Stock</span>
      </div>
    );
  }

  if (stockQuantity <= lowStockThreshold) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Low Stock — Order Soon</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>In Stock</span>
    </div>
  );
}
