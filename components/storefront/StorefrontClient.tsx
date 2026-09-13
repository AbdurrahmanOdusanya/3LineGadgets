// ==============================================================================
// 3LINE GADGETS — STOREFRONT HOMEPAGE CLIENT
// components/storefront/StorefrontClient.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { StorefrontProduct, StorefrontCategory } from '@/types/storefront';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { CategorySection } from '@/components/storefront/CategorySection';
import { PromotionalBanner } from '@/components/storefront/PromotionalBanner';
import { ProductCard } from '@/components/storefront/ProductCard';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { QuickViewModal } from '@/components/storefront/QuickViewModal';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorefrontClientProps {
  initialProducts: StorefrontProduct[];
  categories: StorefrontCategory[];
  userProfile?: {
    id: string;
    full_name?: string | null;
    role?: string | null;
  } | null;
}

export function StorefrontClient({
  initialProducts,
  categories,
  userProfile,
}: StorefrontClientProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<StorefrontProduct | null>(null);

  // Split products: featured or best-sellers
  const bestSellers = initialProducts.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Navigation Header */}
      <StorefrontNavbar userProfile={userProfile} />

      {/* Main Homepage Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 w-full">
        {/* 1. Hero Section */}
        <HeroBanner />

        {/* 2. Browse by Category */}
        <CategorySection categories={categories} />

        {/* 3. Promotional Special Offer Banner */}
        <PromotionalBanner />

        {/* 4. Explore Our Best Sellers / Featured Products */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Explore Our Best Sellers
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <StorefrontFooter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
