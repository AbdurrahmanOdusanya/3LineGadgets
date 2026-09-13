// ==============================================================================
// 3LINE GADGETS — SEARCH CATALOG PAGE
// app/search/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { getCurrentProfile } from '@/lib/auth/session';
import {
  getStorefrontCatalog,
  getStorefrontCategories,
  getStorefrontBrands,
} from '@/lib/actions/storefront';
import { ShopCatalogClient } from '@/components/storefront/ShopCatalogClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Gadgets — 3Line Gadgets',
  description: 'Search for genuine smartphones, MacBooks, audio gear, and accessories at 3Line Gadgets.',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;

  const query = resolvedParams.q ? resolvedParams.q.trim() : '';
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;

  const [catalogResult, categories, brands, profile] = await Promise.all([
    getStorefrontCatalog({
      page,
      limit: 12,
      search: query,
      categorySlug: resolvedParams.category,
      brandSlug: resolvedParams.brand,
      minPrice,
      maxPrice,
      stockStatus: resolvedParams.stock as any,
      sortBy: resolvedParams.sort as any,
    }),
    getStorefrontCategories(),
    getStorefrontBrands(),
    getCurrentProfile(),
  ]);

  const pageTitle = query ? `Search Results for "${query}"` : 'Browse Search Catalog';
  const pageDescription = query
    ? `Found ${catalogResult.totalCount} products matching your query "${query}".`
    : 'Search through our inventory of flagship phones, laptops, and premium audio equipment.';

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
        search: query,
        category: resolvedParams.category,
        brand: resolvedParams.brand,
        minPrice,
        maxPrice,
        stock: resolvedParams.stock,
        sort: resolvedParams.sort,
        page,
      }}
      title={pageTitle}
      description={pageDescription}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Search' },
      ]}
    />
  );
}
