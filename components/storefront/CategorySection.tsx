// ==============================================================================
// 3LINE GADGETS — BROWSE BY CATEGORY SECTION
// components/storefront/CategorySection.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StorefrontCategory } from '@/types/storefront';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface CategorySectionProps {
  categories: StorefrontCategory[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  // Filter out any invalid items
  const activeCategories = categories.filter((c) => c.slug !== 'all');

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Browse by Category
          </h2>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-5">
        {activeCategories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            href={`/categories/${cat.slug}`}
            className="group rounded-2xl bg-white border border-slate-100 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-violet-200 transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1"
          >
            {/* Category Image Circle */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 flex items-center justify-center p-2 mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <Image
                src={
                  cat.image_url ||
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'
                }
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 25vw, 15vw"
                referrerPolicy="no-referrer"
                className="object-contain mix-blend-multiply p-2"
              />
            </div>

            {/* Category Name */}
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-violet-600 transition-colors leading-tight line-clamp-1">
              {cat.name}
            </h3>

            {/* Item Count */}
            <span className="text-[11px] text-slate-400 mt-1">
              {cat.itemCount} {cat.itemCount === 1 ? 'Product' : 'Products'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
