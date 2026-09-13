// ==============================================================================
// 3LINE GADGETS — BRAND CATALOG PAGE
// app/brands/[slug]/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/session';
import {
  getStorefrontCatalog,
  getStorefrontCategories,
  getStorefrontBrands,
} from '@/lib/actions/storefront';
import { ShopCatalogClient } from '@/components/storefront/ShopCatalogClient';

export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brands = await getStorefrontBrands();
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    return {
      title: 'Brand Not Found — 3Line Gadgets',
    };
  }

  return {
    title: `${brand.name} Products — 3Line Gadgets`,
    description: `Shop authentic ${brand.name} gadgets with official Lagos warranty and fast delivery across Nigeria.`,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const brands = await getStorefrontBrands();
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) {
    notFound();
  }

  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;

  const [catalogResult, categories, profile] = await Promise.all([
    getStorefrontCatalog({
      page,
      limit: 12,
      brandSlug: brand.slug,
      categorySlug: resolvedParams.category,
      search: resolvedParams.search,
      minPrice,
      maxPrice,
      stockStatus: resolvedParams.stock as any,
      sortBy: resolvedParams.sort as any,
    }),
    getStorefrontCategories(),
    getCurrentProfile(),
  ]);

  return (
    <ShopCatalogClient
      catalogResult={catalogResult}
      categories={categories}
      brands={brands}
      userProfile={
        profile
          ? {
              id: profile.id,
              full_name: profile.full_name,
              role: profile.role,
            }
          : null
      }
      currentParams={{
        brand: brand.slug,
        category: resolvedParams.category,
        search: resolvedParams.search,
        minPrice,
        maxPrice,
        stock: resolvedParams.stock,
        sort: resolvedParams.sort,
        page,
      }}
      title={`${brand.name} Collection`}
      description={`Official genuine imported ${brand.name} devices, laptops, smartphones, and accessories with nationwide Lagos delivery.`}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: brand.name },
      ]}
    />
  );
}
