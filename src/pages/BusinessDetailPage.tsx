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
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { useBusiness, useBusinesses } from '../hooks/useDiscovery';
import { useAuthStore } from '../store/useAuthStore';

const priceRangeMap: Record<string, { label: string; text: string; color: string }> = {
  BUDGET: { label: '₹', text: 'Budget-Friendly (₹100 - ₹400 for two)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  MODERATE: { label: '₹₹', text: 'Moderate (₹500 - ₹1200 for two)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  PREMIUM: { label: '₹₹₹', text: 'Premium (₹1500 - ₹3000 for two)', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  LUXURY: { label: '₹₹₹₹', text: 'Luxury (₹3500+ for two)', color: 'text-amber-800 bg-amber-50 border-amber-200' },
};

export const BusinessDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: business, isLoading, error } = useBusiness(slug);

  const categorySlug =
    typeof business?.category === 'object' && business?.category !== null
      ? (business.category as any).slug
      : business?.categoryDetails?.slug;

  const { data: relatedData } = useBusinesses({
    category: categorySlug,
    locality: business?.locality,
    limit: 4,
  });

  const relatedBusinesses = relatedData?.data?.filter((b) => b.slug !== business?.slug).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="py-12">
        <Container size="xl">
          <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
          <div className="mt-8 space-y-4">
            <div className="h-10 w-2/3 bg-slate-100 animate-pulse rounded-lg" />
            <div className="h-6 w-1/3 bg-slate-100 animate-pulse rounded-lg" />
          </div>
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
          <Link to="/businesses">
            <Button size="md" variant="primary">
              Browse All Spots
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const images =
    business.images && business.images.length > 0
      ? business.images
      : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'];

  const categoryName =
    typeof business.category === 'object' && business.category !== null
      ? (business.category as any).name
      : business.categoryDetails?.name || 'Local Spot';

  const priceInfo = priceRangeMap[business.priceRange] || priceRangeMap.MODERATE;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-8 space-y-10 pb-24">
      <Container size="xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/businesses" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Spots</span>
          </Link>
          <span>/</span>
          {categorySlug && (
            <>
              <Link to={`/category/${categorySlug}`} className="hover:text-indigo-600">
                {categoryName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 font-semibold truncate max-w-xs">{business.name}</span>
        </div>

        {/* Hero Gallery Section */}
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[340px] sm:h-[420px] md:h-[480px] w-full shadow-lg">
            <img
              src={images[activeImageIdx]}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

            {/* Badges Top */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                {business.verified && (
                  <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified SpotPicks Partner</span>
                  </span>
                )}
                {business.claimed ? (
                  <span className="bg-indigo-600/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Claimed Business</span>
                  </span>
                ) : (
                  <span className="bg-slate-800/80 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full">
                    SpotPicks Index
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                  title="Share Link"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSaved(!saved)}
                  className={`p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer ${
                    saved ? 'bg-rose-500 text-white' : 'bg-white/90 hover:bg-white text-slate-800'
                  }`}
                  title="Save Spot"
                >
                  <Bookmark className={`h-4 w-4 ${saved ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bottom Hero Info */}
            <div className="absolute bottom-6 inset-x-6 text-white max-w-4xl space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  {categoryName}
                </span>
                <span className="text-white/60">•</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-slate-900/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
                  <span className="text-white/70 font-normal">
                    ({business.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {business.name}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  {business.locality}, {business.city}, {business.state}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnails Gallery Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column: Details, Highlights, Hours */}
          <div className="lg:col-span-2 space-y-8">
            {/* About & Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span>About this Spot</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {business.description}
              </p>

              {/* Price Tier Description */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priceInfo.color}`}>
                  Price Tier: {priceInfo.text}
                </span>
              </div>
            </div>

            {/* Highlights & Features */}
            {business.features && business.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Key Highlights & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Amenities & Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {business.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-xs font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Operating Hours Schedule */}
            {business.openingHours && Object.keys(business.openingHours).length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span>Opening Hours</span>
                </h2>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {Object.entries(business.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-white">
                      <span className="font-semibold text-slate-700">{day}</span>
                      <span className="text-slate-500 font-mono">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Cloud */}
            {business.tags && business.tags.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-indigo-600" />
                  <span>Tags & Topics</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      to={`/businesses?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Card, Location Details, Actions */}
          <div className="space-y-6">
            {/* Quick Action & Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs sticky top-20">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Contact & Directions
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Get in Touch</h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100 font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Phone Number</div>
                      <div className="font-semibold text-slate-900">{business.phone}</div>
                    </div>
                  </a>
                )}

                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100 font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Email Address</div>
                      <div className="font-semibold text-slate-900">{business.email}</div>
                    </div>
                  </a>
                )}

                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100 font-medium"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-slate-400">Official Website</div>
                      <div className="font-semibold text-slate-900 truncate">
                        {business.website.replace('https://', '')}
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {/* Address Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span>Physical Address</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{business.address}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  GPS: {business.latitude.toFixed(4)}° N, {business.longitude.toFixed(4)}° E
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${business.name} ${business.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Spots Section */}
        {relatedBusinesses.length > 0 && (
          <div className="pt-12 mt-12 border-t border-slate-200 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">More Spots in {business.locality}</h2>
              <p className="text-xs text-slate-500">
                Explore nearby verified places in {categoryName} and surroundings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBusinesses.map((b) => (
                <BusinessCard key={b._id || b.slug} business={b} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
