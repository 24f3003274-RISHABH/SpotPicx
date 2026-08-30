import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, RefreshCw, Library } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { EditorialCollectionDefinition } from '../../types/book.types';
import { EditorialCollectionCard } from '../../components/books/EditorialCollectionCard';

export const BookCollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<EditorialCollectionDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setLoading(true);
    const data = await BookApi.getEditorialCollections();
    setCollections(data);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Editorial Lists
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Curated Book Collections
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Thematic reading selections crafted by the SpotPicx Editorial Team, covering Computer Science foundations, Startup Playbooks, Indian History, and Habit Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
            <Library className="w-4 h-4 text-amber-600" />
            Showing {collections.length} Editorial Collections
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading curated collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center">
            <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No collections found</h3>
            <p className="text-xs text-gray-500 mt-1">Check back soon for new curated reading lists.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <EditorialCollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
