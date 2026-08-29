import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Route, ArrowLeft, RefreshCw, Compass } from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { ReadingPathDefinition } from '../../types/book.types';
import { ReadingPathCard } from '../../components/books/ReadingPathCard';

export const ReadingPathsPage: React.FC = () => {
  const [paths, setPaths] = useState<ReadingPathDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    setLoading(true);
    const data = await BookApi.getReadingPaths();
    setPaths(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/books" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Books Hub
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" /> Guided Knowledge Roadmaps
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Curated Reading Paths
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Follow step-by-step reading sequences designed to take you from foundational basics to master-level domain competency without getting overwhelmed.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500">Loading reading paths...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paths.map((path) => (
              <ReadingPathCard key={path.id} path={path} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
