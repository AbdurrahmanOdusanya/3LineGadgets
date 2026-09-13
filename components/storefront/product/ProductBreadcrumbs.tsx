// ==============================================================================
// 3LINE GADGETS — PRODUCT BREADCRUMBS
// components/storefront/product/ProductBreadcrumbs.tsx
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ProductBreadcrumbsProps {
  category?: {
    name: string;
    slug: string;
  } | null;
  productName: string;
}

export function ProductBreadcrumbs({
  category,
  productName,
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium">
        <li className="flex items-center gap-1.5">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-violet-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        </li>

        <li className="flex items-center gap-1.5">
          <Link
            href="/shop"
            className="hover:text-violet-600 transition-colors"
          >
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        </li>

        {category && (
          <li className="flex items-center gap-1.5">
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-violet-600 transition-colors whitespace-nowrap"
            >
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          </li>
        )}

        <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          <span aria-current="page">{productName}</span>
        </li>
      </ol>
    </nav>
  );
}
