import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  Compass,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Utensils,
  Camera,
  Heart,
  Users,
  GraduationCap,
  PiggyBank,
  Eye,
  CheckCircle2,
  ChevronRight,
  Search,
  ArrowLeft,
  Share2,
  Bookmark,
  Info,
  HelpCircle,
  Sun,
  Mountain,
  Landmark,
  Trees,
  Footprints,
  Plane,
  Train,
  Check,
} from 'lucide-react';
import { getIndiaStateBySlug, getAllIndiaStates } from '../data/india/allStatesRegistry';
import { IndiaPlace, IndiaFood, IndiaFestival } from '../types/india.types';

// Tab categories matching the 15 required sections
const CATEGORY_NAV = [
  { id: 'top-places', label: 'Top Places', icon: Compass },
  { id: 'heritage', label: 'Heritage & History', icon: Landmark },
  { id: 'spiritual', label: 'Religious & Spiritual', icon: Sparkles },
  { id: 'nature', label: 'Nature & Wildlife', icon: Trees },
  { id: 'hill-stations', label: 'Hill Stations', icon: Mountain },
  { id: 'food', label: 'Famous Food', icon: Utensils },
  { id: 'experiences', label: 'Local Experiences', icon: Camera },
  { id: 'weekend', label: 'Weekend Getaways', icon: Footprints },
  { id: 'best-time', label: 'Best Time to Visit', icon: Sun },
  { id: 'festivals', label: 'Festivals & Culture', icon: Calendar },
  { id: 'families', label: 'For Families', icon: Users },
  { id: 'couples', label: 'For Couples', icon: Heart },
  { id: 'students', label: 'For Students & Youth', icon: GraduationCap },
  { id: 'budget', label: 'Budget Travel Tips', icon: PiggyBank },
  { id: 'hidden-gems', label: 'Hidden Gems', icon: Eye },
];

