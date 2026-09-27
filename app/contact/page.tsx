// ==============================================================================
// 3LINE GADGETS — CONTACT SUPPORT PAGE
// app/contact/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ChevronRight, Mail, MapPin, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/storefront/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Support — 3Line Gadgets',
  description: 'Reach our Lagos customer service desk for orders, tracking inquiries, corporate quotes, and warranty support.',
};

export default async function ContactPage() {
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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-montserrat">
            We’re Here to Help
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-manrope">
            Have a question about an order, delivery timing in Lagos, gadget compatibility, or bulk corporate procurement? Connect with our support team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">WhatsApp Support</h3>
            <p className="text-xs text-slate-500">Fastest response for order status and device recommendations.</p>
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-bold text-emerald-600 hover:underline"
            >
              +234 (0) 812 345 6789
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Email Inquiries</h3>
            <p className="text-xs text-slate-500">Invoices, warranty claims, and corporate purchasing.</p>
            <a
              href="mailto:support@3linegadgets.com"
              className="inline-block text-sm font-bold text-violet-600 hover:underline"
            >
              support@3linegadgets.com
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Lagos Hub</h3>
            <p className="text-xs text-slate-500">Ikeja / Victoria Island pickup & dispatch centers.</p>
            <p className="text-sm font-semibold text-slate-800">Otigba Street, Computer Village, Ikeja, Lagos</p>
          </div>
        </div>

        {/* Contact Form and FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
            <p className="text-xs text-slate-500 mb-6">Fill out the form below and our team will get back to you within 2 hours during business hours.</p>
            <ContactForm />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-600" /> Operating Hours
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex justify-between">
                  <span className="font-medium text-slate-700">Monday – Friday:</span>
                  <span>8:00 AM – 7:00 PM (WAT)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-slate-700">Saturday:</span>
                  <span>9:00 AM – 5:00 PM (WAT)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium text-slate-700">Sunday:</span>
                  <span>Online Orders & Automated Dispatch</span>
                </li>
              </ul>
            </div>

            <div className="bg-violet-50/70 p-6 rounded-2xl border border-violet-100 space-y-3">
              <h3 className="font-bold text-violet-950 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" /> Tracking an Existing Order?
              </h3>
              <p className="text-xs text-violet-900/80">
                You can check live dispatch status, delivery courier notes, and estimated delivery times using our real-time tracker.
              </p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline"
              >
                <span>Go to Order Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
