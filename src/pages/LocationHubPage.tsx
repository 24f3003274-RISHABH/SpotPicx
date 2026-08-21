import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Star,
  Sparkles,
  Utensils,
  Coffee,
  Landmark,
  ShoppingBag,
  Hotel,
  ArrowRight,
  SlidersHorizontal,
  Navigation,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { MapView } from '../components/location/MapView';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';
import { useBusinesses, useCategories } from '../hooks/useDiscovery';
import { useGeolocation } from '../hooks/useGeolocation';
import { Business } from '../types';

export const LocationHubPage: React.FC = () => {
  const { citySlug = 'delhi', categorySlug } = useParams<{
    citySlug?: string;
    categorySlug?: string;
  }>();

  const [searchParams] = useSearchParams();
  const selectedLocality = searchParams.get('locality') || '';
  const [activeTab, setActiveTab] = useState<string>(categorySlug || 'all');
  const [selectedMapSpot, setSelectedMapSpot] = useState<Business | null>(null);
  const { coordinates: userCoords } = useGeolocation();

  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  // Map category slug to display name & query
  const categoryMap: Record<string, { name: string; icon: React.ReactNode; queryCat: string }> = {
    restaurants: { name: 'Restaurants & Food', icon: <Utensils className="h-4 w-4" />, queryCat: 'food-and-cafes' },
    cafes: { name: 'Cafes & Bakeries', icon: <Coffee className="h-4 w-4" />, queryCat: 'food-and-cafes' },
    places: { name: 'Heritage & Places', icon: <Landmark className="h-4 w-4" />, queryCat: 'places-and-heritage' },
    shopping: { name: 'Shopping & Bazaars', icon: <ShoppingBag className="h-4 w-4" />, queryCat: 'shopping-and-markets' },
    hostels: { name: 'Student Housing & PGs', icon: <Hotel className="h-4 w-4" />, queryCat: 'stay-and-hostels' },
  };

  const activeCategoryConfig = categorySlug ? categoryMap[categorySlug.toLowerCase()] : null;
  const filterCategory = activeCategoryConfig ? activeCategoryConfig.queryCat : undefined;

  const { data: businessesData, isLoading } = useBusinesses({
    city: cityName,
    locality: selectedLocality || undefined,
    category: filterCategory,
    limit: 24,
  });

  const businesses = businessesData?.data || [];

  return (
    <div className="py-8 md:py-12 space-y-10 pb-24">
      <Container size="xl" className="space-y-8">
        {/* City Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 shadow-2xl">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=80"
              alt={`${cityName} skyline`}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>Location Discovery Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {activeCategoryConfig
                ? `Best ${activeCategoryConfig.name} in ${cityName}`
                : `Discover the Best of ${cityName} NCR`}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {activeCategoryConfig
                ? `Hand-picked and verified ${activeCategoryConfig.name.toLowerCase()} across historic avenues, student hubs, and buzzing markets of ${cityName}.`
                : `Explore top-rated cafes, historic monuments, authentic street eats, student hostels, and reliable repair hubs across the capital region.`}
            </p>

            {/* Quick Category Hub Links */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Link
                to={`/${citySlug.toLowerCase()}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !categorySlug
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                All {cityName}
              </Link>
              <Link
                to={`/${citySlug.toLowerCase()}/restaurants`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categorySlug === 'restaurants'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <Utensils className="h-3 w-3" />
                <span>Restaurants</span>
              </Link>
              <Link
                to={`/${citySlug.toLowerCase()}/cafes`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categorySlug === 'cafes'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <Coffee className="h-3 w-3" />
                <span>Cafes</span>
              </Link>
              <Link
                to={`/${citySlug.toLowerCase()}/places`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categorySlug === 'places'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <Landmark className="h-3 w-3" />
                <span>Heritage & Places</span>
              </Link>
              <Link
                to={`/${citySlug.toLowerCase()}/shopping`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categorySlug === 'shopping'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <ShoppingBag className="h-3 w-3" />
                <span>Shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Delhi Neighborhoods Explorer Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Explore by {cityName} Neighborhood:</span>
            </h2>
            {selectedLocality && (
              <Link
                to={`/${citySlug.toLowerCase()}${categorySlug ? '/' + categorySlug : ''}`}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Show All {cityName}
              </Link>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {POPULAR_DELHI_LOCALITIES.map((loc) => {
              const isSelected = selectedLocality.toLowerCase() === loc.name.toLowerCase();
              return (
                <Link
                  key={loc.id}
                  to={`/${citySlug.toLowerCase()}${categorySlug ? '/' + categorySlug : ''}?locality=${encodeURIComponent(
                    loc.name
                  )}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs'
                  }`}
                >
                  {loc.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Interactive Location Map & Listings Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Listings Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedLocality
                  ? `${businesses.length} Spots in ${selectedLocality}`
                  : `Top Spots in ${cityName}`}
              </h3>

              <Link
                to={`/search?city=${encodeURIComponent(cityName)}${
                  selectedLocality ? '&locality=' + encodeURIComponent(selectedLocality) : ''
                }${filterCategory ? '&category=' + encodeURIComponent(filterCategory) : ''}`}
              >
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Open Full Filter Engine
                </Button>
              </Link>
            </div>

            {businesses.length === 0 ? (
              <Card className="p-10 text-center space-y-3 border-dashed border-slate-300">
                <p className="text-sm font-semibold text-slate-700">No spots found in this selection.</p>
                <Link to="/search">
                  <Button size="sm" variant="primary">Browse All Delhi NCR</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {businesses.map((biz) => (
                  <BusinessCard key={biz._id || biz.slug} business={biz} />
                ))}
              </div>
            )}
          </div>

          {/* Sticky Interactive Map Right Column (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-indigo-600" />
                  <span>{cityName} Interactive Pinpoint Map</span>
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">{businesses.length} Pins</span>
              </div>

              <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-200">
                <MapView
                  businesses={businesses}
                  selectedBusiness={selectedMapSpot}
                  userCoords={userCoords}
                  onSelectBusiness={(b) => setSelectedMapSpot(b)}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
