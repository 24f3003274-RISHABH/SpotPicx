import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Navigation,
  Sparkles,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
  RotateCcw,
  Filter,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { SearchAutocomplete } from '../components/search/SearchAutocomplete';
import { MapView } from '../components/location/MapView';
import { CurrentLocationButton } from '../components/location/CurrentLocationButton';
import { LocationSelector } from '../components/location/LocationSelector';
import { useSearch } from '../hooks/useSearch';
import { useCategories, useLocations } from '../hooks/useDiscovery';
import { Business } from '../types';
import { MapCoordinate } from '../services/map/types';
import { mapService } from '../services/map';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const localityParam = searchParams.get('locality') || '';
  const cityParam = searchParams.get('city') || 'Delhi';
  const ratingParam = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const priceRangeParam = searchParams.get('priceRange') || '';
  const priceMaxParam = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined;
  const sortParam = searchParams.get('sort') || 'recommended';
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const openNowParam = searchParams.get('openNow') === 'true';
  const verifiedParam = searchParams.get('verified') === 'true';
  const radiusParam = searchParams.get('radius') ? Number(searchParams.get('radius')) : 10;
  const latParam = searchParams.get('lat') ? Number(searchParams.get('lat')) : undefined;
  const lngParam = searchParams.get('lng') ? Number(searchParams.get('lng')) : undefined;
  const tagsParam = searchParams.get('tags') ? searchParams.get('tags')!.split(',') : [];
  const amenitiesParam = searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [];

  // Responsive / View state
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [listingViewMode, setListingViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMapSpot, setSelectedMapSpot] = useState<Business | null>(null);
  const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Fetch Categories & Localities for Filter Sidebar
  const { data: categoriesData } = useCategories();
  const { data: locationsData } = useLocations();

  const categories = categoriesData || [];
  const localities = (locationsData || []).filter((l) => l.type === 'LOCALITY');

  // Unified Search Query
  const { data: searchResponse, isLoading, isFetching } = useSearch({
    q: qParam,
    category: categoryParam,
    locality: localityParam,
    city: cityParam,
    rating: ratingParam,
    priceRange: priceRangeParam || undefined,
    priceMax: priceMaxParam,
    sort: sortParam,
    page: pageParam,
    limit: 24,
    openNow: openNowParam,
    lat: latParam,
    lng: lngParam,
    radius: radiusParam,
    tags: tagsParam,
    amenities: amenitiesParam,
  });

  const businesses = searchResponse?.data || [];
  const pagination = searchResponse?.pagination;
  const parsedQuery = searchResponse?.parsedQuery;

  // Filter Update Helper
  const updateFilter = (key: string, value: any) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === '' || value === 'All') {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.join(','));
      }
    } else {
      newParams.set(key, String(value));
    }
    newParams.delete('page'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
    setSelectedMapSpot(null);
  };

  const handleLocationAcquired = (coords: MapCoordinate) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lat', coords.lat.toFixed(4));
    newParams.set('lng', coords.lng.toFixed(4));
    newParams.set('sort', 'distance');
    if (!newParams.get('radius')) newParams.set('radius', '10');
    setSearchParams(newParams);
  };

  const handleLocationCleared = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('lat');
    newParams.delete('lng');
    if (newParams.get('sort') === 'distance') {
      newParams.set('sort', 'recommended');
    }
    setSearchParams(newParams);
  };

  const userCoords: MapCoordinate | null =
    latParam && lngParam ? { lat: latParam, lng: lngParam } : null;

  const hasActiveFilters = Boolean(
    categoryParam ||
      localityParam ||
      ratingParam ||
      priceRangeParam ||
      priceMaxParam ||
      openNowParam ||
      verifiedParam ||
      latParam ||
      tagsParam.length > 0 ||
      amenitiesParam.length > 0
  );

  const popularPresetQueries = [
    'best cafes in Delhi',
    'momos under 200',
    'quiet cafes with WiFi',
    'laptop repair in Nehru Place',
    'rooftop date places',
    'student food in Majnu Ka Tilla',
  ];

  return (
    <div className="py-6 md:py-8 space-y-6 pb-24 lg:pb-12">
      <Container size="xl" className="space-y-6">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-indigo-600">Home</Link> &gt; <span>Search & Discovery Map</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <span>{qParam ? `Discovery: "${qParam}"` : localityParam ? `Spots in ${localityParam}` : 'Explore Delhi NCR Spots'}</span>
                {isFetching && (
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">
                    Searching...
                  </span>
                )}
              </h1>
            </div>

            {/* Geolocation & Mobile Filter Trigger */}
            <div className="flex items-center gap-2 flex-wrap">
              <CurrentLocationButton
                onLocationAcquired={handleLocationAcquired}
                onLocationCleared={handleLocationCleared}
                onPermissionDenied={() => setMobileFilterOpen(true)}
              />

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5 text-indigo-600" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>
            </div>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="w-full">
            <SearchAutocomplete
              initialValue={qParam}
              onSearch={(newQ) => updateFilter('q', newQ)}
              placeholder='Try "quiet cafes with WiFi", "momos under 200", "laptop repair in Nehru Place"...'
            />
          </div>

          {/* Preset Discovery Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-semibold shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Try:
            </span>
            {popularPresetQueries.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateFilter('q', preset)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  qParam === preset
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* NLP Parsed Query Insight Banner */}
          {parsedQuery && (parsedQuery.intent !== 'STANDARD' || parsedQuery.category || parsedQuery.locality || parsedQuery.priceRange || parsedQuery.tags.length > 0) && (
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Smart Query Match:
                </span>

                {parsedQuery.intent && parsedQuery.intent !== 'STANDARD' && (
                  <span className="bg-indigo-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                    Intent: {parsedQuery.intent.replace('_', ' ')}
                  </span>
                )}

                {parsedQuery.category && (
                  <span className="bg-white text-indigo-700 font-medium px-2 py-0.5 rounded-md border border-indigo-200">
                    Category: {parsedQuery.category}
                  </span>
                )}

                {parsedQuery.locality && (
                  <span className="bg-white text-indigo-700 font-medium px-2 py-0.5 rounded-md border border-indigo-200">
                    Locality: {parsedQuery.locality}
                  </span>
                )}

                {parsedQuery.priceMax && (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    Budget &lt; ₹{parsedQuery.priceMax}
                  </span>
                )}

                {parsedQuery.tags.map((t, idx) => (
                  <span key={idx} className="bg-white text-slate-600 text-[11px] px-1.5 py-0.5 rounded border border-slate-200">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-indigo-700/80 font-semibold">
                Deterministic Search Parser
              </div>
            </div>
          )}
        </div>

        {/* Results Meta & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-200 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium flex-wrap">
            <span className="font-bold text-slate-900">{pagination?.total || businesses.length}</span> spots found
            {localityParam && <span>in <strong className="text-indigo-600">{localityParam}</strong></span>}
            {categoryParam && <span>for <strong className="text-indigo-600">{categoryParam}</strong></span>}
            {latParam && <span>within {radiusParam}km of your location</span>}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* View Mode Switcher for Desktop */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setListingViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  listingViewMode === 'grid' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setListingViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  listingViewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 hidden md:inline">Sort:</span>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="recommended">⭐ Recommended (Ranked)</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
                <option value="reviews">Most Reviewed</option>
                <option value="distance" disabled={!latParam}>
                  📍 Nearest (Requires Location)
                </option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* 
          Phase 6 Responsive Discovery Layout:
          Desktop: 3-column / split view (25% filters, 45% listings, 30% sticky interactive map)
          Mobile: Full screen toggle between List and Map!
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 1. Desktop Filter Sidebar (3 cols = 25%) */}
          <div className="hidden lg:block lg:col-span-3 space-y-5 sticky top-24">
            <Card className="p-5 space-y-5 border-slate-200 shadow-xs rounded-2xl">
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-600" /> Filters
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Locality Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Delhi Neighborhood
                </label>
                <LocationSelector
                  selectedLocality={localityParam}
                  selectedRadiusKm={radiusParam}
                  onSelectLocality={(loc) => updateFilter('locality', loc)}
                  onSelectRadius={(rad) => updateFilter('radius', rad)}
                  onClear={() => updateFilter('locality', '')}
                  showRadius={Boolean(latParam)}
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Category
                </label>
                <select
                  value={categoryParam}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id || c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Tier Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Price Tier
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: '', label: 'Any Price' },
                    { id: 'BUDGET', label: '₹ Budget' },
                    { id: 'MODERATE', label: '₹₹ Moderate' },
                    { id: 'PREMIUM', label: '₹₹₹ Premium' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateFilter('priceRange', p.id)}
                      className={`text-xs py-1.5 px-2 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        priceRangeParam === p.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:border-indigo-300 text-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Rating
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { val: 0, label: 'All' },
                    { val: 4.0, label: '4.0+ ★' },
                    { val: 4.5, label: '4.5+ ★' },
                    { val: 4.8, label: '4.8+ ★' },
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => updateFilter('rating', r.val > 0 ? r.val : '')}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-colors ${
                        (ratingParam || 0) === r.val
                          ? 'bg-amber-500 text-white border-amber-500 font-bold'
                          : 'border-slate-200 hover:border-amber-300 text-slate-700'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Popular Amenities
                </label>
                <div className="space-y-1.5">
                  {['Free High-Speed WiFi', 'Outdoor Seating', 'Valet Parking', 'AC'].map((amenity) => {
                    const isSelected = amenitiesParam.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-indigo-600 cursor-pointer font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const newAmenities = isSelected
                              ? amenitiesParam.filter((a) => a !== amenity)
                              : [...amenitiesParam, amenity];
                            updateFilter('amenities', newAmenities);
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* 2. Listings Column (5.5 cols = ~45% on desktop) */}
          <div
            className={`space-y-6 ${
              mobileView === 'map' ? 'hidden lg:block' : 'block'
            } ${isMapExpanded ? 'lg:col-span-5' : 'lg:col-span-5'}`}
          >
            {businesses.length === 0 ? (
              <Card className="p-12 text-center space-y-4 border-dashed border-slate-300 rounded-2xl">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Search className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No matching spots found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try clearing some filters or searching for popular Delhi terms like "cafes", "momos", or "hostels".
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                  Clear All Search Filters
                </Button>
              </Card>
            ) : (
              <>
                <div
                  className={
                    listingViewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                      : 'space-y-3'
                  }
                >
                  {businesses.map((biz) => (
                    <div
                      key={biz._id || biz.slug}
                      onMouseEnter={() => setHoveredSpotId(biz._id || biz.slug)}
                      onMouseLeave={() => setHoveredSpotId(null)}
                      className="transition-transform duration-200"
                    >
                      <BusinessCard
                        business={biz}
                        viewMode={listingViewMode}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
                      <span className="font-bold text-slate-900">{pagination.totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => updateFilter('page', pagination.page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => updateFilter('page', pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 3. Interactive Sticky Map Column (3.5-4 cols = ~30% on desktop, Full Screen on Mobile when toggled) */}
          <div
            className={`sticky top-24 ${
              mobileView === 'list' ? 'hidden lg:block' : 'block fixed inset-0 z-40 lg:relative lg:inset-auto'
            } lg:col-span-4`}
          >
            <div className="h-[calc(100vh-140px)] min-h-[480px] w-full">
              <MapView
                businesses={businesses}
                selectedBusiness={selectedMapSpot}
                hoveredBusinessId={hoveredSpotId}
                userCoords={userCoords}
                radiusKm={latParam ? radiusParam : undefined}
                onSelectBusiness={(b) => setSelectedMapSpot(b)}
                className="h-full w-full"
                isFullScreen={mobileView === 'map'}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Floating Mobile [List] [Map] Toggle Pill */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 lg:hidden shadow-2xl">
        <div className="bg-slate-900/95 backdrop-blur-md p-1 rounded-full border border-slate-700 flex items-center gap-1 shadow-2xl">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              mobileView === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>List ({businesses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileView('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              mobileView === 'map'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl p-6 overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                Discovery Filters
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Neighborhood */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Locality / Area
              </label>
              <LocationSelector
                selectedLocality={localityParam}
                selectedRadiusKm={radiusParam}
                onSelectLocality={(loc) => updateFilter('locality', loc)}
                onSelectRadius={(rad) => updateFilter('radius', rad)}
                onClear={() => updateFilter('locality', '')}
                showRadius={Boolean(latParam)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Category
              </label>
              <select
                value={categoryParam}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl p-2.5 bg-white text-slate-800"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Price Tier
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '', label: 'Any Price' },
                  { id: 'BUDGET', label: '₹ Budget' },
                  { id: 'MODERATE', label: '₹₹ Moderate' },
                  { id: 'PREMIUM', label: '₹₹₹ Premium' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => updateFilter('priceRange', p.id)}
                    className={`text-xs py-2 px-3 rounded-xl border text-center font-medium ${
                      priceRangeParam === p.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={handleClearAllFilters}
              >
                Reset All
              </Button>
              <Button
                variant="primary"
                className="w-1/2"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
