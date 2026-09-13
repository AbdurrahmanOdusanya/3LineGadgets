// ==============================================================================
// 3LINE GADGETS — CATEGORY CATALOG PAGE
// app/categories/[slug]/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/session';
import {
  getStorefrontCatalog,
  getStorefrontCategories,
  getStorefrontBrands,
  getStorefrontCategoryBySlug,
} from '@/lib/actions/storefront';
import { ShopCatalogClient } from '@/components/storefront/ShopCatalogClient';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    sort?: string;
    page?: string;
    deals?: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getStorefrontCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found — 3Line Gadgets',
    };
  }

  return {
    title: `${category.name} — 3Line Gadgets`,
    description:
      category.description ||
      `Shop authentic ${category.name} with fast delivery and warranty across Nigeria.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;

  const category = await getStorefrontCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;
  const onlyDeals = resolvedParams.deals === 'true';

  const [catalogResult, categories, brands, profile] = await Promise.all([
    getStorefrontCatalog({
      page,
      limit: 12,
      categorySlug: category.slug,
      brandSlug: resolvedParams.brand,
      search: resolvedParams.search,
      minPrice,
      maxPrice,
      stockStatus: resolvedParams.stock as any,
      sortBy: resolvedParams.sort as any,
      onlyDeals,
    }),
    getStorefrontCategories(),
    getStorefrontBrands(),
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
        category: category.slug,
        brand: resolvedParams.brand,
        search: resolvedParams.search,
        minPrice,
        maxPrice,
        stock: resolvedParams.stock,
        sort: resolvedParams.sort,
        page,
        deals: onlyDeals,
      }}
      title={category.name}
      description={
        category.description ||
        `Explore all imported ${category.name} available for same-day dispatch in Lagos and tracked shipping across Nigeria.`
      }
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: category.name },
      ]}
    />
  );
}
