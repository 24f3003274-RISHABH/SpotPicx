import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  Navigation,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { useLocationDetail, useLocationBusinesses } from '../hooks/useDiscovery';

export const LocationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: location, isLoading: isLocLoading } = useLocationDetail(slug);
  const { data: resultData, isLoading: isBizLoading } = useLocationBusinesses(slug, { page, limit: 12 });

  const businesses = resultData?.data || [];
  const pagination = resultData?.pagination;

  return (
    <div className="py-8 space-y-8 pb-20">
      <Container size="xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/locations" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Localities</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{location?.name || slug}</span>
        </div>

        {/* Locality Hero */}
        <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden p-6 md:p-10 border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <MapPin className="h-3.5 w-3.5" />
              <span>Delhi Neighborhood</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              {location?.name || 'Locality Discovery'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {location?.description || `Explore verified businesses and top-rated spots in ${location?.name}, Delhi NCR.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              {location?.pincode && (
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  <span>PIN:</span>
                  <span className="text-white font-bold">{location.pincode}</span>
                </div>
              )}
              {location?.latitude && location?.longitude && (
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                  <Navigation className="h-3 w-3 text-indigo-400" />
                  <span>
                    {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Header & View Mode Switcher */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Spots in {location?.name}
            </h2>
            <p className="text-xs text-slate-500">
              Showing verified restaurants, cafes, hostels, repairs, and markets.
            </p>
          </div>

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

        {/* Business Grid */}
        {isBizLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Spots Listed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We are expanding verified listings in {location?.name}. Check back shortly or add a business!
            </p>
            <Link to="/explore">
              <Button size="sm" variant="primary">
                Browse All Spots
              </Button>
            </Link>
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
              Page <span className="font-bold text-slate-800">{pagination.page}</span> of{' '}
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
