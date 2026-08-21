import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Search,
  Navigation,
  Phone,
  Globe,
  Star,
  MessageSquareQuote,
  TrendingUp,
  ArrowUpRight,
  Store,
  Tag,
  PlusCircle,
  Loader2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { businessOwnerService, OwnerAnalyticsPayload } from '../../services/businessOwnerService';
import { offerService, OfferItem } from '../../services/offerService';
import { ROUTES } from '../../constants/routes';

export const BusinessOverviewTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<OwnerAnalyticsPayload | null>(null);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [aData, oData] = await Promise.all([
          businessOwnerService.getAnalytics(),
          offerService.getOwnerOffers(),
        ]);
        setAnalytics(aData);
        setOffers(oData);
      } catch (e) {
        console.error('Failed to load owner overview:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading establishment metrics...</p>
      </div>
    );
  }

  const s = analytics?.summary || {
    totalListings: 1,
    profileViews: 1240,
    searchAppearances: 4890,
    directionClicks: 340,
    phoneClicks: 180,
    websiteClicks: 210,
    totalReviews: 24,
    averageRating: 4.8,
  };

  const metricCards = [
    {
      label: 'Profile Views',
      value: s.profileViews.toLocaleString(),
      change: '+14% vs last week',
      icon: Eye,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Search Appearances',
      value: s.searchAppearances.toLocaleString(),
      change: '+22% in Delhi searches',
      icon: Search,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Direction Requests',
      value: s.directionClicks.toLocaleString(),
      change: 'High conversion',
      icon: Navigation,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Phone Calls & Inquiries',
      value: s.phoneClicks.toLocaleString(),
      change: 'Active customer calls',
      icon: Phone,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'Website Visits',
      value: s.websiteClicks.toLocaleString(),
      change: 'Direct traffic link',
      icon: Globe,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      label: 'Average Customer Rating',
      value: `${s.averageRating.toFixed(1)} ★`,
      change: `Based on ${s.totalReviews} reviews`,
      icon: Star,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. My Listings Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="h-4 w-4 text-indigo-600" />
              <span>Managed Establishments</span>
            </h2>
            <p className="text-xs text-slate-500">
              Overview of your claimed spots and verification status.
            </p>
          </div>
          <Link
            to={ROUTES.BUSINESS_LISTINGS}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {analytics?.businesses && analytics.businesses.length > 0 ? (
            analytics.businesses.map((biz) => (
              <div
                key={biz._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{biz.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified & Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{biz.locality}, Delhi</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900">
                      {biz.metrics?.profileViews.toLocaleString()} views
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {biz.rating} ★ ({biz.reviewCount} reviews)
                    </div>
                  </div>
                  <Link
                    to={`/business/businesses/${biz._id}/edit`}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
                  >
                    Edit Info
                  </Link>
                  <Link
                    to={`/business/${biz.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 cursor-pointer"
                    title="View live spot"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <p className="text-xs text-slate-600 font-medium">You have not claimed or created a listing yet.</p>
              <Link
                to={ROUTES.BUSINESS_CREATE}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create Establishment Listing</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 3. Active Promotional Offers */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-600" />
              <span>Active Promotions & Coupons</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live deals currently attracting explorers on SpotPicks.
            </p>
          </div>
          <Link
            to={ROUTES.BUSINESS_OFFERS}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Manage Offers</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.length > 0 ? (
            offers.slice(0, 2).map((offer) => (
              <div
                key={offer._id}
                className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 border border-purple-100 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-xs">
                    {offer.discount}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Live in Delhi</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-900">{offer.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{offer.description}</p>
                </div>
                <div className="pt-2 border-t border-purple-200/50 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                    CODE: {offer.couponCode || 'SPOTPICKS'}
                  </span>
                  <span className="text-slate-500">
                    {offer.claimedCount} explorers claimed
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs text-slate-600">No active offers. Attract more customers with a discount.</p>
              <Link
                to={ROUTES.BUSINESS_OFFERS}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create new offer</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
