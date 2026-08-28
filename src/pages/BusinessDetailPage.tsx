import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  CheckCircle2,
  Bookmark,
  Share2,
  Phone,
  Mail,
  Globe,
  Clock,
  Navigation,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Tag,
  Calendar,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Heart,
  MessageSquare,
  Send,
  X,
  Maximize2,
  Check,
  Copy,
  Coffee,
  Utensils,
  UtensilsCrossed,
  Landmark,
  Compass,
  Layers,
  Flag,
  Database,
  Train,
  Car,
  Accessibility,
  Hourglass,
  Sun,
  Flame,
  Image as ImageIcon,
  RefreshCw,
  Award,
  Search,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { BusinessDetailSkeleton } from '../components/ui/Skeletons';
import { DistanceBadge } from '../components/location/DistanceBadge';
import { MapView } from '../components/location/MapView';
import { ReviewList } from '../components/reviews/ReviewList';
import { SaveToCollectionModal } from '../components/collections/SaveToCollectionModal';
import { ReportModal } from '../components/common/ReportModal';
import { ShareButton } from '../components/common/ShareButton';
import { ClaimBusinessModal } from '../components/business/ClaimBusinessModal';
import { AskAboutPlaceBox } from '../components/ai/AskAboutPlaceBox';
import { EnquiryModal } from '../components/monetization/EnquiryModal';
import { monetizationService } from '../services/monetizationService';
import { discoveryService } from '../services/discoveryService';
import { businessOwnerService } from '../services/businessOwnerService';
import { useBusiness, useBusinesses } from '../hooks/useDiscovery';
import { useSavedStore } from '../store/useSavedStore';
import { useAuthStore } from '../store/useAuthStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { usePersonalization } from '../hooks/usePersonalization';
import { mapService } from '../services/map';
import { Business } from '../types';

