// ==============================================================================
// 3LINE GADGETS — SHOP CATALOG CLIENT VIEW
// components/storefront/ShopCatalogClient.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type {
  StorefrontProduct,
  StorefrontCatalogResult,
  StorefrontCategory,
  StorefrontBrand,
} from '@/types/storefront';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductFilters } from '@/components/storefront/ProductFilters';
import { ProductSort } from '@/components/storefront/ProductSort';
import { Pagination } from '@/components/storefront/Pagination';
import { QuickViewModal } from '@/components/storefront/QuickViewModal';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import {
  SlidersHorizontal,
  ChevronRight,
  Search,
  PackageOpen,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ShopCatalogClientProps {
  catalogResult: StorefrontCatalogResult;
  categories: StorefrontCategory[];
  brands: StorefrontBrand[];
  userProfile?: {
    id: string;
    full_name?: string | null;
    role?: string | null;
  } | null;
  currentParams: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    stock?: string;
    sort?: string;
    page?: number;
    deals?: boolean;
  };
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function ShopCatalogClient({
  catalogResult,
  categories,
  brands,
  userProfile,
  currentParams,
  title = 'All Gadgets & Tech',
  description = 'Explore authentic flagship smartphones, MacBooks, Dell workstations, and noise-canceling audio gear.',
  breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ],
}: ShopCatalogClientProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<StorefrontProduct | null>(null);

  const { products, totalCount, page, limit, totalPages } = catalogResult;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Navbar */}
      <StorefrontNavbar userProfile={userProfile} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              {crumb.href && idx < breadcrumbs.length - 1 ? (
                <Link
                  href={crumb.href}
                  className="hover:text-violet-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-900">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Page Heading & Header */}
        <div className="space-y-1.5 border-b border-slate-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            {/* Mobile Filter Sheet Button */}
            <Button
              onClick={() => setMobileFilterOpen(true)}
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-2 text-xs font-semibold rounded-xl border-slate-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
              <span>Filters</span>
            </Button>

            <span className="text-xs font-medium text-slate-500">
              Found <strong className="text-slate-900 font-bold">{totalCount}</strong>{' '}
              {totalCount === 1 ? 'gadget' : 'gadgets'}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-auto flex justify-end">
            <ProductSort currentSort={currentParams.sort || 'featured'} />
          </div>
        </div>

        {/* Main Grid & Filters Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs sticky top-24">
            <ProductFilters
              categories={categories}
              brands={brands}
              currentCategorySlug={currentParams.category}
              currentBrandSlug={currentParams.brand}
              currentMinPrice={currentParams.minPrice}
              currentMaxPrice={currentParams.maxPrice}
              currentStockStatus={currentParams.stock}
            />
          </aside>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-9 space-y-8">
            {products.length === 0 ? (
              /* Empty Results State */
              <div className="p-12 rounded-3xl bg-white border border-slate-100 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-slate-900">
                    No gadgets match your filters
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Try adjusting your price range, searching with a broader keyword, or clearing the active filters.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl"
                >
                  <Link href="/shop">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Reset All Filters
                  </Link>
                </Button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              limit={limit}
            />
          </div>
        </div>
      </main>

      {/* Mobile Slide-Over Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                categories={categories}
                brands={brands}
                currentCategorySlug={currentParams.category}
                currentBrandSlug={currentParams.brand}
                currentMinPrice={currentParams.minPrice}
                currentMaxPrice={currentParams.maxPrice}
                currentStockStatus={currentParams.stock}
                onFilterChange={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <StorefrontFooter />

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CartDrawer />
    </div>
  );
}
