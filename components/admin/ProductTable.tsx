// ==============================================================================
// 3LINE GADGETS — PRODUCT DATA TABLE COMPONENT
// components/admin/ProductTable.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  toggleProductStatus,
  toggleProductFeatured,
  deleteAdminProduct,
} from '@/lib/actions/admin-products';
import { formatNaira, formatDate } from '@/lib/utils';

interface ProductTableProps {
  products: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
  filters: {
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: string;
    stockStatus?: string;
    isFeatured?: string;
  };
}

export function ProductTable({
  products,
  totalCount,
  currentPage,
  totalPages,
  categories,
  brands,
  filters,
}: ProductTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search input local state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Delete modal state
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Helper to push updated search parameters to the URL
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset to page 1 on filter changes
    if (key !== 'page') {
      params.set('page', '1');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchTerm.trim());
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleProductStatus(id, !currentStatus);
      router.refresh();
    });
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    startTransition(async () => {
      await toggleProductFeatured(id, !currentFeatured);
      router.refresh();
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    setDeleteError(null);

    const res = await deleteAdminProduct(deleteProduct.id);
    setDeleting(false);

    if (!res.success) {
      setDeleteError(res.error || 'Failed to delete product');
    } else {
      setDeleteProduct(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, model, or slug..."
              className="pl-9 h-10 w-full"
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full sm:w-auto h-10">
            Search
          </Button>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Category Filter */}
          <Select
            value={filters.categoryId || 'all'}
            onChange={(e) => updateQuery('categoryId', e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Brand Filter */}
          <Select
            value={filters.brandId || 'all'}
            onChange={(e) => updateQuery('brandId', e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>

          {/* Active Status Filter */}
          <Select
            value={filters.status || 'all'}
            onChange={(e) => updateQuery('status', e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>

          {/* Stock Status Filter */}
          <Select
            value={filters.stockStatus || 'all'}
            onChange={(e) => updateQuery('stockStatus', e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock</option>
          </Select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-700">
              No products found
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No products match your current search or filter criteria. Try clearing
              your filters or add a new gadget to the store.
            </p>
            <Link href="/admin/products/new" className="mt-4 inline-block">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product &amp; Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Variants / Stock</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const primaryImg =
                  product.images?.find((img: any) => img.is_primary)?.image_url ||
                  product.images?.[0]?.image_url ||
                  null;

                const variants = product.variants || [];
                const totalStock = variants.reduce(
                  (sum: number, v: any) => sum + (v.stock_quantity || 0),
                  0
                );
                const isOutOfStock = totalStock === 0;
                const isLowStock =
                  !isOutOfStock &&
                  variants.some(
                    (v: any) =>
                      v.stock_quantity <= (v.low_stock_threshold || 5) &&
                      v.stock_quantity > 0
                  );

                return (
                  <TableRow key={product.id}>
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center">
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </TableCell>

                    {/* Title, Brand, Category */}
                    <TableCell>
                      <div>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-semibold text-slate-900 hover:text-violet-600 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span className="font-medium text-slate-600">
                            {product.brand?.name || 'Generic'}
                          </span>
                          <span>•</span>
                          <span>{product.category?.name || 'Uncategorized'}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-slate-400">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div className="font-semibold text-slate-900">
                        {formatNaira(product.base_price)}
                      </div>
                      {product.compare_at_price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatNaira(product.compare_at_price)}
                        </span>
                      )}
                    </TableCell>

                    {/* Variants & Stock Status */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-700">
                          {variants.length} variant{variants.length !== 1 ? 's' : ''}
                        </span>
                        <span>•</span>
                        {isOutOfStock ? (
                          <Badge variant="outOfStock" className="text-[10px]">
                            Out of Stock
                          </Badge>
                        ) : isLowStock ? (
                          <Badge variant="lowStock" className="text-[10px]">
                            {totalStock} (Low)
                          </Badge>
                        ) : (
                          <Badge variant="inStock" className="text-[10px]">
                            {totalStock} in stock
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono truncate max-w-[200px]">
                        SKUs: {variants.map((v: any) => v.sku).join(', ') || 'None'}
                      </div>
                    </TableCell>

                    {/* Featured toggle */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.is_featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
                        }`}
                        title={product.is_featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Star
                          className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`}
                        />
                      </button>
                    </TableCell>

                    {/* Active Status toggle */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          product.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {product.is_active ? 'Active' : 'Draft'}
                      </button>
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2.5">
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteProduct(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing page <strong className="text-slate-800">{currentPage}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total products)
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateQuery('page', String(currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateQuery('page', String(currentPage + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteProduct)} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Product Deletion
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Are you sure you want to delete &quot;{deleteProduct?.name}&quot;?
              This action will delete all associated variants and image records.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{deleteError}</span>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteProduct(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Confirm Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
