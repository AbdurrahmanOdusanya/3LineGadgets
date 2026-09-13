// ==============================================================================
// 3LINE GADGETS — PRODUCT QUICK VIEW MODAL
// components/storefront/QuickViewModal.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StorefrontProduct, StorefrontProductVariant } from '@/types/storefront';
import { getProductStockInfo } from '@/types/storefront';
import { useCart } from '@/lib/context/CartContext';
import { formatNaira } from '@/lib/utils';
import {
  X,
  Check,
  ShieldCheck,
  Truck,
  ShoppingBag,
  Star,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickViewModalProps {
  product: StorefrontProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const currentVariant: StorefrontProductVariant | undefined =
    product.variants[selectedVariantIndex] || product.variants[0];

  const price = currentVariant ? currentVariant.price : product.base_price;
  const compareAtPrice = currentVariant
    ? currentVariant.compare_at_price
    : product.compare_at_price;

  const discountPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const stockInfo = getProductStockInfo(product.variants);

  const handleAddToCart = () => {
    if (!stockInfo.isAvailable) return;
    addToCart(product, currentVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 600);
  };

  const primaryImage =
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 overflow-hidden my-8">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Image Column */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                referrerPolicy="no-referrer"
                className="object-contain mix-blend-multiply p-6"
              />

              {discountPercent && (
                <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Right Product Details */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider mb-1">
                  <span className="font-semibold text-violet-600">
                    {product.brand?.name || '3Line Direct'}
                  </span>

                  {stockInfo.status === 'in_stock' && (
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      In Stock
                    </span>
                  )}
                  {stockInfo.status === 'low_stock' && (
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                      Low Stock
                    </span>
                  )}
                  {stockInfo.status === 'out_of_stock' && (
                    <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700">{product.rating?.toFixed(1) || '4.9'}</span>
                  <span>({product.review_count || 48} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-slate-900">
                  {formatNaira(price)}
                </span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-sm line-through text-slate-400 font-medium">
                    {formatNaira(compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.short_description || product.description}
              </p>

              {/* Variant selector */}
              {product.variants.length > 1 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    Select Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                          selectedVariantIndex === idx
                            ? 'bg-violet-50 border-violet-600 text-violet-700 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications snippet */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-slate-600">
                      <span className="font-semibold text-slate-700 capitalize">{key}:</span>
                      <span className="truncate max-w-[180px]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart Actions */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!stockInfo.isAvailable}
                  className={`flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm ${
                    stockInfo.isAvailable
                      ? 'bg-violet-600 hover:bg-violet-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatNaira(price * quantity)}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> 1-Year Warranty
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-violet-600" /> Tracked Delivery
                </span>
              </div>

              {/* View Full Product Details Link */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="inline-block text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline"
                >
                  View Full Product Details & Specifications →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
