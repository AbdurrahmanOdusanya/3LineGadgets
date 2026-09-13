import type {Metadata} from 'next';
import { Manrope, Montserrat } from 'next/font/google';
import './globals.css'; // Global styles
import { AppProviders } from '@/components/providers/AppProviders';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '3Line Gadgets',
  description: 'Premium electronics and gadget importation and retail e-commerce store featuring authentic smartphones, laptops, audio gear, and accessories with nationwide delivery.',
  openGraph: {
    title: '3Line Gadgets',
    description: 'Premium electronics and gadget importation and retail e-commerce store featuring authentic smartphones, laptops, audio gear, and accessories with nationwide delivery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3Line Gadgets',
    description: 'Premium electronics and gadget importation and retail e-commerce store featuring authentic smartphones, laptops, audio gear, and accessories with nationwide delivery.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${manrope.variable} ${montserrat.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-violet-500 selection:text-white">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
