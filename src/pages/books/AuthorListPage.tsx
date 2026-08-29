import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, GraduationCap, ArrowLeft, RefreshCw, Globe, BookOpen } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IAuthor } from '../../types/book.types';
import { AuthorCard } from '../../components/books/AuthorCard';

export const AuthorListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const initialIndian = searchParams.get('indian') === 'true';

  const [search, setSearch] = useState(initialSearch);
  const [isIndian, setIsIndian] = useState(initialIndian);
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAuthors();
  }, [search, isIndian]);

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await BookApi.getAuthors({
      search: search || undefined,
      isIndian: isIndian ? true : undefined,
      limit: 24,
    });
    setAuthors(res.authors || []);
    setTotal(res.total || 0);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/books" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Books Hub
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5" /> Verified Thinkers & Creators
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Author & Scholar Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Explore authoritative biographies, fields of expertise, and verified publications from Indian and international thinkers.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search authors, fields..."
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs pl-9 pr-3 py-2 rounded-xl placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <button
                onClick={() => setIsIndian(!isIndian)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  isIndian
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                🇮🇳 Indian Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
            Showing {total} Authors
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading authors directory...</p>
          </div>
        ) : authors.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
            <GraduationCap className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No authors found</h3>
            <p className="text-xs text-gray-500 mt-1">Try relaxing your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