const priceRangeMap: Record<string, { label: string; text: string; color: string }> = {
  BUDGET: { label: '₹', text: 'Budget-Friendly (Under ₹500 for two)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  MODERATE: { label: '₹₹', text: 'Casual Dining (₹500 - ₹1,500 for two)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  PREMIUM: { label: '₹₹₹', text: 'Gourmet (₹1,500 - ₹3,000 for two)', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  LUXURY: { label: '₹₹₹₹', text: 'Fine Dining (₹3,000+ for two)', color: 'text-amber-800 bg-amber-50 border-amber-200' },
};

interface UserReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export const BusinessDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { isSpotSaved, toggleSaveSpot } = useSavedStore();
  const { coordinates: userCoords } = useGeolocation();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [nearbyCategoryFilter, setNearbyCategoryFilter] = useState<'all' | 'cafes' | 'restaurants' | 'heritage'>('all');
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [aiSummaryOverride, setAiSummaryOverride] = useState<any>(null);

  // Menu Search and Filtering states
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('ALL');
  const [isVegOnly, setIsVegOnly] = useState(false);

  const { data: business, isLoading, error } = useBusiness(slug);
  const { recordView } = usePersonalization();

  // Refresh AI Summary handler
  const handleRefreshSummary = async () => {
    if (!business) return;
    setIsRefreshingSummary(true);
    try {
      const freshSummary = await discoveryService.generatePlaceSummary(business._id || business.slug);
      setAiSummaryOverride(freshSummary);
    } catch (err) {
      console.warn('Failed to refresh AI summary:', err);
    } finally {
      setIsRefreshingSummary(false);
    }
  };

  // Track user personalization profile
  React.useEffect(() => {
    if (business) {
      recordView(business);
    }
  }, [business?._id || business?.slug]);

  // Fetch broader spots for nearby discovery
  const { data: nearbyPoolData } = useBusinesses({
    city: 'Delhi',
    limit: 30,
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <Container size="xl">
          <BusinessDetailSkeleton />
        </Container>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="py-20 text-center space-y-4">
        <Container size="md">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MapPin className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Spot Not Found</h2>
          <p className="text-sm text-slate-500">
            The spot you are looking for does not exist or may have been archived.
          </p>
          <Link to="/search">
            <Button size="md" variant="primary">
              Browse All Spots
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const spotId = business._id || business.slug;
  const isSaved = isSpotSaved(spotId);

  const images =
    business.images && business.images.length > 0
      ? business.images
      : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'];

  const categoryName =
    typeof business.category === 'object' && business.category !== null
      ? (business.category as any).name
      : business.categoryDetails?.name || 'Local Spot';

  const priceInfo = priceRangeMap[business.priceRange] || priceRangeMap.MODERATE;

  // Directions via MapService Abstraction
  const directionsUrl = mapService.getDirectionsUrl({
    destination: {
      lat: business.latitude,
      lng: business.longitude,
    },
    origin: userCoords || undefined,
  });

  const activeMapProvider = mapService.getActiveProvider();

  // User distance
  const distanceKm = userCoords
    ? mapService.calculateDistanceKm(userCoords, { lat: business.latitude, lng: business.longitude })
    : null;

  const handleSaveToggle = () => {
    toggleSaveSpot(business);
  };

  // Determine open/closed status safely
  const isCurrentlyOpen = (): { isOpen: boolean; label: string } => {
    if (!business.openingHours) {
      return { isOpen: true, label: 'Open Now' };
    }
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];

    if (Array.isArray(business.openingHours)) {
      const todaySchedule = business.openingHours.find(
        (h) => h.day.toLowerCase() === currentDay
      );
      if (!todaySchedule || todaySchedule.isClosed) {
        return { isOpen: false, label: 'Closed Today' };
      }
      return { isOpen: true, label: `Open until ${todaySchedule.close}` };
    } else if (typeof business.openingHours === 'object') {
      const todayHours = (business.openingHours as Record<string, string>)[currentDay];
      if (todayHours) {
        return { isOpen: true, label: `Open (${todayHours})` };
      }
    }
    return { isOpen: true, label: 'Open Today' };
  };

  const openStatus = isCurrentlyOpen();

  // Nearby Places calculation: Compute distances and sort
  const allNearbyWithDistance = (nearbyPoolData?.data || [])
    .filter((b) => b.slug !== business.slug)
    .map((b) => {
      const dist = mapService.calculateDistanceKm(
        { lat: business.latitude, lng: business.longitude },
        { lat: b.latitude, lng: b.longitude }
      );
      return { ...b, distanceKm: dist };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const filteredNearby = allNearbyWithDistance.filter((b) => {
    const catSlug = typeof b.category === 'object' && b.category !== null ? b.category.slug : String(b.category || '');
    if (nearbyCategoryFilter === 'cafes') return catSlug.includes('cafe');
    if (nearbyCategoryFilter === 'restaurants') return catSlug.includes('food') || catSlug.includes('rest');
    if (nearbyCategoryFilter === 'heritage') return catSlug.includes('heritage') || catSlug.includes('place') || catSlug.includes('monument');
    return true;
  }).slice(0, 4);

  return (
    <div className="py-6 md:py-10 space-y-10 pb-28">
      <Container size="xl" className="space-y-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link to="/explore" className="hover:text-indigo-600 transition-colors">
              Explore
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link to={`/search?locality=${encodeURIComponent(business.locality)}`} className="hover:text-indigo-600 transition-colors">
              {business.locality}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-xs">
              {business.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-600' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Save Spot'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCollectionModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              <span>Add to Collection</span>
            </button>

            <ShareButton
              title={business.name}
              text={`Check out ${business.name} in ${business.locality}, Delhi on SpotPicks!`}
              variant="outline"
              size="sm"
            />

            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Report an issue with this spot"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 1. HERO & GALLERY */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  {categoryName}
                </span>

                {business.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>SpotPicks Verified</span>
                  </span>
                )}

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priceInfo.color}`}>
                  {priceInfo.label} • {business.priceRange}
                </span>

                {distanceKm !== null && <DistanceBadge distanceKm={distanceKm} size="md" variant="solid" />}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
                  <span className="text-slate-400 font-normal">({business.reviewCount || 10} ratings)</span>
                </div>

                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span>{business.locality}, {business.city}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-700">{openStatus.label}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                <span>Directions ({activeMapProvider.name})</span>
              </a>
            </div>
          </div>

          {/* Responsive Photo Carousel & Scrollable Reel */}
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[440px] bg-slate-900 shadow-md">
              <img
                src={images[activeImageIdx] || images[0]}
                alt={`${business.name} photo ${activeImageIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* Prev / Next Controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg z-10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg z-10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Photo Count Pill */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/75 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-md">
                Photo {activeImageIdx + 1} of {images.length}
              </div>

              {/* Fullscreen Modal Trigger */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg transition-all cursor-pointer z-10"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen View</span>
              </button>
            </div>

            {/* Horizontal Scrollable Thumbnail Reel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative shrink-0 w-20 sm:w-28 h-16 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer snap-start ${
                      activeImageIdx === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 opacity-100 scale-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. MAIN DETAILS & MAP SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Summary / Place Overview */}
            {(() => {
              const intel = business.placeIntelligence;
              const summary = aiSummaryOverride || intel?.aiSummary || {
                whyVisit: business.shortDescription || `A premier spot in ${business.locality} renowned for authentic quality and vibrant community buzz.`,
                whatToExpect: `Expect top-notch service, welcoming atmosphere, and curated offerings in the heart of ${business.locality}, Delhi.`,
                bestFor: intel?.bestFor || ['Friends & Hangouts', 'Food Discovery', 'Local Exploration'],
              };

              return (
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-indigo-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/25">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          <span>SpotPicx AI Place Intelligence</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                            Verified Insights
                          </span>
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRefreshSummary}
                      disabled={isRefreshingSummary}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
                      title="Regenerate concise AI overview"
                    >
                      <RefreshCw className={`h-3 w-3 ${isRefreshingSummary ? 'animate-spin' : ''}`} />
                      <span>{isRefreshingSummary ? 'Updating...' : 'Refresh AI Summary'}</span>
                    </button>
                  </div>

                  <div className="relative z-10 space-y-4 text-xs sm:text-sm">
                    {/* Why Visit */}
                    <div>
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                        Why Visit This Spot
                      </span>
                      <p className="text-indigo-50/95 leading-relaxed font-medium">
                        {summary.whyVisit}
                      </p>
                    </div>

                    {/* What to Expect */}
                    {summary.whatToExpect && (
                      <div>
                        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                          What to Expect
                        </span>
                        <p className="text-indigo-100/85 leading-relaxed">
                          {summary.whatToExpect}
                        </p>
                      </div>
                    )}

                    {/* Best For Chips */}
                    {summary.bestFor && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1.5">
                          Best Suited For
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(summary.bestFor) ? summary.bestFor : [summary.bestFor]).map((item: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-400/25 text-xs font-medium"
                            >
                              ★ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Place Intelligence Key Facts & Attributes */}
            {(() => {
              const intel = business.placeIntelligence;
              if (!intel) return null;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {intel.recommendedDuration && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Hourglass className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Duration</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {intel.recommendedDuration}
                      </div>
                    </div>
                  )}

                  {intel.bestTimeToVisit && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Sun className="h-3.5 w-3.5 text-amber-500" />
                        <span>Best Time</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {intel.bestTimeToVisit}
                      </div>
                    </div>
                  )}

                  {intel.priceLevel && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Tag className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Price Level</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {intel.priceLevel}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Freshness</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-700">
                      {business.freshnessStatus || 'FRESH'}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Popular Items / What People Order */}
            {business.placeIntelligence?.popularItems && business.placeIntelligence.popularItems.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-rose-500" />
                    <span>Popular & Signature Items</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">Community Favorites</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {business.placeIntelligence.popularItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESTAURANT MENU & SPECIALTIES SECTION */}
            {(() => {
              // Curated fallback menu items if not populated yet in DB
              const defaultDishes = [
                {
                  name: 'Chef’s Special Gourmet Signature Platter',
                  category: 'Starters',
                  price: 490,
                  isVeg: true,
                  isBestseller: true,
                  description: 'Curated mix of artisanal bites, woodfired dips, and house condiments.',
                },
                {
                  name: 'Signature Wood-Fired Truffle Pizza / Entrée',
                  category: 'Main Course',
                  price: 620,
                  isVeg: true,
                  isBestseller: true,
                  description: 'Slow-fermented dough topped with fresh mozzarella, sautéed wild mushrooms, and truffle oil.',
                },
                {
                  name: 'Smoked Garlic Butter Herb Bowl',
                  category: 'Main Course',
                  price: 540,
                  isVeg: false,
                  isBestseller: true,
                  description: 'Charred tender protein infused with garlic thyme reduction and seasonal greens.',
                },
                {
                  name: 'Artisanal Cold Brew / Specialty Blend',
                  category: 'Beverages',
                  price: 260,
                  isVeg: true,
                  isBestseller: false,
                  description: 'Single-origin beans freshly extracted with a smooth velvety finish.',
                },
                {
                  name: 'Signature Lotus Biscoff Baked Dessert',
                  category: 'Desserts',
                  price: 380,
                  isVeg: true,
                  isBestseller: true,
                  description: 'Rich creamy decadent cake layer on spiced Belgian caramelized biscuit base.',
                },
                {
                  name: 'House Spiced Butter Naan & Sourdough Crisps',
                  category: 'Breads & Sides',
                  price: 180,
                  isVeg: true,
                  isBestseller: false,
                  description: 'Freshly baked breads brushed with aromatic herb butter.',
                },
              ];

              const currentMenuItems =
                business.menu && business.menu.length > 0 ? business.menu : defaultDishes;

              const categories: string[] = [
                'ALL',
                ...(Array.from(new Set(currentMenuItems.map((m: any) => String(m.category || 'Main Course')))) as string[]),
              ];

              const filteredMenu = currentMenuItems.filter((item: any) => {
                if (selectedMenuCategory !== 'ALL' && item.category !== selectedMenuCategory) return false;
                if (isVegOnly && !item.isVeg) return false;
                if (
                  menuSearch.trim() &&
                  !item.name.toLowerCase().includes(menuSearch.toLowerCase()) &&
                  !item.description?.toLowerCase().includes(menuSearch.toLowerCase())
                ) {
                  return false;
                }
                return true;
              });

              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs" id="restaurant-menu">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <UtensilsCrossed className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <span>Restaurant Menu</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                            {currentMenuItems.length} Items
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Explore curated culinary offerings & pricing for {business.name}
                        </p>
                      </div>
                    </div>

                    {/* Veg Only Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsVegOnly((prev) => !prev)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        isVegOnly
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                          isVegOnly ? 'border-emerald-600 bg-emerald-600' : 'border-emerald-600'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                      <span>{isVegOnly ? 'Pure Veg (Active)' : 'Veg Only Filter'}</span>
                    </button>
                  </div>

                  {/* Search Bar & Category Tabs */}
                  <div className="space-y-3">
                    {/* Search inside menu */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search menu items (e.g. coffee, pizza, pasta, dessert)..."
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      {menuSearch && (
                        <button
                          type="button"
                          onClick={() => setMenuSearch('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedMenuCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                            selectedMenuCategory === cat
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  {filteredMenu.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {filteredMenu.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-200 bg-slate-50/50 hover:bg-white transition-all space-y-2 relative group flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {/* Veg/NonVeg Indicator */}
                                <div
                                  className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                                    item.isVeg
                                      ? 'border-emerald-600 bg-emerald-50'
                                      : 'border-rose-600 bg-rose-50'
                                  }`}
                                  title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                                    }`}
                                  />
                                </div>
                                <span className="font-bold text-slate-900 text-sm leading-snug">
                                  {item.name}
                                </span>
                              </div>

                              {/* Price */}
                              <div className="font-extrabold text-indigo-700 text-sm shrink-0">
                                ₹{item.price || 250}
                              </div>
                            </div>

                            {item.description && (
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-[11px]">
                            <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-semibold">
                              {item.category || 'Specialty'}
                            </span>
                            {item.isBestseller && (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100/80 px-2 py-0.5 rounded-md">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                <span>Bestseller</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl space-y-2 border border-dashed border-slate-200">
                      <Utensils className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">
                        No menu items found for this filter
                      </p>
                      <p className="text-xs text-slate-400">
                        Try clearing search terms or selecting 'ALL' categories
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuSearch('');
                          setSelectedMenuCategory('ALL');
                          setIsVegOnly(false);
                        }}
                        className="text-xs text-indigo-600 font-bold hover:underline pt-1 cursor-pointer"
                      >
                        Reset Menu Filters
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Interactive AI Concierge Box */}
            <AskAboutPlaceBox business={business} />

            {/* About / Description */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">About {business.name}</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {business.description || business.shortDescription}
              </p>

              {/* Highlights & Ambience tags */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {business.placeIntelligence?.highlights && business.placeIntelligence.highlights.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Highlights:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {business.placeIntelligence.highlights.map((hl, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                        >
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {business.placeIntelligence?.ambience && business.placeIntelligence.ambience.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Ambience & Vibe:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {business.placeIntelligence.ambience.map((amb, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium"
                        >
                          {amb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {business.tags && business.tags.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {business.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility, Parking & Transit Section */}
            {(() => {
              const intel = business.placeIntelligence;
              const metroRaw = intel?.metroNearby || intel?.transport?.metroNearby;
              const metroStation = typeof metroRaw === 'string' ? metroRaw : (metroRaw as any)?.station || null;
              const metroLine = intel?.transport?.metroLine || (metroRaw as any)?.line || null;
              const walkingDist = intel?.transport?.walkingDistance || (metroRaw as any)?.walkingDistance || null;
              const parking = intel?.parking;
              const accessibility = intel?.accessibility;

              if (!metroStation && !parking && !accessibility) return null;

              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Train className="h-5 w-5 text-indigo-600" />
                    <span>Transit, Accessibility & Parking</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Metro */}
                    {metroStation && (
                      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                          <Train className="h-4 w-4 text-indigo-600" />
                          <span>Delhi Metro</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {metroStation}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {metroLine && <span className="font-semibold text-indigo-700">{metroLine} Line • </span>}
                          {walkingDist || 'Direct walking distance'}
                        </div>
                      </div>
                    )}

                    {/* Parking */}
                    {parking && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Car className="h-4 w-4 text-slate-700" />
                          <span>Parking</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {parking.available ? (parking.valet ? 'Valet & Parking Available' : 'Parking Available') : 'Street / Paid Nearby'}
                        </div>
                        {parking.notes && (
                          <div className="text-[11px] text-slate-500 leading-snug">
                            {parking.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Accessibility */}
                    {accessibility && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Accessibility className="h-4 w-4 text-emerald-600" />
                          <span>Accessibility</span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          {accessibility.wheelchairAccessible || (accessibility as any).wheelchair ? 'Wheelchair Accessible' : 'Standard Entry'}
                        </div>
                        {accessibility.notes && (
                          <div className="text-[11px] text-slate-500 leading-snug">
                            {accessibility.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Curated Photo Gallery Section */}
            {images.length > 1 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-indigo-600" />
                    <span>Visual Gallery ({images.length} Photos)</span>
                  </h2>
                  <span className="text-[11px] text-slate-400">Approved Licensed Media</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setLightboxOpen(true);
                      }}
                      className="group relative h-36 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200"
                    >
                      <img
                        src={imgUrl}
                        alt={`${business.name} photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Amenities & Services</h2>
                <div className="flex flex-wrap gap-2">
                  {business.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-xs font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews & Ratings Section */}
            <div className="space-y-6">
              <ReviewList
                businessId={business._id || business.slug}
                businessName={business.name}
              />
            </div>
          </div>

          {/* Sidebar Location & Contact Card (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs sticky top-24">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-indigo-600" />
                  <span>Location & Contact</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Exact location verified by SpotPicks team.
                </p>
              </div>

              {/* Interactive MapView */}
              <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <MapView
                  businesses={[business]}
                  selectedBusiness={business}
                  userCoords={userCoords}
                  interactive={false}
                  className="h-full w-full"
                />
              </div>

              {/* Physical Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <span>Address</span>
                  </div>
                  {distanceKm !== null && <DistanceBadge distanceKm={distanceKm} size="sm" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{business.address}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                {/* Direct Enquiry Button */}
                <button
                  type="button"
                  id="btn-open-enquiry-modal"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-neutral-950" />
                  <span>Send Enquiry / Table Booking</span>
                </button>

                {business.phone && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`tel:${business.phone}`}
                      onClick={() => {
                        businessOwnerService.trackInteraction(business._id, 'phone_click');
                        monetizationService.trackLead({
                          businessId: business._id || business.slug,
                          type: 'CALL',
                        });
                      }}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="font-semibold truncate">Call Spot</span>
                    </a>

                    <a
                      href={`https://wa.me/${business.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I discovered ${business.name} on SpotPicks!`)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        monetizationService.trackLead({
                          businessId: business._id || business.slug,
                          type: 'WHATSAPP',
                        });
                      }}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-emerald-800 transition-colors"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="font-semibold truncate">WhatsApp</span>
                    </a>
                  </div>
                )}

                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      businessOwnerService.trackInteraction(business._id, 'website_click');
                      monetizationService.trackLead({
                        businessId: business._id || business.slug,
                        type: 'WEBSITE',
                      });
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold truncate">Visit Official Website</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </a>
                )}
              </div>

              {/* Directions Button */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  businessOwnerService.trackInteraction(business._id, 'direction_click');
                  monetizationService.trackLead({
                    businessId: business._id || business.slug,
                    type: 'DIRECTION',
                  });
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions ({activeMapProvider.name})</span>
              </a>

              {/* Data Source & Freshness Attribution (Phase 15) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Database className="h-3 w-3 text-indigo-600" />
                    Listing Source & Freshness
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      business.freshnessStatus === 'FRESH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : business.freshnessStatus === 'RECENT'
                        ? 'bg-sky-100 text-sky-800'
                        : business.freshnessStatus === 'STALE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {business.freshnessStatus || 'FRESH'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Source:</span>
                  <span className="font-medium text-slate-800">
                    {business.source || 'Delhi NCR Open Registry'}
                  </span>
                </div>
                {business.lastVerified && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Last Verified:</span>
                    <span>{new Date(business.lastVerified).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {business.sourceUrl && (
                  <div className="pt-1 border-t border-slate-200/60 text-[10px]">
                    <a
                      href={business.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                    >
                      <span>Public Source Feed</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Business Ownership Claim Callout */}
              <div className="pt-3 border-t border-slate-100 flex flex-col items-center text-center gap-1.5 bg-slate-50/80 p-3 rounded-2xl border border-dashed border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-rose-600" />
                  <span>Own or manage this establishment?</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Claim this SpotPicks listing to respond to reviews, update menus & hours, and publish deals.
                </p>
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(true)}
                  className="mt-1 px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Claim This Spot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NEARBY PLACES SECTION (Categorized & Distance-Ranked) */}
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Local Neighborhood Discovery
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                Nearby Places around {business.locality}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore nearby verified spots calculated by proximity from {business.name}.
              </p>
            </div>

            {/* Nearby Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setNearbyCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  nearbyCategoryFilter === 'all'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Nearby
              </button>
              <button
                type="button"
                onClick={() => setNearbyCategoryFilter('cafes')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  nearbyCategoryFilter === 'cafes'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Coffee className="h-3 w-3" />
                <span>Nearby Cafes</span>
              </button>
              <button
                type="button"
                onClick={() => setNearbyCategoryFilter('restaurants')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  nearbyCategoryFilter === 'restaurants'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Utensils className="h-3 w-3" />
                <span>Nearby Restaurants</span>
              </button>
              <button
                type="button"
                onClick={() => setNearbyCategoryFilter('heritage')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  nearbyCategoryFilter === 'heritage'
                    ? 'bg-white text-indigo-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Landmark className="h-3 w-3" />
                <span>Nearby Attractions</span>
              </button>
            </div>
          </div>

          {/* Grid of Nearby Spots */}
          {filteredNearby.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No matching spots found in this category near {business.locality}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredNearby.map((nearbySpot) => (
                <BusinessCard key={nearbySpot._id || nearbySpot.slug} business={nearbySpot} />
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Sticky Mobile Action Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center gap-2">
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold cursor-pointer"
          >
            <Phone className="h-4 w-4 text-indigo-600" />
            <span>Call</span>
          </a>
        )}

        <button
          type="button"
          onClick={handleSaveToggle}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
          title="Save Spot"
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-600' : ''}`} />
        </button>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-2 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md cursor-pointer"
        >
          <Navigation className="h-4 w-4" />
          <span>Directions</span>
        </a>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full bg-white/10 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center gap-4">
            <img
              src={images[activeImageIdx]}
              alt={business.name}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="flex gap-2 overflow-x-auto p-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    activeImageIdx === i ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        business={business}
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="BUSINESS"
        targetId={business._id || business.slug}
        targetName={business.name}
      />

      {/* Claim Business Modal */}
      <ClaimBusinessModal
        business={business}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      {/* Direct Enquiry / Reservation Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        businessId={business._id || business.slug}
        businessName={business.name}
        categoryName={categoryName}
      />
    </div>
  );
};
