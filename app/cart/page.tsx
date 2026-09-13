// ==============================================================================
// 3LINE GADGETS — SHOPPING CART PAGE
// app/cart/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/cart/cart-drawer';
import { CartPageContent } from '@/components/storefront/cart/cart-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shopping Cart — 3Line Gadgets',
  description:
    'Review items in your shopping bag and proceed to secure checkout for authentic smartphones, MacBooks, audio gear, and accessories.',
};

export default async function CartPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <StorefrontNavbar
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

      <main className="flex-1">
        <CartPageContent />
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
