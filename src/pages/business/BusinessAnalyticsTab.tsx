import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Eye,
  Search,
  Navigation,
  Phone,
  Globe,
  Star,
  MessageSquareQuote,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Loader2,
  Filter,
} from 'lucide-react';
import { businessOwnerService, OwnerAnalyticsPayload } from '../../services/businessOwnerService';

export const BusinessAnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<OwnerAnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await businessOwnerService.getAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error('Failed to load analytics:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Compiling Delhi visitor analytics...</p>
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

  const timeline = analytics?.timeline || [
    { date: 'Mon', profileViews: 140, searchAppearances: 520, directionClicks: 42, phoneClicks: 21, websiteClicks: 28 },
    { date: 'Tue', profileViews: 165, searchAppearances: 610, directionClicks: 48, phoneClicks: 24, websiteClicks: 32 },
    { date: 'Wed', profileViews: 190, searchAppearances: 680, directionClicks: 52, phoneClicks: 26, websiteClicks: 35 },
    { date: 'Thu', profileViews: 210, searchAppearances: 740, directionClicks: 58, phoneClicks: 30, websiteClicks: 40 },
    { date: 'Fri', profileViews: 280, searchAppearances: 990, directionClicks: 82, phoneClicks: 45, websiteClicks: 55 },
    { date: 'Sat', profileViews: 340, searchAppearances: 1240, directionClicks: 110, phoneClicks: 62, websiteClicks: 70 },
    { date: 'Sun', profileViews: 310, searchAppearances: 1150, directionClicks: 95, phoneClicks: 58, websiteClicks: 64 },
  ];

  // Max for relative bar heights
  const maxSearch = Math.max(...timeline.map((t) => t.searchAppearances), 1);
  const maxViews = Math.max(...timeline.map((t) => t.profileViews), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <span>Discovery & Conversion Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time intent signals: view counts, searches, map navigation, calls, and conversions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRange === r
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Quarterly'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Core Conversion Funnel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Impressions</span>
            <Search className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{s.searchAppearances.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +24% in Delhi queries
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Spot Page Views</span>
            <Eye className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{s.profileViews.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 25.3% view conversion
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Directions Requested</span>
            <Navigation className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{s.directionClicks.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 27.4% physical footfall intent
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Phone & Web Leads</span>
            <Phone className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{(s.phoneClicks + s.websiteClicks).toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Direct reservations
          </p>
        </div>
      </div>

      {/* 2. Visual Traffic Distribution Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly Traffic & Discovery Trends</h3>
            <p className="text-xs text-slate-500">Comparison of search impressions vs direct page views.</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-500" />
              <span className="text-slate-700">Search Impressions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-slate-700">Page Views</span>
            </div>
          </div>
        </div>

        {/* CSS-based responsive bar visualizer */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 sm:h-56 items-end border-b border-slate-100 pb-2">
            {timeline.map((item, idx) => {
              const searchPercent = Math.round((item.searchAppearances / maxSearch) * 100);
              const viewPercent = Math.round((item.profileViews / maxViews) * 80);

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-full">
                    {/* Search bar */}
                    <div
                      style={{ height: `${Math.max(searchPercent, 8)}%` }}
                      className="w-1/2 bg-indigo-400 group-hover:bg-indigo-600 rounded-t-md transition-all relative"
                      title={`${item.searchAppearances} search impressions on ${item.date}`}
                    />
                    {/* Views bar */}
                    <div
                      style={{ height: `${Math.max(viewPercent, 8)}%` }}
                      className="w-1/2 bg-purple-400 group-hover:bg-purple-600 rounded-t-md transition-all"
                      title={`${item.profileViews} profile views on ${item.date}`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Mon</span>
            <span>Peak weekend activity (Fri - Sun in Delhi)</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* 3. Actionable Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-emerald-600" />
            <span>High Intent Actions Breakdown</span>
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Google Maps / Apple Maps Navigation</span>
                <span className="font-bold text-slate-900">{s.directionClicks} clicks</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Direct Telephone Inquiries</span>
                <span className="font-bold text-slate-900">{s.phoneClicks} calls</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Official Website / Menu Outlinks</span>
                <span className="font-bold text-slate-900">{s.websiteClicks} visits</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span>Sentiment & Ratings Summary</span>
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="text-3xl font-black text-amber-700">{s.averageRating.toFixed(1)}</div>
              <div className="flex justify-center text-amber-400 text-xs my-0.5">★★★★★</div>
              <div className="text-[10px] font-bold text-slate-500">{s.totalReviews} Total Reviews</div>
            </div>

            <div className="space-y-1.5 flex-1 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>5 Stars</span>
                <span className="font-bold text-slate-900">82%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>4 Stars</span>
                <span className="font-bold text-slate-900">14%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>3 Stars</span>
                <span className="font-bold text-slate-900">4%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>1-2 Stars</span>
                <span className="font-bold text-slate-900">0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
