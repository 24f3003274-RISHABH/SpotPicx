import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { useCategory, useBusinesses } from '../hooks/useDiscovery';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [locality, setLocality] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<'rating' | 'reviews' | 'newest' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: category, isLoading: isCategoryLoading } = useCategory(slug);

  const { data: businessesData, isLoading: isBusinessesLoading } = useBusinesses({
    category: slug,
    locality: locality || undefined,
    priceRange: priceRange || undefined,
    verified: verifiedOnly || undefined,
    sort,
    page,
    limit: 12,
  });

  const businesses = businessesData?.data || [];
  const pagination = businessesData?.pagination;

  return (
    <div className="py-8 space-y-8 pb-20">
      <Container size="xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/explore" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Categories</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{category?.name || slug}</span>
        </div>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-6 md:p-10 border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Category Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {category?.name || 'Category Directory'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {category?.description || `Explore verified and top-rated spots under ${slug} in Delhi NCR.`}
            </p>

            {/* Subcategories pills if available */}
            {category?.subcategories && category.subcategories.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Subcategories:</span>
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub._id || sub.slug}
                    to={`/category/${sub.slug}`}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filters and Controls Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 mt-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* Locality filter */}
            <select
              value={locality}
              onChange={(e) => {
                setLocality(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by locality"
              className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="">All Delhi Localities</option>
              {POPULAR_DELHI_LOCALITIES.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* Price filter */}
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by price range"
              className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="">All Price Ranges</option>
              <option value="BUDGET">₹ Budget-Friendly</option>
              <option value="MODERATE">₹₹ Moderate</option>
              <option value="PREMIUM">₹₹₹ Premium</option>
              <option value="LUXURY">₹₹₹₹ Luxury</option>
            </select>

            {/* Verified toggle */}
            <button
              type="button"
              onClick={() => {
                setVerifiedOnly(!verifiedOnly);
                setPage(1);
              }}
              className={`h-9 px-3 text-xs rounded-xl border flex items-center gap-1.5 font-semibold cursor-pointer transition-colors ${
                verifiedOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Only</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort listings by"
              className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="newest">Newest Added</option>
              <option value="name">Alphabetical</option>
            </select>

            {/* View Mode Toggle */}
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

        {/* Results Section */}
        {isBusinessesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Spots Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No businesses currently match your selected filters in this category. Try resetting the filters.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setLocality('');
                setPriceRange('');
                setVerifiedOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'
                : 'space-y-4 mt-6'
            }
          >
            {businesses.map((biz) => (
              <BusinessCard key={biz._id || biz.slug} business={biz} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
            <div className="text-xs text-slate-500">
              Showing page <span className="font-bold text-slate-800">{pagination.page}</span> of{' '}
              <span className="font-bold text-slate-800">{pagination.totalPages}</span> ({pagination.total} total spots)
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
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
