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
    <div className="group relative rounded-2xl bg-white border border-slate-100 hover:border-violet-200 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5">
      {/* Top Image Stage */}
      <div className="relative w-full aspect-square bg-slate-50/70 overflow-hidden flex items-center justify-center p-4">
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-xs'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
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
            className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 p-2"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Stock Pill */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-400 uppercase tracking-wider">
              {product.brand?.name || '3Line Direct'}
            </span>

            {/* Stock indicator badge */}
            {stockInfo.status === 'in_stock' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" /> In Stock
              </span>
            )}
            {stockInfo.status === 'low_stock' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3" /> Low Stock
              </span>
            )}
            {stockInfo.status === 'out_of_stock' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3
              className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 leading-none">
              {formatNaira(price)}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!stockInfo.isAvailable}
            size="sm"
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all h-9 flex items-center gap-1.5 shadow-xs ${
              stockInfo.isAvailable
                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
