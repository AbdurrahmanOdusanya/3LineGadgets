// ==============================================================================
// 3LINE GADGETS — CHECKOUT ROUTE PAGE
// app/checkout/page.tsx
// ==============================================================================

import type { Metadata } from 'next';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CheckoutClient } from '@/components/storefront/checkout/CheckoutClient';
import { getCurrentProfile } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Checkout — Manual Bank Transfer | 3Line Gadgets',
  description: 'Complete your gadget order with verified manual bank transfer. Get instant order tracking code.',
};

export default async function CheckoutPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
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
        <CheckoutClient />
      </main>
      <StorefrontFooter />
    </div>
  );
}
