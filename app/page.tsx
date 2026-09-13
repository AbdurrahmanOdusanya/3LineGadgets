// ==============================================================================
// 3LINE GADGETS — STOREFRONT MAIN LANDING PAGE
// app/page.tsx
// ==============================================================================

import { getCurrentProfile } from '@/lib/auth/session';
import {
  getStorefrontFeaturedProducts,
  getStorefrontCategories,
} from '@/lib/actions/storefront';
import { StorefrontClient } from '@/components/storefront/StorefrontClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, profile] = await Promise.all([
    getStorefrontFeaturedProducts(),
    getStorefrontCategories(),
    getCurrentProfile(),
  ]);

  return (
    <StorefrontClient
      initialProducts={products}
      categories={categories}
      userProfile={
        profile
          ? {
              id: profile.id,
              full_name: profile.full_name,
              role: profile.role,
            }
          : null
      }
    />
  );
}
