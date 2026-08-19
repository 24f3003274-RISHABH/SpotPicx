import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { useBusinesses, useCategories, useLocations } from '../hooks/useDiscovery';

export const BusinessesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryQ = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryLocality = searchParams.get('locality') || '';
  const queryPrice = searchParams.get('priceRange') || '';
  const queryVerified = searchParams.get('verified') === 'true';
  const queryRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
  const querySort = (searchParams.get('sort') as any) || 'rating';
  const queryPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const [searchTerm, setSearchTerm] = useState(queryQ);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories } = useCategories();
  const { data: locations } = useLocations();

  const { data: businessesData, isLoading } = useBusinesses({
    q: queryQ || undefined,
    category: queryCategory || undefined,
    locality: queryLocality || undefined,
    priceRange: queryPrice || undefined,
    verified: queryVerified ? true : undefined,
    rating: queryRating || undefined,
    sort: querySort,
    page: queryPage,
    limit: 12,
  });

  const businesses = businessesData?.data || [];
  const pagination = businessesData?.pagination;

  const updateFilters = (newParams: Record<string, string | null>) => {
    const updated = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(newParams)) {
      if (v === null || v === '' || v === undefined) {
        updated.delete(k);
      } else {
        updated.set(k, v);
      }
    }
    // Always reset to page 1 unless page itself was updated
    if (!newParams.page) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchTerm });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    Boolean(queryQ) ||
    Boolean(queryCategory) ||
    Boolean(queryLocality) ||
    Boolean(queryPrice) ||
    queryVerified ||
    Boolean(queryRating);

  return (
    <div className="py-8 space-y-8 pb-20">
      <Container size="xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Delhi NCR Business Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All Spots & Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse top verified restaurants, cafes, hostels, repair shops, and local institutions across Delhi NCR.
            </p>
          </div>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, tag, or place..."
              className="w-full h-11 pl-10 pr-10 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateFilters({ q: null });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <select
                value={queryCategory}
                onChange={(e) => updateFilters({ category: e.target.value || null })}
                aria-label="Filter by category"
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id || cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Locality Filter */}
              <select
                value={queryLocality}
                onChange={(e) => updateFilters({ locality: e.target.value || null })}
                aria-label="Filter by locality"
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 cursor-pointer"
              >
                <option value="">All Localities</option>
                {locations
                  ?.filter((l) => l.type === 'LOCALITY')
                  .map((loc) => (
                    <option key={loc._id || loc.slug} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
              </select>

              {/* Price Filter */}
              <select
                value={queryPrice}
                onChange={(e) => updateFilters({ priceRange: e.target.value || null })}
                aria-label="Filter by price"
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 cursor-pointer"
              >
                <option value="">All Price Tiers</option>
                <option value="BUDGET">₹ Budget-Friendly</option>
                <option value="MODERATE">₹₹ Moderate</option>
                <option value="PREMIUM">₹₹₹ Premium</option>
                <option value="LUXURY">₹₹₹₹ Luxury</option>
              </select>

              {/* Verified Only */}
              <button
                type="button"
                onClick={() => updateFilters({ verified: queryVerified ? null : 'true' })}
                className={`h-9 px-3 text-xs rounded-xl border flex items-center gap-1.5 font-semibold cursor-pointer transition-colors ${
                  queryVerified
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Only</span>
              </button>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="h-9 px-3 text-xs rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-1 font-semibold transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right: Sort & Layout */}
            <div className="flex items-center gap-3">
              <select
                value={querySort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                aria-label="Sort listings"
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Newest Added</option>
                <option value="name">Alphabetical</option>
              </select>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400'
                  }`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Found <strong className="text-slate-900">{pagination?.total ?? businesses.length}</strong> matching spots
          </span>
          {pagination && pagination.totalPages > 1 && (
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          )}
        </div>

        {/* Businesses Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Spots Matched</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any businesses matching your search criteria. Try modifying your search or resetting filters.
            </p>
            <Button size="sm" variant="outline" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {businesses.map((biz) => (
              <BusinessCard key={biz._id || biz.slug} business={biz} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
            <div className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{businesses.length}</span> spots of{' '}
              <span className="font-bold text-slate-800">{pagination.total}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => updateFilters({ page: String(Math.max(1, queryPage - 1)) })}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => updateFilters({ page: String(queryPage + 1) })}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
