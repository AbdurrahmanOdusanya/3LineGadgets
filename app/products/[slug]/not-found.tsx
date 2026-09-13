// ==============================================================================
// 3LINE GADGETS — PRODUCT NOT FOUND
// app/products/[slug]/not-found.tsx
// ==============================================================================

import Link from 'next/link';
import { PackageSearch, ArrowLeft, ShoppingBag } from 'lucide-react';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <StorefrontNavbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 mx-auto flex items-center justify-center">
            <PackageSearch className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Product Not Found
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We couldn’t find the gadget you’re looking for. It may have been discontinued, renamed, or is currently unavailable in our active catalog.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2"
            >
              <Link href="/shop">
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
