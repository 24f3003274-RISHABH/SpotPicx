import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Moon,
  Sparkles,
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { BusinessCard } from './BusinessCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { BusinessCardSkeleton } from '../ui/Skeletons';
import api from '../../lib/api';

interface LiveFeedData {
  trendingToday: any[];
  popularTonight: any[];
  newlyAdded: any[];
  recentlyUpdated: any[];
  eventsThisWeekend: any[];
  eventsTonight: any[];
  dealsNearYou: any[];
  updatedAt: string;
}

export const LiveDiscoveryFeed: React.FC = () => {
  const [data, setData] = useState<LiveFeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveFeed = async () => {
      try {
        const res = await api.get('/discovery/live-feed');
        if (isMounted && res.data?.data) {
          setData(res.data.data);
        }
      } catch (e) {
        console.warn('Could not fetch live feed from server, loading defaults', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveFeed();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  if (loading) {
    return (
      <div className="space-y-12 py-6">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <BusinessCardSkeleton key={n} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div id="live-discovery-feed" className="space-y-16 py-6">
      {/* 1. TRENDING TODAY (Multi-factor calculated rank) */}
      <section id="section-trending-today" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider border border-rose-200/60 mb-1.5">
              <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Real-Time Momentum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trending Today in Delhi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Calculated deterministically from user searches, clicks, saves, and recent check-in activity.
            </p>
          </div>

          <Link
            to="/search?sort=trending"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0"
          >
            <span>View All Trending</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(data.trendingToday || []).slice(0, 4).map((business: any, idx: number) => (
            <div key={business._id || business.slug} className="relative group">
              <div className="absolute top-3 left-3 z-10 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1 shadow-sm">
                <span className="text-rose-400">#{idx + 1}</span>
                <span className="text-slate-300 font-medium">Rank</span>
              </div>
              <BusinessCard business={business} />
            </div>
          ))}
        </div>
      </section>

      {/* 2. POPULAR TONIGHT (Evening Vibe, Rooftops, Gigs) */}
      <section id="section-popular-tonight" className="space-y-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30 mb-1.5">
              <Moon className="h-3.5 w-3.5 text-amber-300" />
              <span>Evening Agenda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Tonight
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              High-energy rooftops, live acoustic sets, speakeasies, and aesthetic late-night dinners.
            </p>
          </div>

          <Link
            to="/search?category=nightlife-and-clubs"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 group shrink-0"
          >
            <span>Explore Nightlife</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(data.popularTonight || []).slice(0, 4).map((business: any) => (
            <div key={business._id || business.slug} className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden hover:border-amber-400/60 transition-all group flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={business.coverImage || business.photos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-md shadow-sm">
                  {business.priceRange || '₹₹₹'}
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold flex items-center gap-1 text-slate-200">
                    <MapPin className="h-3 w-3 text-amber-400" />
                    {business.locality || 'Delhi'}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {business.rating ? business.rating.toFixed(1) : '4.6'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {business.description || 'Iconic South Delhi evening destination featuring sunset views and specialty beverages.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    {business.isOpenNow ? 'Open Now' : 'Closes late night'}
                  </span>
                  <Link
                    to={`/spots/${business.slug || business._id}`}
                    className="text-xs font-bold text-white group-hover:text-amber-300 inline-flex items-center gap-1"
                  >
                    <span>View Spot</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EVENTS THIS WEEKEND (Dynamic Event Discovery) */}
      <section id="section-events-weekend" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200/60 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              <span>Weekend Agenda</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Events This Weekend
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Concerts, comedy nights, theatre, startup meetups, and food festivals happening in Delhi NCR.
            </p>
          </div>

          <Link
            to="/events?timeframe=weekend"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0"
          >
            <span>All Weekend Events</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.eventsThisWeekend || []).slice(0, 3).map((event: any) => (
            <div
              key={event._id || event.slug}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.coverImage || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black text-slate-900 shadow-sm">
                  {event.category}
                </div>
                <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {event.price || 'Free Pass'}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Clock className="h-3.5 w-3.5 text-indigo-300" />
                    {event.time || '7:00 PM onwards'}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[11px]">
                    {event.location?.locality || 'Delhi NCR'}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium truncate max-w-[160px]">
                    📍 {event.venue}
                  </span>
                  <Link
                    to={`/events`}
                    className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                  >
                    <span>Reserve Passes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DEALS NEAR YOU (Verified Active Offers) */}
      <section id="section-deals-near-you" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200/60 mb-1.5">
              <Tag className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Savings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Exclusive Deals & Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Restaurant discounts, student perks, cafe buy-1-get-1, and shopping voucher codes.
            </p>
          </div>

          <Link
            to="/offers"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0"
          >
            <span>Browse All Offers</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data.dealsNearYou || []).slice(0, 6).map((offer: any) => (
            <div
              key={offer._id || offer.couponCode}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {offer.category || 'Restaurant Offer'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {offer.business?.name || 'Partner Establishment'} • {offer.business?.locality || 'Delhi'}
                  </p>
                </div>
                <div className="bg-emerald-600 text-white font-black text-sm px-3 py-1.5 rounded-xl shadow-xs shrink-0">
                  {offer.discount}
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {offer.description || 'Show code at billing to redeem this verified exclusive discount.'}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCoupon(offer.couponCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-200 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  {copiedCode === offer.couponCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>{offer.couponCode}</span>
                    </>
                  )}
                </button>

                <Link
                  to="/offers"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Redeem</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEWLY ADDED & RECENTLY UPDATED SPOTLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Newly Added */}
        <section id="section-newly-added" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">Newly Added Spots</h3>
            </div>
            <Link to="/search?sort=newest" className="text-xs font-bold text-indigo-600 hover:underline">
              View New
            </Link>
          </div>

          <div className="space-y-3">
            {(data.newlyAdded || []).slice(0, 3).map((biz: any) => (
              <Link
                key={biz._id || biz.slug}
                to={`/spots/${biz.slug || biz._id}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
              >
                <img
                  src={biz.coverImage || biz.photos?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'}
                  alt={biz.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                      {biz.name}
                    </h4>
                    <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded shrink-0">
                      NEW
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {biz.locality} • {biz.category?.name || 'Local Favorite'}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Updated */}
        <section id="section-recently-updated" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">Recently Updated</h3>
            </div>
            <Link to="/search?sort=updated" className="text-xs font-bold text-indigo-600 hover:underline">
              View Updated
            </Link>
          </div>

          <div className="space-y-3">
            {(data.recentlyUpdated || []).slice(0, 3).map((biz: any) => (
              <Link
                key={biz._id || biz.slug}
                to={`/spots/${biz.slug || biz._id}`}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all group"
              >
                <img
                  src={biz.coverImage || biz.photos?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200'}
                  alt={biz.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                      {biz.name}
                    </h4>
                    {biz.isVerified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    Fresh hours & menu verified • {biz.locality}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
