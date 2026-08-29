import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Car,
  Train,
  Sparkles,
  ArrowRight,
  Navigation,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  BookOpen,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import {
  ALL_WEEKEND_GETAWAYS,
  DISTANCE_BRACKETS,
  GETAWAY_CATEGORIES,
  searchWeekendGetaways,
} from '../../data/getaways/allWeekendGetaways';
import { GETAWAY_EDITORIAL_GUIDES } from '../../data/getaways/getawayGuidesData';
import { GetawayCard } from '../../components/getaways/GetawayCard';
import { GetawayFilterBar } from '../../components/getaways/GetawayFilterBar';
import { GetawayMapModal } from '../../components/getaways/GetawayMapModal';
import { GetawayVerificationNotice } from '../../components/getaways/GetawayVerificationNotice';
import { GetawayJsonLd } from '../../components/getaways/GetawayJsonLd';
import {
  DistanceBracket,
  TripDuration,
  BudgetLevel,
  DestinationCategory,
  TravellerType,
  StateRegion,
  WeekendGetawayPlace,
} from '../../types/weekendGetaways.types';

export const WeekendGetawaysHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<DistanceBracket | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<TripDuration | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<BudgetLevel | 'all'>('all');
  const [selectedTravellerType, setSelectedTravellerType] = useState<TravellerType | 'all'>('all');
  const [selectedState, setSelectedState] = useState<StateRegion | 'all'>('all');
  const [selectedSeasonSpecial, setSelectedSeasonSpecial] = useState<'all' | 'monsoon' | 'winter' | 'summer'>('all');
  const [selectedTransitType, setSelectedTransitType] = useState<'all' | 'train' | 'road'>('all');

  const [activeMapPlace, setActiveMapPlace] = useState<WeekendGetawayPlace | null>(null);

  // Filtered getaways
  const filteredPlaces = useMemo(() => {
    return searchWeekendGetaways(searchQuery, {
      distance: selectedDistance,
      category: selectedCategory,
      duration: selectedDuration,
      budget: selectedBudget,
      travellerType: selectedTravellerType,
      state: selectedState,
      seasonSpecial: selectedSeasonSpecial,
      transitType: selectedTransitType,
    });
  }, [
    searchQuery,
    selectedDistance,
    selectedCategory,
    selectedDuration,
    selectedBudget,
    selectedTravellerType,
    selectedState,
    selectedSeasonSpecial,
    selectedTransitType,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDistance('all');
    setSelectedCategory('all');
    setSelectedDuration('all');
    setSelectedBudget('all');
    setSelectedTravellerType('all');
    setSelectedState('all');
    setSelectedSeasonSpecial('all');
    setSelectedTransitType('all');
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Delhi NCR', url: '/delhi' },
    { name: 'Weekend Getaways', url: '/delhi/weekend-getaways' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <GetawayJsonLd
        title="Weekend Getaways From Delhi (100–500 km) | Road Trips, Hill Stations & Heritage"
        description="Discover the ultimate curated guide to weekend getaways from Delhi NCR. Filter destinations by distance (<100 km to 500 km), Vande Bharat train routes, hill stations, budget trips, and seasonal getaways across Uttarakhand, Himachal, Rajasthan, UP & Haryana."
        canonicalUrl="/delhi/weekend-getaways"
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header Section */}
      <div className="relative border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent py-12 lg:py-16">
        <Container className="space-y-6">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/delhi" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Delhi
            </Link>
            <span>/</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold">
              Weekend Getaways
            </span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-bold text-sky-800 dark:text-sky-300">
              <Compass className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Delhi NCR Travel & Weekend Discovery Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Weekend Getaways From Delhi
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Escape the capital with handpicked road trips, Vande Bharat train escapes, misty Himalayan hill stations, royal Rajput fortresses, wildlife tiger reserves, and sacred river ghats within 45 km to 500 km of Delhi NCR.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Navigation className="h-4 w-4 text-sky-500" />
                <span>{ALL_WEEKEND_GETAWAYS.length} Curated Getaways</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Car className="h-4 w-4 text-emerald-500" />
                <span>Expressway Sourced Drive Times</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <Train className="h-4 w-4 text-purple-500" />
                <span>Vande Bharat & Shatabdi Routes</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        {/* Verification & Reliability Notice */}
        <GetawayVerificationNotice />

        {/* Featured Editorial Guides Carousel / Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>SpotPicks Travel Editorials</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Curated Guides & Trip Itineraries
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GETAWAY_EDITORIAL_GUIDES.slice(0, 6).map((guide) => (
              <Link
                key={guide.id}
                to={`/delhi/weekend-getaways/guide/${guide.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-sky-500/40 hover:shadow-lg transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 font-bold px-2 py-0.5">
                      {guide.category}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">{guide.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick links to all 10 guides */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Explore All 10 Getaway Editorial Topics:
            </div>
            <div className="flex flex-wrap gap-2">
              {GETAWAY_EDITORIAL_GUIDES.map((g) => (
                <Link
                  key={g.id}
                  to={`/delhi/weekend-getaways/guide/${g.slug}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Filter Engine */}
        <section id="getaways-directory" className="space-y-6 pt-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Explore Destinations ({filteredPlaces.length})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Filter by distance brackets, duration, transport type, budget, and travel companions.
            </p>
          </div>

          <GetawayFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDistance={selectedDistance}
            onDistanceChange={setSelectedDistance}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            selectedBudget={selectedBudget}
            onBudgetChange={setSelectedBudget}
            selectedTravellerType={selectedTravellerType}
            onTravellerTypeChange={setSelectedTravellerType}
            selectedState={selectedState}
            onStateChange={setSelectedState}
            selectedSeasonSpecial={selectedSeasonSpecial}
            onSeasonSpecialChange={setSelectedSeasonSpecial}
            selectedTransitType={selectedTransitType}
            onTransitTypeChange={setSelectedTransitType}
            onResetFilters={handleResetFilters}
            totalResults={filteredPlaces.length}
          />

          {/* Destination Cards Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredPlaces.map((place) => (
                <GetawayCard
                  key={place.id}
                  place={place}
                  onOpenMap={(p) => setActiveMapPlace(p)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Navigation className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No destinations match your exact filter combination
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your distance range, duration, or experience filters to see more weekend getaways.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-500 transition-colors"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </section>

        {/* State Regional Breakdowns */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-10 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Regional Geography
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Getaways by Neighboring State
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setSelectedState('Uttarakhand')}
              className="cursor-pointer group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 hover:border-sky-500/40 hover:shadow-md transition-all"
            >
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">Devbhoomi</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Uttarakhand</h3>
              <p className="text-xs text-slate-500">
                Rishikesh, Haridwar, Lansdowne, Mussoorie, Nainital, Jim Corbett.
              </p>
            </div>

            <div
              onClick={() => setSelectedState('Rajasthan')}
              className="cursor-pointer group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 hover:border-sky-500/40 hover:shadow-md transition-all"
            >
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">Royal Heritage</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Rajasthan</h3>
              <p className="text-xs text-slate-500">
                Neemrana, Sariska, Bharatpur, Jaipur, Pushkar, Alwar.
              </p>
            </div>

            <div
              onClick={() => setSelectedState('Himachal Pradesh')}
              className="cursor-pointer group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 hover:border-sky-500/40 hover:shadow-md transition-all"
            >
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">Shivalik & Himalayas</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Himachal Pradesh</h3>
              <p className="text-xs text-slate-500">
                Kasauli, Shimla, Mashobra, Narkanda, Parwanoo.
              </p>
            </div>

            <div
              onClick={() => setSelectedState('Uttar Pradesh')}
              className="cursor-pointer group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 hover:border-sky-500/40 hover:shadow-md transition-all"
            >
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">Yamuna Corridor</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Uttar Pradesh</h3>
              <p className="text-xs text-slate-500">
                Agra, Mathura, Vrindavan, Fatehpur Sikri.
              </p>
            </div>
          </div>
        </section>

        {/* Delhi Internal Linking Hub */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Connected Delhi NCR Transit & Discovery Hubs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plan your getaway departure smoothly from key railway stations, bus terminals, and highway pickup points.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <Link
              to="/delhi/heritage"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Delhi Heritage Hub
            </Link>
            <Link
              to="/india/spiritual"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Spiritual India Hub
            </Link>
            <Link
              to="/delhi/nizamuddin"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Nizamuddin Terminal
            </Link>
            <Link
              to="/delhi/kashmere-gate"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Kashmere Gate ISBT
            </Link>
            <Link
              to="/delhi/anand-vihar"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Anand Vihar Hub
            </Link>
            <Link
              to="/delhi/connaught-place"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-600 transition-colors"
            >
              Connaught Place
            </Link>
          </div>
        </section>
      </Container>

      {/* Route & Coordinates Modal */}
      <GetawayMapModal
        place={activeMapPlace}
        onClose={() => setActiveMapPlace(null)}
      />
    </div>
  );
};
