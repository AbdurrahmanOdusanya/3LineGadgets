// ==============================================================================
// 3LINE GADGETS — STOREFRONT FOOTER
// components/storefront/StorefrontFooter.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export function StorefrontFooter() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-100 text-slate-600">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center text-slate-900 group">
              <span className="font-black text-xl tracking-tight uppercase font-montserrat">
                3Line<span className="text-violet-600">Gadgets</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Nigeria&apos;s trusted destination for authentic imported flagship gadgets, developer workstations, and studio-grade audio gear. 100% factory sealed with 1-year warranty.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                <span>Otigba Street, Computer Village, Ikeja, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-violet-600 shrink-0" />
                <span>+234 812 345 6789 (WhatsApp &amp; Calls)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-violet-600 shrink-0" />
                <span>support@3linegadgets.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/smartphones-tablets" className="hover:text-violet-600 transition-colors">
                  Smartphones &amp; Tablets
                </Link>
              </li>
              <li>
                <Link href="/categories/laptops-computers" className="hover:text-violet-600 transition-colors">
                  Laptops &amp; MacBooks
                </Link>
              </li>
              <li>
                <Link href="/categories/audio-sound" className="hover:text-violet-600 transition-colors">
                  Audio &amp; Headphones
                </Link>
              </li>
              <li>
                <Link href="/categories/wearables-smart-home" className="hover:text-violet-600 transition-colors">
                  Smartwatches &amp; Wearables
                </Link>
              </li>
              <li>
                <Link href="/categories/power-accessories" className="hover:text-violet-600 transition-colors">
                  Power Banks &amp; GaN Chargers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-violet-600 transition-colors">
                  Shop All Gadgets
                </Link>
              </li>
              <li>
                <Link href="/shop?deals=true" className="hover:text-violet-600 transition-colors">
                  Flash Deals &amp; Discounts
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-violet-600 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-violet-600 transition-colors">
                  Warranty &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-violet-600 transition-colors">
                  Merchant / Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Ancillary Links */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} 3Line Gadgets. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-violet-600 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/account" className="hover:text-violet-600 transition-colors">
              Customer Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
