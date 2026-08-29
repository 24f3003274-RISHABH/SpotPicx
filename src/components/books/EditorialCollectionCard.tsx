import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Library } from 'lucide-react';
import { EditorialCollectionDefinition } from '../../types/book.types';

interface EditorialCollectionCardProps {
  collection: EditorialCollectionDefinition;
}

export const EditorialCollectionCard: React.FC<EditorialCollectionCardProps> = ({ collection }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-slate-50 to-amber-50/30 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {collection.badge}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            {collection.bookSlugs?.length || 0} Books
          </span>
        </div>

        <Link to={`/books/collections/${collection.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors leading-snug mb-1">
            {collection.title}
          </h3>
        </Link>

        <p className="text-xs font-medium text-amber-800/80 mb-3">
          {collection.subtitle}
        </p>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {collection.description}
        </p>
      </div>

      <div className="pt-3 border-t border-amber-100/60 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
          <Library className="w-3.5 h-3.5 text-amber-600" /> Curated Reading List
        </span>
        <Link
          to={`/books/collections/${collection.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Explore List <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
