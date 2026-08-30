import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, BookOpen, ChevronRight, RefreshCw, Library, ShieldCheck } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { EditorialCollectionDefinition, IBook } from '../../types/book.types';
import { BookCard } from '../../components/books/BookCard';

export const BookCollectionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    collection: EditorialCollectionDefinition;
    books: IBook[];
  } | null>(null);

  useEffect(() => {
    if (slug) {
      loadCollection(slug);
    }
  }, [slug]);

  const loadCollection = async (collectionSlug: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const res = await BookApi.getEditorialCollectionBySlug(collectionSlug);
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Library className="w-10 h-10 text-amber-600 animate-bounce mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading Editorial Collection...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.collection) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-lg">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Collection Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The requested editorial reading list could not be found.
          </p>
          <Link
            to="/books/collections"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Browse All Collections
          </Link>
        </div>
      </div>
    );
  }

  const { collection, books } = data;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-500">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/books" className="hover:text-amber-700">Books</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/books/collections" className="hover:text-amber-700">Collections</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-semibold text-gray-900 line-clamp-1">{collection.title}</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {collection.badge}
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {books.length} Verified Books
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
            {collection.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-200/90 font-medium mt-2 max-w-2xl">
            {collection.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 max-w-3xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Book Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Verified Books in this Collection
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Each book contains verified metadata, key ideas, prerequisites, and purchase/library avenues.
            </p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">Books currently being indexed</h3>
            <p className="text-xs text-gray-500 mt-1">Our editorial desk is completing verification for these entries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
