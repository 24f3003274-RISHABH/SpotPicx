import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  Navigation,
  Sparkles,
  LayoutGrid,
  List,
  Map as MapIcon,
  X,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Filter,
  Layers,
  ArrowUpDown,
  Tag,
  Coffee,
  Wifi,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { SearchAutocomplete } from '../components/search/SearchAutocomplete';
import { SearchMapPreview } from '../components/search/SearchMapPreview';
import { useSearch } from '../hooks/useSearch';
import { useCategories, useLocations } from '../hooks/useDiscovery';
import { Business } from '../types';

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

  // Local UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedMapSpot, setSelectedMapSpot] = useState<Business | null>(null);

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
    limit: 20,
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
    setGeoError(null);
  };

  // Browser Geolocation Trigger
  const handleRequestNearMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('lat', position.coords.latitude.toFixed(6));
        newParams.set('lng', position.coords.longitude.toFixed(6));
        newParams.set('sort', 'distance');
        if (!newParams.get('radius')) newParams.set('radius', '10');
        setSearchParams(newParams);
      },
      (err) => {
        setGeoLoading(false);
        // Fallback to Connaught Place coordinates for preview if denied
        setGeoError('Location permission denied. Using central Delhi demo location.');
        const newParams = new URLSearchParams(searchParams);
        newParams.set('lat', '28.6304');
        newParams.set('lng', '77.2197');
        newParams.set('sort', 'distance');
        setSearchParams(newParams);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

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
    'laptop repair near Nehru Place',
    'quiet cafes with WiFi',
    'hostels near JNU',
    'rooftop date places',
  ];

  return (
    <div className="py-6 md:py-8 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Top Search & Presets Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                <Link to="/" className="hover:text-indigo-600">Home</Link> &gt; <span>Search & Discovery Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <span>{qParam ? `Discovery: "${qParam}"` : 'Discover Delhi Spots'}</span>
                {isFetching && (
                  <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">
                    Searching...
                  </span>
                )}
              </h1>
            </div>

            {/* Quick Near Me Geolocation Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRequestNearMe}
                disabled={geoLoading}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  latParam && lngParam
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <Navigation className={`h-3.5 w-3.5 ${latParam ? 'text-emerald-600 fill-emerald-600' : 'text-indigo-600'}`} />
                <span>{geoLoading ? 'Acquiring GPS...' : latParam ? 'Near Me Active (GPS)' : 'Find Near Me'}</span>
              </button>

              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-xs"
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
              placeholder='Try "momos under 200", "quiet cafes with WiFi", "laptop repair in Nehru Place"...'
            />
          </div>

          {/* Preset Chips */}
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

          {/* NLP Parsed Query Insight Banner (Deterministic Parser Feedback) */}
          {parsedQuery && (parsedQuery.intent !== 'STANDARD' || parsedQuery.category || parsedQuery.locality || parsedQuery.priceRange || parsedQuery.tags.length > 0) && (
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
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

              <div className="text-[11px] text-indigo-700/80 font-medium">
                Deterministic Natural Language Engine
              </div>
            </div>
          )}

          {geoError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between">
              <span>{geoError}</span>
              <button
                type="button"
                onClick={() => setGeoError(null)}
                className="text-amber-600 hover:text-amber-900 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Search Results & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-slate-200 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="font-bold text-slate-900">{pagination?.total || businesses.length}</span> spots found
            {localityParam && <span>in <strong className="text-indigo-600">{localityParam}</strong></span>}
            {categoryParam && <span>for <strong className="text-indigo-600">{categoryParam}</strong></span>}
            {latParam && <span>within {radiusParam}km of your location</span>}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Map Pinpoint View"
              >
                <MapIcon className="h-3.5 w-3.5" />
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

        {/* Main Content Layout: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-24">
            <Card className="p-5 space-y-5 border-slate-200 shadow-xs">
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

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
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

              {/* Locality Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Delhi Hubs & Localities
                </label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-indigo-600 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="locality"
                      checked={!localityParam}
                      onChange={() => updateFilter('locality', '')}
                      className="rounded-full text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>All Localities (Delhi NCR)</span>
                  </label>
                  {localities.map((loc) => (
                    <label
                      key={loc._id || loc.slug}
                      className="flex items-center gap-2 text-xs text-slate-700 hover:text-indigo-600 cursor-pointer font-medium"
                    >
                      <input
                        type="radio"
                        name="locality"
                        checked={localityParam === loc.name}
                        onChange={() => updateFilter('locality', loc.name)}
                        className="rounded-full text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{loc.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Radius (when coordinates active) */}
              {latParam && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold uppercase tracking-wider text-slate-500">
                      Search Radius
                    </label>
                    <span className="font-bold text-indigo-600">{radiusParam} km</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="2"
                    value={radiusParam}
                    onChange={(e) => updateFilter('radius', e.target.value)}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>2 km</span>
                    <span>10 km</span>
                    <span>30 km</span>
                  </div>
                </div>
              )}

              {/* Price Tier Filter */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Tier
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: '', label: 'Any Price' },
                    { id: 'BUDGET', label: '₹ Budget' },
                    { id: 'MODERATE', label: '₹₹ Moderate' },
                    { id: 'PREMIUM', label: '₹₹₹ Premium' },
                    { id: 'LUXURY', label: '₹₹₹₹ Luxury' },
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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
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

              {/* Amenities & Badges */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Amenities & Tags
                </label>
                <div className="space-y-1.5">
                  {['Free High-Speed WiFi', 'Outdoor Seating', 'Valet Parking', 'Pet Friendly', 'AC'].map((amenity) => {
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

          {/* Results Grid / List / Map */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map View Mode */}
            {viewMode === 'map' ? (
              <div className="space-y-4">
                <SearchMapPreview
                  businesses={businesses}
                  userLocation={latParam && lngParam ? { lat: latParam, lng: lngParam } : null}
                  radiusKm={radiusParam}
                  selectedBusinessId={selectedMapSpot?._id}
                  onSelectBusiness={(b) => setSelectedMapSpot(b)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {businesses.slice(0, 4).map((b) => (
                    <BusinessCard key={b._id || b.slug} business={b} viewMode="grid" />
                  ))}
                </div>
              </div>
            ) : businesses.length === 0 ? (
              <Card className="p-12 text-center space-y-4 border-dashed border-slate-300">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Search className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No matching spots found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    We couldn't find spots matching all your search constraints. Try clearing some filters or searching for popular terms like "momos", "cafes", or "repair".
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
                  Clear All Search Filters
                </Button>
              </Card>
            ) : (
              <>
                {/* Visual Discovery Map preview snippet at top if coordinates active */}
                {latParam && lngParam && (
                  <SearchMapPreview
                    businesses={businesses.slice(0, 10)}
                    userLocation={{ lat: latParam, lng: lngParam }}
                    radiusKm={radiusParam}
                    className="h-[280px]"
                  />
                )}

                {/* Results Listing */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'space-y-4'
                  }
                >
                  {businesses.map((biz) => (
                    <BusinessCard
                      key={biz._id || biz.slug}
                      business={biz}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
                      <span className="font-bold text-slate-900">{pagination.totalPages}</span> (
                      {pagination.total} total spots)
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
                        Next Page
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filters Sliding Drawer / Bottom Sheet */}
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

            {/* Mobile Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
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

            {/* Mobile Price */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
