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
  Train,
  HelpCircle,
  BookOpen,
  Compass,
  Building2,
  ExternalLink,
  ChevronDown,
  Layers,
  Map as MapIcon,
  Tag,
  Star,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { useLocationDetail, useLocationBusinesses } from '../hooks/useDiscovery';
import { SEOHead } from '../components/seo/SEOHead';

export const LocationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showMap, setShowMap] = useState<boolean>(false);

  const { data: location, isLoading: isLocLoading } = useLocationDetail(slug);
  const { data: resultData, isLoading: isBizLoading } = useLocationBusinesses(slug, { page, limit: 12 });

  const rawBusinesses = resultData?.data || [];
  const pagination = resultData?.pagination;

  // Filter businesses locally based on selected chips
  const businesses = rawBusinesses.filter((biz) => {
    if (selectedCategory !== 'all') {
      const matchCat =
        biz.categorySlug?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        biz.categorySlugs?.some((c: string) => c.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        biz.tags?.some((t: string) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
      if (!matchCat) return false;
    }
    if (selectedPrice !== 'all') {
      if (biz.priceRange !== selectedPrice) return false;
    }
    return true;
  });

  const highlights = location?.highlights || [
    'Verified local establishments',
    'Direct Delhi Metro transit access',
    'Authentic street & culinary traditions',
    'Community reviewed with high trust scores',
  ];

  const nearbyLocalities = location?.nearbyLocalities || [
    { name: 'Connaught Place', slug: 'connaught-place', distance: '4.5 km' },
    { name: 'Hauz Khas', slug: 'hauz-khas', distance: '5.2 km' },
    { name: 'Saket', slug: 'saket', distance: '6.0 km' },
  ];

  const faqs = location?.faqs || [
    {
      question: `What makes ${location?.name || 'this locality'} famous in Delhi?`,
      answer: `${location?.name || 'This neighborhood'} is one of Delhi's prominent destinations, offering a vibrant mix of verified dining, shopping, cultural heritage, and modern amenities.`,
    },
    {
      question: `How can I travel to ${location?.name || 'this locality'} via Delhi Metro?`,
      answer: location?.metroConnectivity || 'Accessible via the comprehensive Delhi Metro rapid transit network.',
    },
  ];

  const relatedGuides = location?.relatedGuides || [
    { title: 'Best Restaurants in Delhi', slug: 'best-restaurants-in-delhi' },
    { title: 'Best Cafes in Delhi', slug: 'best-cafes-in-delhi' },
    { title: 'Best Date Places in Delhi', slug: 'best-date-places-in-delhi' },
  ];

  const popularCategories = location?.popularCategories || ['Cafes', 'Restaurants', 'Shopping', 'Living'];

  // Construct JSON-LD schemas
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: `${location?.name || 'Delhi Locality'}, Delhi`,
        description: location?.description,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: location?.latitude || 28.6139,
          longitude: location?.longitude || 77.209,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: location?.name,
          addressRegion: 'Delhi NCR',
          postalCode: location?.pincode,
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://spotpicks.delhi',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Delhi Neighborhoods',
            item: 'https://spotpicks.delhi/locations',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: location?.name || slug,
            item: `https://spotpicks.delhi/location/${slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="py-6 space-y-8 pb-20 bg-slate-50/50">
      <SEOHead
        title={`${location?.name || 'Locality'} Delhi: Best Spots, Cafes, Food & Living`}
        description={location?.description || `Explore top verified spots, restaurants, cafes, and markets in ${location?.name}, Delhi NCR.`}
        canonicalUrl={`https://spotpicks.delhi/location/${slug}`}
        jsonLd={jsonLdSchema}
      />

      <Container size="xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/locations" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Delhi Localities</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{location?.name || slug}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <MapPin className="h-3.5 w-3.5" />
              <span>Delhi NCR Neighborhood Guide</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {location?.name || 'Locality Discovery'}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-3xl">
              {location?.description ||
                `Explore verified businesses, iconic cafes, street food trails, and top-rated spots in ${location?.name}, Delhi NCR.`}
            </p>

            {/* Quick Metadata Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
              {location?.pincode && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400">PIN:</span>
                  <span className="text-white font-bold">{location.pincode}</span>
                </div>
              )}
              {location?.metroConnectivity && (
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <Train className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-slate-200">{location.metroConnectivity}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>{location?.businessCount || rawBusinesses.length} Verified Spots</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span>{showMap ? 'Hide Map' : 'View Neighborhood Map'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Map View Card (Collapsible) */}
        {showMap && (
          <div className="mt-6 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Neighborhood Coordinates & Map: {location?.name}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {location?.latitude?.toFixed(4) || '28.6139'}° N, {location?.longitude?.toFixed(4) || '77.2090'}° E
              </span>
            </div>

            <div className="w-full h-64 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden relative border border-slate-200">
              <iframe
                title={`Map of ${location?.name}`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${(location?.longitude || 77.209) - 0.03}%2C${(location?.latitude || 28.6139) - 0.02}%2C${(location?.longitude || 77.209) + 0.03}%2C${(location?.latitude || 28.6139) + 0.02}&layer=mapnik&marker=${location?.latitude || 28.6139}%2C${location?.longitude || 77.209}`}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Highlights & Popular Category Hub Chips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Highlights */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Why Visit {location?.name}? Key Neighborhood Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((h: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-xs text-slate-700 leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Categories in this Locality */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-indigo-600" />
              <span>Popular in {location?.name}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((cat: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Header & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-10 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <span>Spots in {location?.name}</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                {businesses.length} Places
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified dining, student stays, coffee roasteries, lifestyle boutiques, and service centers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Price Filter */}
            <select
              value={selectedPrice}
              aria-label="Filter by Price Tier"
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Prices</option>
              <option value="BUDGET">Budget (₹)</option>
              <option value="MODERATE">Moderate (₹₹)</option>
              <option value="LUXURY">Luxury (₹₹₹₹)</option>
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

        {/* Business Grid */}
        {isBizLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 mt-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Spots Matched Your Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your category or price filters to see all verified spots in {location?.name}.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPrice('all');
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

        {/* Surrounding & Nearby Localities */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mt-12 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-indigo-600" />
              <span>Surrounding & Nearby Neighborhoods</span>
            </h3>
            <Link to="/locations" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              View All 12 Localities →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {nearbyLocalities.map((near: any, idx: number) => (
              <Link
                key={idx}
                to={`/location/${near.slug}`}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {near.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{near.distance} away</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Related Curated Guides & Intent Pages */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mt-8 shadow-md">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Curated Delhi Guides</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              Explore More Top 10 Guides & Curated Lists
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Check out our expert-verified city-wide rankings for restaurants, momo trails, romantic date spots, and student accommodations.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {relatedGuides.map((guide: any, idx: number) => (
                <Link
                  key={idx}
                  to={`/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
                >
                  <span>{guide.title}</span>
                  <ExternalLink className="h-3 w-3 text-indigo-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Locality FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mt-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Frequently Asked Questions About {location?.name}
            </h3>
          </div>
          <div className="space-y-3">
            {faqs.map((faq: any, idx: number) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};
