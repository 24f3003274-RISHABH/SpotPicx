import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, ArrowLeft, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { BookCategoryDefinition } from '../../types/book.types';

export const BookCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<BookCategoryDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await BookApi.getCategories();
    setCategories(data);
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

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" /> Comprehensive Taxonomy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Book Knowledge Categories & Subjects
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Explore 20+ specialized knowledge domains, from Computer Science, Systems, and AI to Indian History, Behavioral Science, and Philosophy.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading taxonomy...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-snug">
                          {category.name}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {category.subcategories?.map((sub) => (
                      <div key={sub.slug} className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {sub.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 pl-3">
                          {sub.topics?.map((topic) => (
                            <Link
                              key={topic}
                              to={`/books?category=${category.slug}&topic=${encodeURIComponent(topic)}`}
                              className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100 font-medium transition-colors"
                            >
                              {topic}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    {category.subcategories?.length || 0} Subcategories
                  </span>
                  <Link
                    to={`/books?category=${category.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-xl transition-colors"
                  >
                    Browse Category Books <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
