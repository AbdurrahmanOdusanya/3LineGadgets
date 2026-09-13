// ==============================================================================
// 3LINE GADGETS — ORDER TRACKING & LOOKUP PAGE
// app/track-order/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { TrackOrderClient } from '@/components/storefront/TrackOrderClient';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Track Order — 3Line Gadgets',
  description: 'Track the delivery and dispatch status of your gadgets across Lagos and nationwide Nigeria.',
};

export default async function TrackOrderPage() {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Track Order</span>
        </nav>

        <TrackOrderClient />
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
