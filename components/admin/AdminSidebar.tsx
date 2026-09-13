// ==============================================================================
// 3LINE GADGETS — ADMIN SIDEBAR NAVIGATION
// components/admin/AdminSidebar.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Boxes,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  Ticket,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  userProfile?: {
    full_name?: string | null;
    role?: string;
    avatar_url?: string | null;
  } | null;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  active: boolean;
  functional: boolean;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AdminSidebar({
  userProfile,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const navGroups: NavGroup[] = [

    {
      label: 'Core Management',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard,
          active: pathname === '/admin',
          functional: true,
        },
        {
          name: 'Products',
          href: '/admin/products',
          icon: Package,
          active: pathname.startsWith('/admin/products'),
          functional: true,
        },
        {
          name: 'Categories',
          href: '/admin/categories',
          icon: Layers,
          active: pathname.startsWith('/admin/categories'),
          functional: true,
        },
        {
          name: 'Brands',
          href: '/admin/brands',
          icon: Tag,
          active: pathname.startsWith('/admin/brands'),
          functional: true,
        },
        {
          name: 'Inventory',
          href: '/admin/inventory',
          icon: Boxes,
          active: pathname.startsWith('/admin/inventory'),
          functional: true,
        },
      ],
    },
    {
      label: 'Store Operations (Upcoming)',
      items: [
        {
          name: 'Orders',
          href: '#',
          icon: ShoppingCart,
          active: false,
          functional: false,
          badge: 'Soon',
        },
        {
          name: 'Customers',
          href: '#',
          icon: Users,
          active: false,
          functional: false,
          badge: 'Soon',
        },
        {
          name: 'Payments',
          href: '#',
          icon: CreditCard,
          active: false,
          functional: false,
          badge: 'Soon',
        },
        {
          name: 'Shipments',
          href: '#',
          icon: Truck,
          active: false,
          functional: false,
          badge: 'Soon',
        },
        {
          name: 'Coupons',
          href: '#',
          icon: Ticket,
          active: false,
          functional: false,
          badge: 'Soon',
        },
        {
          name: 'Settings',
          href: '#',
          icon: Settings,
          active: false,
          functional: false,
          badge: 'Soon',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  3Line
                </span>
                <span className="text-base font-medium text-violet-600">
                  Gadgets
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <span>Admin Console</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Link Groups */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <div className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  if (!item.functional) {
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 cursor-not-allowed opacity-60"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all',
                        item.active
                          ? 'bg-violet-50 text-violet-700 font-semibold border border-violet-100 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'h-4 w-4 transition-colors',
                            item.active ? 'text-violet-600' : 'text-slate-400'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.active && (
                        <ChevronRight className="h-4 w-4 text-violet-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* View Storefront Quick Link */}
        <div className="px-4 py-2 border-t border-slate-100">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              Customer Storefront
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">
              Live
            </span>
          </Link>
        </div>

        {/* Bottom Profile Bar */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-200/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white font-semibold text-xs">
                {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {userProfile?.full_name || 'Administrator'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-medium text-violet-700 uppercase">
                    {userProfile?.role || 'Admin'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-2xs transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
