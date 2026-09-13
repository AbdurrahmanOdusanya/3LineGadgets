// ==============================================================================
// 3LINE GADGETS — PRODUCT DETAILS LOADING SKELETON
// app/products/[slug]/loading.tsx
// ==============================================================================

import React from 'react';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';

export default function ProductLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white animate-pulse">
      <StorefrontNavbar />

      {/* Breadcrumb Skeleton */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="h-4 w-64 bg-slate-200 rounded-md" />
      </div>

      {/* Main Layout Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full aspect-square bg-slate-100 rounded-3xl" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="h-10 w-40 bg-slate-200 rounded-lg" />
              <div className="h-3 w-64 bg-slate-200 rounded" />
            </div>

            <div className="h-16 w-full bg-slate-100 rounded-2xl" />

            <div className="space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-28 bg-slate-100 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="h-12 w-full bg-slate-200 rounded-2xl" />

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-16 bg-slate-50 rounded-2xl" />
              <div className="h-16 bg-slate-50 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
