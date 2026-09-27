// ==============================================================================
// 3LINE GADGETS — STOREFRONT HOMEPAGE CLIENT
// components/storefront/StorefrontClient.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import type { StorefrontProduct, StorefrontCategory } from '@/types/storefront';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { ProductCard } from '@/components/storefront/ProductCard';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ArrowRight } from 'lucide-react';

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
  userProfile,
}: StorefrontClientProps) {
  // Split products: featured or best-sellers
  const bestSellers = initialProducts.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Navigation Header */}
      <StorefrontNavbar userProfile={userProfile} />

      {/* Main Homepage Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 w-full">
        {/* Hero Section */}
        <HeroBanner />

        {/* Explore Our Best Sellers / Featured Products */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <StorefrontFooter />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
