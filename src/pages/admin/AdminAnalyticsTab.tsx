import React, { useEffect, useState } from 'react';
import {
  Search,
  TrendingUp,
  Activity,
  Sparkles,
  MousePointerClick,
  Clock,
  AlertCircle,
  FileQuestion,
  Eye,
  Bookmark,
  Star,
  RefreshCw,
  ExternalLink,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { searchService } from '../../services/searchService';
import { AdminSearchAnalyticsData } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/**
 * Admin Search Intelligence & Analytics Dashboard Tab
 * 
 * SPOTPICKS SEARCH INTELLIGENCE ENGINE:
 * Provides administrators with real-time insight into:
 * - Search query volume and engine response latency
 * - Click-through rates across queries and spots
 * - Category and locality demand patterns
 * - Zero-result queries (highlighting high-ROI SEO and category expansion opportunities)
 * - Most viewed and saved business spots
 */
export const AdminAnalyticsTab: React.FC = () => {
  const [data, setData] = useState<AdminSearchAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const res = await searchService.getAdminSearchAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin search analytics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Compiling SpotPicks Search Analytics...</p>
      </div>
    );
  }

  const {
    summary,
    dailySearches,
    popularSearches,
    topCategories,
    topLocations,
    zeroResultQueries,
    mostViewedBusinesses,
  } = data;

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-600" />
            <span>Search Analytics & Intelligence Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time search behaviors, CTR metrics, category demand, and zero-result SEO opportunities
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalytics}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Searches</span>
            <Search className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.totalSearches.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +14.2% this week
          </p>
        </Card>

        <Card className="p-5 border-slate-200 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg CTR</span>
            <MousePointerClick className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.ctr}</div>
          <p className="text-[11px] text-slate-500 font-medium">
            {summary.totalClicks.toLocaleString()} total listing clicks
          </p>
        </Card>

        <Card className="p-5 border-slate-200 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">AI Queries</span>
            <Sparkles className="h-4 w-4 text-violet-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.aiSearchesCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold">
            {summary.aiSuccessRate} NLP parsing success
          </p>
        </Card>

        <Card className="p-5 border-slate-200 space-y-2 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Latency</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.avgResponseTimeMs}ms
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Sub-50ms deterministic
          </p>
        </Card>
      </div>

      {/* 14-Day Search Volume & Latency Trend Chart */}
      <Card className="p-6 border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">14-Day Search Volume & Latency Trend</h3>
            <p className="text-xs text-slate-500">Daily searches and server response times</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Searches
            </span>
            <span className="flex items-center gap-1.5 text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Zero Results
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySearches}>
              <defs>
                <linearGradient id="searchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="zeroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
              <Area
                type="monotone"
                dataKey="searches"
                name="Total Searches"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#searchGradient)"
              />
              <Area
                type="monotone"
                dataKey="zeroResults"
                name="Zero Results"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#zeroGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Columns: Category Breakdown & Locality Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (Pie / Bar) */}
        <Card className="p-6 border-slate-200 rounded-2xl lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Category Demand Distribution</h3>
              <p className="text-xs text-slate-500">Search volume breakdown by core category</p>
            </div>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCategories} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#64748b" width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" name="Searches" fill="#6366f1" radius={[0, 8, 8, 0]}>
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Locations Demand */}
        <Card className="p-6 border-slate-200 rounded-2xl lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Top Delhi Neighborhoods</h3>
              <p className="text-xs text-slate-500">Most active localities by user search intent</p>
            </div>
            <MapPin className="h-4 w-4 text-slate-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLocations}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="searches" name="Search Volume" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Searched Queries & CTR Table */}
      <Card className="p-6 border-slate-200 rounded-2xl space-y-4 overflow-hidden">
        <div>
          <h3 className="font-bold text-base text-slate-900">Top Searched Queries & Click-Through Rates</h3>
          <p className="text-xs text-slate-500">High volume terms and user conversion into listing views</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Search Query</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Locality</th>
                <th className="py-3 px-4 text-center">Search Count</th>
                <th className="py-3 px-4 text-center">Results Found</th>
                <th className="py-3 px-4 text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {popularSearches.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="text-slate-400 font-bold w-4">#{idx + 1}</span>
                    <span>"{item.query}"</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{item.location}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    {item.count.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{item.resultCount} spots</td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.clickRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SEO & Merchant Opportunities: Zero-Result Queries */}
      <Card className="p-6 border-slate-200 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <FileQuestion className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Zero-Result Queries (High-ROI SEO Landing Page & Merchant Opportunities)
            </h3>
            <p className="text-xs text-slate-500">
              Users searched for these specific terms, but found 0 matching listings. Use these to target new businesses or create automated Top 10 landing pages!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {zeroResultQueries.map((zq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="text-amber-900">"{zq.query}"</span>
                  <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md text-[10px]">
                    {zq.count} searches
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/90 font-medium mt-1">
                  Category: {zq.potentialCategory}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 text-[11px] text-slate-700 font-semibold">
                Action: {zq.seoOpportunity}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Most Viewed & Saved Businesses */}
      <Card className="p-6 border-slate-200 rounded-2xl space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Top Visited & Saved Spots</h3>
          <p className="text-xs text-slate-500">Highest engagement listings on SpotPicks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostViewedBusinesses.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {b.locality}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {b.rating}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <strong>{b.views.toLocaleString()}</strong> views
                </span>
                <span className="flex items-center gap-1 text-indigo-600">
                  <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
                  <strong>{b.saves.toLocaleString()}</strong> saves
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
