// ==============================================================================
// 3LINE GADGETS — CATALOG SORT DROPDOWN
// components/storefront/ProductSort.tsx
// ==============================================================================

'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

interface ProductSortProps {
  currentSort?: string;
}

export function ProductSort({ currentSort = 'featured' }: ProductSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (val === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', val);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort by:</span>
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:border-violet-500 focus:outline-hidden cursor-pointer"
      >
        <option value="featured">Featured / Best Sellers</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </div>
  );
}
