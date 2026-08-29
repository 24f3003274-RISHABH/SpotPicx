import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Route, Clock, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { ReadingPathDefinition, IBook } from '../../types/book.types';
import { BookCard } from '../../components/books/BookCard';

export const ReadingPathDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState<{
    path: ReadingPathDefinition;
    stepBooks: Record<number, IBook[]>;
  } | null>(null);

  useEffect(() => {
    if (slug) {
      loadPath(slug);
    }
  }, [slug]);

  const loadPath = async (pathSlug: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const res = await BookApi.getReadingPathBySlug(pathSlug);
    if (res) {
      setPathData(res);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Route className="w-10 h-10 text-indigo-600 animate-bounce mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading Reading Path Roadmap...</p>
        </div>
      </div>
    );
  }

  if (!pathData || !pathData.path) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-lg">
          <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Roadmap Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The requested reading path does not exist.
          </p>
          <Link
            to="/books/paths"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> View All Reading Paths
          </Link>
        </div>
      </div>
    );
  }

  const { path, stepBooks } = pathData;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/books" className="hover:text-indigo-600">Books</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/books/paths" className="hover:text-indigo-600">Reading Paths</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-semibold text-gray-900 line-clamp-1">{path.title}</span>
        </div>
      </div>

      {/* Path Header */}
      <section className="bg-white border-b border-gray-200/80 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                {path.difficulty}
              </span>
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {path.estimatedDuration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {path.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {path.description}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 inline-block text-xs font-medium text-indigo-900">
              <span className="font-bold">Target Audience:</span> {path.targetAudience}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Timeline */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="space-y-12">
          {path.steps?.map((step) => {
            const booksInStep = stepBooks[step.order] || [];

            return (
              <section
                key={step.order}
                className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs relative"
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                    {step.order}
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Step {step.order}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Core Takeaway:</span> {step.keyTakeaway}
                    </div>
                  </div>
                </div>

                {/* Recommended Books in this step */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" /> Recommended Books for this Stage
                  </h3>

                  {booksInStep.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {booksInStep.map((book) => (
                        <BookCard key={book.slug} book={book} compact />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 text-xs text-gray-500">
                      Book guides for this step are being indexed.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
};
