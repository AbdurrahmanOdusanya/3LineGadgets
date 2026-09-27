// ==============================================================================
// 3LINE GADGETS — STOREFRONT PRODUCT CARD
// components/storefront/ProductCard.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StorefrontProduct } from '@/types/storefront';
import { getProductStockInfo } from '@/types/storefront';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { formatNaira } from '@/lib/utils';
import { ShoppingBag, Heart, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: StorefrontProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);

  // Variant & Pricing calculation
  const defaultVariant = product.variants?.[0];
  const price = defaultVariant ? defaultVariant.price : product.base_price;

  // Real stock state logic
  const stockInfo = getProductStockInfo(product.variants);

  // Image resolution
  const primaryImage =
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!stockInfo.isAvailable) return;
    addToCart(product, defaultVariant, 1);
  };

  return (
    <div className="group relative rounded-xl sm:rounded-2xl bg-white border border-slate-100 hover:border-violet-200 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5">
      {/* Top Image Stage */}
      <div className="relative w-full aspect-square bg-slate-50/70 overflow-hidden flex items-center justify-center p-2.5 sm:p-4">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all touch-manipulation ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full h-full block"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            referrerPolicy="no-referrer"
            className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 p-1 sm:p-2"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between gap-1 w-full text-[10px] sm:text-[11px] overflow-hidden">
            <span className="font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[50%]">
              {product.brand?.name || '3Line Direct'}
            </span>

            {/* Stock indicator badge */}
            {stockInfo.status === 'in_stock' && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> In Stock
              </span>
            )}
            {stockInfo.status === 'low_stock' && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Low Stock
              </span>
            )}
            {stockInfo.status === 'out_of_stock' && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3
              className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem] cursor-pointer"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <div
              className="text-xs sm:text-sm md:text-base font-black text-slate-900 leading-tight truncate"
              title={formatNaira(price)}
            >
              {formatNaira(price)}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!stockInfo.isAvailable}
            size="sm"
            aria-label={`Add ${product.name} to cart`}
            className={`rounded-lg sm:rounded-xl p-2 sm:px-3 sm:py-2 text-xs font-semibold transition-all h-8 sm:h-9 w-8 sm:w-auto shrink-0 flex items-center justify-center gap-1.5 shadow-xs touch-manipulation active:scale-95 ${
              stockInfo.isAvailable
                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
