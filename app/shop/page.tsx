// ==============================================================================
// 3LINE GADGETS — SHOP CATALOG PAGE
// app/shop/page.tsx
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
  title: 'Shop Catalog — 3Line Gadgets',
  description:
    'Browse our complete catalog of authentic imported smartphones, MacBooks, laptops, noise-canceling audio gear, and accessories.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    stock?: string;
    sort?: string;
    page?: string;
    deals?: string;
    filter?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;

  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;
  const onlyDeals = resolvedParams.deals === 'true' || resolvedParams.filter === 'deals';

  const [catalogResult, categories, brands, profile] = await Promise.all([
    getStorefrontCatalog({
      page,
      limit: 12,
      categorySlug: resolvedParams.category,
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
        category: resolvedParams.category,
        brand: resolvedParams.brand,
        search: resolvedParams.search,
        minPrice,
        maxPrice,
        stock: resolvedParams.stock,
        sort: resolvedParams.sort,
        page,
        deals: onlyDeals,
      }}
      title={onlyDeals ? 'Flash Deals & Discounts' : 'All Gadgets & Tech'}
      description={
        onlyDeals
          ? 'Special limited-time offers on genuine imported gadgets with official Lagos warranty.'
          : 'Browse all available smartphones, laptops, studio headphones, and high-wattage power accessories.'
      }
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: onlyDeals ? 'Deals' : 'Shop' },
      ]}
    />
  );
}
