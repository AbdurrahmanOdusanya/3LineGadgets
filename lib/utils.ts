import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number or numeric string as Nigerian Naira (NGN)
 * Example: 250000 -> ₦250,000.00
 */
export function formatNaira(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₦0.00';
  }
  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Turn any string into a clean URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Generate a standard 3Line Gadgets SKU
 * Example: "iPhone 16 Pro Max", "Natural Titanium 256GB" -> "3LG-IP16-NAT-256"
 */
export function generateSKU(productName: string, variantName?: string): string {
  const cleanName = productName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(' ')
    .filter(Boolean);

  let prefix = '3LG';
  let productCode = cleanName.slice(0, 2).map(w => w.slice(0, 3)).join('');
  if (!productCode) productCode = 'PROD';

  let variantCode = '';
  if (variantName) {
    const cleanVariant = variantName
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(' ')
      .filter(Boolean);
    variantCode = cleanVariant.map(w => w.slice(0, 3)).join('-');
  }

  const randomSuffix = Math.floor(100 + Math.random() * 900); // 3 digits
  return variantCode
    ? `${prefix}-${productCode}-${variantCode}-${randomSuffix}`
    : `${prefix}-${productCode}-${randomSuffix}`;
}

/**
 * Calculate percentage discount from compareAtPrice
 */
export function calculateDiscount(
  basePrice: number | string,
  compareAtPrice: number | string | null | undefined
): number | null {
  const base = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
  const compare = typeof compareAtPrice === 'string' ? parseFloat(compareAtPrice) : compareAtPrice;

  if (!compare || compare <= base) return null;
  const discount = Math.round(((compare - base) / compare) * 100);
  return discount > 0 ? discount : null;
}

/**
 * Format timestamp into readable localized string
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

