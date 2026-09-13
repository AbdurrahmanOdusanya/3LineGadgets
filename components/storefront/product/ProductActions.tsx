// ==============================================================================
// 3LINE GADGETS — PRODUCT ACTIONS (ADD TO CART, WISHLIST, SHARE)
// components/storefront/product/ProductActions.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import type { StorefrontProduct, StorefrontProductVariant } from '@/types/storefront';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductActionsProps {
  product: StorefrontProduct;
  selectedVariant?: StorefrontProductVariant;
  quantity: number;
  isAvailable: boolean;
}

export function ProductActions({
  product,
  selectedVariant,
  quantity,
  isAvailable,
}: ProductActionsProps) {
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!isAvailable) return;
    setErrorMessage(null);

    const result = await addToCart(product, selectedVariant, quantity);
    if (result.success) {
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
        openCart();
      }, 700);
    } else if (result.error) {
      setErrorMessage(result.error);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleWishlist = () => {
    toggleWishlist(product.id, product.name);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${product.name} | 3Line Gadgets`,
      text: product.short_description || product.name,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or share failed
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedNotice(true);
        setTimeout(() => setCopiedNotice(false), 2500);
      } catch {
        // Fallback or silent
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-center gap-3">
        {/* Add To Cart Primary Button */}
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`flex-1 h-12 sm:h-13 rounded-2xl text-sm sm:text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
            !isAvailable
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100 shadow-none'
              : addedNotice
              ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
              : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-violet-200 hover:shadow-lg'
          }`}
        >
          {addedNotice ? (
            <>
              <Check className="w-5 h-5 text-white stroke-[3]" />
              <span>Added to Cart!</span>
            </>
          ) : !isAvailable ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`w-12 sm:w-13 h-12 sm:h-13 rounded-2xl border flex items-center justify-center transition-all cursor-pointer ${
            isFavorited
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
              : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          className="w-12 sm:w-13 h-12 sm:h-13 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-violet-600 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
        >
          {copiedNotice ? (
            <Check className="w-5 h-5 text-emerald-600" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {copiedNotice && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product link copied to clipboard!</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 animate-in fade-in">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
