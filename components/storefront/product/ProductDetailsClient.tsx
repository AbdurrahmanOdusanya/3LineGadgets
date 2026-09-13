// ==============================================================================
// 3LINE GADGETS — PRODUCT DETAILS CLIENT CONTAINER
// components/storefront/product/ProductDetailsClient.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { StorefrontProduct, StorefrontProductVariant } from '@/types/storefront';
import { ProductBreadcrumbs } from './ProductBreadcrumbs';
import { ProductGallery } from './ProductGallery';
import { ProductPrice } from './ProductPrice';
import { ProductStockBadge } from './ProductStockBadge';
import { ProductVariants } from './ProductVariants';
import { ProductQuantity } from './ProductQuantity';
import { ProductActions } from './ProductActions';
import { ProductTrustBadges } from './ProductTrustBadges';
import { ProductTabs } from './ProductTabs';
import { RelatedProductsSection } from './RelatedProductsSection';
import { Star, Shield, Cpu, Tag } from 'lucide-react';

interface ProductDetailsClientProps {
  product: StorefrontProduct;
  relatedProducts: StorefrontProduct[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  // Active variants
  const activeVariants = (product.variants || []).filter((v) => v.is_active);

  // Initial variant selection
  const [selectedVariant, setSelectedVariant] = useState<StorefrontProductVariant | undefined>(
    activeVariants[0] || product.variants[0]
  );

  // Current pricing based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const currentCompareAtPrice = selectedVariant
    ? selectedVariant.compare_at_price
    : product.compare_at_price;

  // Discount computation
  const discountPercent =
    currentCompareAtPrice && currentCompareAtPrice > currentPrice
      ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
      : null;

  // Inventory & stock state of the selected variant
  const stockQuantity = selectedVariant ? selectedVariant.stock_quantity : 0;
  const lowStockThreshold = selectedVariant?.low_stock_threshold || 5;
  const isAvailable = stockQuantity > 0;

  // Quantity selection state
  const [quantity, setQuantity] = useState(1);

  // When variant changes, update selection and clamp quantity if needed
  const handleVariantSelect = (variant: StorefrontProductVariant) => {
    setSelectedVariant(variant);
    if (quantity > variant.stock_quantity && variant.stock_quantity > 0) {
      setQuantity(variant.stock_quantity);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs Navigation */}
      <ProductBreadcrumbs
        category={product.category}
        productName={product.name}
      />

      {/* Main Product Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Product Image Gallery (5 cols on lg, 6 on xl) */}
          <div className="lg:col-span-6 xl:col-span-6 sticky top-24">
            <ProductGallery
              images={product.images}
              productName={product.name}
              isFeatured={product.is_featured}
              discountPercent={discountPercent}
            />
          </div>

          {/* RIGHT COLUMN: Product Information & Purchase Station (6 cols on lg/xl) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-6">
            {/* Top Meta: Brand, Category, SKU */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {product.brand ? (
                    <Link
                      href={`/brands/${product.brand.slug}`}
                      className="font-bold text-violet-600 hover:text-violet-700 uppercase tracking-wider transition-colors"
                    >
                      {product.brand.name}
                    </Link>
                  ) : (
                    <span className="font-bold text-slate-400 uppercase tracking-wider">
                      3Line Gadgets
                    </span>
                  )}

                  {product.category && (
                    <>
                      <span className="text-slate-300">•</span>
                      <Link
                        href={`/categories/${product.category.slug}`}
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {product.category.name}
                      </Link>
                    </>
                  )}
                </div>

                {/* Subtle SKU belonging to selected variant */}
                {selectedVariant?.sku && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>

              {/* Primary H1 Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Star Rating / Reviews summary */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {(product.rating || 4.9).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({product.review_count || 42} verified reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-medium">
                  Verified Authentic
                </span>
              </div>
            </div>

            {/* Price Station */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <ProductPrice
                price={currentPrice}
                compareAtPrice={currentCompareAtPrice}
              />
            </div>

            {/* Short Description (if present) */}
            {product.short_description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Stock Availability Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Availability:
              </span>
              <ProductStockBadge
                stockQuantity={stockQuantity}
                lowStockThreshold={lowStockThreshold}
              />
            </div>

            {/* Variant Selector */}
            {activeVariants.length > 1 && (
              <ProductVariants
                variants={activeVariants}
                selectedVariantId={selectedVariant?.id || ''}
                onSelectVariant={handleVariantSelect}
              />
            )}

            {/* Quantity Selector */}
            <div className="pt-2">
              <ProductQuantity
                quantity={quantity}
                maxStock={stockQuantity}
                onChange={(q) => setQuantity(q)}
                disabled={!isAvailable}
              />
            </div>

            {/* Primary Purchase Actions: Add to Cart, Wishlist, Share */}
            <ProductActions
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              isAvailable={isAvailable}
            />

            {/* Trust & Service Benefits */}
            <ProductTrustBadges />
          </div>
        </div>

        {/* Detailed Description, Specifications & Shipping Tabs */}
        <ProductTabs product={product} />

        {/* Related Products Carousel / Grid */}
        <RelatedProductsSection
          products={relatedProducts}
          categorySlug={product.category?.slug}
          categoryName={product.category?.name}
        />
      </main>
    </div>
  );
}
