import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Globe, ArrowRight } from 'lucide-react';
import { IAuthor } from '../../types/book.types';

interface AuthorCardProps {
  author: IAuthor;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <div className="group flex flex-col justify-between p-5 rounded-2xl border border-gray-200/80 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <Link
            to={`/books/authors/${author.slug}`}
            className="shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-100 group-hover:ring-blue-400 transition-all block"
          >
            <img
              src={author.portrait}
              alt={author.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {author.isIndian && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                  🇮🇳 Indian Author
                </span>
              )}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {author.nationality}
              </span>
            </div>
            <Link to={`/books/authors/${author.slug}`}>
              <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {author.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {author.profession?.join(' • ')}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
          {author.shortBiography || author.biography}
        </p>

        {author.fields && author.fields.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {author.fields.slice(0, 3).map((field) => (
              <span
                key={field}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          {author.bookCount || 1} {author.bookCount === 1 ? 'Book' : 'Books'} in Hub
        </span>
        <Link
          to={`/books/authors/${author.slug}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
