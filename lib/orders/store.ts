// ==============================================================================
// 3LINE GADGETS — ORDER PERSISTENCE SERVICE
// lib/orders/store.ts
// Handles atomic order saving, tracking code generation, and Supabase sync
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';

export interface StoredOrderItem {
  id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string | null;
  sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface StoredOrder {
  id: string;
  order_number: string;
  tracking_code: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'successful' | 'failed';
  fulfillment_status: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  payment_method: 'bank_transfer';
  bank_details: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
  customer: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    note?: string;
  };
  items: StoredOrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: 'NGN';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and orders file exist
function ensureStorageFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Failed to initialize orders storage file:', err);
  }
}

/**
 * Generate unique 3Line Gadgets tracking code (e.g., 3LG-TRK-849201)
 */
export function generateTrackingCode(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `3LG-TRK-${randomDigits}`;
}

/**
 * Generate human-friendly order number (e.g., 3LG-ORD-94102)
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `3LG-${dateStr}-${randomSuffix}`;
}

/**
 * Read all stored orders
 */
export function readOrdersFromStore(): StoredOrder[] {
  ensureStorageFile();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw) as StoredOrder[];
  } catch (err) {
    console.error('Error reading orders from store:', err);
    return [];
  }
}

/**
 * Write all orders atomically
 */
function writeOrdersToStore(orders: StoredOrder[]): boolean {
  ensureStorageFile();
  try {
    const tempFile = `${ORDERS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(orders, null, 2), 'utf8');
    fs.renameSync(tempFile, ORDERS_FILE);
    return true;
  } catch (err) {
    console.error('Error writing orders to store:', err);
    return false;
  }
}

/**
 * Save a new order to store and attempt Supabase synchronization
 */
export async function saveOrder(order: StoredOrder): Promise<StoredOrder> {
  // 1. Save to persistent file storage
  const orders = readOrdersFromStore();
  
  // Prevent duplicate insertion by order_number or id
  const existingIndex = orders.findIndex(
    (o) => o.id === order.id || o.order_number === order.order_number
  );

  if (existingIndex >= 0) {
    orders[existingIndex] = { ...orders[existingIndex], ...order, updated_at: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }

  writeOrdersToStore(orders);

  // 2. Best-effort Supabase sync
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If an authenticated user exists, save directly into Supabase orders & order_items
    if (user) {
      const { data: supabaseOrder, error: orderErr } = await (supabase.from('orders') as any)
        .insert({
          id: order.id,
          order_number: order.order_number,
          user_id: user.id,
          status: order.status,
          payment_status: order.payment_status,
          fulfillment_status: order.fulfillment_status,
          subtotal: order.subtotal,
          shipping_fee: order.shipping_fee,
          discount_amount: order.discount_amount,
          tax_amount: order.tax_amount,
          total_amount: order.total_amount,
          currency: 'NGN',
          shipping_address: order.customer,
          billing_address: order.customer,
          customer_note: `Manual Bank Transfer to ${order.bank_details.bank_name} (${order.bank_details.account_number}). Tracking Code: ${order.tracking_code}`,
        })
        .select()
        .maybeSingle();

      if (!orderErr && supabaseOrder) {
        // Also insert items
        if (order.items && order.items.length > 0) {
          const itemsPayload = order.items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            product_name: item.product_name,
            variant_name: item.variant_name || null,
            sku: item.sku || '3LG-GEN',
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
          }));
          await (supabase.from('order_items') as any).insert(itemsPayload);
        }

        // Insert shipment record with the tracking code
        await (supabase.from('shipments') as any).insert({
          order_id: order.id,
          carrier: order.customer.state.toLowerCase().includes('lagos')
            ? '3Line Lagos Express Courier'
            : 'GIG Logistics / Red Star Express',
          tracking_number: order.tracking_code,
          status: 'pending',
        });
      }
    }
  } catch (syncErr) {
    // Non-fatal: Local persistent store is already committed
    console.warn('Supabase order synchronization notice:', syncErr);
  }

  return order;
}

/**
 * Retrieve order by tracking code (case-insensitive)
 */
export async function getOrderByTrackingCode(trackingCode: string): Promise<StoredOrder | null> {
  const cleanCode = trackingCode.trim().toLowerCase();
  const orders = readOrdersFromStore();
  const found = orders.find((o) => o.tracking_code.toLowerCase() === cleanCode);
  if (found) return found;

  // Try matching order_number as well
  const byNumber = orders.find((o) => o.order_number.toLowerCase() === cleanCode);
  if (byNumber) return byNumber;

  return null;
}

/**
 * Retrieve order by order number or ID
 */
export async function getOrderByIdOrNumber(identifier: string): Promise<StoredOrder | null> {
  const clean = identifier.trim().toLowerCase().replace(/^#/, '');
  const orders = readOrdersFromStore();
  return (
    orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.order_number.toLowerCase() === clean ||
        o.tracking_code.toLowerCase() === clean
    ) || null
  );
}

/**
 * Retrieve all orders for Admin console
 */
export async function getAllOrders(): Promise<StoredOrder[]> {
  return readOrdersFromStore();
}

/**
 * Update order status (e.g. mark payment confirmed, mark shipped)
 */
export async function updateOrderStatus(
  orderId: string,
  updates: Partial<Pick<StoredOrder, 'status' | 'payment_status' | 'fulfillment_status'>>
): Promise<StoredOrder | null> {
  const orders = readOrdersFromStore();
  const index = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);

  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  writeOrdersToStore(orders);
  return orders[index];
}
