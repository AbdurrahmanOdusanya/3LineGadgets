// ==============================================================================
// 3LINE GADGETS — RELATED PRODUCTS SECTION
// components/storefront/product/RelatedProductsSection.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import type { StorefrontProduct } from '@/types/storefront';
import { ProductCard } from '@/components/storefront/ProductCard';
import { QuickViewModal } from '@/components/storefront/QuickViewModal';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsSectionProps {
  products: StorefrontProduct[];
  categorySlug?: string;
  categoryName?: string;
}

export function RelatedProductsSection({
  products,
  categorySlug,
  categoryName,
}: RelatedProductsSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<StorefrontProduct | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-16 pt-12 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-violet-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Tech</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            You May Also Like
          </h2>
          {categoryName && (
            <p className="text-xs text-slate-500 mt-1">
              More premium devices from <span className="font-semibold text-slate-700">{categoryName}</span>
            </p>
          )}
        </div>

        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline"
          >
            <span>View All in {categoryName || 'Category'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Grid of Related Products using Feature 3 ProductCard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal integration */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
}
