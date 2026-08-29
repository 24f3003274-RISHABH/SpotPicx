import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Sun,
  Globe,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { ALL_SPIRITUAL_PLACES } from '../../data/spiritual/allSpiritualPlaces';
import { SPIRITUAL_STATES } from '../../data/spiritual/spiritualStatesData';
import { SPIRITUAL_TRADITIONS, traditionToSlug } from '../../data/spiritual/traditionsData';
import { SPIRITUAL_EDITORIAL_GUIDES } from '../../data/spiritual/spiritualGuidesData';
import { SpiritualPlaceCard } from '../../components/spiritual/SpiritualPlaceCard';
import { SpiritualStateCard } from '../../components/spiritual/SpiritualStateCard';
import { SpiritualGuideCard } from '../../components/spiritual/SpiritualGuideCard';
import { SpiritualFilterBar } from '../../components/spiritual/SpiritualFilterBar';
import { SpiritualVerificationNotice } from '../../components/spiritual/SpiritualVerificationNotice';
import { SpiritualJsonLd } from '../../components/spiritual/SpiritualJsonLd';

export const SpiritualHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradition, setSelectedTradition] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedSpecialFilter, setSelectedSpecialFilter] = useState('all');

  // Filter places based on user criteria
  const filteredPlaces = useMemo(() => {
    return ALL_SPIRITUAL_PLACES.filter((place) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesCity = place.cityDistrict.toLowerCase().includes(query);
        const matchesState = place.stateName.toLowerCase().includes(query);
        const matchesTradition = place.tradition.toLowerCase().includes(query);
        const matchesDetail = place.traditionDetail.toLowerCase().includes(query);
        const matchesTags = place.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDesc = place.shortDescription.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesCity &&
          !matchesState &&
          !matchesTradition &&
          !matchesDetail &&
          !matchesTags &&
          !matchesDesc
        ) {
          return false;
        }
      }

      // 2. Tradition
      if (selectedTradition !== 'all' && place.tradition !== selectedTradition) {
        return false;
      }

      // 3. State
      if (selectedState !== 'all' && place.stateSlug !== selectedState) {
        return false;
      }

      // 4. Special Filter
      if (selectedSpecialFilter === 'top-pilgrimage' && !place.isTopPilgrimage) {
        return false;
      }
      if (selectedSpecialFilter === 'temple-town' && !place.isTempleTown) {
        return false;
      }
      if (selectedSpecialFilter === 'weekend-delhi' && !place.weekendTripFromDelhi) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedTradition, selectedState, selectedSpecialFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SpiritualJsonLd type="hub" />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-12 pb-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/india" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              India
            </Link>
            <span>/</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Spiritual India</span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Compass className="h-3.5 w-3.5" />
              <span>Nationwide Sacred Discovery Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Spiritual India: Sacred Heritage, Pilgrimage Circuits & Living Traditions
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              An inclusive, respectful nationwide guide to India’s most revered spiritual destinations, sacred river ghats, monumental temple cities, historic gurudwaras, sufi dargahs, ancient stupas, and colonial cathedrals across 28 states and Union Territories.
            </p>

            {/* Quick Metrics */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">9+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Traditions Covered</div>
              </div>
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">12+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">State Directories</div>
              </div>
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">40+</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Sacred Circuits</div>
              </div>
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">100%</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Factual & Respectful</div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        {/* Verification notice */}
        <SpiritualVerificationNotice />

        {/* Traditions Overview Pills / Mini-Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Major Indian Spiritual Traditions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Explore distinct philosophies, architectural hallmarks, and sacred etiquette
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SPIRITUAL_TRADITIONS.map((tr) => {
              const slug = traditionToSlug(tr.tradition);
              return (
                <Link
                  key={slug}
                  to={`/india/spiritual/tradition/${slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all hover:border-amber-500/40 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {tr.tradition}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tr.title}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <span>Explore Heritage</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* High Value Editorial Guides Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Editorial Longform Guides</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Curated Pilgrimage & State Guides
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              In-depth research covering top state sites, temple town histories, and practical travel logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPIRITUAL_EDITORIAL_GUIDES.slice(0, 6).map((guide) => (
              <SpiritualGuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>

        {/* Interactive Nationwide Places Directory & Filter Section */}
        <section id="directory" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                <span>Sacred Destinations Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Explore Sacred Places Across India
              </h2>
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredPlaces.length}</strong> verified destinations
            </div>
          </div>

          {/* Filter Bar Component */}
          <SpiritualFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTradition={selectedTradition}
            onTraditionChange={setSelectedTradition}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            selectedSpecialFilter={selectedSpecialFilter}
            onSpecialFilterChange={setSelectedSpecialFilter}
            totalCount={ALL_SPIRITUAL_PLACES.length}
          />

          {/* Filtered Places Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <SpiritualPlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching sacred destinations found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Try clearing your search query or selecting "All Faiths" and "All States" in the filter controls above.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTradition('all');
                  setSelectedState('all');
                  setSelectedSpecialFilter('all');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:bg-amber-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* State-by-State Spiritual Guides Grid */}
        <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>State Directories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Explore Spiritual Destinations by State
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Detailed sacred guides for each Indian state featuring pilgrimage circuits, temple towns, and cultural festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPIRITUAL_STATES.map((stateInfo) => (
              <SpiritualStateCard key={stateInfo.stateSlug} stateInfo={stateInfo} />
            ))}
          </div>
        </section>

        {/* Inter-linking & Cultural Harmony Footer Block */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-100 to-amber-500/10 dark:from-amber-500/5 dark:via-slate-900 dark:to-amber-500/5 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Discover Delhi Heritage & Historical Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect your spiritual explorations with Delhi's monumental heritage—including Mughal architecture, Sultanate tombs, stepwells, and ancient medieval forts.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/delhi/heritage"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 text-xs font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors shadow-sm"
              >
                Visit Delhi Heritage Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};
