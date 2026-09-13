// ==============================================================================
// 3LINE GADGETS — INVENTORY MANAGER COMPONENT
// components/admin/InventoryManager.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Boxes,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  History,
  ArrowRight,
  Package,
  Plus,
  Minus,
  Edit,
  FileText,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  adjustVariantStock,
  getVariantTransactionHistory,
} from '@/lib/actions/admin-inventory';
import { formatNaira, formatDate } from '@/lib/utils';
import type { StockAdjustmentInput } from '@/lib/validations/inventory';

interface InventoryManagerProps {
  variants: any[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  stats: {
    totalVariants: number;
    totalStockUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  filters: {
    search?: string;
    stockStatus?: string;
  };
}

export function InventoryManager({
  variants,
  totalCount,
  currentPage,
  totalPages,
  stats,
  filters,
}: InventoryManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Stock Adjustment Modal State
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number | string>('');
  const [transactionType, setTransactionType] = useState<string>('restock');
  const [note, setNote] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);
  const [adjustmentSuccess, setAdjustmentSuccess] = useState<string | null>(null);

  // Transaction History Modal State
  const [historyVariant, setHistoryVariant] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') {
      params.set('page', '1');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchTerm.trim());
  };

  const openAdjustmentModal = (variant: any) => {
    setSelectedVariant(variant);
    setAdjustmentQuantity('');
    setTransactionType('restock');
    setNote('');
    setAdjustmentError(null);
    setAdjustmentSuccess(null);
  };

  const openHistoryModal = async (variant: any) => {
    setHistoryVariant(variant);
    setHistoryLoading(true);
    const history = await getVariantTransactionHistory(variant.id);
    setHistoryList(history);
    setHistoryLoading(false);
  };

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    setAdjustmentError(null);
    setAdjustmentSuccess(null);

    const qty = Number(adjustmentQuantity);
    if (!qty || isNaN(qty)) {
      setAdjustmentError('Please specify a non-zero adjustment quantity');
      return;
    }

    // Determine sign based on transaction type if user entered positive number
    let finalQty = qty;
    if (['damage', 'sale', 'reservation'].includes(transactionType) && finalQty > 0) {
      finalQty = -finalQty;
    }

    const payload: StockAdjustmentInput = {
      variantId: selectedVariant.id,
      adjustmentQuantity: finalQty,
      transactionType: transactionType as any,
      note: note.trim() || null,
    };

    setAdjusting(true);

    const res = await adjustVariantStock(payload);
    setAdjusting(false);

    if (!res.success) {
      setAdjustmentError(res.error || 'Failed to adjust stock');
    } else {
      setAdjustmentSuccess(`Stock updated! New stock: ${res.newStock} units.`);
      setTimeout(() => {
        setSelectedVariant(null);
        router.refresh();
      }, 700);
    }
  };

  // Live calculation of preview stock
  const currentStock = selectedVariant?.stock_quantity ?? 0;
  const numQty = Number(adjustmentQuantity) || 0;
  const computedChange = ['damage', 'sale', 'reservation'].includes(transactionType) && numQty > 0 ? -numQty : numQty;
  const previewStock = currentStock + computedChange;

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Variants */}
        <div
          onClick={() => updateQuery('stockStatus', 'all')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            !filters.stockStatus || filters.stockStatus === 'all'
              ? 'border-violet-500 ring-2 ring-violet-500/10'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total SKUs
            </span>
            <Boxes className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalVariants}</p>
          <p className="text-xs text-slate-400 mt-1">
            {stats.totalStockUnits.toLocaleString()} units available
          </p>
        </div>

        {/* Healthy In Stock */}
        <div
          onClick={() => updateQuery('stockStatus', 'in_stock')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            filters.stockStatus === 'in_stock'
              ? 'border-emerald-500 ring-2 ring-emerald-500/10'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Healthy Stock
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {Math.max(0, stats.totalVariants - stats.lowStockCount - stats.outOfStockCount)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Sufficient inventory</p>
        </div>

        {/* Low Stock Warning */}
        <div
          onClick={() => updateQuery('stockStatus', 'low_stock')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            filters.stockStatus === 'low_stock'
              ? 'border-amber-500 ring-2 ring-amber-500/10'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</p>
          <p className="text-xs text-slate-400 mt-1">At or below threshold</p>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => updateQuery('stockStatus', 'out_of_stock')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            filters.stockStatus === 'out_of_stock'
              ? 'border-rose-500 ring-2 ring-rose-500/10'
              : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{stats.outOfStockCount}</p>
          <p className="text-xs text-slate-400 mt-1">0 units remaining</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search variant name or SKU code..."
            className="pl-9 h-10"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={filters.stockStatus || 'all'}
            onChange={(e) => updateQuery('stockStatus', e.target.value)}
            className="h-10 text-xs w-full sm:w-48"
          >
            <option value="all">All Inventory Levels</option>
            <option value="in_stock">In Stock Only</option>
            <option value="low_stock">Low Stock Alerts Only</option>
            <option value="out_of_stock">Out of Stock Only</option>
          </Select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {variants.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Boxes className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-700">No inventory matches</p>
            <p className="text-xs text-slate-400 mt-1">
              No variant SKUs found matching the filter query.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Product</TableHead>
                <TableHead>Variant &amp; SKU</TableHead>
                <TableHead>Price (NGN)</TableHead>
                <TableHead className="text-center">Stock Level</TableHead>
                <TableHead className="text-center">Threshold</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => {
                const isOutOfStock = variant.stock_quantity === 0;
                const isLowStock =
                  !isOutOfStock &&
                  variant.stock_quantity <= (variant.low_stock_threshold || 5);

                return (
                  <TableRow key={variant.id}>
                    {/* Image */}
                    <TableCell>
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden">
                        {variant.primaryImage ? (
                          <img
                            src={variant.primaryImage}
                            alt={variant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </TableCell>

                    {/* Variant & Parent Product */}
                    <TableCell>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {variant.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Link
                            href={`/admin/products/${variant.product?.id}`}
                            className="hover:text-violet-600 hover:underline"
                          >
                            {variant.product?.name || 'Unknown Product'}
                          </Link>
                          <span>•</span>
                          <span className="font-mono text-xs font-semibold text-violet-600">
                            {variant.sku}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <span className="font-semibold text-slate-900">
                        {formatNaira(variant.price)}
                      </span>
                    </TableCell>

                    {/* Stock Units */}
                    <TableCell className="text-center">
                      <span className="font-bold text-base text-slate-900">
                        {variant.stock_quantity}
                      </span>
                      <span className="text-[11px] text-slate-400 block">units</span>
                    </TableCell>

                    {/* Alert Threshold */}
                    <TableCell className="text-center font-mono text-xs text-slate-500">
                      ≤ {variant.low_stock_threshold || 5}
                    </TableCell>

                    {/* Stock Badge */}
                    <TableCell className="text-center">
                      {isOutOfStock ? (
                        <Badge variant="outOfStock" className="text-xs">
                          Depleted
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="lowStock" className="text-xs">
                          Low Stock Alert
                        </Badge>
                      ) : (
                        <Badge variant="inStock" className="text-xs">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAdjustmentModal(variant)}
                          className="h-8 px-2.5 font-semibold text-xs"
                        >
                          Adjust
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openHistoryModal(variant)}
                          className="h-8 px-2 text-slate-500 hover:text-slate-800"
                          title="View transaction history"
                        >
                          <History className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total variants)
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateQuery('page', String(currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateQuery('page', String(currentPage + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal Dialog */}
      <Dialog
        open={Boolean(selectedVariant)}
        onOpenChange={(open) => !open && setSelectedVariant(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-violet-600" />
              Adjust Stock: {selectedVariant?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              SKU: <strong className="font-mono text-slate-700">{selectedVariant?.sku}</strong> • Product: {selectedVariant?.product?.name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdjustmentSubmit} className="space-y-4 pt-2">
            {adjustmentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{adjustmentError}</span>
              </div>
            )}

            {adjustmentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{adjustmentSuccess}</span>
              </div>
            )}

            {/* Current vs New preview */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-around text-center">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Current Stock
                </span>
                <span className="text-lg font-bold text-slate-800">{currentStock}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Adjustment
                </span>
                <span
                  className={`text-lg font-bold ${
                    computedChange > 0
                      ? 'text-emerald-600'
                      : computedChange < 0
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                >
                  {computedChange > 0 ? `+${computedChange}` : computedChange}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  New Stock
                </span>
                <span
                  className={`text-lg font-bold ${
                    previewStock < 0 ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {previewStock}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Transaction Type
              </label>
              <Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="restock">Restock (+ Add Stock)</option>
                <option value="purchase">Supplier Purchase Order (+)</option>
                <option value="return">Customer Return (+)</option>
                <option value="adjustment">Manual Adjustment (+ / -)</option>
                <option value="damage">Damaged / Written-off (-)</option>
                <option value="sale">Manual Walk-in Sale (-)</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Quantity Units <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                step="1"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                placeholder="e.g. 25 (or -5 for negative adjustment)"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                For damage or write-offs, enter positive units and system will automatically deduct.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Note / Reason (Optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Shipment received via DHL Express from Lagos warehouse"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedVariant(null)}
                disabled={adjusting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adjusting || previewStock < 0}>
                {adjusting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Commit Adjustment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transaction Movement History Dialog */}
      <Dialog
        open={Boolean(historyVariant)}
        onOpenChange={(open) => !open && setHistoryVariant(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-violet-600" />
              Inventory Movement Audit Log
            </DialogTitle>
            <DialogDescription className="text-xs">
              History for <strong className="text-slate-800">{historyVariant?.name}</strong> (SKU: {historyVariant?.sku})
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto pt-2">
            {historyLoading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-600" />
                <p className="text-xs">Loading ledger transactions...</p>
              </div>
            ) : historyList.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No recorded transactions</p>
                <p className="text-xs mt-1">This variant has no recorded ledger entries yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {historyList.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wide text-slate-800">
                          {item.transaction_type}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">{formatDate(item.created_at)}</span>
                      </div>
                      {item.note && (
                        <p className="text-slate-600 mt-1">{item.note}</p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Logged by: {item.admin?.full_name || 'System Admin'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-bold ${
                          item.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                      </span>
                      <span className="text-[10px] text-slate-400 block">units</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryVariant(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
