// ==============================================================================
// 3LINE GADGETS — CATALOG FILTER SIDEBAR
// components/storefront/ProductFilters.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { StorefrontCategory, StorefrontBrand } from '@/types/storefront';
import { Filter, X, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductFiltersProps {
  categories: StorefrontCategory[];
  brands: StorefrontBrand[];
  currentCategorySlug?: string;
  currentBrandSlug?: string;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  currentStockStatus?: string;
  onFilterChange?: () => void;
}

export function ProductFilters({
  categories,
  brands,
  currentCategorySlug,
  currentBrandSlug,
  currentMinPrice,
  currentMaxPrice,
  currentStockStatus,
  onFilterChange,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPriceInput, setMinPriceInput] = useState(
    currentMinPrice ? String(currentMinPrice) : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentMaxPrice ? String(currentMaxPrice) : ''
  );

  const applyQueryUpdates = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset page to 1 on filter changes

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
    if (onFilterChange) onFilterChange();
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyQueryUpdates({
      minPrice: minPriceInput.trim() ? minPriceInput.trim() : null,
      maxPrice: maxPriceInput.trim() ? maxPriceInput.trim() : null,
    });
  };

  const clearAllFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    router.push(pathname);
    if (onFilterChange) onFilterChange();
  };

  const hasActiveFilters = Boolean(
    (currentCategorySlug && currentCategorySlug !== 'all') ||
      (currentBrandSlug && currentBrandSlug !== 'all') ||
      currentMinPrice ||
      currentMaxPrice ||
      (currentStockStatus && currentStockStatus !== 'all')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Filter className="w-4 h-4 text-violet-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => applyQueryUpdates({ category: null })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
              !currentCategorySlug || currentCategorySlug === 'all'
                ? 'bg-violet-50 text-violet-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {(!currentCategorySlug || currentCategorySlug === 'all') && (
              <Check className="w-3.5 h-3.5 text-violet-600" />
            )}
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategorySlug === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => applyQueryUpdates({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-50 text-violet-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                  ({cat.itemCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => applyQueryUpdates({ brand: null })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
              !currentBrandSlug || currentBrandSlug === 'all'
                ? 'bg-violet-50 text-violet-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Brands</span>
            {(!currentBrandSlug || currentBrandSlug === 'all') && (
              <Check className="w-3.5 h-3.5 text-violet-600" />
            )}
          </button>

          {brands.map((brand) => {
            const isSelected = currentBrandSlug === brand.slug;
            return (
              <button
                key={brand.id || brand.slug}
                type="button"
                onClick={() => applyQueryUpdates({ brand: brand.slug })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-50 text-violet-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{brand.name}</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                  ({brand.itemCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Price Range (₦)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-8 text-xs bg-slate-50 border-slate-200 rounded-lg px-2"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="5,000,000"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-8 text-xs bg-slate-50 border-slate-200 rounded-lg px-2"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            className="w-full h-8 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
          >
            Apply Price
          </Button>
        </form>
      </div>

      {/* Stock Availability Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Availability
        </h4>
        <div className="space-y-1.5">
          {[
            { label: 'All Items', value: 'all' },
            { label: 'In Stock Only', value: 'in_stock' },
            { label: 'Low Stock Specials', value: 'low_stock' },
          ].map((item) => {
            const isSelected =
              (!currentStockStatus && item.value === 'all') ||
              currentStockStatus === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  applyQueryUpdates({
                    stock: item.value === 'all' ? null : item.value,
                  })
                }
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-violet-50 text-violet-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-violet-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
