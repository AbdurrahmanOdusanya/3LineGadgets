// ==============================================================================
// 3LINE GADGETS — BRAND MANAGER COMPONENT
// components/admin/BrandManager.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  AlertCircle,
  AlertTriangle,
  FolderOpen,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  createAdminBrand,
  updateAdminBrand,
  toggleBrandStatus,
  deleteAdminBrand,
} from '@/lib/actions/admin-brands';
import { slugify, formatDate } from '@/lib/utils';
import type { BrandInput } from '@/lib/validations/brand';

interface BrandManagerProps {
  brands: any[];
}

export function BrandManager({ brands: initialBrands }: BrandManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteBrandItem, setDeleteBrandItem] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setLogoUrl('');
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setDescription(brand.description || '');
    setLogoUrl(brand.logo_url || '');
    setIsActive(brand.is_active ?? true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Brand name is required');
      return;
    }

    const payload: BrandInput = {
      name: name.trim(),
      slug: slugify(slug || name),
      description: description.trim() || null,
      logoUrl: logoUrl.trim() || null,
      isActive,
    };

    setFormSubmitting(true);

    try {
      if (editingBrand) {
        const res = await updateAdminBrand(editingBrand.id, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update brand');
        } else {
          setModalOpen(false);
          router.refresh();
        }
      } else {
        const res = await createAdminBrand(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create brand');
        } else {
          setModalOpen(false);
          router.refresh();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleBrandStatus(id, !current);
      router.refresh();
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBrandItem) return;
    setDeleting(true);
    setDeleteError(null);

    const res = await deleteAdminBrand(deleteBrandItem.id);
    setDeleting(false);

    if (!res.success) {
      setDeleteError(res.error || 'Failed to delete brand');
    } else {
      setDeleteBrandItem(null);
      router.refresh();
    }
  };

  const filteredBrands = initialBrands.filter((b) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      b.slug.toLowerCase().includes(term) ||
      (b.description && b.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="pl-9 h-10"
          />
        </div>

        <Button onClick={openCreateModal} className="w-full sm:w-auto shadow-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Brand
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredBrands.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-700">No brands found</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first electronics manufacturer or brand.
            </p>
            <Button onClick={openCreateModal} size="sm" className="mt-4">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Brand
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead>Brand Name &amp; Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden">
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Tag className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900 block">{brand.name}</span>
                    <span className="font-mono text-xs text-slate-400">/{brand.slug}</span>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-xs text-slate-500">
                    {brand.description || <span className="text-slate-300">No description</span>}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">
                      {brand.productCount} {brand.productCount === 1 ? 'item' : 'items'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(brand.id, brand.is_active)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        brand.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          brand.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {brand.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(brand)}
                        className="h-8 px-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteBrandItem(brand);
                          setDeleteError(null);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete brand"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Brand Create / Edit Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBrand ? 'Edit Brand' : 'Create New Brand'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manage gadget manufacturers and brand identities.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Apple, Samsung, Sony, Dell"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Slug <span className="text-rose-500">*</span>
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="e.g. apple"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary or brand overview..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Logo URL (Optional)
              </label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                />
                Active in Store
              </label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formSubmitting}>
                {formSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingBrand ? (
                  'Save Changes'
                ) : (
                  'Create Brand'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteBrandItem)}
        onOpenChange={(open) => !open && setDeleteBrandItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Brand
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Are you sure you want to delete brand &quot;{deleteBrandItem?.name}&quot;?
              If products are currently assigned to this brand, deletion will be blocked to protect catalog integrity.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{deleteError}</span>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteBrandItem(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Confirm Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
