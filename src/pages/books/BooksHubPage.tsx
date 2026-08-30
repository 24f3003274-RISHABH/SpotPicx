import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Sparkles,
  Flame,
  Compass,
  ArrowRight,
  CheckCircle2,
  Filter,
  Layers,
  GraduationCap,
  Briefcase,
  Globe,
  Landmark,
  Code2,
  Brain,
  Rocket,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { BookApi } from '../../services/book.api';
import { IBook, BookCategoryDefinition, ReadingPathDefinition, EditorialCollectionDefinition } from '../../types/book.types';
import { BookCard } from '../../components/books/BookCard';
import { ReadingPathCard } from '../../components/books/ReadingPathCard';
import { EditorialCollectionCard } from '../../components/books/EditorialCollectionCard';
import { BookCompareModal } from '../../components/books/BookCompareModal';

export const BooksHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ slug?: string; topic?: string; goal?: string; career?: string }>();
  const location = useLocation();

  const isIndiaRoute = location.pathname === '/books/india';
  const isWorldRoute = location.pathname === '/books/world';
  const categoryFromRoute = routeParams.slug || searchParams.get('category') || 'all';
  const topicFromRoute = routeParams.topic || searchParams.get('topic') || '';
  const goalFromRoute = routeParams.goal || searchParams.get('purpose') || '';
  const careerFromRoute = routeParams.career || searchParams.get('career') || '';
  const searchQueryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [activeCategory, setActiveCategory] = useState(categoryFromRoute);
  const [activeTopic, setActiveTopic] = useState(topicFromRoute);
  const [activePurpose, setActivePurpose] = useState(goalFromRoute);
  const [activeCareer, setActiveCareer] = useState(careerFromRoute);
  const [activeLevel, setActiveLevel] = useState<string>('ALL');
  const [indianOnly, setIndianOnly] = useState<boolean>(isIndiaRoute);

  const [loading, setLoading] = useState(true);
  const [hubData, setHubData] = useState<{
    featuredBooks: IBook[];
    editorsPicks: IBook[];
    indianSpotlight: IBook[];
    studentEssentials: IBook[];
    categories: BookCategoryDefinition[];
    readingPurposes: Array<{ id: string; label: string; icon: string }>;
    careerPaths: Array<{ id: string; label: string; icon: string; description: string }>;
    readingPaths: ReadingPathDefinition[];
    editorialCollections: EditorialCollectionDefinition[];
    totalBooksCount: number;
  } | null>(null);

  const [browseBooks, setBrowseBooks] = useState<IBook[]>([]);
  const [browseTotal, setBrowseTotal] = useState(0);
  const [browseLoading, setBrowseLoading] = useState(false);

  // Comparison State
  const [compareList, setCompareList] = useState<IBook[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Sync state when route or search params change
  useEffect(() => {
    setActiveCategory(routeParams.slug || searchParams.get('category') || 'all');
    setActiveTopic(routeParams.topic || searchParams.get('topic') || '');
    setActivePurpose(routeParams.goal || searchParams.get('purpose') || '');
    setActiveCareer(routeParams.career || searchParams.get('career') || '');
    setSearchQuery(searchParams.get('q') || '');
    if (isIndiaRoute) {
      setIndianOnly(true);
    }
  }, [location.pathname, searchParams, routeParams]);

  useEffect(() => {
    loadHubData();
  }, []);

  useEffect(() => {
    fetchFilteredBooks();
  }, [activeCategory, activeTopic, activePurpose, activeCareer, activeLevel, indianOnly, searchQueryParam]);

  const loadHubData = async () => {
    setLoading(true);
    const data = await BookApi.getDiscoveryHub();
    if (data) {
      setHubData(data);
    }
    setLoading(false);
  };

  const fetchFilteredBooks = async () => {
    setBrowseLoading(true);
    const result = await BookApi.getBooks({
      category: activeCategory !== 'all' ? activeCategory : undefined,
      topic: activeTopic || undefined,
      readingPurpose: activePurpose || undefined,
      career: activeCareer || undefined,
      readingLevel: activeLevel !== 'ALL' ? activeLevel : undefined,
      isIndianAuthor: indianOnly ? true : undefined,
      search: searchQueryParam || undefined,
      limit: 24,
    });
    setBrowseBooks(result.books || []);
    setBrowseTotal(result.total || 0);
    setBrowseLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('q', searchQuery.trim());
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleToggleCompare = (book: IBook) => {
    if (compareList.some((b) => b.slug === book.slug)) {
      setCompareList(compareList.filter((b) => b.slug !== book.slug));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare up to 4 books simultaneously.');
        return;
      }
      setCompareList([...compareList, book]);
      setIsCompareModalOpen(true);
    }
  };

  const handleRemoveCompare = (slug: string) => {
    setCompareList(compareList.filter((b) => b.slug !== slug));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Discovery Engine Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Knowledge & Book Discovery Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find the Exact Book That Solves Your Next Goal
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Not just lists or ratings. Discover verified book metadata, structured takeaways,
            who should read what, and guided learning roadmaps from India and across the world.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-white/20">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, goal (e.g. 'Distributed Systems', 'Stoicism', 'AI')..."
                className="w-full bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden font-medium"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                Search Hub
              </button>
            </div>
          </form>

          {/* Quick Purpose Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1">Popular Goals:</span>
            {[
              { id: 'learn-programming', label: '💻 Learn Programming' },
              { id: 'start-startup', label: '🚀 Build a Startup' },
              { id: 'understand-indian-society', label: '🇮🇳 Indian History & Polity' },
              { id: 'build-habits', label: '⚡ Daily Discipline' },
              { id: 'improve-financial-knowledge', label: '📈 Investing Mindset' },
              { id: 'learn-philosophy', label: '🏛️ Stoicism' },
            ].map((goal) => (
              <button
                key={goal.id}
                onClick={() => {
                  setActivePurpose(activePurpose === goal.id ? '' : goal.id);
                  const newParams = new URLSearchParams(searchParams);
                  if (activePurpose === goal.id) newParams.delete('purpose');
                  else newParams.set('purpose', goal.id);
                  setSearchParams(newParams);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  activePurpose === goal.id
                    ? 'bg-blue-500 text-white font-bold ring-2 ring-blue-300'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Compare Floating Bar if user selected books */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
              {compareList.length}
            </span>
            <span className="text-xs font-semibold">Books in Decision Matrix</span>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            Open Comparison ({compareList.length})
          </button>
          <button
            onClick={() => setCompareList([])}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Navigation Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Link
            to="/books/categories"
            className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600">20+ Categories</div>
              <div className="text-[11px] text-gray-500">Tech, History, Business</div>
            </div>
          </Link>

          <Link
            to="/books/authors"
            className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600">Author Directory</div>
              <div className="text-[11px] text-gray-500">Indian & Global Thinkers</div>
            </div>
          </Link>

          <Link
            to="/books/paths"
            className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-600">Reading Paths</div>
              <div className="text-[11px] text-gray-500">Step-by-Step Roadmaps</div>
            </div>
          </Link>

          <Link
            to="/books/collections"
            className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-amber-300 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900 group-hover:text-amber-600">Curated Lists</div>
              <div className="text-[11px] text-gray-500">Hand-picked Essentials</div>
            </div>
          </Link>
        </div>

        {/* Section 1: Curated Editorial Reading Paths */}
        {hubData?.readingPaths && hubData.readingPaths.length > 0 && !searchQueryParam && activeCategory === 'all' && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">Step-by-Step Roadmaps</span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Structured Reading Paths</h2>
              </div>
              <Link
                to="/books/paths"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                View all paths <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hubData.readingPaths.slice(0, 3).map((path) => (
                <ReadingPathCard key={path.id} path={path} />
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Spotlight on Indian Authors & Heritage */}
        {hubData?.indianSpotlight && hubData.indianSpotlight.length > 0 && !searchQueryParam && activeCategory === 'all' && (
          <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-50 border border-amber-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Spotlight: Indian Authors & Thought</h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Foundational books on Indian history, democracy, philosophy, memoirs, and science.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIndianOnly(!indianOnly)}
                className="text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                {indianOnly ? 'Showing All' : 'Filter Indian Only'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hubData.indianSpotlight.slice(0, 3).map((book) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  onCompareToggle={handleToggleCompare}
                  isComparing={compareList.some((b) => b.slug === book.slug)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Interactive Discovery & Filter Grid */}
        <section className="mb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Browse Knowledge & Discovery Directory</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {browseTotal} verified book guides matching your criteria
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category selector */}
              <select
                value={activeCategory}
                onChange={(e) => {
                  setActiveCategory(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value === 'all') newParams.delete('category');
                  else newParams.set('category', e.target.value);
                  setSearchParams(newParams);
                }}
                className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden"
              >
                <option value="all">All Categories ({hubData?.categories?.length || 12})</option>
                {hubData?.categories?.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Difficulty Level */}
              <select
                value={activeLevel}
                onChange={(e) => setActiveLevel(e.target.value)}
                className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden"
              >
                <option value="ALL">All Reading Levels</option>
                <option value="BEGINNER">Beginner Friendly</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced / In-Depth</option>
                <option value="ALL_LEVELS">All Levels</option>
              </select>

              {/* Indian Author Toggle */}
              <button
                onClick={() => setIndianOnly(!indianOnly)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                  indianOnly
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                🇮🇳 Indian Authors
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(activeCategory !== 'all' || activeTopic || activePurpose || activeCareer || activeLevel !== 'ALL' || indianOnly || searchQueryParam) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-gray-200">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </span>

              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                  Category: {hubData?.categories?.find(c => c.slug === activeCategory)?.name || activeCategory}
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('category');
                      setSearchParams(newParams);
                    }}
                    className="hover:text-blue-900 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {activeTopic && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                  Topic: {activeTopic}
                  <button onClick={() => setActiveTopic('')} className="hover:text-purple-900 font-bold ml-1">×</button>
                </span>
              )}

              {activePurpose && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  Goal: {hubData?.readingPurposes?.find(p => p.id === activePurpose)?.label || activePurpose}
                  <button onClick={() => setActivePurpose('')} className="hover:text-emerald-900 font-bold ml-1">×</button>
                </span>
              )}

              {activeCareer && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  Career: {hubData?.careerPaths?.find(c => c.id === activeCareer)?.label || activeCareer}
                  <button onClick={() => setActiveCareer('')} className="hover:text-indigo-900 font-bold ml-1">×</button>
                </span>
              )}

              {indianOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">
                  🇮🇳 Indian Authors Only
                  <button onClick={() => setIndianOnly(false)} className="hover:text-amber-900 font-bold ml-1">×</button>
                </span>
              )}

              {searchQueryParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                  Search: "{searchQueryParam}"
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('q');
                      setSearchParams(newParams);
                    }}
                    className="hover:text-gray-950 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveTopic('');
                  setActivePurpose('');
                  setActiveCareer('');
                  setActiveLevel('ALL');
                  setIndianOnly(false);
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {browseLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-gray-500">Loading verified book guides...</p>
            </div>
          ) : browseBooks.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
              <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No books found for this combination</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Try resetting your filters or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActivePurpose('');
                  setActiveCareer('');
                  setActiveLevel('ALL');
                  setIndianOnly(false);
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="text-xs font-bold px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {browseBooks.map((book) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  onCompareToggle={handleToggleCompare}
                  isComparing={compareList.some((b) => b.slug === book.slug)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Curated Editorial Collections */}
        {hubData?.editorialCollections && hubData.editorialCollections.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-amber-700 font-bold text-xs uppercase tracking-wider">SpotPicx Curated</span>
                <h2 className="text-2xl font-extrabold text-gray-900">Editorial Reading Collections</h2>
              </div>
              <Link
                to="/books/collections"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
              >
                View all collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hubData.editorialCollections.slice(0, 2).map((col) => (
                <EditorialCollectionCard key={col.id} collection={col} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Comparison Modal */}
      <BookCompareModal
        books={compareList}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveBook={handleRemoveCompare}
      />
    </div>
  );
};
