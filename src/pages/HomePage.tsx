import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Utensils,
  Coffee,
  Landmark,
  ShoppingBag,
  Hotel,
  Wine,
  Wrench,
  Calendar,
  Sparkles,
  MapPin,
  Star,
  Flame,
  Award,
  Navigation,
  Compass,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Heart,
  DollarSign,
  Search,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { SearchAutocomplete } from '../components/search/SearchAutocomplete';
import { BusinessCardSkeleton, CategoryCardSkeleton } from '../components/ui/Skeletons';
import { useCategories, useLocations, useBusinesses } from '../hooks/useDiscovery';
import { useSearch } from '../hooks/useSearch';
import { ROUTES } from '../constants/routes';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';
import { Business } from '../types';
import { AISearchBox } from '../components/search/AISearchBox';
import { AskSpotPicks } from '../components/ai/AskSpotPicks';
import { TrendingSection } from '../components/discovery/TrendingSection';
import { PersonalizedPicksSection } from '../components/discovery/PersonalizedPicksSection';
import { LiveDiscoveryFeed } from '../components/discovery/LiveDiscoveryFeed';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAISearch, setShowAISearch] = useState(false);

  // Curated Discovery Tab State
  const [activeTab, setActiveTab] = useState<
    | 'trending'
    | 'popular'
    | 'best_rated'
    | 'near_me'
    | 'hidden_gems'
    | 'budget'
    | 'student'
    | 'date_ideas'
    | 'food_explorer'
    | 'weekend'
  >('trending');

  // GPS State for Near-Me Tab
  const [userGps, setUserGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Discovery Data Queries
  const { data: rootCategories, isLoading: catLoading } = useCategories({ type: 'ROOT' });
  const { data: locationsData } = useLocations({ type: 'LOCALITY' });
  const { data: allSpotsData, isLoading: spotsLoading } = useBusinesses({ limit: 40 });

  const allSpots: Business[] = allSpotsData?.data || [];

  // Tab Filtering Logic
  const getTabFilteredSpots = (): Business[] => {
    if (allSpots.length === 0) return [];

    switch (activeTab) {
      case 'trending':
        return [...allSpots].sort((a, b) => (b.popularity || 80) - (a.popularity || 80)).slice(0, 6);
      case 'popular':
        return [...allSpots].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 6);
      case 'best_rated':
        return [...allSpots].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
      case 'near_me':
        return allSpots.filter((s) => s.locality === 'Majnu Ka Tilla' || s.locality === 'Connaught Place' || s.locality === 'Hauz Khas').slice(0, 6);
      case 'hidden_gems':
        return allSpots.filter((s) => (s.tags || []).some((t) => t.includes('tasting') || t.includes('bakery') || t.includes('monument') || t.includes('peaceful')) || (s.rating >= 4.7 && (s.reviewCount || 0) < 3000)).slice(0, 6);
      case 'budget':
        return allSpots.filter((s) => s.priceRange === 'BUDGET' || (s.tags || []).includes('budget')).slice(0, 6);
      case 'student':
        return allSpots.filter((s) => s.locality === 'Majnu Ka Tilla' || s.locality === 'North Campus' || (s.tags || []).includes('student') || (s.tags || []).includes('pg')).slice(0, 6);
      case 'date_ideas':
        return allSpots.filter((s) => (s.tags || []).includes('romantic') || (s.tags || []).includes('date') || s.priceRange === 'PREMIUM' || s.locality === 'Hauz Khas').slice(0, 6);
      case 'food_explorer':
        return allSpots.filter((s) => {
          const cat = typeof s.category === 'object' ? (s.category as any)?.slug : s.category;
          return cat === 'food-and-cafes' || cat === 'food-and-dining' || (s.tags || []).includes('momos') || (s.tags || []).includes('cafe');
        }).slice(0, 6);
      case 'weekend':
        return allSpots.filter((s) => (s.tags || []).includes('monument') || (s.tags || []).includes('park') || s.locality === 'Nizamuddin' || s.locality === 'Hauz Khas').slice(0, 6);
      default:
        return allSpots.slice(0, 6);
    }
  };

  const currentTabSpots = getTabFilteredSpots();

  // Core Categories Definition
  const coreCategoryCards = [
    {
      name: 'Restaurants',
      slug: 'food-and-cafes',
      searchQuery: 'restaurant',
      icon: Utensils,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200/60',
      description: 'Dhabas, fine dining & North Indian buffets',
      count: '1,420+ Spots',
    },
    {
      name: 'Cafes & Bakeries',
      slug: 'food-and-cafes',
      searchQuery: 'cafe',
      icon: Coffee,
      color: 'bg-orange-500/10 text-orange-600 border-orange-200/60',
      description: 'Artisanal roasters, Himalayan bakeries & WiFi hubs',
      count: '890+ Spots',
    },
    {
      name: 'Heritage Places',
      slug: 'heritage-and-places',
      searchQuery: 'heritage',
      icon: Landmark,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/60',
      description: 'Mughal monuments, lush stepwells & museums',
      count: '340+ Spots',
    },
    {
      name: 'Shopping & Bazaars',
      slug: 'shopping-and-retail',
      searchQuery: 'shopping',
      icon: ShoppingBag,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/60',
      description: 'Sarojini thrift, Janpath handicrafts & luxury malls',
      count: '1,150+ Spots',
    },
    {
      name: 'Hotels & PGs',
      slug: 'hotels-and-pgs',
      searchQuery: 'pg',
      icon: Hotel,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200/60',
      description: 'Student residences, boutique stays & co-living',
      count: '620+ Spots',
    },
    {
      name: 'Nightlife & Bars',
      slug: 'nightlife-and-clubs',
      searchQuery: 'nightlife',
      icon: Wine,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200/60',
      description: 'Rooftops, craft breweries & speakeasies',
      count: '280+ Spots',
    },
    {
      name: 'Repair & Tech',
      slug: 'repair-and-services',
      searchQuery: 'repair',
      icon: Wrench,
      color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200/60',
      description: 'Chip-level laptop care, camera & phone hubs',
      count: '430+ Spots',
    },
    {
      name: 'Events & Experiences',
      slug: 'events-and-meetups',
      searchQuery: 'events',
      icon: Calendar,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200/60',
      description: 'Farmers markets, sufi nights & live comedy',
      count: '190+ Spots',
    },
  ];

  // Top Delhi Localities with curated visual assets
  const delhiLocalities = [
    {
      name: 'Connaught Place',
      slug: 'connaught-place',
      tagline: 'Colonial Georgian circles, legacy bookshops & rooftop dining',
      category: 'Central Delhi Heritage',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
      spotsCount: '180+ Spots',
    },
    {
      name: 'Hauz Khas Village',
      slug: 'hauz-khas',
      tagline: '13th-century madrasa ruins overlooking bohemian lakeside cafes',
      category: 'Art & Bohemian Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      spotsCount: '140+ Spots',
    },
    {
      name: 'Majnu Ka Tilla',
      slug: 'majnu-ka-tilla',
      tagline: 'Tibetan cultural colony famous for tingmo, thukpa & cafes',
      category: 'Himalayan Culture & Food',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
      spotsCount: '95+ Spots',
    },
    {
      name: 'Nehru Place',
      slug: 'nehru-place',
      tagline: 'Asia largest electronics IT market & hardware repair capital',
      category: 'Tech & IT Services',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      spotsCount: '210+ Spots',
    },
    {
      name: 'Saket & Mehrauli',
      slug: 'saket',
      tagline: 'Sunder forest trails, Qutub Minar views & upscale design studios',
      category: 'South Delhi Luxury',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=80',
      spotsCount: '165+ Spots',
    },
    {
      name: 'Chandni Chowk',
      slug: 'chandni-chowk',
      tagline: '300-year-old Mughal streets, paranthe wali gali & spice bazaar',
      category: 'Old Delhi Street Cuisine',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
      spotsCount: '290+ Spots',
    },
    {
      name: 'Vasant Kunj',
      slug: 'vasant-kunj',
      tagline: 'University vibes, greenery & high-end shopping malls',
      category: 'Campus & Malls',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
      spotsCount: '130+ Spots',
    },
    {
      name: 'Karol Bagh',
      slug: 'karol-bagh',
      tagline: 'Bustling bridal bazaars, Punjabi food joints & electronics',
      category: 'Bazaars & Food',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      spotsCount: '175+ Spots',
    },
    {
      name: 'Lajpat Nagar',
      slug: 'lajpat-nagar',
      tagline: 'Central Market textiles, Afghan dining & vibrant street street food',
      category: 'Fashion & Food',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
      spotsCount: '150+ Spots',
    },
    {
      name: 'Greater Kailash (GK 1 & 2)',
      slug: 'greater-kailash',
      tagline: 'M-Block & N-Block gourmet eateries, bakeries & designer boutiques',
      category: 'Gourmet & Boutiques',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      spotsCount: '190+ Spots',
    },
  ];

  // Discovery Navigation Tabs config
  const discoveryTabs = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'best_rated', label: 'Best Rated', icon: Award },
    { id: 'near_me', label: 'Near You', icon: Navigation },
    { id: 'hidden_gems', label: 'Hidden Gems', icon: Sparkles },
    { id: 'budget', label: 'Budget Friendly', icon: DollarSign },
    { id: 'student', label: 'Student Picks', icon: GraduationCap },
    { id: 'date_ideas', label: 'Date Ideas', icon: Heart },
    { id: 'food_explorer', label: 'Food Explorer', icon: Utensils },
    { id: 'weekend', label: 'Weekend Ideas', icon: Compass },
  ] as const;

  const handleRequestNearMe = () => {
    setActiveTab('near_me');
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        setUserGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setGpsLoading(false);
        setUserGps({ lat: 28.6304, lng: 77.2197 }); // Demo center Delhi fallback
      }
    );
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200">
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        
        <Container size="xl" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Hyper-Local Discovery for Delhi NCR</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
            >
              Discover the <span className="text-indigo-600">Best</span> Around You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
            >
              Find the best places to eat, explore, shop, stay and experience across Delhi NCR with verified reviews and live rankings.
            </motion.p>

            {/* Main Search Autocomplete & Location Selector */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full max-w-3xl mx-auto mt-8 space-y-4"
            >
              <SearchAutocomplete
                placeholder='Try searching "best cafes in Delhi", "momos under 200", "laptop repair in Nehru Place"...'
                onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              />

              {/* AI Natural Language Search Launcher */}
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAISearch(!showAISearch)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-950 text-indigo-200 border border-indigo-500/40 hover:border-indigo-400 hover:text-white shadow-md text-xs font-bold transition-all cursor-pointer group"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                  <span>Ask SpotPicx (Gemini AI)</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-[10px] text-indigo-300 font-extrabold uppercase">
                    AI Search
                  </span>
                </button>
              </div>

              {/* Collapsible Ask SpotPicks Box */}
              {showAISearch && (
                <div className="pt-2 text-left animate-in fade-in zoom-in-95 duration-200">
                  <AskSpotPicks
                    onClose={() => setShowAISearch(false)}
                  />
                </div>
              )}

              {/* Popular Searches Quick Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <TrendingUp className="h-3 w-3 text-indigo-600" /> Popular:
                </span>
                {[
                  'Best cafes',
                  'Momos under 200',
                  'Quiet cafes with WiFi',
                  'Rooftop date places',
                  'Laptop repair',
                  'Student PGs',
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 shadow-2xs transition-all text-xs font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Phase 10: Specialized Hub Quick Action Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 max-w-5xl mx-auto text-left">
              <Link
                to="/events"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Live Events</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Concerts & Comedy</div>
              </Link>

              <Link
                to="/offers"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Deals & Coupons</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Up to 50% Off</div>
              </Link>

              <Link
                to="/students"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-indigo-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Student Hub</div>
                <div className="text-[11px] text-slate-500 mt-0.5">PGs & Study Cafes</div>
              </Link>

              <Link
                to="/housing"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-amber-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <Hotel className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Housing & PGs</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Flats & Co-living</div>
              </Link>

              <Link
                to="/jobs"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-cyan-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Internships & Jobs</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Freshers & Gigs</div>
              </Link>

              <Link
                to="/discover"
                className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-rose-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm mb-2 group-hover:scale-110 transition-transform">
                  <Heart className="h-4 w-4" />
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">Vibe Discovery</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Couples & Luxury</div>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. CATEGORY SECTIONS */}
      <section className="space-y-6">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Browse By Category
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Explore Categories in Delhi
              </h2>
            </div>
            <Link
              to={ROUTES.CATEGORIES}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Grid of 8 Core Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {coreCategoryCards.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/search?category=${cat.slug}&q=${encodeURIComponent(cat.searchQuery)}`}
                  className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Discover spots</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 2.5 PHASE 11 & PHASE 18: LIVE DISCOVERY & TRENDING INTELLIGENCE */}
      <Container size="xl" className="space-y-12">
        <LiveDiscoveryFeed />
        <PersonalizedPicksSection />
        <TrendingSection onSearchSelect={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)} />
      </Container>

      {/* 3. CURATED DISCOVERY SECTIONS (Trending, Popular, Best Rated, Near You, Hidden Gems, Budget, Student Picks, Date Ideas, Food Explorer, Weekend Ideas) */}
      <section className="space-y-8 bg-slate-100/60 py-12 border-y border-slate-200">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Curated Discovery
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Handpicked Delhi Spotlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Filter recommendations by lifestyle intent, budget, and real-time community rankings.
              </p>
            </div>

            <Link to={ROUTES.EXPLORE}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Explore Full Directory
              </Button>
            </Link>
          </div>

          {/* Discovery Tabs Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {discoveryTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'near_me' && !userGps) {
                      handleRequestNearMe();
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm scale-102'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Discovery Spots Grid */}
          {spotsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : currentTabSpots.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-white">
              <Sparkles className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-900">No spots available in this collection yet</h4>
              <p className="text-xs text-slate-500 mt-1">Check back shortly or browse all categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTabSpots.map((spot) => (
                <BusinessCard key={spot._id || spot.slug} business={spot} />
              ))}
            </div>
          )}

          {/* Bottom Explore Link */}
          <div className="text-center pt-4">
            <Link
              to={`/search?sort=recommended`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:border-indigo-500 hover:text-indigo-600 shadow-sm transition-all cursor-pointer"
            >
              <span>View All {allSpots.length}+ Verified Delhi Listings</span>
              <ArrowRight className="h-4 w-4 text-indigo-600" />
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. DELHI LOCALITIES DISCOVERY HUB (Connaught Place, Hauz Khas, Saket, Vasant Kunj, Chandni Chowk, Karol Bagh, Lajpat Nagar, Dwarka, Rohini, GK) */}
      <section className="space-y-8">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Neighborhood Spotlights
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Explore by Delhi Localities & Hubs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Every corner of Delhi has its own character, iconic food stalls, markets, and hidden alleys.
              </p>
            </div>

            <Link
              to={ROUTES.LOCATIONS}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>View All Localities</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Localities Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {delhiLocalities.map((loc) => (
              <Link
                key={loc.slug}
                to={`/search?locality=${encodeURIComponent(loc.name)}`}
                className="group relative h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col justify-end p-5 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {/* Background Image */}
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/30 text-white">
                    {loc.spotsCount}
                  </span>
                </div>

                {/* Card Info */}
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                    {loc.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed opacity-90">
                    {loc.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. TOP 10 CURATED GUIDES & EDITORIAL STORIES */}
      <section className="space-y-8">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Curated Top 10 Guides & Editorial
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Definitive Best in Delhi Rankings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Evaluated by local food critics, lifestyle editors, and community data.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/articles"
                className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition"
              >
                <span>Read Magazine</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Best Restaurants in Delhi',
                tag: 'Fine Dining & Heritage',
                slug: 'best-restaurants-in-delhi',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
                count: 'Top 10 Evaluated',
              },
              {
                title: 'Best Cafes in Delhi',
                tag: 'Specialty Coffee & Wi-Fi',
                slug: 'best-cafes-in-delhi',
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600',
                count: 'Top 10 Evaluated',
              },
              {
                title: 'Best Momos in Delhi',
                tag: 'Tibetan & Tandoori',
                slug: 'best-momos-in-delhi',
                image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600',
                count: 'Top 10 Evaluated',
              },
              {
                title: 'Best Date Places in Delhi',
                tag: 'Romantic Haveli Rooftops',
                slug: 'best-date-places-in-delhi',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
                count: 'Top 10 Evaluated',
              },
            ].map((guide) => (
              <Link
                key={guide.slug}
                to={`/${guide.slug}`}
                className="group relative h-56 rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all flex flex-col justify-end p-5 text-white"
              >
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md shadow-sm">
                    {guide.count}
                  </span>
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                    {guide.tag}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    {guide.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. COMMUNITY TRUST & SPOTPICKS VALUE PROPOSITION */}
      <section className="bg-slate-900 text-white py-14 rounded-3xl mx-4 sm:mx-8 md:mx-12 overflow-hidden shadow-2xl">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="warning">The SpotPicks Standard</Badge>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Authentic, Unbiased Discovery for Delhiites & Explorers
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We combine real human local picks, deterministic search intent analysis, and proximity matching so you never fall into tourist traps.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">100% Verified Listings</h4>
                <p className="text-xs text-slate-400">
                  Every business is verified with real contact info, menu pricing, and coordinates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Navigation className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Precise Near-Me GPS</h4>
                <p className="text-xs text-slate-400">
                  Instant real-time distance calculations with customizable radius bounds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Multi-Factor Ranking</h4>
                <p className="text-xs text-slate-400">
                  Dynamic ranking balancing star ratings, review velocity, and verified status.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
