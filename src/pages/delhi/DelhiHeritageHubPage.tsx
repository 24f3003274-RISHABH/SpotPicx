import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  Filter,
  Train,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { Badge } from '../../components/ui/Badge';
import { DELHI_HERITAGE_CATEGORIES } from '../../data/delhi/heritageCategories';
import {
  ALL_DELHI_HERITAGE_PLACES,
  getPlacesByCategory,
  getTop10HeritagePlaces,
  get15MustVisitPlaces,
  getUNESCOPlaces,
  getMughalPlaces,
  getSultanatePlaces,
  getMuseumPlaces,
  getHiddenGems,
  searchHeritagePlaces,
} from '../../data/delhi/allDelhiHeritagePlaces';
import { DELHI_HERITAGE_GUIDES } from '../../data/delhi/heritageGuidesData';
import { HeritagePlaceCard } from '../../components/delhi/HeritagePlaceCard';
import { HeritageTimeline } from '../../components/delhi/HeritageTimeline';
import { HeritageMapModal } from '../../components/delhi/HeritageMapModal';
import { HeritageJsonLd } from '../../components/delhi/HeritageJsonLd';
import { DelhiHeritagePlace, HeritageCategory } from '../../types/delhiHeritage.types';

type QuickFilterType =
  | 'all'
  | 'top10'
  | 'mustvisit15'
  | 'unesco'
  | 'mughal'
  | 'sultanate'
  | 'museums'
  | 'hiddengems'
  | 'free';

