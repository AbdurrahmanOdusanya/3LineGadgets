// ==============================================================================
// 3LINE GADGETS — PRODUCT DETAILS PAGE
// app/products/[slug]/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/session';
import {
  getStorefrontProductBySlug,
  getRelatedProducts,
} from '@/lib/actions/storefront';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ProductDetailsClient } from '@/components/storefront/product/ProductDetailsClient';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product || !product.is_active) {
    return {
      title: 'Product Not Found | 3Line Gadgets',
      description: 'The requested gadget could not be found.',
    };
  }

  const primaryImage =
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80';

  const desc =
    product.short_description ||
    product.description?.slice(0, 160) ||
    `Buy authentic ${product.name} at 3Line Gadgets. Genuine imported electronics with official Lagos warranty and nationwide delivery.`;

  return {
    title: `${product.name} | 3Line Gadgets`,
    description: desc,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | 3Line Gadgets`,
      description: desc,
      url: `/products/${product.slug}`,
      type: 'website',
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | 3Line Gadgets`,
      description: desc,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getStorefrontProductBySlug(slug);

  // Safety & Active check
  if (!product || !product.is_active) {
    notFound();
  }

  const [relatedProducts, profile] = await Promise.all([
    getRelatedProducts(product.category?.slug, product.id, 4),
    getCurrentProfile(),
  ]);

  // JSON-LD Structured Data for Product SEO
  const defaultVariant = product.variants?.[0];
  const sellingPrice = defaultVariant ? defaultVariant.price : product.base_price;
  const inStock = defaultVariant
    ? defaultVariant.stock_quantity > 0
    : product.variants.some((v) => v.stock_quantity > 0);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description,
    image: product.images.map((img) => img.image_url),
    sku: defaultVariant?.sku || product.slug,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand.name,
        }
      : {
          '@type': 'Brand',
          name: '3Line Gadgets',
        },
    offers: {
      '@type': 'Offer',
      price: sellingPrice,
      priceCurrency: 'NGN',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://3linegadgets.ng/products/${product.slug}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Product Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Global Storefront Header & Navigation */}
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

      {/* Main Interactive Product Experience */}
      <ProductDetailsClient
        product={product}
        relatedProducts={relatedProducts}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Global Storefront Footer */}
      <StorefrontFooter />
    </div>
  );
}
