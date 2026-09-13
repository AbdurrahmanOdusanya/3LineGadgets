// ==============================================================================
// 3LINE GADGETS — STOREFRONT NAVBAR
// components/storefront/StorefrontNavbar.tsx
// ==============================================================================

'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StorefrontNavbarProps {
  userProfile?: {
    id: string;
    full_name?: string | null;
    role?: string | null;
  } | null;
}

const emptySubscribe = () => () => {};

export function StorefrontNavbar({ userProfile }: StorefrontNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Cart', href: '/cart' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/shop?deals=true' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const quickCategories = [
    { name: 'Smartphones & Tablets', href: '/categories/smartphones-tablets' },
    { name: 'Laptops & Computers', href: '/categories/laptops-computers' },
    { name: 'Audio & Sound', href: '/categories/audio-sound' },
    { name: 'Wearables & Smart Home', href: '/categories/wearables-smart-home' },
    { name: 'Power & Accessories', href: '/categories/power-accessories' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-18 flex items-center justify-between gap-4 sm:gap-6">
            {/* Left: Brand Logo */}
            <Link
              href="/"
              className="flex items-center text-slate-900 group shrink-0"
            >
              <span className="leading-tight font-black tracking-tight text-xl uppercase text-slate-900 font-montserrat">
                3Line<span className="text-violet-600">Gadgets</span>
              </span>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 font-manrope">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href.split('?')[0]);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? 'text-violet-600 font-semibold'
                        : 'text-slate-600 hover:text-violet-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Wishlist, Cart & Account */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Desktop Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center relative w-56 lg:w-68"
              >
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border-slate-200/80 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all h-9"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Admin Button if user is Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                href="/shop?filter=wishlist"
                aria-label="Wishlist"
                className="relative p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
                {isClient && wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                id="storefront-cart-button"
                onClick={openCart}
                aria-label="Shopping Cart"
                className="relative p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {isClient && itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Button */}
              <Link
                href="/account"
                aria-label="Account"
                className="p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-slate-900 font-bold"
                >
                  <span className="font-black tracking-tight font-montserrat uppercase text-base">
                    3Line<span className="text-violet-600">Gadgets</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </form>

              {/* Main Links */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>

              {/* Quick Categories */}
              <div className="space-y-1 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                  Categories
                </p>
                {quickCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-violet-600 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>

              {/* Account & Admin Console Shortcuts */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-600" />
                    <span>My Customer Account</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-violet-600" />
                      <span>Admin Console</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Support info */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Need Assistance?
              </p>
              <p>Call or WhatsApp our Lagos support desk:</p>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-violet-600 hover:underline"
              >
                +234 812 345 6789
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
