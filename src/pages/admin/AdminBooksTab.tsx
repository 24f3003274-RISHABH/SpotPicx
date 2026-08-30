import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Globe,
  Tag,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IBook, BookReadingLevel } from '../../types/book.types';

export const AdminBooksTab: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    primaryAuthor: string;
    authors: string;
    category: string;
    subcategory: string;
    readingLevel: BookReadingLevel;
    estimatedReadingTime: string;
    publicationYear: number;
    publisher: string;
    countryOfOrigin: string;
    language: string;
    latestKnownEdition: string;
    latestEditionYear: number | undefined;
    editionPublisher: string;
    editionVerified: boolean;
    isbn13: string;
    shortDescription: string;
    whyRead: string;
    keyIdeas: string;
    whoShouldRead: string;
    prerequisites: string;
    bestFor: string;
    coverImage: string;
    officialWebsite: string;
    publisherUrl: string;
    isIndianAuthor: boolean;
    featured: boolean;
    editorPick: boolean;
    recommended: boolean;
    source: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  }>({
    title: '',
    subtitle: '',
    primaryAuthor: '',
    authors: '',
    category: 'Computer Science & Technology',
    subcategory: 'Software Engineering',
    readingLevel: 'BEGINNER',
    estimatedReadingTime: '6-8 hours',
    publicationYear: 2023,
    publisher: '',
    countryOfOrigin: 'United States',
    language: 'English',
    latestKnownEdition: '1st Edition',
    latestEditionYear: 2023,
    editionPublisher: '',
    editionVerified: true,
    isbn13: '',
    shortDescription: '',
    whyRead: '',
    keyIdeas: '',
    whoShouldRead: '',
    prerequisites: '',
    bestFor: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    officialWebsite: '',
    publisherUrl: '',
    isIndianAuthor: false,
    featured: false,
    editorPick: false,
    recommended: true,
    source: 'SpotPicx Curated Editorial Registry',
    status: 'PUBLISHED',
  });

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const res = await BookApi.getBooks({ limit: 100 });
      setBooks(res.books || []);
    } catch (e) {
      console.error('Failed to load books:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleOpenCreate = () => {
    setEditingBookId(null);
    setFormData({
      title: '',
      subtitle: '',
      primaryAuthor: '',
      authors: '',
      category: 'Computer Science & Technology',
      subcategory: 'Software Engineering',
      readingLevel: 'BEGINNER',
      estimatedReadingTime: '6-8 hours',
      publicationYear: 2023,
      publisher: '',
      countryOfOrigin: 'United States',
      language: 'English',
      latestKnownEdition: '1st Edition',
      latestEditionYear: 2023,
      editionPublisher: '',
      editionVerified: true,
      isbn13: '',
      shortDescription: '',
      whyRead: '',
      keyIdeas: '',
      whoShouldRead: '',
      prerequisites: '',
      bestFor: '',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      officialWebsite: '',
      publisherUrl: '',
      isIndianAuthor: false,
      featured: false,
      editorPick: false,
      recommended: true,
      source: 'SpotPicx Curated Editorial Registry',
      status: 'PUBLISHED',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: IBook) => {
    setEditingBookId(b._id || b.slug);
    setFormData({
      title: b.title || '',
      subtitle: b.subtitle || '',
      primaryAuthor: b.primaryAuthor || (b.authors ? b.authors[0] : ''),
      authors: Array.isArray(b.authors) ? b.authors.join(', ') : '',
      category: b.category || 'Computer Science & Technology',
      subcategory: b.subcategory || '',
      readingLevel: b.readingLevel || 'BEGINNER',
      estimatedReadingTime: b.estimatedReadingTime || '6-8 hours',
      publicationYear: b.publicationYear || 2023,
      publisher: b.publisher || '',
      countryOfOrigin: b.countryOfOrigin || 'United States',
      language: b.language || 'English',
      latestKnownEdition: b.latestKnownEdition || '1st Edition',
      latestEditionYear: b.latestEditionYear || b.publicationYear,
      editionPublisher: b.editionPublisher || b.publisher || '',
      editionVerified: Boolean(b.editionVerified),
      isbn13: b.isbn13 || '',
      shortDescription: b.shortDescription || '',
      whyRead: b.whyRead || '',
      keyIdeas: Array.isArray(b.keyIdeas) ? b.keyIdeas.join('\n') : '',
      whoShouldRead: Array.isArray(b.whoShouldRead) ? b.whoShouldRead.join('\n') : '',
      prerequisites: Array.isArray(b.prerequisites) ? b.prerequisites.join('\n') : '',
      bestFor: Array.isArray(b.bestFor) ? b.bestFor.join(', ') : '',
      coverImage: b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      officialWebsite: b.officialWebsite || '',
      publisherUrl: b.publisherUrl || '',
      isIndianAuthor: Boolean(b.isIndianAuthor),
      featured: Boolean(b.featured),
      editorPick: Boolean(b.editorPick),
      recommended: Boolean(b.recommended),
      source: b.source || 'SpotPicx Curated Editorial Registry',
      status: b.status || 'PUBLISHED',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.primaryAuthor.trim()) {
      alert('Please provide at least Title and Primary Author');
      return;
    }

    const payload: Partial<IBook> = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      primaryAuthor: formData.primaryAuthor.trim(),
      authors: formData.authors
        ? formData.authors.split(',').map((s) => s.trim()).filter(Boolean)
        : [formData.primaryAuthor.trim()],
      category: formData.category,
      subcategory: formData.subcategory.trim(),
      readingLevel: formData.readingLevel,
      estimatedReadingTime: formData.estimatedReadingTime.trim(),
      publicationYear: Number(formData.publicationYear) || new Date().getFullYear(),
      publisher: formData.publisher.trim(),
      countryOfOrigin: formData.countryOfOrigin.trim(),
      language: formData.language.trim(),
      latestKnownEdition: formData.latestKnownEdition.trim(),
      latestEditionYear: formData.latestEditionYear ? Number(formData.latestEditionYear) : undefined,
      editionPublisher: formData.editionPublisher.trim(),
      editionVerified: formData.editionVerified,
      isbn13: formData.isbn13.trim() || undefined,
      shortDescription: formData.shortDescription.trim(),
      description: formData.shortDescription.trim(),
      whyRead: formData.whyRead.trim(),
      keyIdeas: formData.keyIdeas
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      whoShouldRead: formData.whoShouldRead
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      prerequisites: formData.prerequisites
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      bestFor: formData.bestFor
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      coverImage: formData.coverImage.trim(),
      officialWebsite: formData.officialWebsite.trim() || undefined,
      publisherUrl: formData.publisherUrl.trim() || undefined,
      isIndianAuthor: formData.isIndianAuthor,
      featured: formData.featured,
      editorPick: formData.editorPick,
      recommended: formData.recommended,
      source: formData.source.trim(),
      sourceType: 'EDITORIAL',
      status: formData.status,
    };

    try {
      if (editingBookId) {
        const updated = await BookApi.updateBook(editingBookId, payload);
        if (updated) {
          setBooks(books.map((b) => ((b._id === editingBookId || b.slug === editingBookId) ? updated : b)));
        }
      } else {
        const created = await BookApi.createBook(payload);
        if (created) {
          setBooks([created, ...books]);
        }
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book record?')) return;
    try {
      await BookApi.deleteBook(id);
      setBooks(books.filter((b) => b._id !== id && b.slug !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete book');
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      !searchFilter ||
      b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.primaryAuthor.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory =
      categoryFilter === 'ALL' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>Book Discovery Catalog ({books.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Curate verified book metadata, publication years, verified editions, reading level, editorial "Why Read", and author linkages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter books by title or author..."
            className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none w-full md:w-auto"
        >
          <option value="ALL">All Categories</option>
          <option value="Computer Science & Technology">Computer Science & Technology</option>
          <option value="Entrepreneurship & Business">Entrepreneurship & Business</option>
          <option value="Habits & Behavior">Habits & Behavior</option>
          <option value="Personal Development">Personal Development</option>
          <option value="Indian Knowledge & Society">Indian Knowledge & Society</option>
          <option value="Philosophy">Philosophy</option>
          <option value="Psychology">Psychology</option>
          <option value="Finance & Investing">Finance & Investing</option>
          <option value="Science">Science</option>
        </select>
      </div>

      {/* Modal / Inline Editor Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingBookId ? 'Edit Book Record' : 'Add New Book to Knowledge Hub'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure strict editorial accuracy: no full copyrighted text, verify publication and edition details.
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
              <label className="block font-bold text-slate-700 mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Pragmatic Programmer"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Your Journey To Mastery"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Author *</label>
              <input
                type="text"
                required
                value={formData.primaryAuthor}
                onChange={(e) => setFormData({ ...formData, primaryAuthor: e.target.value })}
                placeholder="e.g. David Thomas"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">All Authors (comma separated)</label>
              <input
                type="text"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                placeholder="e.g. David Thomas, Andrew Hunt"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              >
                <option value="Computer Science & Technology">Computer Science & Technology</option>
                <option value="Entrepreneurship & Business">Entrepreneurship & Business</option>
                <option value="Habits & Behavior">Habits & Behavior</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Indian Knowledge & Society">Indian Knowledge & Society</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Psychology">Psychology</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="History">History</option>
                <option value="Finance & Investing">Finance & Investing</option>
                <option value="Science">Science</option>
                <option value="Career & Education">Career & Education</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Software Engineering / Artificial Intelligence"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reading Difficulty Level</label>
              <select
                value={formData.readingLevel}
                onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value as BookReadingLevel })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              >
                <option value="BEGINNER">Beginner (No prior background needed)</option>
                <option value="INTERMEDIATE">Intermediate (Foundational concepts required)</option>
                <option value="ADVANCED">Advanced (Rigorous / Specialized)</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Reading Time</label>
              <input
                type="text"
                value={formData.estimatedReadingTime}
                onChange={(e) => setFormData({ ...formData, estimatedReadingTime: e.target.value })}
                placeholder="e.g. 6-8 hours"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Original Publication Year</label>
              <input
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Original Publisher</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="e.g. Addison-Wesley Professional"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Latest Known Edition (e.g. 20th Anniversary Edition)</label>
              <input
                type="text"
                value={formData.latestKnownEdition}
                onChange={(e) => setFormData({ ...formData, latestKnownEdition: e.target.value })}
                placeholder="e.g. 20th Anniversary Edition (2nd Edition)"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Latest Edition Year</label>
              <input
                type="number"
                value={formData.latestEditionYear || ''}
                onChange={(e) => setFormData({ ...formData, latestEditionYear: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 2019"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ISBN-13 (Verified only)</label>
              <input
                type="text"
                value={formData.isbn13}
                onChange={(e) => setFormData({ ...formData, isbn13: e.target.value })}
                placeholder="e.g. 978-0135957059"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Description / Editorial Summary *</label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Concise overview of what this book covers and why it exists..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Why Should You Read This? (Editorial Analysis)</label>
              <textarea
                rows={3}
                value={formData.whyRead}
                onChange={(e) => setFormData({ ...formData, whyRead: e.target.value })}
                placeholder="Explain the practical significance and career impact of reading this book..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Ideas / Takeaways (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.keyIdeas}
                  onChange={(e) => setFormData({ ...formData, keyIdeas: e.target.value })}
                  placeholder="Care about your craft&#10;Think about your work&#10;Provide options, don't make lame excuses"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Who Should Read This? (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.whoShouldRead}
                  onChange={(e) => setFormData({ ...formData, whoShouldRead: e.target.value })}
                  placeholder="Software engineers wanting to write cleaner code&#10;Computer science students entering the industry"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Prerequisites (One per line, e.g. Basic Python syntax)</label>
              <input
                type="text"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="e.g. Basic programming literacy in any language"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox Flags */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isIndianAuthor}
                onChange={(e) => setFormData({ ...formData, isIndianAuthor: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Indian Author / Origin</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Featured on Books Hub</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.editorPick}
                onChange={(e) => setFormData({ ...formData, editorPick: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">SpotPicx Editor's Pick</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.editionVerified}
                onChange={(e) => setFormData({ ...formData, editionVerified: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="font-semibold text-emerald-700">Edition Verified</span>
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
              {editingBookId ? 'Save Changes' : 'Publish Book'}
            </button>
          </div>
        </form>
      )}

      {/* Book Catalog Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading catalog records...</span>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No books matching current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Book & Author</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Publication</th>
                  <th className="py-3.5 px-4">Edition Status</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBooks.map((b) => (
                  <tr key={b._id || b.slug} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="w-10 h-14 object-cover rounded-md border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                        />
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{b.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium">by {b.primaryAuthor}</div>
                          {b.isIndianAuthor && (
                            <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                              <Globe className="h-2.5 w-2.5" /> Indian Origin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block font-semibold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                        {b.category}
                      </span>
                      {b.subcategory && (
                        <div className="text-[10px] text-slate-400 mt-0.5">{b.subcategory}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          b.readingLevel === 'BEGINNER'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.readingLevel === 'INTERMEDIATE'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {b.readingLevel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.publicationYear}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{b.publisher}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.editionVerified ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{b.latestKnownEdition || 'Verified'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <AlertTriangle className="h-3 w-3 text-amber-400" />
                          <span>Unverified</span>
                        </div>
                      )}
                      {b.isbn13 && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.isbn13}</div>}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {b.featured && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            Featured
                          </span>
                        )}
                        {b.editorPick && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                            Editor's Pick
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Edit Book"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(b._id || b.slug)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
