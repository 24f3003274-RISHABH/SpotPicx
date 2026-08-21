import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { Category } from '../../types';

export const AdminCategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Coffee');
  const [isAdding, setIsAdding] = useState(false);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await discoveryService.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: Category = {
      _id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Curated ${newCatName.trim()} spots in Delhi`,
      icon: newCatIcon,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
      type: 'ROOT',
      isActive: true,
      order: 1,
      businessCount: 0,
      subcategories: [],
    };
    setCategories([...categories, cat]);
    setNewCatName('');
    setNewCatSlug('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete category?')) return;
    setCategories(categories.filter((c) => (c._id || c.slug) !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-rose-600" />
            <span>Category Taxonomy ({categories.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Delhi curation taxonomy: Cafes, Heritage, Street Food, Nightlife, and Wellness.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCategory} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Create New Delhi Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Rooftop Bars)"
              value={newCatName}
              onChange={(e) => {
                setNewCatName(e.target.value);
                setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
            <input
              type="text"
              placeholder="URL Slug (e.g. rooftop-bars)"
              value={newCatSlug}
              onChange={(e) => setNewCatSlug(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <input
              type="text"
              placeholder="Icon (e.g. Wine, Utensils, Music)"
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.slug}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">/category/{cat.slug}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">
                {cat.businessCount || 12} listed spots
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(cat._id || cat.slug)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
