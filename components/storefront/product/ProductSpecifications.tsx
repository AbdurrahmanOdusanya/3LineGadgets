// ==============================================================================
// 3LINE GADGETS — PRODUCT SPECIFICATIONS TABLE
// components/storefront/product/ProductSpecifications.tsx
// ==============================================================================

import React from 'react';

interface ProductSpecificationsProps {
  specifications?: Record<string, any> | null;
}

function formatSpecValue(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.map((item) => formatSpecValue(item)).join(', ');
  if (typeof val === 'object') {
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${formatSpecValue(v)}`)
      .join('; ');
  }
  return String(val);
}

function formatSpecLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (!specifications || typeof specifications !== 'object') {
    return null;
  }

  const entries = Object.entries(specifications).filter(
    ([_, value]) => value !== null && value !== undefined && value !== ''
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-5 font-semibold text-slate-700 w-1/3">
                Specification
              </th>
              <th className="py-3 px-5 font-semibold text-slate-700 w-2/3">
                Details / Values
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map(([key, value], idx) => (
              <tr
                key={key}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
              >
                <td className="py-3.5 px-5 font-medium text-slate-800 align-top">
                  {formatSpecLabel(key)}
                </td>
                <td className="py-3.5 px-5 text-slate-600 leading-relaxed align-top">
                  {formatSpecValue(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
