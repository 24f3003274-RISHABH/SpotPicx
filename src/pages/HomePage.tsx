import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Utensils,
  Building2,
  Landmark,
  ShoppingBag,
  Wrench,
  GraduationCap,
  Activity,
  CheckCircle2,
  Server,
  Layers,
  Database,
  Globe2,
  Navigation,
  Compass,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { SearchAutocomplete } from '../components/search/SearchAutocomplete';
import { useCategories, useLocations, useBusinesses } from '../hooks/useDiscovery';
import { useFilterStore } from '../store/useFilterStore';
import { useHealth } from '../hooks/useHealth';
import { ROUTES } from '../constants/routes';

// Icon mapping helper
const iconMap: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  Landmark: <Landmark className="h-6 w-6" />,
  ShoppingBag: <ShoppingBag className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { data: healthData, isSuccess: healthSuccess } = useHealth();

  const { data: categories, isLoading: categoriesLoading } = useCategories({ type: 'ROOT' });
  const { data: locations } = useLocations({ type: 'LOCALITY' });
  const { data: featuredBusinesses, isLoading: bizLoading } = useBusinesses({ limit: 4, sort: 'rating' });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/businesses?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/businesses');
    }
  };

  const trendingPicks = [
    {
      title: 'Best Cafes & Bakeries',
      locality: 'Hauz Khas & Champa Gali',
      category: 'Food & Dining',
      query: 'cafe',
    },
    {
      title: 'Authentic Tibetan & Momos',
      locality: 'Majnu Ka Tilla',
      category: 'Food & Dining',
      query: 'momos',
    },
    {
      title: 'Asia Largest Electronics Hub',
      locality: 'Nehru Place',
      category: 'Shopping & Retail',
      query: 'electronics',
    },
    {
      title: 'Historical Monuments & Heritage',
      locality: 'Chandni Chowk & Mehrauli',
      category: 'Places & Heritage',
      query: 'heritage',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-slate-50 border-b border-slate-200">
        <Container size="xl" className="relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 3 Discovery Database Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover the <span className="text-indigo-600">Best</span> in Delhi NCR
            </h1>

            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore verified restaurants, cozy student cafes, IT markets, heritage monuments, and repair services with SpotPicks.
            </p>

            {/* Sleek Main Search Bar with debounced auto-complete */}
            <div className="w-full max-w-3xl mx-auto mt-8">
              <SearchAutocomplete
                placeholder='Search "best cafes", "momos under 200", "laptop repair in Nehru Place"...'
                onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
              />

              {/* Locality Quick Selector Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Quick Localities:</span>
                {locations?.slice(0, 6).map((loc) => (
                  <Link
                    key={loc._id || loc.slug}
                    to={`/location/${loc.slug}`}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 shadow-2xs transition-all text-xs font-medium cursor-pointer"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Verified Spots Section */}
      <section>
        <Container size="xl" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Featured Listings
              </h3>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Top Rated Spots in Delhi NCR
              </h2>
            </div>
            <Link
              to={ROUTES.BUSINESSES}
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All 50+ Spots</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {bizLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses?.data?.map((biz) => (
                <BusinessCard key={biz._id || biz.slug} business={biz} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Popular Categories Grid Section */}
      <section>
        <Container size="xl" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Discovery Categories
              </h3>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Browse By Category
              </h2>
            </div>
            <Link
              to={ROUTES.EXPLORE}
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={`/category/${cat.slug}`}
                  className="group block bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {iconMap[cat.icon] || <Sparkles className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base truncate">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Popular Delhi Neighborhoods Section */}
      <section className="bg-white py-12 border-y border-slate-200">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Local Neighborhoods
              </h3>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Explore Popular Localities in Delhi
              </h2>
            </div>
            <Link
              to={ROUTES.LOCATIONS}
              className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All Localities</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingPicks.map((pick, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/businesses?q=${encodeURIComponent(pick.query)}`)}
                className="cursor-pointer"
              >
                <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {pick.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {pick.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{pick.locality}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Explore spots</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Backend & Architecture Health Inspection Widget */}
      <section>
        <Container size="xl">
          <div className="p-6 md:p-8 bg-slate-900 text-white rounded-2xl shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    SpotPicks Discovery APIs v1 Active
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    Core Discovery Architecture
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={ROUTES.BUSINESSES}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    Open Discovery Directory
                  </Link>
                </div>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Taxonomy Hierarchy</span>
                    <Layers className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    Hierarchical Categories
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    ROOT, SUBCATEGORY, LEAF
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Geospatial Indexing</span>
                    <Navigation className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    2dsphere Coordinates
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Point [lng, lat] + Text Index
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Pagination & Limits</span>
                    <Server className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    20 / page (max 50)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Skip/Limit + Total Count
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Database Seeding</span>
                    <Database className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    52+ Verified Demo Spots
                  </div>
                  <div className="text-[11px] text-slate-400">
                    20+ Categories, 10+ Localities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
