import React, { useEffect, useState } from 'react';
import {
  Users,
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
  Globe,
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IAuthor } from '../../types/book.types';

export const AdminAuthorsTab: React.FC = () => {
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    nationality: string;
    country: string;
    isIndian: boolean;
    birthYear: number | undefined;
    deathYear: number | undefined;
    profession: string;
    fields: string;
    notableWorks: string;
    shortBiography: string;
    biography: string;
    portrait: string;
    wikipediaUrl: string;
    officialWebsite: string;
    featured: boolean;
    popular: boolean;
  }>({
    name: '',
    nationality: 'American',
    country: 'United States',
    isIndian: false,
    birthYear: undefined,
    deathYear: undefined,
    profession: 'Computer Scientist, Author',
    fields: 'Software Engineering, Computer Systems',
    notableWorks: 'The Pragmatic Programmer',
    shortBiography: '',
    biography: '',
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    wikipediaUrl: '',
    officialWebsite: '',
    featured: true,
    popular: true,
  });

  const loadAuthors = async () => {
    try {
      setIsLoading(true);
      const res = await BookApi.getAuthors({ limit: 100 });
      setAuthors(res.authors || []);
    } catch (e) {
      console.error('Failed to load authors:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpenCreate = () => {
    setEditingAuthorId(null);
    setFormData({
      name: '',
      nationality: 'Indian',
      country: 'India',
      isIndian: true,
      birthYear: undefined,
      deathYear: undefined,
      profession: 'Author, Educator',
      fields: 'Computer Science, Technology',
      notableWorks: '',
      shortBiography: '',
      biography: '',
      portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      wikipediaUrl: '',
      officialWebsite: '',
      featured: true,
      popular: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (a: IAuthor) => {
    setEditingAuthorId(a._id || a.slug);
    setFormData({
      name: a.name || '',
      nationality: a.nationality || '',
      country: a.country || '',
      isIndian: Boolean(a.isIndian),
      birthYear: a.birthYear,
      deathYear: a.deathYear,
      profession: Array.isArray(a.profession) ? a.profession.join(', ') : '',
      fields: Array.isArray(a.fields) ? a.fields.join(', ') : '',
      notableWorks: Array.isArray(a.notableWorks) ? a.notableWorks.join(', ') : '',
      shortBiography: a.shortBiography || '',
      biography: a.biography || '',
      portrait: a.portrait || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      wikipediaUrl: a.wikipediaUrl || '',
      officialWebsite: a.officialWebsite || '',
      featured: Boolean(a.featured),
      popular: Boolean(a.popular),
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please provide author name');
      return;
    }

    const payload: Partial<IAuthor> = {
      name: formData.name.trim(),
      nationality: formData.nationality.trim(),
      country: formData.country.trim(),
      isIndian: formData.isIndian,
      birthYear: formData.birthYear ? Number(formData.birthYear) : undefined,
      deathYear: formData.deathYear ? Number(formData.deathYear) : undefined,
      profession: formData.profession
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      fields: formData.fields
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      notableWorks: formData.notableWorks
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      shortBiography: formData.shortBiography.trim(),
      biography: formData.biography.trim() || formData.shortBiography.trim(),
      portrait: formData.portrait.trim(),
      wikipediaUrl: formData.wikipediaUrl.trim() || undefined,
      officialWebsite: formData.officialWebsite.trim() || undefined,
      featured: formData.featured,
      popular: formData.popular,
    };

    try {
      if (editingAuthorId) {
        const updated = await BookApi.updateAuthor(editingAuthorId, payload);
        if (updated) {
          setAuthors(authors.map((a) => (a._id === editingAuthorId || a.slug === editingAuthorId ? updated : a)));
        }
      } else {
        const created = await BookApi.createAuthor(payload);
        if (created) {
          setAuthors([created, ...authors]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this author record?')) return;
    try {
      await BookApi.deleteAuthor(id);
      setAuthors(authors.filter((a) => a._id !== id && a.slug !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete author');
    }
  };

  const filteredAuthors = authors.filter(
    (a) =>
      !searchFilter ||
      a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.nationality?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.fields?.some((f) => f.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>Authors Directory ({authors.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain verified author profiles, biographies, fields of expertise, notable works, and Wikipedia references.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Author</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter authors by name, nationality, or discipline..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Editor Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingAuthorId ? 'Edit Author Profile' : 'Add New Author Profile'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify factual integrity (biography, birth years, notable works).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Author Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. A.P.J. Abdul Kalam"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="e.g. Indian, American, British"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Birth Year (if verified)</label>
              <input
                type="number"
                value={formData.birthYear || ''}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 1931"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Death Year (if applicable)</label>
              <input
                type="number"
                value={formData.deathYear || ''}
                onChange={(e) => setFormData({ ...formData, deathYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 2015"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Professions (comma separated)</label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="e.g. Aerospace Scientist, Statesman, Author"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fields / Disciplines (comma separated)</label>
              <input
                type="text"
                value={formData.fields}
                onChange={(e) => setFormData({ ...formData, fields: e.target.value })}
                placeholder="e.g. Aerospace Engineering, Youth Motivation, Public Policy"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notable Works (comma separated)</label>
              <input
                type="text"
                value={formData.notableWorks}
                onChange={(e) => setFormData({ ...formData, notableWorks: e.target.value })}
                placeholder="e.g. Wings of Fire, Ignited Minds, India 2020"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Portrait Image URL</label>
              <input
                type="url"
                value={formData.portrait}
                onChange={(e) => setFormData({ ...formData, portrait: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Biography *</label>
              <textarea
                rows={2}
                required
                value={formData.shortBiography}
                onChange={(e) => setFormData({ ...formData, shortBiography: e.target.value })}
                placeholder="1-2 sentences capturing their principal contribution..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Biography</label>
              <textarea
                rows={4}
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                placeholder="Comprehensive career and intellectual background..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isIndian}
                onChange={(e) => setFormData({ ...formData, isIndian: e.target.checked })}
                className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Indian Author</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Featured Author</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Popular / Trending</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              {editingAuthorId ? 'Save Changes' : 'Create Author Profile'}
            </button>
          </div>
        </form>
      )}

      {/* Authors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading authors directory...</span>
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No authors found matching filter.</p>
          </div>
        ) : (
          filteredAuthors.map((a) => (
            <div
              key={a._id || a.slug}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={a.portrait}
                  alt={a.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{a.name}</h3>
                    {a.isIndian && (
                      <span className="shrink-0 text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                        India
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {a.nationality || a.country}
                    {a.birthYear && ` • b. ${a.birthYear}`}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {a.shortBiography}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] text-indigo-600 font-bold">
                  {a.bookCount || 1} {a.bookCount === 1 ? 'Book' : 'Books'} in Registry
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(a)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a._id || a.slug)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Delete Profile"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
