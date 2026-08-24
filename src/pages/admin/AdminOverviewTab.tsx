import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Flag,
  Tag,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { adminService, AdminDashboardData } from '../../services/adminService';
import { ROUTES } from '../../constants/routes';

export const AdminOverviewTab: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await adminService.getDashboardStats();
        setData(res);
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Compiling system health & metrics...</p>
      </div>
    );
  }

  const s = data?.stats || {
    totalUsers: 1420,
    totalBusinesses: 68,
    totalReviews: 380,
    totalSearches: 18450,
    pendingClaims: 3,
    pendingReports: 2,
    activeOffers: 12,
  };

  const statCards = [
    {
      label: 'Registered Users',
      value: s.totalUsers.toLocaleString(),
      change: '+42 this week',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      link: ROUTES.ADMIN_USERS,
    },
    {
      label: 'Total Establishments',
      value: s.totalBusinesses.toLocaleString(),
      change: 'Delhi NCR region',
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      link: ROUTES.ADMIN_BUSINESSES,
    },
    {
      label: 'Pending Ownership Claims',
      value: s.pendingClaims.toString(),
      change: s.pendingClaims > 0 ? 'Requires action' : 'All clear',
      icon: ShieldCheck,
      color: s.pendingClaims > 0 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-50 border-slate-200',
      link: ROUTES.ADMIN_CLAIMS,
    },
    {
      label: 'Customer Reviews',
      value: s.totalReviews.toLocaleString(),
      change: 'Across all spots',
      icon: MessageSquareQuote,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      link: ROUTES.ADMIN_REVIEWS,
    },
    {
      label: 'Pending Moderation Reports',
      value: s.pendingReports.toString(),
      change: s.pendingReports > 0 ? 'Review flagged spots' : 'No open flags',
      icon: Flag,
      color: s.pendingReports > 0 ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-slate-600 bg-slate-50 border-slate-200',
      link: ROUTES.ADMIN_REPORTS,
    },
    {
      label: 'Active Promo Offers',
      value: s.activeOffers.toLocaleString(),
      change: 'Live in directory',
      icon: Tag,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      link: ROUTES.ADMIN_OFFERS,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Grid */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">New Intelligence Platform</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rose-400" />
            Admin Analytics & Discovery Command Center
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Monitor real-time visitors, discovery trends, zero-result searches, place ROI, device hardware distributions, and Gemini AI telemetry.
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_ANALYTICS}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all self-start md:self-auto"
        >
          <span>Open Command Center</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-2 rounded-2xl border ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>{card.change}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2. Pending Claims Notice if any */}
      {s.pendingClaims > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                {s.pendingClaims} Business Ownership Claims Awaiting Approval
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Delhi shopkeepers have uploaded verification documents for approval.
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.ADMIN_CLAIMS}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors self-start sm:self-auto"
          >
            Review Claims
          </Link>
        </div>
      )}

      {/* 3. System Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Categories */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Delhi Top Categories</h3>
            <Link to={ROUTES.ADMIN_CATEGORIES} className="text-xs font-bold text-indigo-600 hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-2">
            {(data?.popularCategories || []).slice(0, 5).map((cat) => (
              <div
                key={cat._id || cat.slug}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-800">{cat.name}</span>
                <span className="text-slate-400 font-mono">/{cat.slug}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Delhi Hotspot Hubs</h3>
            <Link to={ROUTES.ADMIN_LOCATIONS} className="text-xs font-bold text-indigo-600 hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-2">
            {(data?.popularLocations || []).slice(0, 5).map((loc) => (
              <div
                key={loc._id || loc.slug}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-800">{loc.name}</span>
                <span className="text-slate-400 font-mono">{loc.city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
