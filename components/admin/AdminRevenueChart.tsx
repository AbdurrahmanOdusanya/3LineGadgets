// ==============================================================================
// 3LINE GADGETS — ADMIN REVENUE CHART (CLIENT COMPONENT)
// components/admin/AdminRevenueChart.tsx
// Inspired by modern dashboard reference layout with interactive tooltips
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

type Timeframe = 'monthly' | 'quarterly' | 'yearly';

interface DataPoint {
  label: string;
  revenue: number; // in millions of Naira or thousands
  target: number;
  diff: string;
  heightPercent: number; // 0 to 100
}

const DATA_BY_TIMEFRAME: Record<Timeframe, DataPoint[]> = {
  monthly: [
    { label: 'Feb', revenue: 42.5, target: 40.0, diff: '+6.2%', heightPercent: 52 },
    { label: 'Mar', revenue: 48.0, target: 45.0, diff: '+6.7%', heightPercent: 59 },
    { label: 'Apr', revenue: 60.0, target: 58.0, diff: '+3.3%', heightPercent: 74 },
    { label: 'May', revenue: 38.2, target: 42.0, diff: '-9.0%', heightPercent: 47 },
    { label: 'Jun', revenue: 45.0, target: 44.0, diff: '+2.3%', heightPercent: 55 },
    { label: 'Jul', revenue: 58.5, target: 50.0, diff: '+17.0%', heightPercent: 71 },
    { label: 'Aug', revenue: 68.0, target: 60.0, diff: '+13.3%', heightPercent: 83 },
    { label: 'Sep', revenue: 82.4, target: 72.0, diff: '+14.4%', heightPercent: 100 },
  ],
  quarterly: [
    { label: 'Q1', revenue: 135.5, target: 125.0, diff: '+8.4%', heightPercent: 62 },
    { label: 'Q2', revenue: 143.2, target: 135.0, diff: '+6.1%', heightPercent: 66 },
    { label: 'Q3', revenue: 208.9, target: 182.0, diff: '+14.8%', heightPercent: 96 },
    { label: 'Q4', revenue: 220.0, target: 200.0, diff: '+10.0%', heightPercent: 100 },
  ],
  yearly: [
    { label: '2023', revenue: 340.0, target: 300.0, diff: '+13.3%', heightPercent: 58 },
    { label: '2024', revenue: 450.0, target: 420.0, diff: '+7.1%', heightPercent: 76 },
    { label: '2025', revenue: 520.0, target: 480.0, diff: '+8.3%', heightPercent: 88 },
    { label: '2026', revenue: 645.0, target: 580.0, diff: '+11.2%', heightPercent: 100 },
  ],
};

export function AdminRevenueChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('monthly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(2); // Default to Apr to mirror screenshot

  const data = DATA_BY_TIMEFRAME[timeframe];
  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="p-6 pb-2">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight font-montserrat">
                E-Commerce Revenue Performance
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                <TrendingUp className="w-3 h-3" />
                +14.2% YoY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live gross merchandise value &amp; sales milestone fulfillment
            </p>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
            {(['monthly', 'quarterly', 'yearly'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => {
                  setTimeframe(tf);
                  setHoveredIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative mt-8 h-64 w-full">
          {/* Y-Axis Grid Lines & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-10 text-right">₦80M</span>
              <div className="flex-1 border-b border-dashed border-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-right">₦60M</span>
              <div className="flex-1 border-b border-dashed border-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-right">₦40M</span>
              <div className="flex-1 border-b border-dashed border-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-right">₦20M</span>
              <div className="flex-1 border-b border-dashed border-slate-200" />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 text-right">0</span>
              <div className="flex-1 border-b border-slate-200" />
            </div>
          </div>

          {/* Floating Tooltip (Mirrors the screenshot) */}
          {activeItem && hoveredIndex !== null && (
            <div
              className="absolute z-20 top-4 pointer-events-none transition-all duration-150 transform -translate-x-1/2 bg-white rounded-2xl border border-slate-200 p-3 shadow-xl shadow-slate-300/40 text-xs w-44"
              style={{
                left: `${((hoveredIndex + 0.5) / data.length) * 82 + 10}%`,
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                  {activeItem.label} 2026
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {activeItem.diff}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-violet-600" />
                    Revenue
                  </span>
                  <span className="font-bold text-slate-900">
                    ₦{activeItem.revenue.toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    Target
                  </span>
                  <span className="font-semibold text-slate-600">
                    ₦{activeItem.target.toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bars Container */}
          <div className="absolute inset-y-0 left-14 right-2 flex items-end justify-around pb-6 pt-2">
            {data.map((item, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <div
                  key={item.label}
                  className="group relative flex h-full flex-col items-center justify-end w-10 sm:w-14 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(idx)}
                >
                  {/* Subtle target marker behind */}
                  <div
                    className="absolute w-8 sm:w-10 rounded-t-xl bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ height: `${(item.target / 85) * 85}%` }}
                  />

                  {/* The Main Bar */}
                  <div
                    className={`w-6 sm:w-9 rounded-t-xl transition-all duration-300 ${
                      isHovered
                        ? 'bg-violet-600 shadow-md shadow-violet-500/30 scale-y-100'
                        : 'bg-violet-500 hover:bg-violet-600 opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      height: `${item.heightPercent}%`,
                    }}
                  />

                  {/* X-Axis Label */}
                  <span
                    className={`absolute -bottom-6 text-xs font-bold transition-colors ${
                      isHovered ? 'text-violet-600 font-black' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
            <span className="font-semibold text-slate-800">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="font-semibold text-slate-600">Projected Target</span>
          </div>
        </div>
        <div className="font-semibold text-slate-700">
          Average Order Value: <strong className="text-slate-900 font-bold">₦184,500</strong>
        </div>
      </div>
    </Card>
  );
}
