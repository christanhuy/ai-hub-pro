/**
 * CategorySidebar Component
 * Left sidebar menu for managing and selecting categories/use cases
 * Design: Gradient Modern with smooth interactions
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ConfirmDialog from './ConfirmDialog';
import { toast } from 'sonner';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategorySidebarProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; categoryId?: string; categoryName?: string }>({ isOpen: false });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    onAddCategory(newCategoryName);
    setNewCategoryName('');
    setIsAddingCategory(false);
    toast.success('Category added');
  };

  const handleUpdateCategory = (id: string) => {
    if (!editingName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    onUpdateCategory(id, editingName);
    setEditingId(null);
    setEditingName('');
    toast.success('Category updated');
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    setDeleteConfirm({
      isOpen: true,
      categoryId: id,
      categoryName: category?.name || 'Category',
    });
  };

  const confirmDeleteCategory = () => {
    if (deleteConfirm.categoryId) {
      onDeleteCategory(deleteConfirm.categoryId);
      setDeleteConfirm({ isOpen: false });
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-border h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>

        {/* Add Category Button */}
        {!isAddingCategory ? (
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="w-full btn-primary px-3 py-2 rounded text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddCategory();
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddCategory}
                className="flex-1 btn-primary px-2 py-1 rounded text-sm"
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className="flex-1 btn-secondary px-2 py-1 rounded text-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {categories.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No categories yet
          </p>
        ) : (
          categories
            .sort((a, b) => {
              // Home category always first
              if (a.id === 'home') return -1;
              if (b.id === 'home') return 1;
              return 0;
            })
            .map((category) => (
            <div
              key={category.id}
              className={`group relative rounded-lg transition-all duration-200 ${
                selectedCategoryId === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                  : 'bg-slate-700/50 text-foreground hover:bg-slate-700'
              }`}
            >
              {editingId === category.id ? (
                <div className="p-2 space-y-2">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    placeholder="Category name..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleUpdateCategory(category.id);
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className="flex-1 text-xs bg-accent text-accent-foreground rounded px-2 py-1 hover:opacity-90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 text-xs bg-muted text-foreground rounded px-2 py-1 hover:opacity-90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => onSelectCategory(category.id)}
                  className="p-3 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {category.icon && <span className="text-lg">{category.icon}</span>}
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                  </div>

                  {/* Action Buttons - Hide for Home category */}
                  {category.id !== 'home' && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        <p>Total: {categories.length} categories</p>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteConfirm.categoryName}"? AI tools in this category will not be deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDeleteCategory}
        onCancel={() => setDeleteConfirm({ isOpen: false })}
      />
    </div>
  );
}
