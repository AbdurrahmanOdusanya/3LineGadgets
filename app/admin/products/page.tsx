// ==============================================================================
// 3LINE GADGETS — ADMIN PRODUCTS LIST PAGE
// app/admin/products/page.tsx
// ==============================================================================

import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import { getAdminProducts } from '@/lib/actions/admin-products';
import { getAdminCategories } from '@/lib/actions/admin-categories';
import { getAdminBrands } from '@/lib/actions/admin-brands';
import { ProductTable } from '@/components/admin/ProductTable';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    brandId?: string;
    status?: 'all' | 'active' | 'inactive';
    stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
    isFeatured?: 'all' | 'featured' | 'standard';
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requireAdmin('/admin/products');
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const categoryId = params.categoryId || 'all';
  const brandId = params.brandId || 'all';
  const status = params.status || 'all';
  const stockStatus = params.stockStatus || 'all';
  const isFeatured = params.isFeatured || 'all';

  // Parallel data fetching
  const [productData, categories, brands] = await Promise.all([
    getAdminProducts({
      page,
      limit: 10,
      search,
      categoryId,
      brandId,
      status,
      stockStatus,
      isFeatured,
    }),
    getAdminCategories(),
    getAdminBrands(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Catalog
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
              {productData.totalCount} items
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Create, edit, search, and track pricing, specifications, variants, and stock.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button className="shadow-xs font-semibold">
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Interactive Products Table */}
      <ProductTable
        products={productData.products}
        totalCount={productData.totalCount}
        currentPage={productData.page}
        totalPages={productData.totalPages}
        categories={categories}
        brands={brands}
        filters={{
          search,
          categoryId,
          brandId,
          status,
          stockStatus,
          isFeatured,
        }}
      />
    </div>
  );
}
