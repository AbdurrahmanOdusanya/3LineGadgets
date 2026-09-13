// ==============================================================================
// 3LINE GADGETS — CATEGORY MANAGER COMPONENT
// components/admin/CategoryManager.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  AlertCircle,
  AlertTriangle,
  FolderOpen,
  ArrowUpDown,
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
  createAdminCategory,
  updateAdminCategory,
  toggleCategoryStatus,
  deleteAdminCategory,
} from '@/lib/actions/admin-categories';
import { slugify, formatDate } from '@/lib/utils';
import type { CategoryInput } from '@/lib/validations/category';

interface CategoryManagerProps {
  categories: any[];
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deleteCategoryItem, setDeleteCategoryItem] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setSortOrder(initialCategories.length);
    setIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setSortOrder(cat.sort_order ?? 0);
    setIsActive(cat.is_active ?? true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Category name is required');
      return;
    }

    const payload: CategoryInput = {
      name: name.trim(),
      slug: slugify(slug || name),
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    };

    setFormSubmitting(true);

    try {
      if (editingCategory) {
        const res = await updateAdminCategory(editingCategory.id, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update category');
        } else {
          setModalOpen(false);
          router.refresh();
        }
      } else {
        const res = await createAdminCategory(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create category');
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
      await toggleCategoryStatus(id, !current);
      router.refresh();
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryItem) return;
    setDeleting(true);
    setDeleteError(null);

    const res = await deleteAdminCategory(deleteCategoryItem.id);
    setDeleting(false);

    if (!res.success) {
      setDeleteError(res.error || 'Failed to delete category');
    } else {
      setDeleteCategoryItem(null);
      router.refresh();
    }
  };

  const filteredCategories = initialCategories.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.slug.toLowerCase().includes(term) ||
      (c.description && c.description.toLowerCase().includes(term))
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
            placeholder="Search categories..."
            className="pl-9 h-10"
          />
        </div>

        <Button onClick={openCreateModal} className="w-full sm:w-auto shadow-xs font-semibold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-700">No categories found</p>
            <p className="text-xs text-slate-400 mt-1">
              Add your first gadget category to start organizing products.
            </p>
            <Button onClick={openCreateModal} size="sm" className="mt-4">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Icon / Image</TableHead>
                <TableHead>Category Name &amp; Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Sort Order</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center overflow-hidden">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="w-4 h-4" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900 block">{cat.name}</span>
                    <span className="font-mono text-xs text-slate-400">/{cat.slug}</span>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-xs text-slate-500">
                    {cat.description || <span className="text-slate-300">No description</span>}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">
                      {cat.productCount} {cat.productCount === 1 ? 'item' : 'items'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center font-mono text-xs text-slate-500">
                    {cat.sort_order ?? 0}
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat.id, cat.is_active)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        cat.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          cat.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {cat.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                        className="h-8 px-2"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteCategoryItem(cat);
                          setDeleteError(null);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete category"
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

      {/* Category Create / Edit Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Organize electronics and gadgets into storefront collections.
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
                Category Name <span className="text-rose-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Smartphones, Audio, Laptops"
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
                placeholder="e.g. smartphones"
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
                placeholder="Brief summary of category products..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Image / Icon URL (Optional)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sort Order
                </label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </div>

              <div className="flex items-center pt-5">
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
                ) : editingCategory ? (
                  'Save Changes'
                ) : (
                  'Create Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteCategoryItem)}
        onOpenChange={(open) => !open && setDeleteCategoryItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Are you sure you want to delete category &quot;{deleteCategoryItem?.name}&quot;?
              If products are currently assigned to this category, deletion will be blocked to protect catalog integrity.
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
              onClick={() => setDeleteCategoryItem(null)}
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