export const DelhiHeritageHubPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<QuickFilterType>('all');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);
  const [activeMapPlace, setActiveMapPlace] = useState<DelhiHeritagePlace | null>(null);

  // Match category if URL param exists
  const activeCategoryMeta = useMemo(() => {
    if (!categorySlug) return null;
    return DELHI_HERITAGE_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
    );
  }, [categorySlug]);

  // Compute filtered places
  const filteredPlaces = useMemo(() => {
    let list: DelhiHeritagePlace[] = ALL_DELHI_HERITAGE_PLACES;

    // 1. If category param is active
    if (activeCategoryMeta) {
      list = getPlacesByCategory(activeCategoryMeta.id);
    } else {
      // Apply quick filter tabs
      switch (activeFilter) {
        case 'top10':
          list = getTop10HeritagePlaces();
          break;
        case 'mustvisit15':
          list = get15MustVisitPlaces();
          break;
        case 'unesco':
          list = getUNESCOPlaces();
          break;
        case 'mughal':
          list = getMughalPlaces();
          break;
        case 'sultanate':
          list = getSultanatePlaces();
          break;
        case 'museums':
          list = getMuseumPlaces();
          break;
        case 'hiddengems':
          list = getHiddenGems();
          break;
        case 'free':
          list = ALL_DELHI_HERITAGE_PLACES.filter((p) =>
            p.visitingInfo.entryFee.indianCitizens.toLowerCase().includes('free')
          );
          break;
        default:
          list = ALL_DELHI_HERITAGE_PLACES;
          break;
      }
    }

    // 2. Historic city filter from timeline
    if (selectedCityFilter) {
      list = list.filter(
        (p) =>
          p.historicCityAssociation &&
          selectedCityFilter.toLowerCase().includes(p.historicCityAssociation.toLowerCase())
      );
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.location.locality.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.dynastyOrEra.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategoryMeta, activeFilter, selectedCityFilter, searchQuery]);

  const handleCategoryClick = (slug: string) => {
    navigate(`/delhi/heritage/category/${slug}`);
  };

  const handleClearCategory = () => {
    navigate('/delhi/heritage');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <HeritageJsonLd
        type="hub"
        categoryName={activeCategoryMeta ? activeCategoryMeta.name : undefined}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-16 md:pt-20 md:pb-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80"
            alt="Delhi Heritage Background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <Container size="xl" className="relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/delhi" className="hover:text-white transition-colors">
              Delhi
            </Link>
            <span>/</span>
            {activeCategoryMeta ? (
              <>
                <Link to="/delhi/heritage" className="hover:text-white transition-colors">
                  Heritage & History
                </Link>
                <span>/</span>
                <span className="text-indigo-400 font-semibold">{activeCategoryMeta.name}</span>
              </>
            ) : (
              <span className="text-indigo-400 font-semibold">Heritage & History</span>
            )}
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Authoritative Heritage & History Guide • Delhi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {activeCategoryMeta ? activeCategoryMeta.name : 'Delhi Heritage & History'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
              {activeCategoryMeta
                ? activeCategoryMeta.description
                : 'Explore 3,000 years of living history across 13 specialized categories: from UNESCO masterpieces and Mughal garden tombs to medieval stepwells, ancient citadels, and premier museums.'}
            </p>

            {/* Search Bar */}
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monuments, stepwells, Mughal tombs, metro stations..."
                className="w-full h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 pl-12 pr-4 text-sm text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container size="xl" className="mt-8">
        {/* Category Navigation Pills */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Explore 13 Heritage Categories</span>
            </h2>
            {activeCategoryMeta && (
              <button
                type="button"
                onClick={handleClearCategory}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                View All Categories
              </button>
            )}
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={handleClearCategory}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                !activeCategoryMeta
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Categories ({ALL_DELHI_HERITAGE_PLACES.length})
            </button>
            {DELHI_HERITAGE_CATEGORIES.map((cat) => {
              const isActive = activeCategoryMeta?.id === cat.id;
              const count = getPlacesByCategory(cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Guides Highlight Section (Shown on main hub) */}
        {!activeCategoryMeta && (
          <section className="mb-14">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Curated Itineraries & Historical Essays
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Featured Heritage Guides
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DELHI_HERITAGE_GUIDES.slice(0, 3).map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/delhi/heritage/guide/${guide.slug}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={guide.heroImage}
                      alt={guide.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        <BookOpen className="h-3 w-3 text-indigo-400" />
                        {guide.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {guide.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                      <span>Read Editorial Guide</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all guides horizontal pill list */}
            <div className="mt-4 flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-500 py-1">More Guides:</span>
              {DELHI_HERITAGE_GUIDES.slice(3).map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/delhi/heritage/guide/${guide.slug}`}
                  className="text-xs font-medium text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 px-3 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <span>{guide.title.split(':')[0]}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick Filter Bar (When viewing all categories) */}
        {!activeCategoryMeta && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
            <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1 mr-2">
              <Filter className="h-3.5 w-3.5" /> Filter by:
            </span>

            {[
              { id: 'all', label: 'All Monuments' },
              { id: 'top10', label: '⭐ Top 10 Picks' },
              { id: 'mustvisit15', label: '🏛️ 15 Must Visit' },
              { id: 'unesco', label: '🏆 UNESCO Sites' },
              { id: 'mughal', label: '👑 Mughal Heritage' },
              { id: 'sultanate', label: '🕌 Delhi Sultanate' },
              { id: 'museums', label: '🏺 Museums' },
              { id: 'hiddengems', label: '💎 Hidden Historical' },
              { id: 'free', label: '🎟️ Free Entry' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as QuickFilterType)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Places Grid Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {activeCategoryMeta
                ? `${activeCategoryMeta.name} (${filteredPlaces.length})`
                : activeFilter === 'top10'
                ? 'Top 10 Heritage Places in Delhi'
                : activeFilter === 'mustvisit15'
                ? '15 Historical Places in Delhi'
                : activeFilter === 'unesco'
                ? 'UNESCO World Heritage Sites in Delhi'
                : `Historical Places & Monuments (${filteredPlaces.length})`}
            </h3>
            {selectedCityFilter && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md mt-1">
                <span>Associated City: {selectedCityFilter}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCityFilter(null)}
                  className="text-indigo-400 hover:text-indigo-700 ml-1"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Showing {filteredPlaces.length} verified historic sites
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <HeritagePlaceCard
                key={place.slug}
                place={place}
                onOpenMap={(p) => setActiveMapPlace(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No Historical Places Found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              No monuments match your current search and filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setSelectedCityFilter(null);
                navigate('/delhi/heritage');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Interactive 8 Historic Cities Timeline */}
        <HeritageTimeline
          selectedCity={selectedCityFilter}
          onSelectCity={(city) => setSelectedCityFilter(city)}
        />

        {/* All 13 Categories Showcase Grid */}
        <section className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Structured Architecture Taxonomies
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Explore Delhi by Heritage Classification
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Every landmark is verified and cross-referenced with Archaeological Survey of India (ASI) and INTACH records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DELHI_HERITAGE_CATEGORIES.map((cat) => {
              const count = getPlacesByCategory(cat.id).length;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group cursor-pointer rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {cat.era}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{count} Sites</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Explore Category</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Delhi Heritage FAQs */}
        <section className="my-16 rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Visiting Heritage Sites in Delhi
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed mb-8">
              Official ticketing, timings, metro accessibility, and visitor regulations verified with ASI and Delhi Tourism guidelines.
            </p>

            <div className="space-y-5">
              {[
                {
                  q: 'How many UNESCO World Heritage Sites are there in Delhi?',
                  a: 'Delhi is home to three designated UNESCO World Heritage Sites: Qutb Minar and its Monuments (inscribed 1993), Humayun’s Tomb (inscribed 1993), and the Red Fort Complex (inscribed 2007).',
                },
                {
                  q: 'Where can I book official ASI monument tickets for Delhi?',
                  a: 'Official electronic entry tickets can be booked online through the Archaeological Survey of India portal at asi.nic.in. Online tickets offer a discount (₹15 off Indian tickets and ₹50 off foreign tourist tickets) and allow visitors to bypass on-site ticketing queues.',
                },
                {
                  q: 'Which historical places in Delhi have completely free admission?',
                  a: 'Several of Delhi’s finest heritage landmarks have 100% free entry: Lodhi Gardens, Mehrauli Archaeological Park, Agrasen ki Baoli, Dargah Hazrat Nizamuddin Auliya, Chandni Chowk & Khari Baoli, Ghalib ki Haveli, and Jahaz Mahal.',
                },
                {
                  q: 'Which days are Delhi monuments and museums closed?',
                  a: 'ASI monuments (Qutb Minar, Humayun’s Tomb, Purana Qila, Safdarjung’s Tomb) are open 7 days a week from sunrise to sunset. However, the Red Fort and almost all government museums (National Museum, Pradhanmantri Sangrahalaya, NGMA) are strictly closed on Mondays.',
                },
                {
                  q: 'What is the best way to travel between heritage monuments in Delhi?',
                  a: 'The Delhi Metro network is the fastest, safest, and most economical transit method. The Yellow Line directly connects Qutb Minar, Hauz Khas, Jor Bagh (Safdarjung Tomb/Lodhi Gardens), and Chandni Chowk. The Violet Line connects Delhi Gate (Feroz Shah Kotla), Jama Masjid, Lal Quila, and Central Secretariat.',
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <h3 className="text-base font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authoritative Sources Citation Block */}
        <section className="my-10 p-6 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Editorial Integrity & Authoritative Sources</span>
                <span>
                  Historical descriptions, architectural analyses, and monument coordinates are verified against records from the Archaeological Survey of India (ASI), UNESCO World Heritage Centre, INTACH Delhi Chapter, and National Museum archives.
                </span>
              </div>
            </div>
            <a
              href="https://asi.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0"
            >
              <span>Visit Official ASI Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </Container>

      {/* Map Modal */}
      {activeMapPlace && (
        <HeritageMapModal
          place={activeMapPlace}
          onClose={() => setActiveMapPlace(null)}
        />
      )}
    </div>
  );
};
