import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  ArrowLeft,
  ArrowRight,
  Share2,
  Bookmark,
  Building,
  Calendar,
  Globe,
  FileText,
  User,
  Info,
  ChevronRight,
} from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IBook, IAuthor } from '../../types/book.types';
import { BookCard } from '../../components/books/BookCard';

export const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    book: IBook;
    authorDetails: IAuthor[];
    authorOtherBooks: IBook[];
    relatedBooks: IBook[];
    jsonLd?: any;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      loadBookData(slug);
    }
  }, [slug]);

  const loadBookData = async (bookSlug: string) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const res = await BookApi.getBookBySlug(bookSlug);
    if (res) {
      setData(res);
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.book.title || 'Book on SpotPicx',
        text: data?.book.shortDescription || '',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-10 h-10 text-blue-600 animate-bounce mx-auto mb-3" />
          <p className="text-xs font-semibold text-gray-500">Loading Book Discovery Guide...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.book) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 text-center shadow-lg">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Book Guide Not Found</h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            The book guide you requested could not be located in the SpotPicx database.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Books Hub
          </Link>
        </div>
      </div>
    );
  }

  const { book, authorDetails, authorOtherBooks, relatedBooks, jsonLd } = data;

  const readingLevelBadge = {
    BEGINNER: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    INTERMEDIATE: 'bg-blue-50 text-blue-800 border-blue-200',
    ADVANCED: 'bg-purple-50 text-purple-800 border-purple-200',
    ALL_LEVELS: 'bg-amber-50 text-amber-800 border-amber-200',
  }[book.readingLevel || 'BEGINNER'];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Inject JSON-LD */}
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
            <Link to={`/books?category=${book.category}`} className="hover:text-blue-600 capitalize">
              {book.category.replace(/-/g, ' ')}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">{book.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Book Hero Block */}
      <section className="bg-white border-b border-gray-200/80 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Book Cover + Purchase/Library Links */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center md:items-start">
              <div className="w-48 sm:w-56 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-200/80 relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                {book.isPublicDomain && (
                  <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    Public Domain
                  </div>
                )}
              </div>

              {/* Verified Metadata Pill */}
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold w-full justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{book.freshnessStatus || 'Verified Metadata'}</span>
              </div>

              {/* Legitimate Purchase / Digital Links */}
              <div className="mt-4 w-full space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Legitimate Official Sources
                </div>

                {book.legitimatePurchaseLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors text-xs font-semibold text-gray-800"
                  >
                    <span>{link.label || `Get on ${link.storeOrPlatform}`}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                ))}

                {book.legitimateDigitalLinks?.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                ))}

                {book.isPublicDomain && book.publicDomainSourceUrl && (
                  <a
                    href={book.publicDomainSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    <span>Read Free on Project Gutenberg</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Title, Subtitle, Author, Metadata Stats, Why Read Teaser */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${readingLevelBadge}`}>
                  {book.readingLevel}
                </span>

                {book.isIndianAuthor && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-900 border border-orange-200">
                    🇮🇳 Indian Author
                  </span>
                )}

                {book.editorPick && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Editor's Choice
                  </span>
                )}

                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Published: {book.publicationYear}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="mt-1 text-base sm:text-lg text-gray-600 font-medium">
                  {book.subtitle}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-700 font-medium">
                <span>By</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {book.authors?.map((author, index) => {
                    const slug = author.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    return (
                      <Link
                        key={author}
                        to={`/books/authors/${slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        <User className="w-3.5 h-3.5" />
                        {author}
                        {index < book.authors.length - 1 ? ',' : ''}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Fast Facts Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Estimated Reading Time</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {book.estimatedReadingTime || '6-8 hours'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Length</span>
                  <span className="font-bold text-gray-900 mt-0.5 block">
                    {book.pageCount ? `${book.pageCount} pages` : 'Standard Length'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Publisher</span>
                  <span className="font-bold text-gray-900 mt-0.5 block truncate">
                    {book.publisher}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Latest Edition</span>
                  <span className="font-bold text-gray-900 mt-0.5 block truncate">
                    {book.latestKnownEdition || `${book.publicationYear} Edition`}
                  </span>
                </div>
              </div>

              {/* Core "Why You Should Read This" Highlight Box */}
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-slate-50 border border-blue-200/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Why You Should Read This Book
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {book.whyRead}
                </p>
                {book.importance && (
                  <p className="text-xs text-slate-600 mt-2 italic">
                    <span className="font-semibold not-italic">Industry Impact:</span> {book.importance}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep-Dive Editorial Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Summary & Overview */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Book Overview & Scope
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                <p>{book.description}</p>
                {book.summary && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Structured Content Summary
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{book.summary}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 2. Key Ideas & Core Takeaways */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" /> Key Ideas & Mental Models
              </h2>
              <div className="space-y-3">
                {book.keyIdeas?.map((idea, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">{idea}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Who Should Read vs Who Should Not Read */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs bg-emerald-50/20">
                <h3 className="text-base font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Who Should Read This
                </h3>
                <ul className="space-y-2.5 text-xs text-emerald-950 font-medium">
                  {book.whoShouldRead?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 shrink-0 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-rose-200/80 shadow-xs bg-rose-50/20">
                <h3 className="text-base font-bold text-rose-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" /> Who Should Pass
                </h3>
                <ul className="space-y-2.5 text-xs text-rose-950 font-medium">
                  {(book.whoShouldNotRead || [
                    'Readers who already master the foundational topics and want bleeding-edge academic research papers.',
                  ]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 shrink-0 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 4. Prerequisites */}
            {book.prerequisites && book.prerequisites.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs bg-amber-50/10">
                <h2 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" /> Recommended Prerequisites
                </h2>
                <div className="flex flex-wrap gap-2">
                  {book.prerequisites.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-amber-100/70 text-amber-900 font-semibold px-3 py-1.5 rounded-xl border border-amber-200"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Author Profile Spotlight */}
            {authorDetails && authorDetails.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Author Spotlight
                </h2>

                <div className="space-y-6">
                  {authorDetails.map((author) => (
                    <div key={author.slug} className="flex flex-col sm:flex-row items-start gap-5">
                      <img
                        src={author.portrait}
                        alt={author.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`/books/authors/${author.slug}`}
                            className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {author.name}
                          </Link>
                          {author.isIndian && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                              🇮🇳 Indian
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {author.nationality} • {author.profession?.join(', ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          {author.biography}
                        </p>
                        <div className="mt-3">
                          <Link
                            to={`/books/authors/${author.slug}`}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                          >
                            View Author Biography & Bibliography <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. More Books by Author */}
            {authorOtherBooks && authorOtherBooks.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    More Books by {book.primaryAuthor}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {authorOtherBooks.map((b) => (
                    <BookCard key={b.slug} book={b} compact />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Edition & Verification Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-gray-500">
                Edition & Publication Details
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Original Publication</span>
                  <span className="font-semibold text-gray-900">{book.publicationYear}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Publisher</span>
                  <span className="font-semibold text-gray-900">{book.publisher}</span>
                </div>
                {book.latestKnownEdition && (
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Latest Edition</span>
                    <span className="font-semibold text-gray-900">{book.latestKnownEdition}</span>
                  </div>
                )}
                {book.isbn13 && (
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">ISBN-13</span>
                    <span className="font-mono font-semibold text-gray-900">{book.isbn13}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Language</span>
                  <span className="font-semibold text-gray-900">{book.language}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Formats</span>
                  <span className="font-semibold text-gray-900">{book.format?.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Taxonomy & Topics */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Classification & Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {book.topics?.map((topic) => (
                  <Link
                    key={topic}
                    to={`/books?topic=${encodeURIComponent(topic)}`}
                    className="text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-colors"
                  >
                    #{topic}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Recommendations */}
            {relatedBooks && relatedBooks.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" /> Similar Recommended Books
                </h3>
                <div className="space-y-3">
                  {relatedBooks.map((rel) => (
                    <BookCard key={rel.slug} book={rel} compact />
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
