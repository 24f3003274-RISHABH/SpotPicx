import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';
import { GuidesService } from '../../services/guides.service';
import { getGuideFreshness } from '../../utils/guideFreshness';

export const GuidesIndexPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [freshnessFilter, setFreshnessFilter] = useState<'ALL' | 'FRESH_ONLY'>('ALL');

  // Load all published guides
  const allGuides = useMemo(() => {
    return GuidesService.getAllGuides(false); // only published for public index
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allGuides.forEach(g => set.add(g.category));
    return ['All', ...Array.from(set)];
  }, [allGuides]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    allGuides.forEach(g => {
      if (g.state) set.add(g.state);
      else if (g.location) set.add(g.location);
    });
    return ['All', ...Array.from(set)];
  }, [allGuides]);

  const featuredGuides = useMemo(() => {
    return allGuides.filter(g => g.isFeatured).slice(0, 3);
  }, [allGuides]);

  const filteredGuides = useMemo(() => {
    return allGuides.filter(guide => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.seo.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guide.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || guide.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLocation =
        selectedLocation === 'All' ||
        guide.state.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        guide.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const freshness = getGuideFreshness(guide.lastReviewedDate);
      const matchesFreshness = freshnessFilter === 'ALL' || freshness.status === 'FRESH';

      return matchesSearch && matchesCategory && matchesLocation && matchesFreshness;
    });
  }, [allGuides, searchQuery, selectedCategory, selectedLocation, freshnessFilter]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SpotPicks Top 10 Guides — Factual Editorial Travel & Lifestyle Directory',
    description:
      'Curated directory of high-quality, factual Top 10 guides across Delhi, Uttarakhand, Uttar Pradesh, Rajasthan, and India. Reviewed under a strict 90-day verification policy.',
    url: 'https://spotpicks.in/guides',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: filteredGuides.map((g, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://spotpicks.in/guides/${g.slug}`,
        name: g.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="SpotPicks Top 10 Guides — Verified Factual Editorial Travel Directory"
        description="Explore 15+ comprehensive, verified Top 10 guides across Delhi, Uttarakhand, Rajasthan, UP, and India. Unbiased editorial selections with 90-day freshness reviews."
        canonicalUrl="https://spotpicks.in/guides"
        jsonLd={jsonLd}
        keywords={[
          'spotpicks guides',
          'top 10 places in delhi',
          'delhi travel guides',
          'weekend getaways from delhi',
          'top 10 cafes in delhi',
          'heritage places rajasthan',
          'spiritual places india',
        ]}
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 md:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wide">
              <BookOpen className="w-3.5 h-3.5" />
              SpotPicks Editorial Content Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              90-Day Freshness Verification Policy
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Top 10 Guides
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-normal">
              Factual, editorially verified guides across Delhi NCR, Himalayan valleys, and heritage states.
              Every guide adheres to transparent selection criteria with zero paid commercial rankings.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, monument, street food, state, or location..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-950 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-700 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Guides Bento Grid */}
      {searchQuery === '' && selectedCategory === 'All' && selectedLocation === 'All' && (
        <section className="max-w-6xl mx-auto px-4 md:px-8 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredGuides.map((guide, idx) => (
              <Link
                key={guide.id}
                to={`/guides/${guide.slug}`}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img
                      src={guide.heroImage}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                        Featured #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                      {guide.category} • {guide.location}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {guide.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{guide.items?.length || 10} Verified Places</span>
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Read Guide <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Main Content Area with Filters & Guide Grid */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-12 space-y-8">
        {/* Filters bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Filter Guides</span>
              <span className="text-xs text-slate-500 font-normal">({filteredGuides.length} guides found)</span>
            </div>

            {/* Freshness toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFreshnessFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  freshnessFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Guides
              </button>
              <button
                onClick={() => setFreshnessFilter('FRESH_ONLY')}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  freshnessFilter === 'FRESH_ONLY'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Reviewed &lt; 60 Days</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px] shrink-0 mr-1">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Location Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px] shrink-0 mr-1">Region:</span>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedLocation === loc
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <Compass className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No guides matching your criteria</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords or resetting filters to browse all 15 editorial guides.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLocation('All');
                setFreshnessFilter('ALL');
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => {
              const freshness = getGuideFreshness(guide.lastReviewedDate);
              return (
                <article
                  key={guide.id}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Card Thumbnail */}
                    <div className="relative aspect-[16/10] bg-slate-100 border-b border-slate-100 overflow-hidden">
                      <img
                        src={guide.heroImage}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
                          {guide.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-semibold rounded-md shadow-sm">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          {guide.location}, {guide.state}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-5 space-y-2">
                      {/* Freshness pill */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full ${
                            freshness.status === 'FRESH'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {freshness.label}
                        </span>
                        <span className="text-slate-400">{guide.items?.length || 10} places</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 leading-snug">
                        <Link to={`/guides/${guide.slug}`} className="hover:text-amber-700 transition-colors">
                          {guide.title}
                        </Link>
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pt-4 pb-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                      <span className="truncate">{guide.author?.name || 'SpotPicks Desk'}</span>
                    </div>

                    <Link
                      to={`/guides/${guide.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-200 transition-colors"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Quality Commitment Section */}
        <section className="bg-slate-900 text-slate-200 rounded-3xl p-6 md:p-10 border border-slate-800 space-y-6 mt-12">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-semibold">
              <FileCheck2 className="w-3.5 h-3.5" />
              SpotPicks Editorial Standards
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Why SpotPicks Top 10 Guides are Different
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We never generate thin duplicate content or use paid sponsorship to determine rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1.5">
              <h3 className="font-bold text-sm text-amber-400">1. Verified Factual Precision</h3>
              <p className="leading-relaxed text-slate-300">
                Operating hours, ticket prices, and transit routes are cross-checked against official department registries (ASI, DTTDC, UTDB).
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1.5">
              <h3 className="font-bold text-sm text-amber-400">2. 90-Day Freshness Audits</h3>
              <p className="leading-relaxed text-slate-300">
                Every guide undergoes mandatory quarterly reviews to update price changes, Metro line expansions, and operational timings.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1.5">
              <h3 className="font-bold text-sm text-amber-400">3. Transparent Methodology</h3>
              <p className="leading-relaxed text-slate-300">
                We clearly disclose our selection rationale — whether Editor's Selection, Historical Significance, or Field Surveys — without fake claims.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
