import React from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle, AlertCircle, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { IBook } from '../../types/book.types';

interface BookCompareModalProps {
  books: IBook[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveBook: (slug: string) => void;
}

export const BookCompareModal: React.FC<BookCompareModalProps> = ({
  books,
  isOpen,
  onClose,
  onRemoveBook,
}) => {
  if (!isOpen || books.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Side-by-Side Book Decision Matrix</h2>
              <p className="text-xs text-gray-500">
                Compare difficulty, prerequisites, time investment, and core takeaways to pick the right next read.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-[760px]">
            {books.map((book) => (
              <div
                key={book.slug}
                className="flex flex-col rounded-2xl border border-gray-200 p-4 bg-white shadow-xs relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemoveBook(book.slug)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Top overview */}
                <div className="flex gap-3 items-start mb-4 pr-6">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-lg shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      by {book.authors?.join(', ') || book.primaryAuthor}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {book.readingLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compare Attributes */}
                <div className="space-y-3 text-xs text-gray-600 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">⏱️ Time Commitment</span>
                    <span>{book.estimatedReadingTime} ({book.pageCount || '~300'} pages)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-1">🎯 Why Read This</span>
                    <p className="line-clamp-3 text-blue-950 italic">"{book.whyRead}"</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">🔑 Core Key Ideas</span>
                    <ul className="space-y-1 list-disc list-inside">
                      {book.keyIdeas?.slice(0, 3).map((idea, i) => (
                        <li key={i} className="line-clamp-2">{idea}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">✅ Ideal For</span>
                    <p className="line-clamp-2 text-emerald-950">{book.whoShouldRead?.slice(0, 2).join(' • ')}</p>
                  </div>

                  {book.prerequisites && book.prerequisites.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1">⚡ Prerequisites</span>
                      <p className="line-clamp-2 text-amber-950">{book.prerequisites.join(', ')}</p>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">📚 Edition & Publisher</span>
                    <p className="line-clamp-1">{book.publisher} ({book.publicationYear})</p>
                    {book.latestKnownEdition && (
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        Latest: {book.latestKnownEdition}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    to={`/books/${book.slug}`}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    View Complete Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-slate-50 flex items-center justify-between text-xs text-gray-500">
          <span>Comparing {books.length} of max 4 books</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
