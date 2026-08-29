import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  BookOpen,
  Globe,
  ExternalLink,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IAuthor, IBook } from '../../types/book.types';
import { BookCard } from '../../components/books/BookCard';
import { AuthorCard } from '../../components/books/AuthorCard';

export const AuthorDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    author: IAuthor;
    books: IBook[];
    relatedAuthors: IAuthor[];
    jsonLd?: any;
  } | null>(null);

  useEffect(() => {
    if (slug) {
      loadAuthor(slug);
    }
  }, [slug]);

  const loadAuthor = async (authorSlug: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const res = await BookApi.getAuthorBySlug(authorSlug);
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-10 h-10 text-indigo-600 animate-bounce mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading Author Profile...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.author) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-lg">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Author Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The author profile you are looking for does not exist in our directory.
          </p>
          <Link
            to="/books/authors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Authors
          </Link>
        </div>
      </div>
    );
  }

  const { author, books, relatedAuthors, jsonLd } = data;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link to="/books" className="hover:text-blue-600">Books</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link to="/books/authors" className="hover:text-blue-600">Authors</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-semibold text-gray-900 line-clamp-1">{author.name}</span>
          </div>
        </div>
      </div>

      {/* Author Hero Header */}
      <section className="bg-white border-b border-gray-200/80 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-xl shrink-0">
              <img
                src={author.portrait}
                alt={author.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-2">
                {author.isIndian && (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
                    🇮🇳 Indian Author
                  </span>
                )}
                <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {author.nationality}
                </span>
                {author.birthYear && (
                  <span className="text-xs text-gray-500">
                    ({author.birthYear} {author.deathYear ? `– ${author.deathYear}` : '– Present'})
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {author.name}
              </h1>

              <p className="text-sm font-semibold text-indigo-600 mt-1">
                {author.profession?.join(' • ')}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 mt-3 max-w-3xl leading-relaxed">
                {author.biography}
              </p>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs font-semibold">
                {author.officialWebsite && (
                  <a
                    href={author.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                  >
                    <Globe className="w-3.5 h-3.5" /> Official Website
                  </a>
                )}
                {author.wikipediaUrl && (
                  <a
                    href={author.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Wikipedia
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Books in SpotPicx */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Verified Books & Guides by {author.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {books.length} publications indexed in the discovery engine
                  </p>
                </div>
              </div>

              {books.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center">
                  <p className="text-xs text-gray-500">No books indexed for this author yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.slug} book={book} />
                  ))}
                </div>
              )}
            </div>

            {/* Notable Works list */}
            {author.notableWorks && author.notableWorks.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Notable Masterpieces & Contributions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {author.notableWorks.map((work) => (
                    <span
                      key={work}
                      className="text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200"
                    >
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Fields & Expertise */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Fields & Expertise
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {author.fields?.map((field) => (
                  <span
                    key={field}
                    className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Authors */}
            {relatedAuthors && relatedAuthors.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Similar Thinkers & Authors
                </h3>
                <div className="space-y-4">
                  {relatedAuthors.map((rel) => (
                    <div key={rel.slug} className="flex items-center gap-3">
                      <img
                        src={rel.portrait}
                        alt={rel.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/books/authors/${rel.slug}`}
                          className="text-xs font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
                        >
                          {rel.name}
                        </Link>
                        <span className="text-[11px] text-gray-500 line-clamp-1">
                          {rel.nationality} • {rel.fields?.[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
