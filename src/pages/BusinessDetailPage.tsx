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
  Heart,
  MessageSquare,
  Send,
  X,
  Maximize2,
  Check,
  Copy,
  Coffee,
  Utensils,
  Landmark,
  Compass,
  Layers,
  Flag,
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
import { businessOwnerService } from '../services/businessOwnerService';
import { useBusiness, useBusinesses } from '../hooks/useDiscovery';
import { useSavedStore } from '../store/useSavedStore';
import { useAuthStore } from '../store/useAuthStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { mapService } from '../services/map';
import { Business } from '../types';

const priceRangeMap: Record<string, { label: string; text: string; color: string }> = {
  BUDGET: { label: '₹', text: 'Budget-Friendly (₹100 - ₹400 for two)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  MODERATE: { label: '₹₹', text: 'Moderate (₹500 - ₹1200 for two)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  PREMIUM: { label: '₹₹₹', text: 'Premium (₹1500 - ₹3000 for two)', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  LUXURY: { label: '₹₹₹₹', text: 'Luxury (₹3500+ for two)', color: 'text-amber-800 bg-amber-50 border-amber-200' },
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
  const [nearbyCategoryFilter, setNearbyCategoryFilter] = useState<'all' | 'cafes' | 'restaurants' | 'heritage'>('all');

  const { data: business, isLoading, error } = useBusiness(slug);

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

          {/* Mosaic Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden h-[340px] sm:h-[420px] bg-slate-900 relative">
            <div
              className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden"
              onClick={() => {
                setActiveImageIdx(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={images[0]}
                alt={business.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="hidden md:grid col-span-2 grid-cols-2 gap-3 h-full">
              {images.slice(1, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative h-full cursor-pointer group overflow-hidden"
                  onClick={() => {
                    setActiveImageIdx(idx + 1);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`${business.name} gallery ${idx + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>View All {images.length} Photos</span>
            </button>
          </div>
        </div>

        {/* 2. MAIN DETAILS & MAP SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Description */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">About {business.name}</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {business.description || business.shortDescription}
              </p>

              {business.tags && business.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {business.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Amenities & Highlights</h2>
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
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    onClick={() => businessOwnerService.trackInteraction(business._id, 'phone_click')}
                    className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold">{business.phone}</span>
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => businessOwnerService.trackInteraction(business._id, 'website_click')}
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
                onClick={() => businessOwnerService.trackInteraction(business._id, 'direction_click')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions ({activeMapProvider.name})</span>
              </a>

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
    </div>
  );
};
