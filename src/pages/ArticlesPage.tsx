import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  User,
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Tag,
  Compass,
} from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { articleService } from '../services/article.service';
import { Article } from '../types';

export const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const data = await articleService.getAllArticles();
        setArticles(data);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const categories = ['ALL', 'Food Trails', 'Coffee & Cafes', 'Romantic Escapes', 'Shopping & Bazaars'];

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'ALL' && !art.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const listArticles = filteredArticles.filter((a) => a.slug !== featuredArticle?.slug);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Delhi City Guides & Editorial Stories | SpotPicks Magazine"
        description="Immerse in curated stories on Delhi food trails, hidden aesthetic cafes, romantic heritage date spots, and bargaining guides for legendary bazaars."
        canonicalUrl="https://spotpicks.delhi/articles"
        keywords={['delhi food guides', 'delhi street food trail', 'delhi cafe guides', 'romantic places delhi', 'sarojini nagar guide']}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-indigo-300 mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-semibold">Delhi Magazine & Editorial Guides</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                SpotPicks Editorial Magazine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
                Delhi Guides & Cultural Stories
              </h1>
              <p className="text-slate-300 text-base sm:text-lg">
                Curated insider itineraries, culinary trails, and neighborhood deep dives written by passionate local Delhi curators.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search stories, topics, areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-md"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'ALL' ? 'All Stories' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-sm text-slate-500 font-medium">Loading Delhi editorial magazine...</p>
          </div>
        ) : (
          <>
            {/* Featured Story Banner */}
            {featuredArticle && !searchQuery && selectedCategory === 'ALL' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden group hover:shadow-md transition">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-100">
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Cover Story
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        <span>{featuredArticle.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredArticle.readingTimeMinutes} min read
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition leading-tight">
                        <Link to={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={featuredArticle.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={featuredArticle.author}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 block font-bold">{featuredArticle.author}</strong>
                          <span className="text-[11px] text-slate-500">{featuredArticle.authorRole || 'Delhi Curator'}</span>
                        </div>
                      </div>

                      <Link
                        to={`/articles/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
                      >
                        Read Story
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Articles */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {searchQuery ? `Search Results (${filteredArticles.length})` : 'Latest Curated Stories'}
                </h3>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <Compass className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">No stories match your criteria</h4>
                  <p className="text-xs text-slate-500 mt-1">Try searching for different keywords or clear your filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(searchQuery || selectedCategory !== 'ALL' ? filteredArticles : listArticles).map((art) => (
                    <article
                      key={art._id || art.slug}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col group"
                    >
                      <div className="h-48 relative overflow-hidden bg-slate-100">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                          {art.category}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="h-3 w-3" />
                              {art.readingTimeMinutes} min read
                            </span>
                            <span>•</span>
                            <span>{art.author}</span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                            <Link to={`/articles/${art.slug}`}>{art.title}</Link>
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>

                        {art.tags && art.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                            {art.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
