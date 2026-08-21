import React, { useEffect, useState } from 'react';
import {
  FileText,
  PlusCircle,
  Trash2,
  Edit,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { adminService, AdminArticle } from '../../services/adminService';

export const AdminArticlesTab: React.FC = () => {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Cafes & Coffee');

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getArticles();
      setArticles(data);
    } catch (e) {
      console.error('Failed to load articles:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const art = await adminService.createArticle({
        title: title.trim(),
        excerpt: excerpt.trim() || 'A curated neighborhood guide by SpotPicks.',
        content: content.trim() || 'Full guide detailing the best spots in Delhi.',
        category,
        author: 'SpotPicks Editorial Desk',
        readingTimeMinutes: 4,
        coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        featured: true,
        status: 'PUBLISHED',
      });
      setArticles([art, ...articles]);
      setIsAdding(false);
      setTitle('');
      setExcerpt('');
      setContent('');
    } catch (err: any) {
      alert(err.message || 'Failed to create article');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await adminService.deleteArticle(id);
      setArticles(articles.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete article');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-rose-600" />
            <span>Curated City Guides & Articles ({articles.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish editorial guides: "10 Best Work-Friendly Cafes in Saket", "Old Delhi Street Food Walk".
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Write City Guide</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Publish Editorial City Guide</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Guide Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Ultimate Weekend Itinerary for Champa Gali & Saidulajab"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Short Summary / Excerpt</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="From artisanal pour-overs to bohemian thrift stores, here is your insider guide."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Full Content / Article Body</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full curated guide recommendations..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 leading-relaxed"
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
              Publish Guide
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  {art.category}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">{art.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{art.excerpt}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{art.author} • {art.readingTimeMinutes} min read</span>
                <button
                  type="button"
                  onClick={() => handleDelete(art._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
