// ==============================================================================
// 3LINE GADGETS — CATEGORIES DIRECTORY PAGE
// app/categories/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentProfile } from '@/lib/auth/session';
import { getStorefrontCategories } from '@/lib/actions/storefront';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ValueProps } from '@/components/storefront/ValueProps';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Browse Categories — 3Line Gadgets',
  description:
    'Explore gadgets by category: Smartphones & Tablets, Laptops & Computers, Audio & Sound, Wearables & Smart Home, and Power Accessories.',
};

export default async function CategoriesPage() {
  const [categories, profile] = await Promise.all([
    getStorefrontCategories(),
    getCurrentProfile(),
  ]);

  const activeCategories = categories.filter((c) => c.slug !== 'all');

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 w-full">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Categories</span>
        </nav>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tech Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Browse by Category
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Choose from our curated collection of genuine imported gadgets. Every device comes with factory packaging and our Lagos warranty.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/categories/${cat.slug}`}
              className="group rounded-3xl bg-white border border-slate-100 hover:border-violet-200 p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Category Image */}
                <div className="relative w-full aspect-video rounded-2xl bg-slate-50 flex items-center justify-center p-6 overflow-hidden">
                  <Image
                    src={
                      cat.image_url ||
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-4"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {cat.name}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">
                      {cat.itemCount} {cat.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600 group-hover:text-violet-700">
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Value Props */}
        <div className="pt-8">
          <ValueProps />
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
