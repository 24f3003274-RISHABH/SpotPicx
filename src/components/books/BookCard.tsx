import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Sparkles, ExternalLink, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { IBook } from '../../types/book.types';

interface BookCardProps {
  book: IBook;
  onCompareToggle?: (book: IBook) => void;
  isComparing?: boolean;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onCompareToggle,
  isComparing = false,
  compact = false,
}) => {
  const readingLevelColor = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INTERMEDIATE: 'bg-blue-50 text-blue-700 border-blue-200',
    ADVANCED: 'bg-purple-50 text-purple-700 border-purple-200',
    ALL_LEVELS: 'bg-amber-50 text-amber-700 border-amber-200',
  }[book.readingLevel || 'BEGINNER'];

  if (compact) {
    return (
      <div className="group flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all">
        <Link to={`/books/${book.slug}`} className="shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-gray-100 shadow-sm relative">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${readingLevelColor}`}>
                {book.readingLevel}
              </span>
              {book.isIndianAuthor && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  🇮🇳 Indian Author
                </span>
              )}
            </div>
            <Link to={`/books/${book.slug}`} className="block">
              <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {book.title}
              </h4>
            </Link>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              by {book.authors?.join(', ') || book.primaryAuthor} ({book.publicationYear})
            </p>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <span className="text-xs text-gray-400 font-medium">
              {book.estimatedReadingTime || '6 hrs'}
            </span>
            <Link
              to={`/books/${book.slug}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Why Read <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300">
      {/* Cover & Badges Header */}
      <div className="relative p-5 pb-0 flex gap-4">
        <Link
          to={`/books/${book.slug}`}
          className="shrink-0 w-28 h-40 rounded-xl overflow-hidden bg-gray-100 shadow-md relative group/cover block"
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {book.isPublicDomain && (
            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-center bg-gray-900/85 text-white py-0.5 rounded px-1 backdrop-blur-xs">
              Public Domain
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${readingLevelColor}`}>
              {book.readingLevel}
            </span>
            {book.isIndianAuthor && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                🇮🇳 Indian Author
              </span>
            )}
            {book.editorPick && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Editor's Pick
              </span>
            )}
          </div>

          <Link to={`/books/${book.slug}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
              {book.title}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mt-1 font-medium line-clamp-1">
            by{' '}
            {book.authors?.map((author, idx) => (
              <span key={author}>
                <Link
                  to={`/books/authors/${author.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                  className="hover:text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author}
                </Link>
                {idx < book.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span>{book.publicationYear}</span>
            <span>•</span>
            <span className="truncate">{book.publisher}</span>
          </div>
        </div>
      </div>

      {/* Why Read / Key Insight Block */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
            {book.shortDescription || book.description}
          </p>

          {/* Quick takeaway banner */}
          {book.whyRead && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Why Read This
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 italic">
                "{book.whyRead}"
              </p>
            </div>
          )}

          {/* Topics & Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(book.topics || []).slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
              >
                #{topic}
              </span>
            ))}
            {(book.topics?.length || 0) > 3 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{(book.topics?.length || 0) - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {onCompareToggle ? (
            <button
              onClick={() => onCompareToggle(book)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                isComparing
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isComparing ? 'Comparing ✓' : '+ Compare'}
            </button>
          ) : (
            <span className="text-xs text-gray-400">
              {book.pageCount ? `${book.pageCount} pages` : book.estimatedReadingTime}
            </span>
          )}

          <Link
            to={`/books/${book.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors"
          >
            Explore Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
