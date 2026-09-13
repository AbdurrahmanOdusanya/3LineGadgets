// ==============================================================================
// 3LINE GADGETS — PRODUCT DETAILS TABS / SECTIONS
// components/storefront/product/ProductTabs.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import type { StorefrontProduct } from '@/types/storefront';
import { ProductSpecifications } from './ProductSpecifications';
import { FileText, Cpu, PackageCheck, Truck, ShieldCheck } from 'lucide-react';

interface ProductTabsProps {
  product: StorefrontProduct;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const hasSpecs =
    product.specifications &&
    typeof product.specifications === 'object' &&
    Object.keys(product.specifications).length > 0;

  // Determine available tabs
  const tabs = [
    { id: 'description', label: 'Description', icon: FileText, available: Boolean(product.description) },
    { id: 'specs', label: 'Specifications', icon: Cpu, available: Boolean(hasSpecs) },
    { id: 'in_box', label: "What's in the Box", icon: PackageCheck, available: true },
    { id: 'shipping', label: 'Shipping & Warranty', icon: Truck, available: true },
  ].filter((t) => t.available);

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'description');

  return (
    <div className="w-full mt-12 pt-8 border-t border-slate-200">
      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-100 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              role="tab"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-6">
        {activeTab === 'description' && (
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              About the {product.name}
            </h3>
            <p className="whitespace-pre-line">{product.description}</p>
            {product.short_description && (
              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 text-violet-900 text-xs mt-4">
                <span className="font-bold">Key Highlight: </span>
                {product.short_description}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && hasSpecs && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Technical Specifications
            </h3>
            <ProductSpecifications specifications={product.specifications} />
          </div>
        )}

        {activeTab === 'in_box' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Included with Your Purchase
            </h3>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  <span>1x {product.name} (Factory sealed in original retail box)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  <span>Standard manufacturer accessories & charging cable</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  <span>Official documentation, safety guide & warranty registration card</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  <span>3Line Gadgets authentic verified seal & proof of purchase</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <h4>Nationwide Shipping Policy</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Orders placed before 2:00 PM West Africa Time (WAT) are processed the same business day. We deliver via tracked direct couriers across Lagos, Abuja, Port Harcourt, Ibadan, and all 36 Nigerian states.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h4>Standard Hardware Warranty</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every electronic gadget sold by 3Line Gadgets includes comprehensive protection against manufacturing defects. In the unlikely event of factory faults, contact support for prompt resolution.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
