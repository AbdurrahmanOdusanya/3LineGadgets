// ==============================================================================
// 3LINE GADGETS — PRODUCT CREATE & EDIT FORM COMPONENT
// components/admin/ProductForm.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plus,
  Trash2,
  UploadCloud,
  Star,
  Check,
  ArrowLeft,
  Sparkles,
  Info,
  Layers,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  createAdminProduct,
  updateAdminProduct,
} from '@/lib/actions/admin-products';
import { uploadProductImage } from '@/lib/actions/admin-storage';
import {
  slugify,
  generateSKU,
  formatNaira,
  calculateDiscount,
} from '@/lib/utils';
import type {
  ProductInput,
  ProductVariantInput,
  ProductImageInput,
} from '@/lib/validations/product';

interface ProductFormProps {
  initialData?: any;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  brands,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Base State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(Boolean(initialData?.slug));
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || '');
  const [brandId, setBrandId] = useState(initialData?.brand_id || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [basePrice, setBasePrice] = useState<number | string>(initialData?.base_price || '');
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(initialData?.compare_at_price || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);

  // Specifications (Dynamic Key/Value Pairs)
  const initialSpecs = initialData?.specifications || {};
  const [specList, setSpecList] = useState<Array<{ key: string; value: string }>>(
    Object.keys(initialSpecs).length > 0
      ? Object.entries(initialSpecs).map(([key, value]) => ({ key, value: String(value) }))
      : [
          { key: 'Display', value: '' },
          { key: 'Processor', value: '' },
          { key: 'RAM', value: '' },
          { key: 'Storage', value: '' },
          { key: 'Battery', value: '' },
        ]
  );

  // Variants State
  const defaultVariant: ProductVariantInput = {
    name: 'Standard',
    sku: '',
    price: 0,
    compareAtPrice: null,
    stockQuantity: 10,
    lowStockThreshold: 5,
    isActive: true,
  };

  const [variants, setVariants] = useState<ProductVariantInput[]>(
    initialData?.variants && initialData.variants.length > 0
      ? initialData.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: Number(v.price),
          compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
          stockQuantity: v.stock_quantity ?? 0,
          lowStockThreshold: v.low_stock_threshold ?? 5,
          isActive: v.is_active ?? true,
        }))
      : [defaultVariant]
  );

  // Images State
  const [images, setImages] = useState<ProductImageInput[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((img: any, idx: number) => ({
          id: img.id,
          imageUrl: img.image_url,
          altText: img.alt_text || '',
          sortOrder: img.sort_order ?? idx,
          isPrimary: img.is_primary ?? idx === 0,
          variantId: img.variant_id || null,
        }))
      : []
  );

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle Name change and auto-slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugCustom) {
      setSlug(slugify(val));
    }
  };

  // Add a spec pair
  const handleAddSpec = () => {
    setSpecList((prev) => [...prev, { key: '', value: '' }]);
  };

  // Update spec
  const handleUpdateSpec = (index: number, field: 'key' | 'value', val: string) => {
    setSpecList((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
  };

  // Remove spec
  const handleRemoveSpec = (index: number) => {
    setSpecList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Variant
  const handleAddVariant = () => {
    const newSku = generateSKU(name || 'Product', `Variant ${variants.length + 1}`);
    setVariants((prev) => [
      ...prev,
      {
        name: `Variant ${prev.length + 1}`,
        sku: newSku,
        price: Number(basePrice) || 0,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stockQuantity: 10,
        lowStockThreshold: 5,
        isActive: true,
      },
    ]);
  };

  // Update Variant field
  const handleUpdateVariant = (index: number, field: keyof ProductVariantInput, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Remove Variant
  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert('A product must have at least one variant.');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick Generate SKU for a variant
  const handleGenerateSkuForVariant = (index: number) => {
    const v = variants[index];
    const generated = generateSKU(name || '3Line Product', v.name);
    handleUpdateVariant(index, 'sku', generated);
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadProductImage(formData);
    setUploadingImage(false);

    if (res.success && res.url) {
      setImages((prev) => [
        ...prev,
        {
          imageUrl: res.url!,
          altText: name || 'Product image',
          sortOrder: prev.length,
          isPrimary: prev.length === 0,
        },
      ]);
    } else {
      setErrorMessage(res.error || 'Failed to upload image');
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput);
    } catch {
      setErrorMessage('Please enter a valid image URL');
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        imageUrl: imageUrlInput.trim(),
        altText: name || 'Product image',
        sortOrder: prev.length,
        isPrimary: prev.length === 0,
      },
    ]);
    setImageUrlInput('');
    setErrorMessage(null);
  };

  // Set primary image
  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      // Ensure at least one primary if items exist
      if (copy.length > 0 && !copy.some((img) => img.isPrimary)) {
        copy[0].isPrimary = true;
      }
      return copy;
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product name is required');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Please select a category');
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage('Full description must be at least 10 characters');
      return;
    }

    if (Number(basePrice) < 0 || isNaN(Number(basePrice))) {
      setErrorMessage('Base price must be a valid non-negative number');
      return;
    }

    // Build specifications object from specList
    const specsObject: Record<string, string> = {};
    for (const item of specList) {
      if (item.key.trim() && item.value.trim()) {
        specsObject[item.key.trim()] = item.value.trim();
      }
    }

    // Ensure variants have SKUs
    const formattedVariants = variants.map((v, i) => {
      let variantSku = v.sku.trim();
      if (!variantSku) {
        variantSku = generateSKU(name, v.name || `Var ${i + 1}`);
      }
      return {
        ...v,
        sku: variantSku,
        price: Number(v.price) >= 0 ? Number(v.price) : Number(basePrice),
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
        stockQuantity: Number(v.stockQuantity) >= 0 ? Number(v.stockQuantity) : 0,
        lowStockThreshold: Number(v.lowStockThreshold) >= 0 ? Number(v.lowStockThreshold) : 5,
      };
    });

    const payload: ProductInput = {
      name: name.trim(),
      slug: slugify(slug || name),
      categoryId,
      brandId: brandId || null,
      description: description.trim(),
      shortDescription: shortDescription.trim() || null,
      basePrice: Number(basePrice),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      specifications: specsObject,
      isActive,
      isFeatured,
      variants: formattedVariants,
      images: images.map((img, i) => ({
        ...img,
        sortOrder: i,
        isPrimary: img.isPrimary ?? i === 0,
      })),
    };

    setSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        const res = await updateAdminProduct(initialData.id, payload);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to update product');
        } else {
          setSuccessMessage('Product updated successfully!');
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 800);
        }
      } else {
        const res = await createAdminProduct(payload);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to create product');
        } else {
          setSuccessMessage('Product created successfully!');
          setTimeout(() => {
            router.push('/admin/products');
            router.refresh();
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const discount = calculateDiscount(basePrice, compareAtPrice);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" type="button">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Products
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {isEditing ? `Edit: ${initialData?.name || 'Product'}` : 'Create New Product'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure product details, dynamic specifications, variants, pricing, and images.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="ghost" type="button" disabled={submitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={submitting}
            className="shadow-xs font-semibold min-w-[140px]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1.5" />
                {isEditing ? 'Save Changes' : 'Create Product'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Unable to save product</p>
            <p className="text-xs text-rose-600 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2.5">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Info, Specs, Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">General Information</CardTitle>
              <CardDescription className="text-xs">
                Essential identification and descriptive metadata for the customer storefront.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apple iPhone 16 Pro Max"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">
                    URL Slug <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugCustom(false);
                      setSlug(slugify(name));
                    }}
                    className="text-[11px] text-violet-600 hover:underline"
                  >
                    Reset from name
                  </button>
                </div>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setIsSlugCustom(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. apple-iphone-16-pro-max"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Identifier used in storefront URLs: <code>/products/{slug || 'slug'}</code>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Brand
                  </label>
                  <Select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                  >
                    <option value="">None / Generic</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Short Description (Teaser)
                </label>
                <Input
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Compact summary displayed in product cards and search results"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Description <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Comprehensive product specifications, features, in-box contents, and warranty details..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Dynamic Technical Specifications (JSONB) */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Technical Specifications</CardTitle>
                <CardDescription className="text-xs">
                  Key/value attributes saved directly into the PostgreSQL JSONB specifications column.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSpec}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Spec
              </Button>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              {specList.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No technical specifications defined yet. Click &quot;Add Spec&quot; above.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {specList.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={spec.key}
                        onChange={(e) => handleUpdateSpec(index, 'key', e.target.value)}
                        placeholder="Key (e.g. Display, RAM)"
                        className="w-1/3"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                        placeholder="Value (e.g. 6.9-inch Super Retina XDR)"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Remove specification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Variants & SKUs */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Product Variants &amp; SKUs ({variants.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage distinct SKU codes, variant pricing, initial inventory, and thresholds.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Variant
              </Button>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Variant #{index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Variant Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={variant.name}
                        onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                        placeholder="e.g. Natural Titanium 256GB"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-slate-600">
                          SKU Code <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleGenerateSkuForVariant(index)}
                          className="text-[11px] text-violet-600 hover:underline"
                        >
                          Generate SKU
                        </button>
                      </div>
                      <Input
                        value={variant.sku}
                        onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value.toUpperCase())}
                        placeholder="e.g. 3LG-IP16-NAT-256"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Price (₦) <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleUpdateVariant(index, 'price', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Compare-at (₦)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.compareAtPrice || ''}
                        onChange={(e) => handleUpdateVariant(index, 'compareAtPrice', e.target.value ? e.target.value : null)}
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Stock Units
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stockQuantity}
                        onChange={(e) => handleUpdateVariant(index, 'stockQuantity', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Low Alert Limit
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.lowStockThreshold}
                        onChange={(e) => handleUpdateVariant(index, 'lowStockThreshold', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing, Images, Visibility */}
        <div className="space-y-6">
          {/* Card: Pricing */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">Storefront Pricing</CardTitle>
              <CardDescription className="text-xs">
                Base price displayed on catalog cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Base Price (₦) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="250000"
                  required
                />
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Preview: {formatNaira(basePrice)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Compare-at Price (Original MSRP)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="280000"
                />
                {discount && (
                  <div className="mt-2">
                    <Badge variant="success" className="text-xs">
                      {discount}% OFF Discount Displayed
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card: Product Images */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">Product Images ({images.length})</CardTitle>
              <CardDescription className="text-xs">
                Upload image files (up to 5MB) or enter image URLs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              {/* File Upload Trigger */}
              <div className="relative border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-violet-600" />
                  )}
                  <p className="text-xs font-medium text-slate-700">
                    {uploadingImage ? 'Uploading to Supabase Storage...' : 'Click or drop image to upload'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP or GIF (Max 5MB)
                  </p>
                </div>
              </div>

              {/* URL input fallback */}
              <div className="flex items-center gap-2">
                <Input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://... or picsum image URL"
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImageUrl}
                >
                  Add URL
                </Button>
              </div>

              {/* Images Preview List */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-square flex items-center justify-center"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.altText || 'Product'}
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Badge */}
                      {img.isPrimary && (
                        <div className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                          Primary
                        </div>
                      )}

                      {/* Controls overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(index)}
                            className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-violet-600"
                            title="Set as Primary"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Status & Visibility */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">Visibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Active Status</p>
                  <p className="text-[11px] text-slate-500">
                    Visible to customers in the catalog &amp; search
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                />
              </label>

              <div className="border-t border-slate-100 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Featured Product</p>
                    <p className="text-[11px] text-slate-500">
                      Highlighted in store homepage hero &amp; banners
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
