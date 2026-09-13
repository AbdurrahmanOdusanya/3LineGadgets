// ==============================================================================
// 3LINE GADGETS — ADMIN EDIT PRODUCT PAGE
// app/admin/products/[id]/page.tsx
// ==============================================================================

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/session';
import { getAdminProductById } from '@/lib/actions/admin-products';
import { getAdminCategories } from '@/lib/actions/admin-categories';
import { getAdminBrands } from '@/lib/actions/admin-brands';
import { ProductForm } from '@/components/admin/ProductForm';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin('/admin/products');
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
    getAdminBrands(),
  ]);

  if (!product) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The gadget you are looking for might have been deleted or the ID is invalid.
        </p>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      <ProductForm
        initialData={product}
        categories={categories}
        brands={brands}
        isEditing={true}
      />
    </div>
  );
}
