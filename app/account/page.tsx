// ==============================================================================
// 3LINE GADGETS — CUSTOMER ACCOUNT PORTAL
// app/account/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/session';
import { getCustomerOrders, getCustomerAddresses } from '@/lib/actions/account';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CustomerAccountView } from '@/components/account/CustomerAccountView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Account — 3Line Gadgets',
  description: 'Manage your customer orders, tracking details, delivery addresses, and profile.',
};

interface AccountPageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { user, profile } = await requireAuth('/account');
  const params = await searchParams;

  const [orders, addresses] = await Promise.all([
    getCustomerOrders(),
    getCustomerAddresses(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <StorefrontNavbar
        userProfile={{
          id: profile.id,
          full_name: profile.full_name,
          role: profile.role,
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <CustomerAccountView
          user={{
            id: user.id,
            email: user.email,
          }}
          profile={{
            id: profile.id,
            full_name: profile.full_name,
            phone: profile.phone,
            role: profile.role,
            avatar_url: profile.avatar_url,
            created_at: profile.created_at,
          }}
          orders={orders}
          addresses={addresses}
          initialTab={params.tab || 'overview'}
        />
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
