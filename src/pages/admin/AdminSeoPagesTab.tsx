import React, { useEffect, useState } from 'react';
import {
  SearchCode,
  PlusCircle,
  Trash2,
  Globe,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { adminService, AdminSeoPage } from '../../services/adminService';

export const AdminSeoPagesTab: React.FC = () => {
  const [seoPages, setSeoPages] = useState<AdminSeoPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form
  const [slug, setSlug] = useState('delhi/best-cafes-in-saket');
  const [title, setTitle] = useState('Best Cafes in Saket Delhi (2025 Guide)');
  const [metaDescription, setMetaDescription] = useState('Discover the best cafes in Saket with outdoor seating, specialty brew coffee, and high-speed Wi-Fi.');
  const [h1, setH1] = useState('The 10 Best Cafes in Saket & Champa Gali, Delhi');
  const [locality, setLocality] = useState('Saidulajab, Saket');

  const loadPages = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getSeoPages();
      setSeoPages(data);
    } catch (e) {
      console.error('Failed to load SEO pages:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    try {
      const page = await adminService.createSeoPage({
        slug: slug.trim(),
        title: title.trim(),
        metaDescription: metaDescription.trim(),
        h1: h1.trim() || title.trim(),
        locality,
        keywords: ['Delhi cafes', 'Saket cafes', 'Champa Gali', 'Coffee shops Delhi'],
        isIndexed: true,
      });
      setSeoPages([page, ...seoPages]);
      setIsAdding(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create SEO page');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete SEO landing page config?')) return;
    try {
      await adminService.deleteSeoPage(id);
      setSeoPages(seoPages.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete SEO page');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <SearchCode className="h-5 w-5 text-rose-600" />
            <span>SEO Landing Pages & Meta Tag Rules ({seoPages.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure programmatic SEO landing hubs, custom FAQs, schema markup, and H1 tags.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New SEO Page</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Configure Programmatic SEO Route</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">URL Route Path *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="delhi/best-cafes-in-saket"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Locality Hub</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Page Meta Title (Title Tag) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Best Cafes in Saket Delhi (2025 Guide)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Meta Description</label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">H1 Headline</label>
              <input
                type="text"
                value={h1}
                onChange={(e) => setH1(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Save SEO Page
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading SEO landing pages...</p>
        </div>
      ) : seoPages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <SearchCode className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No custom SEO pages configured.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {seoPages.map((page) => (
            <div
              key={page._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    /{page.slug}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    INDEXED
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{page.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">{page.metaDescription}</p>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(page._id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 self-end sm:self-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
