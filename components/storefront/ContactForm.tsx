// ==============================================================================
// 3LINE GADGETS — CONTACT FORM CLIENT COMPONENT
// components/storefront/ContactForm.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate reliable submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-violet-50/50 rounded-xl border border-violet-100 space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-slate-900 text-base">Message Sent Successfully!</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Thank you for reaching out, <span className="font-semibold">{formData.name}</span>. A representative from our Lagos desk has received your inquiry and will respond within 2 hours.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              subject: 'General Inquiry',
              message: '',
            });
          }}
          variant="outline"
          className="rounded-xl text-xs mt-2"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 block">
            Your Full Name *
          </label>
          <Input
            id="contact-name"
            required
            placeholder="e.g. Tunde Adebayo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-xl text-xs h-10 border-slate-200 focus:border-violet-600 focus:ring-violet-400 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 block">
            Email Address *
          </label>
          <Input
            id="contact-email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-xl text-xs h-10 border-slate-200 focus:border-violet-600 focus:ring-violet-400 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700 block">
            Phone / WhatsApp Number
          </label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="e.g. 08012345678"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="rounded-xl text-xs h-10 border-slate-200 focus:border-violet-600 focus:ring-violet-400 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 block">
            Inquiry Subject
          </label>
          <select
            id="contact-subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-xl text-xs h-10 px-3 bg-white border border-slate-200 focus:border-violet-600 focus:ring-violet-400 text-slate-800"
          >
            <option value="General Inquiry">General Product Inquiry</option>
            <option value="Order Tracking">Order &amp; Delivery Tracking</option>
            <option value="Warranty Claim">Warranty or Defect Assistance</option>
            <option value="Corporate Procurement">Corporate / Bulk Purchases</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700 block">
          Message *
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder="How can we assist you today? Please provide any relevant order ID if applicable."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xl p-3 text-xs border border-slate-200 focus:border-violet-600 focus:ring-violet-400 text-slate-800 outline-hidden bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
