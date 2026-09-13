// ==============================================================================
// 3LINE GADGETS — PRODUCT IMAGE GALLERY
// components/storefront/product/ProductGallery.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { StorefrontProductImage } from '@/types/storefront';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Package,
  Sparkles,
} from 'lucide-react';

interface ProductGalleryProps {
  images: StorefrontProductImage[];
  productName: string;
  isFeatured?: boolean;
  discountPercent?: number | null;
}

export function ProductGallery({
  images,
  productName,
  isFeatured,
  discountPercent,
}: ProductGalleryProps) {
  // Sort images by sort_order
  const sortedImages = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    return [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [images]);

  // Find initial image index: prefer is_primary, else index 0
  const initialIndex = React.useMemo(() => {
    if (sortedImages.length === 0) return 0;
    const primaryIndex = sortedImages.findIndex((img) => img.is_primary);
    return primaryIndex >= 0 ? primaryIndex : 0;
  }, [sortedImages]);

  const [userSelectedIndex, setUserSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeIndex =
    userSelectedIndex !== null && userSelectedIndex < sortedImages.length
      ? userSelectedIndex
      : initialIndex;

  const hasMultiple = sortedImages.length > 1;
  const currentImage = sortedImages[activeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelectedIndex(activeIndex === 0 ? sortedImages.length - 1 : activeIndex - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserSelectedIndex(activeIndex === sortedImages.length - 1 ? 0 : activeIndex + 1);
  };

  // Fallback placeholder when no images are provided
  if (!currentImage) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="relative w-full aspect-square bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Package className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium text-slate-600">Product Image Coming Soon</p>
          <p className="text-xs text-slate-400 mt-1">{productName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Main Image Stage */}
      <div className="relative w-full aspect-square bg-slate-50/70 border border-slate-100 rounded-3xl overflow-hidden flex items-center justify-center p-6 group">
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isFeatured && (
            <span className="inline-flex items-center gap-1 bg-violet-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="inline-flex items-center bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          aria-label="Enlarge product image"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm text-slate-600 hover:text-violet-600 hover:bg-white shadow-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Primary Image Display */}
        <div
          className="relative w-full h-full cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={currentImage.image_url}
            alt={currentImage.alt_text || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            referrerPolicy="no-referrer"
            className="object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Prev / Next Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:text-violet-600 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:text-violet-600 hover:bg-white shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {hasMultiple && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {sortedImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={img.id || `thumb-${idx}`}
                type="button"
                onClick={() => setUserSelectedIndex(idx)}
                aria-label={`View image ${idx + 1} of ${sortedImages.length}`}
                aria-pressed={isActive}
                className={`relative w-20 h-20 shrink-0 rounded-2xl bg-slate-50 border p-1.5 overflow-hidden transition-all cursor-pointer ${
                  isActive
                    ? 'border-violet-600 ring-2 ring-violet-600/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    referrerPolicy="no-referrer"
                    className="object-contain mix-blend-multiply"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox / Zoom Modal */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image preview"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center"
          >
            {/* Close Lightbox */}
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              aria-label="Close image preview"
              className="absolute top-0 right-0 z-20 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 p-2.5 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Image */}
            <div className="relative w-full h-full">
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || productName}
                fill
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-contain"
              />
            </div>

            {/* Lightbox Navigation */}
            {hasMultiple && (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4 z-20">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-white/80 text-xs font-medium">
                  {activeIndex + 1} / {sortedImages.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