export const StateOverviewPage: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('top-places');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookmarkedPlaces, setBookmarkedPlaces] = useState<Set<string>>(new Set());

  // Find state data from comprehensive registry
  const stateData = useMemo(() => {
    if (!stateSlug) return undefined;
    return getIndiaStateBySlug(stateSlug);
  }, [stateSlug]);

  const otherStatesInRegion = useMemo(() => {
    if (!stateData) return [];
    return getAllIndiaStates()
      .filter((s) => s.slug !== stateData.slug && s.region === stateData.region)
      .slice(0, 4);
  }, [stateData]);

  const toggleBookmark = (placeId: string) => {
    setBookmarkedPlaces((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!stateData) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">State Discovery Hub</h1>
          <p className="text-sm text-slate-600 mt-2 mb-6">
            The state or territory '{stateSlug}' is currently being curated with verified data.
          </p>
          <Link
            to="/india"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All 28 States & 8 UTs</span>
          </Link>
        </div>
      </div>
    );
  }

  // Generate structured JSON-LD for SEO & Rich snippets
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: stateData.name,
    description: stateData.overview,
    image: stateData.heroImage,
    touristType: ['Culture', 'Heritage', 'Nature', 'Spiritual', 'Adventure'],
    containedInPlace: {
      '@type': 'Country',
      name: 'India',
    },
    includesAttraction: (stateData.topPlaces || []).map((p) => ({
      '@type': 'TouristAttraction',
      name: p.name,
      description: p.shortDescription,
      touristType: p.category,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Explore India',
        item: `${window.location.origin}/india`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: stateData.name,
        item: window.location.href,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Dynamic SEO JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Top Breadcrumb Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/india" className="hover:text-indigo-600 transition">Explore India</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold">{stateData.name}</span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              title="Copy link to clipboard"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grand Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={stateData.heroImage}
            alt={stateData.name}
            className="w-full h-full object-cover opacity-35 scale-105 transform hover:scale-100 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/25 border border-indigo-400/40 text-indigo-200">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              {stateData.region} India • {stateData.type === 'UT' || stateData.type === 'UNION_TERRITORY' ? 'Union Territory' : 'State'}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Verified Editorial Facts
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            {stateData.name}
          </h1>

          {stateData.tagline && (
            <p className="mt-2 text-lg sm:text-xl font-semibold text-amber-300">
              {stateData.tagline}
            </p>
          )}

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {stateData.overview}
          </p>

          {/* Quick Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Capital / Hub</span>
              <p className="text-sm font-bold text-white mt-0.5">{stateData.quickFacts.capital}</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Languages</span>
              <p className="text-sm font-bold text-slate-200 mt-0.5 truncate">{stateData.quickFacts.languages.join(', ')}</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Best Time</span>
              <p className="text-sm font-bold text-amber-300 mt-0.5 truncate">{stateData.quickFacts.bestTimeToVisit}</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Official Tourism</span>
              <a
                href={stateData.tourismBoard.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-indigo-300 hover:text-indigo-200 mt-0.5 underline decoration-indigo-400"
              >
                <span>{stateData.tourismBoard.name.split('(')[0]}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Interactive 15-Category Navigation Bar */}
      <section className="bg-white border-b border-slate-200 shadow-sm sticky top-[108px] z-20 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
            {CATEGORY_NAV.map((cat) => {
              const Icon = cat.icon;
              const isCurrent = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveTab(cat.id);
                    const el = document.getElementById(cat.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* 1. TOP PLACES TO VISIT */}
        <section id="top-places" className="scroll-mt-36">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Primary Highlights</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                1. Top Places to Visit in {stateData.name}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {stateData.topPlaces?.length || 0} Curated Places
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(stateData.topPlaces || []).map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isBookmarked={bookmarkedPlaces.has(place.id)}
                onBookmark={() => toggleBookmark(place.id)}
              />
            ))}
          </div>
        </section>

        {/* 2. HERITAGE & HISTORICAL PLACES */}
        {stateData.heritagePlaces && stateData.heritagePlaces.length > 0 && (
          <section id="heritage" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
                  <Landmark className="w-4 h-4" />
                  <span>Ancient Architecture & Monuments</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  2. Heritage & Historical Places
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.heritagePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. RELIGIOUS & SPIRITUAL PLACES */}
        {stateData.spiritualPlaces && stateData.spiritualPlaces.length > 0 && (
          <section id="spiritual" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-orange-600 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Sacred Pilgrimages & Spiritual Shrines</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  3. Religious & Spiritual Places
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.spiritualPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. NATURE & SCENIC PLACES */}
        {stateData.naturePlaces && stateData.naturePlaces.length > 0 && (
          <section id="nature" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                  <Trees className="w-4 h-4" />
                  <span>National Parks, Lakes & Waterfalls</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  4. Nature & Scenic Places
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.naturePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. HILL STATIONS */}
        {stateData.hillStations && stateData.hillStations.length > 0 && (
          <section id="hill-stations" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-cyan-600 text-xs font-bold uppercase tracking-wider">
                  <Mountain className="w-4 h-4" />
                  <span>High Altitude Retreats & Pine Valleys</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  5. Hill Stations in {stateData.name}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.hillStations.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. FAMOUS FOOD */}
        {stateData.famousFood && stateData.famousFood.length > 0 && (
          <section id="food" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider">
                  <Utensils className="w-4 h-4" />
                  <span>Authentic Regional Flavors</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  6. Famous Food & Culinary Heritage
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stateData.famousFood.map((item, idx) => (
                <FoodCard key={idx} food={item} />
              ))}
            </div>
          </section>
        )}

        {/* 7. LOCAL EXPERIENCES */}
        {stateData.localExperiences && stateData.localExperiences.length > 0 && (
          <section id="experiences" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-violet-600 text-xs font-bold uppercase tracking-wider">
                  <Camera className="w-4 h-4" />
                  <span>Authentic Cultural Immersion</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  7. Unmissable Local Experiences
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stateData.localExperiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200 mb-2">
                      {exp.category}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{exp.description}</p>
                  </div>
                  {exp.idealFor && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <strong>Ideal for:</strong> {exp.idealFor}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. WEEKEND GETAWAYS */}
        {stateData.weekendGetaways && stateData.weekendGetaways.length > 0 && (
          <section id="weekend" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-sky-600 text-xs font-bold uppercase tracking-wider">
                  <Footprints className="w-4 h-4" />
                  <span>Short Breaks & Road Trips</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  8. Top Weekend Getaways
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.weekendGetaways.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 9. BEST TIME TO VISIT */}
        <section id="best-time" className="scroll-mt-36">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
                <Sun className="w-4 h-4" />
                <span>Weather & Seasonality Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                9. Best Time to Visit {stateData.name}
              </h2>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed max-w-3xl">
              {stateData.bestTimeToVisitGuide.overview}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Peak Season</span>
                <h4 className="text-sm font-bold text-white mt-1">{stateData.bestTimeToVisitGuide.peakSeasonMonths}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{stateData.bestTimeToVisitGuide.peakSeasonNotes}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Moderate Season</span>
                <h4 className="text-sm font-bold text-white mt-1">{stateData.bestTimeToVisitGuide.moderateSeasonMonths}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{stateData.bestTimeToVisitGuide.moderateSeasonNotes}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300">Off-Season / Summer</span>
                <h4 className="text-sm font-bold text-white mt-1">{stateData.bestTimeToVisitGuide.offSeasonMonths}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{stateData.bestTimeToVisitGuide.offSeasonNotes}</p>
              </div>
            </div>

            {stateData.bestTimeToVisitGuide.monthByMonthTip && (
              <div className="mt-6 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p><strong>Insider Tip:</strong> {stateData.bestTimeToVisitGuide.monthByMonthTip}</p>
              </div>
            )}
          </div>
        </section>

        {/* 10. FAMOUS FESTIVALS */}
        {stateData.famousFestivals && stateData.famousFestivals.length > 0 && (
          <section id="festivals" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Cultural Celebrations</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  10. Famous Festivals & Fairs
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stateData.famousFestivals.map((fest, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Calendar className="w-3 h-3" />
                        {fest.month}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{fest.location}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{fest.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-1">{fest.significance}</p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{fest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 11, 12, 13: TRAVELER DEMOGRAPHIC PROFILES */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 11. Families */}
          <div id="families" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm scroll-mt-36">
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>11. Places for Families</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Family-Friendly Spots</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Safe, engaging attractions for children & parents.</p>

            <div className="space-y-4">
              {(stateData.placesForFamilies || []).map((p) => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <span className="text-[11px] font-semibold text-indigo-600">{p.cityDistrict}</span>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3">{p.whyVisit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 12. Couples */}
          <div id="couples" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm scroll-mt-36">
            <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4" />
              <span>12. Places for Couples</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Romantic Escapes</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Serene sunsets, private resorts & scenic trails.</p>

            <div className="space-y-4">
              {(stateData.placesForCouples || []).map((p) => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <span className="text-[11px] font-semibold text-rose-600">{p.cityDistrict}</span>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3">{p.whyVisit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 13. Students / Youth */}
          <div id="students" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm scroll-mt-36">
            <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>13. Students & Youth</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Backpackers & Adventure</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Hostels, treks, river rafting & affordable stays.</p>

            <div className="space-y-4">
              {(stateData.placesForStudents || []).map((p) => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <span className="text-[11px] font-semibold text-emerald-600">{p.cityDistrict}</span>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3">{p.whyVisit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 14. BUDGET TRAVEL TIPS */}
        <section id="budget" className="scroll-mt-36">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                <PiggyBank className="w-4 h-4" />
                <span>Maximize Your Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                14. Budget Travel Ideas & Cost Estimates
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold mb-6">
              <PiggyBank className="w-4 h-4 text-emerald-600" />
              <span>Average Daily Budget: {stateData.budgetTravelTips.avgDailyBudget}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Stay Smart
                </h4>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed">
                  {stateData.budgetTravelTips.stayTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-indigo-600" />
                  Transit Advice
                </h4>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed">
                  {stateData.budgetTravelTips.transitTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-indigo-600" />
                  Food Tips
                </h4>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed">
                  {stateData.budgetTravelTips.foodTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Free / Low Cost
                </h4>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed">
                  {stateData.budgetTravelTips.freeOrLowCostActivities.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 15. HIDDEN GEMS */}
        {stateData.hiddenGems && stateData.hiddenGems.length > 0 && (
          <section id="hidden-gems" className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider">
                  <Eye className="w-4 h-4" />
                  <span>Off-The-Beaten-Path Treasures</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  15. Hidden Gems & Secret Spots
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateData.hiddenGems.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isBookmarked={bookmarkedPlaces.has(place.id)}
                  onBookmark={() => toggleBookmark(place.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS */}
        {stateData.faqs && stateData.faqs.length > 0 && (
          <section className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
            <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Planning Your Trip to {stateData.name}</h3>

            <div className="space-y-4">
              {stateData.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                    <span className="text-indigo-600 font-extrabold">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 ml-5 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPLORE OTHER STATES IN SAME REGION */}
        {otherStatesInRegion.length > 0 && (
          <section className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Explore More in {stateData.region} India
              </h3>
              <Link to="/india" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <span>View All 36 States & UTs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherStatesInRegion.map((other) => (
                <Link
                  key={other.slug}
                  to={`/india/${other.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition block"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img
                      src={other.heroImage}
                      alt={other.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-white font-bold text-sm">
                      {other.name}
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] text-slate-500 line-clamp-1">{other.tagline || other.region}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// Reusable Place Card Component adhering strictly to the 15 categories specification
const PlaceCard: React.FC<{
  place: IndiaPlace;
  isBookmarked: boolean;
  onBookmark: () => void;
}> = ({ place, isBookmarked, onBookmark }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Image Banner */}
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Category Pill */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md backdrop-blur-sm">
            {place.category}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={onBookmark}
            aria-label="Bookmark this spot"
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
              isBookmarked
                ? 'bg-rose-500 text-white'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* District & Duration at bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="inline-flex items-center gap-1 drop-shadow-md">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {place.cityDistrict}
            </span>
            <span className="inline-flex items-center gap-1 drop-shadow-md">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              {place.idealDuration}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {place.name}
          </h3>

          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
            {place.shortDescription}
          </p>

          {/* Why Visit Highlight Box */}
          <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider block mb-1">
              Why Visit:
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">{place.whyVisit}</p>
          </div>

          {/* Verified Information Badge */}
          {place.verifiedInfo && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{place.verifiedInfo}</span>
            </div>
          )}

          {/* Timings & Entry Fee */}
          {(place.timings || place.entryFee) && (
            <div className="mt-3 grid grid-cols-1 gap-1 text-[11px] text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              {place.timings && (
                <div>
                  <strong>Hours:</strong> {place.timings}
                </div>
              )}
              {place.entryFee && (
                <div>
                  <strong>Fee:</strong> {place.entryFee}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {place.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Nearby Attractions */}
          {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <strong className="text-slate-700">Nearby:</strong> {place.nearbyAttractions.join(' • ')}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Official Source Link */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          Source: <strong className="text-slate-600">{place.officialSource}</strong>
        </span>

        {place.sourceUrl && (
          <a
            href={place.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

// Reusable Famous Food Card
const FoodCard: React.FC<{ food: IndiaFood }> = ({ food }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 mb-2">
          {food.type}
        </div>
        <h4 className="text-base font-bold text-slate-900">{food.name}</h4>
        {food.localName && (
          <span className="text-[11px] text-slate-400 block font-medium mt-0.5">{food.localName}</span>
        )}
        <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">{food.cityOrRegion}</span>
        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{food.description}</p>
      </div>

      {food.famousSpotsOrOrigin && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <strong className="text-slate-700">Where to try:</strong> {food.famousSpotsOrOrigin}
        </div>
      )}
    </div>
  );
};
