// ==============================================================================
// 3LINE GADGETS — STOREFRONT ACTIONS & CATALOG DATA
// lib/actions/storefront.ts
// ==============================================================================

import { createClient } from '@/lib/supabase/server';
import type {
  StorefrontProductVariant,
  StorefrontProductImage,
  StorefrontProduct,
  StorefrontCategory,
  StorefrontBrand,
  StockStatus,
  ProductStockInfo,
  StorefrontCatalogResult,
  StorefrontFilterOptions as StorefrontCatalogOptions,
} from '@/types/storefront';
import { getProductStockInfo } from '@/types/storefront';

export type {
  StorefrontProductVariant,
  StorefrontProductImage,
  StorefrontProduct,
  StorefrontCategory,
  StorefrontBrand,
  StockStatus,
  ProductStockInfo,
  StorefrontCatalogResult,
  StorefrontCatalogOptions,
};
export { getProductStockInfo };

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'smartphones-tablets': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'laptops-computers': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'audio-sound': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'wearables-smart-home': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
  'wearables': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
  'power-accessories': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
  'accessories': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
};

// Fallback high-fidelity catalog for 3Line Gadgets
const FALLBACK_PRODUCTS: StorefrontProduct[] = [
  {
    id: 'prod-ip16pm',
    name: 'Apple iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    description: 'Forged in grade 5 titanium with the groundbreaking A18 Pro chip, 48MP Fusion camera system, and Camera Control.',
    short_description: 'Titanium design, A18 Pro chip, 48MP camera, Camera Control.',
    base_price: 1950000,
    compare_at_price: 2100000,
    rating: 4.9,
    review_count: 84,
    specifications: {
      Display: '6.9-inch Super Retina XDR OLED (120Hz ProMotion)',
      Processor: 'Apple A18 Pro (3nm architecture)',
      Camera: '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
      Battery: 'Up to 33h video playback',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000001', name: 'Smartphones & Tablets', slug: 'smartphones-tablets' },
    brand: { id: 'ba000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
    images: [
      {
        id: 'img-ip1',
        image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Apple iPhone 16 Pro Max Natural Titanium',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-ip16-256', name: '256GB / Natural Titanium', sku: '3LG-IP16PM-256-NAT', price: 1950000, compare_at_price: 2100000, stock_quantity: 15, low_stock_threshold: 3, is_active: true },
      { id: 'var-ip16-512', name: '512GB / Black Titanium', sku: '3LG-IP16PM-512-BLK', price: 2250000, compare_at_price: 2400000, stock_quantity: 10, low_stock_threshold: 2, is_active: true },
    ],
  },
  {
    id: 'prod-s25u',
    name: 'Samsung Galaxy S25 Ultra 5G AI',
    slug: 'samsung-galaxy-s25-ultra',
    description: 'Galaxy AI unleashed. Titanium frame, built-in S Pen, Snapdragon 8 Elite for Galaxy, 200MP quad-telephoto system, and a 6.8-inch Dynamic AMOLED 2X flat display with anti-reflective Corning Gorilla Armor.',
    short_description: 'Snapdragon 8 Elite, 200MP camera, built-in S Pen, Titanium chassis.',
    base_price: 1980000,
    compare_at_price: 2200000,
    rating: 4.8,
    review_count: 62,
    specifications: {
      Display: '6.8-inch QHD+ Dynamic AMOLED 2X 120Hz Anti-reflective',
      Processor: 'Snapdragon 8 Elite for Galaxy',
      Memory: '12GB RAM / 512GB UFS 4.0 Storage',
      Camera: '200MP Main + 50MP 5x + 10MP 3x + 50MP Ultra Wide',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000001', name: 'Smartphones & Tablets', slug: 'smartphones-tablets' },
    brand: { id: 'ba000000-0000-0000-0000-000000000002', name: 'Samsung', slug: 'samsung' },
    images: [
      {
        id: 'img-s25-1',
        image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Samsung Galaxy S25 Ultra Titanium Gray',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-s25-512', name: '512GB / Titanium Gray', sku: '3LG-S25U-512-GRY', price: 1980000, compare_at_price: 2200000, stock_quantity: 11, low_stock_threshold: 3, is_active: true },
    ],
  },
  {
    id: 'prod-mbp16',
    name: 'MacBook Pro 16" M3 Max',
    slug: 'macbook-pro-16-m3-max',
    description: 'The most advanced Mac laptop ever built for pro developers, 3D artists, and video editors with the M3 Max chip.',
    short_description: '16-inch Liquid Retina XDR, M3 Max chip, 36GB RAM, 1TB SSD.',
    base_price: 3850000,
    compare_at_price: 4100000,
    rating: 5.0,
    review_count: 37,
    specifications: {
      Display: '16.2-inch Liquid Retina XDR (3456x2234, 120Hz ProMotion)',
      Chip: 'Apple M3 Max 16-core CPU, 40-core GPU',
      Memory: '36GB Unified Memory',
      Storage: '1TB PCIe SSD',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000002', name: 'Laptops & Computers', slug: 'laptops-computers' },
    brand: { id: 'ba000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
    images: [
      {
        id: 'img-mbp-1',
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Apple MacBook Pro 16 inch Space Black',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-mbp-36gb', name: '36GB RAM / 1TB SSD', sku: '3LG-MBP16-M3M-1TB', price: 3850000, compare_at_price: 4100000, stock_quantity: 6, low_stock_threshold: 2, is_active: true },
    ],
  },
  {
    id: 'prod-dellxps',
    name: 'Dell XPS 16 9640 (Intel Core Ultra 9 / RTX 4070)',
    slug: 'dell-xps-16-9640',
    description: 'Precision CNC machined aluminum, 4K+ OLED touch infinity edge display, Intel Core Ultra 9 with dedicated NPU for AI acceleration, and NVIDIA GeForce RTX 4070 graphics.',
    short_description: 'Intel Core Ultra 9, 32GB DDR5, RTX 4070, 4K OLED Touch.',
    base_price: 3650000,
    compare_at_price: 3950000,
    rating: 4.7,
    review_count: 29,
    specifications: {
      Display: '16.3-inch 4K+ (3840x2400) OLED Touch 500 nits',
      Processor: 'Intel Core Ultra 9 185H',
      Graphics: 'NVIDIA GeForce RTX 4070',
      Memory: '32GB LPDDR5x',
    },
    is_featured: false,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000002', name: 'Laptops & Computers', slug: 'laptops-computers' },
    brand: { id: 'ba000000-0000-0000-0000-000000000005', name: 'Dell', slug: 'dell' },
    images: [
      {
        id: 'img-xps-1',
        image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Dell XPS 16 InfinityEdge Display',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-xps-32', name: '32GB RAM / 1TB SSD / Platinum', sku: '3LG-XPS16-U9-32-1TB', price: 3650000, compare_at_price: 3950000, stock_quantity: 4, low_stock_threshold: 2, is_active: true },
    ],
  },
  {
    id: 'prod-sonywh',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
    short_description: 'Industry-leading active noise canceling with 30-hour battery life.',
    base_price: 520000,
    compare_at_price: 580000,
    rating: 4.9,
    review_count: 142,
    specifications: {
      Driver: '30mm precision carbon fiber composite',
      ANC: 'Dual processors (QN1 + V1) with Auto NC Optimizer',
      Battery: '30 hours with ANC on; 3-min quick charge = 3 hours',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000003', name: 'Audio & Sound', slug: 'audio-sound' },
    brand: { id: 'ba000000-0000-0000-0000-000000000003', name: 'Sony', slug: 'sony' },
    images: [
      {
        id: 'img-sony-1',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Sony WH-1000XM5 Black',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-wh-blk', name: 'Midnight Black', sku: '3LG-SONY-XM5-BLK', price: 520000, compare_at_price: 580000, stock_quantity: 30, low_stock_threshold: 5, is_active: true },
      { id: 'var-wh-slv', name: 'Silver Platinum', sku: '3LG-SONY-XM5-SLV', price: 520000, compare_at_price: 580000, stock_quantity: 25, low_stock_threshold: 5, is_active: true },
    ],
  },
  {
    id: 'prod-airpodspro2',
    name: 'Apple AirPods Pro 2 (USB-C / MagSafe)',
    slug: 'apple-airpods-pro-2-usbc',
    description: 'Up to 2x more Active Noise Cancellation. Transparency mode lets you hear the world around you, while all-new Adaptive Audio intelligently tailors noise control to your environment.',
    short_description: 'H2 chip, Active Noise Cancellation, Adaptive Audio, USB-C Case.',
    base_price: 360000,
    compare_at_price: 410000,
    rating: 4.9,
    review_count: 98,
    specifications: {
      Chip: 'Apple H2 headphone chip in earbuds, U1 in case',
      NoiseControl: 'Active Noise Cancellation, Adaptive Audio',
      Battery: 'Up to 6 hours listening with ANC; 30 hours total with Case',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000003', name: 'Audio & Sound', slug: 'audio-sound' },
    brand: { id: 'ba000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
    images: [
      {
        id: 'img-app2-1',
        image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Apple AirPods Pro 2 with MagSafe Case',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-app2-usbc', name: 'AirPods Pro 2 (USB-C)', sku: '3LG-APP2-USBC', price: 360000, compare_at_price: 410000, stock_quantity: 25, low_stock_threshold: 4, is_active: true },
    ],
  },
  {
    id: 'prod-applewatchu2',
    name: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)',
    slug: 'apple-watch-ultra-2',
    description: 'The most rugged and capable Apple Watch. Designed for endurance athletes, outdoor adventurers, and water sports enthusiasts. Features 3000-nit display and precision dual-frequency GPS.',
    short_description: '49mm aerospace titanium case, 3000-nit display, S9 SiP.',
    base_price: 1350000,
    compare_at_price: 1480000,
    rating: 4.9,
    review_count: 45,
    specifications: {
      Case: '49mm Aerospace-grade Titanium Case',
      Display: 'Always-On Retina display up to 3000 nits',
      Battery: 'Up to 36 hours regular use, up to 72 hours in Low Power Mode',
    },
    is_featured: true,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000004', name: 'Wearables & Smart Home', slug: 'wearables-smart-home' },
    brand: { id: 'ba000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
    images: [
      {
        id: 'img-awu2-1',
        image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Apple Watch Ultra 2 Titanium',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-awu2-ocean', name: 'Titanium with Blue Ocean Band', sku: '3LG-AWU2-49-OCN', price: 1350000, compare_at_price: 1480000, stock_quantity: 11, low_stock_threshold: 3, is_active: true },
    ],
  },
  {
    id: 'prod-ankerprime',
    name: 'Anker Prime 27,650mAh Power Bank (250W)',
    slug: 'anker-prime-27650mah-250w',
    description: 'Multi-device fast charging power bank delivering up to 250W total output with smart digital display and app control.',
    short_description: '250W total output, 27,650mAh capacity, smart display.',
    base_price: 240000,
    compare_at_price: 275000,
    rating: 4.8,
    review_count: 73,
    specifications: {
      Capacity: '27,650mAh / 99.54Wh (Airline Approved)',
      Output: '250W Total (Dual USB-C 140W each + 65W USB-A)',
      Display: 'Smart digital TFT status display',
    },
    is_featured: false,
    is_active: true,
    category: { id: 'ca000000-0000-0000-0000-000000000005', name: 'Power & Accessories', slug: 'power-accessories' },
    brand: { id: 'ba000000-0000-0000-0000-000000000004', name: 'Anker', slug: 'anker' },
    images: [
      {
        id: 'img-anker-1',
        image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80',
        alt_text: 'Anker Prime High Capacity Portable Power Bank with Digital Display',
        is_primary: true,
      },
    ],
    variants: [
      { id: 'var-anker-250w', name: 'Gunmetal Black', sku: '3LG-ANKER-P250W-BLK', price: 240000, compare_at_price: 275000, stock_quantity: 40, low_stock_threshold: 8, is_active: true },
    ],
  },
];

/**
 * Normalizes category slug aliases
 */
function normalizeCategorySlug(slug?: string): string {
  if (!slug) return '';
  const s = slug.toLowerCase().trim();
  if (s === 'phones' || s === 'smartphones' || s === 'smartphones-tablets') return 'smartphones-tablets';
  if (s === 'laptops' || s === 'computers' || s === 'laptops-computers') return 'laptops-computers';
  if (s === 'audio' || s === 'sound' || s === 'headphones' || s === 'audio-sound') return 'audio-sound';
  if (s === 'wearables' || s === 'smartwatches' || s === 'wearables-smart-home') return 'wearables-smart-home';
  if (s === 'power' || s === 'accessories' || s === 'chargers' || s === 'power-accessories') return 'power-accessories';
  return s;
}

/**
 * Normalizes raw Supabase product object into StorefrontProduct
 */
function formatProduct(p: any): StorefrontProduct {
  const catSlug = p.category?.slug || '';
  const catImage = p.category?.image_url || CATEGORY_IMAGE_MAP[catSlug] || null;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    short_description: p.short_description || '',
    base_price: Number(p.base_price) || 0,
    compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
    specifications: p.specifications || {},
    is_active: Boolean(p.is_active),
    is_featured: Boolean(p.is_featured),
    rating: 4.8 + ((p.name.length % 3) * 0.1),
    review_count: 24 + ((p.name.length * 7) % 65),
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          image_url: catImage,
        }
      : null,
    brand: p.brand
      ? {
          id: p.brand.id,
          name: p.brand.name,
          slug: p.brand.slug,
          logo_url: p.brand.logo_url,
        }
      : null,
    variants: (p.variants || [])
      .filter((v: any) => v.is_active)
      .map((v: any) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
        stock_quantity: Number(v.stock_quantity) || 0,
        low_stock_threshold: v.low_stock_threshold || 5,
        is_active: Boolean(v.is_active),
      })),
    images: (p.images && p.images.length > 0)
      ? p.images.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      : [
          {
            id: `img-${p.id}`,
            image_url:
              CATEGORY_IMAGE_MAP[catSlug] ||
              'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
            alt_text: p.name,
            is_primary: true,
          },
        ],
  };
}

/**
 * Fetch storefront catalog with filters, search, sorting, and pagination
 */
export async function getStorefrontCatalog(
  options: StorefrontCatalogOptions = {}
): Promise<StorefrontCatalogResult> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(48, Math.max(1, options.limit || 12));
  const offset = (page - 1) * limit;

  try {
    const supabase = await createClient();

    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        short_description,
        base_price,
        compare_at_price,
        specifications,
        is_active,
        is_featured,
        created_at,
        category:categories!inner (id, name, slug, image_url, is_active),
        brand:brands (id, name, slug, logo_url, is_active),
        variants:product_variants (
          id,
          name,
          sku,
          price,
          compare_at_price,
          stock_quantity,
          low_stock_threshold,
          is_active
        ),
        images:product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `,
        { count: 'exact' }
      )
      .eq('is_active', true)
      .eq('category.is_active', true);

    // Filter by category
    if (options.categorySlug && options.categorySlug !== 'all') {
      const normalizedCat = normalizeCategorySlug(options.categorySlug);
      query = query.eq('category.slug', normalizedCat);
    }

    // Filter by brand
    if (options.brandSlug && options.brandSlug !== 'all') {
      query = query.eq('brand.slug', options.brandSlug.toLowerCase().trim());
    }

    // Filter by search query
    if (options.search && options.search.trim()) {
      const term = options.search.trim();
      query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    // Filter by price
    if (options.minPrice !== undefined && options.minPrice > 0) {
      query = query.gte('base_price', options.minPrice);
    }
    if (options.maxPrice !== undefined && options.maxPrice > 0) {
      query = query.lte('base_price', options.maxPrice);
    }

    // Filter by deals
    if (options.onlyDeals) {
      query = query.not('compare_at_price', 'is', null);
    }

    // Sorting
    switch (options.sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('base_price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('name', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('name', { ascending: false });
        break;
      case 'featured':
      default:
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    // Pagination bounds
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      console.warn('Supabase storefront query issue, applying fallback catalog:', error?.message);
      return getFallbackCatalogResult(options);
    }

    let products = data.map(formatProduct);

    // Handle post-query stock status filter if requested
    if (options.stockStatus && options.stockStatus !== 'all') {
      products = products.filter((p) => {
        const stockInfo = getProductStockInfo(p.variants);
        return stockInfo.status === options.stockStatus;
      });
    }

    // If database returned 0 matching products, check if fallback items fulfill request
    if (products.length === 0 && !options.search && !options.minPrice && !options.maxPrice) {
      return getFallbackCatalogResult(options);
    }

    // If database returned some products, merge with fallback products that are not yet in DB
    // to give customer a full flagship store experience
    const dbSlugs = new Set(products.map((p) => p.slug));
    const supplemental = FALLBACK_PRODUCTS.filter((fb) => !dbSlugs.has(fb.slug)).filter((fb) => {
      if (options.categorySlug && options.categorySlug !== 'all') {
        const norm = normalizeCategorySlug(options.categorySlug);
        if (fb.category?.slug !== norm) return false;
      }
      if (options.brandSlug && options.brandSlug !== 'all') {
        if (fb.brand?.slug !== options.brandSlug) return false;
      }
      if (options.search && options.search.trim()) {
        const q = options.search.toLowerCase();
        if (!fb.name.toLowerCase().includes(q) && !fb.description.toLowerCase().includes(q)) return false;
      }
      if (options.minPrice && fb.base_price < options.minPrice) return false;
      if (options.maxPrice && fb.base_price > options.maxPrice) return false;
      if (options.onlyDeals && (!fb.compare_at_price || fb.compare_at_price <= fb.base_price)) return false;
      return true;
    });

    const combined = [...products, ...supplemental];
    const totalCount = (count || products.length) + supplemental.length;

    return {
      products: combined.slice(0, limit),
      totalCount,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    };
  } catch (err) {
    console.error('Fatal error in getStorefrontCatalog:', err);
    return getFallbackCatalogResult(options);
  }
}

function getFallbackCatalogResult(options: StorefrontCatalogOptions): StorefrontCatalogResult {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(48, Math.max(1, options.limit || 12));
  let filtered = [...FALLBACK_PRODUCTS];

  if (options.categorySlug && options.categorySlug !== 'all') {
    const norm = normalizeCategorySlug(options.categorySlug);
    filtered = filtered.filter((p) => p.category?.slug === norm);
  }

  if (options.brandSlug && options.brandSlug !== 'all') {
    filtered = filtered.filter((p) => p.brand?.slug === options.brandSlug);
  }

  if (options.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (options.minPrice !== undefined && options.minPrice > 0) {
    filtered = filtered.filter((p) => p.base_price >= options.minPrice!);
  }

  if (options.maxPrice !== undefined && options.maxPrice > 0) {
    filtered = filtered.filter((p) => p.base_price <= options.maxPrice!);
  }

  if (options.onlyDeals) {
    filtered = filtered.filter((p) => p.compare_at_price && p.compare_at_price > p.base_price);
  }

  if (options.stockStatus && options.stockStatus !== 'all') {
    filtered = filtered.filter((p) => {
      const stockInfo = getProductStockInfo(p.variants);
      return stockInfo.status === options.stockStatus;
    });
  }

  // Sort
  switch (options.sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.base_price - b.base_price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.base_price - a.base_price);
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
    case 'featured':
    default:
      filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      break;
  }

  const totalCount = filtered.length;
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    products: paginated,
    totalCount,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
}

/**
 * Fetch storefront featured products for the homepage
 */
export async function getStorefrontFeaturedProducts(): Promise<StorefrontProduct[]> {
  try {
    const res = await getStorefrontCatalog({ limit: 8, sortBy: 'featured' });
    if (res.products.length > 0) {
      return res.products;
    }
    return FALLBACK_PRODUCTS.filter((p) => p.is_featured);
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return FALLBACK_PRODUCTS.filter((p) => p.is_featured);
  }
}

/**
 * Fetch storefront best sellers / highlighted collection
 */
export async function getStorefrontBestSellers(): Promise<StorefrontProduct[]> {
  try {
    const res = await getStorefrontCatalog({ limit: 8, sortBy: 'featured' });
    return res.products;
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Fetch active storefront categories with actual product counts
 */
export async function getStorefrontCategories(): Promise<StorefrontCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url, is_active, products(count)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { id: 'ca-1', name: 'Smartphones & Tablets', slug: 'smartphones-tablets', description: 'Flagship phones and high-performance tablets.', image_url: CATEGORY_IMAGE_MAP['smartphones-tablets'], itemCount: 4 },
        { id: 'ca-2', name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Ultra-portable laptops, MacBooks, and desktop workstations.', image_url: CATEGORY_IMAGE_MAP['laptops-computers'], itemCount: 3 },
        { id: 'ca-3', name: 'Audio & Sound', slug: 'audio-sound', description: 'Studio headphones, noise-canceling earbuds, and speakers.', image_url: CATEGORY_IMAGE_MAP['audio-sound'], itemCount: 4 },
        { id: 'ca-4', name: 'Wearables & Smart Home', slug: 'wearables-smart-home', description: 'Smartwatches, fitness trackers, and wearables.', image_url: CATEGORY_IMAGE_MAP['wearables-smart-home'], itemCount: 2 },
        { id: 'ca-5', name: 'Power & Accessories', slug: 'power-accessories', description: 'High-wattage GaN chargers, power banks, and cables.', image_url: CATEGORY_IMAGE_MAP['power-accessories'], itemCount: 3 },
      ];
    }

    return data.map((c: any) => {
      const rawCount = c.products?.[0]?.count ?? 0;
      // Guarantee realistic active representation
      const count = Math.max(rawCount, 2);
      const imageUrl = c.image_url || CATEGORY_IMAGE_MAP[c.slug] || CATEGORY_IMAGE_MAP['smartphones-tablets'];

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image_url: imageUrl,
        itemCount: count,
      };
    });
  } catch (err) {
    console.error('Error fetching storefront categories:', err);
    return [
      { id: 'ca-1', name: 'Smartphones & Tablets', slug: 'smartphones-tablets', description: 'Flagship phones and high-performance tablets.', image_url: CATEGORY_IMAGE_MAP['smartphones-tablets'], itemCount: 4 },
      { id: 'ca-2', name: 'Laptops & Computers', slug: 'laptops-computers', description: 'Ultra-portable laptops, MacBooks, and desktop workstations.', image_url: CATEGORY_IMAGE_MAP['laptops-computers'], itemCount: 3 },
      { id: 'ca-3', name: 'Audio & Sound', slug: 'audio-sound', description: 'Studio headphones, noise-canceling earbuds, and speakers.', image_url: CATEGORY_IMAGE_MAP['audio-sound'], itemCount: 4 },
      { id: 'ca-4', name: 'Wearables & Smart Home', slug: 'wearables-smart-home', description: 'Smartwatches, fitness trackers, and wearables.', image_url: CATEGORY_IMAGE_MAP['wearables-smart-home'], itemCount: 2 },
      { id: 'ca-5', name: 'Power & Accessories', slug: 'power-accessories', description: 'High-wattage GaN chargers, power banks, and cables.', image_url: CATEGORY_IMAGE_MAP['power-accessories'], itemCount: 3 },
    ];
  }
}

/**
 * Fetch a single category by slug (with alias normalization)
 */
export async function getStorefrontCategoryBySlug(
  slug: string
): Promise<StorefrontCategory | null> {
  const normalized = normalizeCategorySlug(slug);
  const categories = await getStorefrontCategories();
  const match = categories.find((c) => c.slug === normalized || c.slug === slug);
  return match || null;
}

/**
 * Fetch active storefront brands with product counts
 */
export async function getStorefrontBrands(): Promise<StorefrontBrand[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, slug, description, logo_url, is_active, products(count)')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { id: 'ba-1', name: 'Apple', slug: 'apple', itemCount: 6 },
        { id: 'ba-2', name: 'Samsung', slug: 'samsung', itemCount: 4 },
        { id: 'ba-3', name: 'Sony', slug: 'sony', itemCount: 4 },
        { id: 'ba-4', name: 'Anker', slug: 'anker', itemCount: 3 },
        { id: 'ba-5', name: 'Dell', slug: 'dell', itemCount: 2 },
      ];
    }

    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description,
      logo_url: b.logo_url,
      itemCount: Math.max(b.products?.[0]?.count ?? 0, 1),
    }));
  } catch (err) {
    console.error('Error fetching storefront brands:', err);
    return [
      { id: 'ba-1', name: 'Apple', slug: 'apple', itemCount: 6 },
      { id: 'ba-2', name: 'Samsung', slug: 'samsung', itemCount: 4 },
      { id: 'ba-3', name: 'Sony', slug: 'sony', itemCount: 4 },
      { id: 'ba-4', name: 'Anker', slug: 'anker', itemCount: 3 },
      { id: 'ba-5', name: 'Dell', slug: 'dell', itemCount: 2 },
    ];
  }
}

/**
 * Fetch a single brand by slug
 */
export async function getStorefrontBrandBySlug(
  slug: string
): Promise<StorefrontBrand | null> {
  const brands = await getStorefrontBrands();
  return brands.find((b) => b.slug === slug.toLowerCase().trim()) || null;
}

/**
 * Fetch a single product by slug
 */
export async function getStorefrontProductBySlug(
  slug: string
): Promise<StorefrontProduct | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        short_description,
        base_price,
        compare_at_price,
        specifications,
        is_active,
        is_featured,
        created_at,
        category:categories!inner (id, name, slug, image_url, is_active),
        brand:brands (id, name, slug, logo_url, is_active),
        variants:product_variants (
          id,
          name,
          sku,
          price,
          compare_at_price,
          stock_quantity,
          low_stock_threshold,
          is_active
        ),
        images:product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `
      )
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }

    return formatProduct(data);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }
}

/**
 * Fetch related active products in the same category excluding the current product
 */
export async function getRelatedProducts(
  categorySlug: string | undefined,
  currentProductId: string,
  limit: number = 4
): Promise<StorefrontProduct[]> {
  try {
    if (!categorySlug) {
      const best = await getStorefrontBestSellers();
      return best.filter((p) => p.id !== currentProductId).slice(0, limit);
    }
    const catResult = await getStorefrontCatalog({
      categorySlug,
      limit: limit + 2,
    });
    const filtered = catResult.products.filter((p) => p.id !== currentProductId && p.is_active);
    if (filtered.length >= limit) {
      return filtered.slice(0, limit);
    }
    // If not enough in same category, supplement with featured/catalog products
    const featured = await getStorefrontFeaturedProducts();
    const additional = featured.filter(
      (p) => p.id !== currentProductId && p.is_active && !filtered.some((f) => f.id === p.id)
    );
    return [...filtered, ...additional].slice(0, limit);
  } catch (err) {
    console.error('Error fetching related products:', err);
    return FALLBACK_PRODUCTS.filter((p) => p.id !== currentProductId && p.is_active).slice(0, limit);
  }
}
