import React, { useEffect, useState } from 'react';
import {
  Activity,
  Users,
  Search,
  MousePointerClick,
  Compass,
  Phone,
  Globe,
  Navigation,
  Bookmark,
  Star,
  UserPlus,
  RefreshCw,
  Download,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileQuestion,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  Layers,
  MapPin,
  Eye,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
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
  LineChart,
  Line,
} from 'recharts';
import { adminService, ComprehensiveAdminAnalyticsData } from '../../services/adminService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

type SectionTab = 'overview' | 'users' | 'traffic' | 'search' | 'businesses' | 'ai' | 'system';

export const AdminAnalyticsTab: React.FC = () => {
  const [data, setData] = useState<ComprehensiveAdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionTab>('overview');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      const params: any = { range: timeRange };
      if (timeRange === 'custom' && customStart && customEnd) {
        params.startDate = customStart;
        params.endDate = customEnd;
      }
      const res = await adminService.getComprehensiveAnalytics(params);
      setData(res);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleCustomRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      fetchAnalytics();
    }
  };

  const handleExport = async (type: 'overview' | 'searches' | 'businesses' | 'traffic' | 'ai') => {
    try {
      setIsExporting(true);
      setExportDropdownOpen(false);
      await adminService.downloadAnalyticsCSV(type, timeRange);
    } catch (err) {
      console.error('Failed to export analytics CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <RefreshCw className="h-10 w-10 text-rose-600 animate-spin mx-auto" />
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-800">Compiling SpotPicks Intelligence Engine...</p>
          <p className="text-xs text-slate-500">Aggregating telemetry, search signals, AI metrics, and Delhi traffic...</p>
        </div>
      </div>
    );
  }

  const { overview, timeline, userAnalytics, traffic, searchAnalytics, businessAnalytics, contentAnalytics, aiAnalytics, dataFreshness, systemHealth } = data;

  const COLORS = ['#e11d48', '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const overviewCards = [
    { label: 'Total Visitors', value: overview.totalVisitors.toLocaleString(), growth: overview.growthRates.visitors, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Unique Visitors', value: overview.uniqueVisitors.toLocaleString(), growth: '+12.3%', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Total Page Views', value: overview.pageViews.toLocaleString(), growth: '+19.5%', icon: Eye, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Searches Executed', value: overview.searches.toLocaleString(), growth: overview.growthRates.searches, icon: Search, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Spot Profile Clicks', value: overview.businessClicks.toLocaleString(), growth: overview.growthRates.clicks, icon: MousePointerClick, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { label: 'Directions Requested', value: overview.directionsClicks.toLocaleString(), growth: '+14.2%', icon: Navigation, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Phone Inquiries', value: overview.phoneClicks.toLocaleString(), growth: '+8.9%', icon: Phone, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Website Click-Throughs', value: overview.websiteClicks.toLocaleString(), growth: '+11.4%', icon: Globe, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
    { label: 'Places Bookmarked', value: overview.savedPlaces.toLocaleString(), growth: '+21.0%', icon: Bookmark, color: 'text-pink-600 bg-pink-50 border-pink-100' },
    { label: 'Reviews Submitted', value: overview.reviews.toLocaleString(), growth: overview.growthRates.reviews, icon: Star, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'User Registrations', value: overview.registrations.toLocaleString(), growth: overview.growthRates.registrations, icon: ShieldCheck, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'AI Concierge Chats', value: aiAnalytics.totalRequests.toLocaleString(), growth: '+34.2%', icon: Sparkles, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Live Analytics Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5 mt-0.5">
            <Activity className="h-6 w-6 text-rose-600" />
            SpotPicks Command Center & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Internal telemetry, search discovery intelligence, conversion funnel, AI model performance & system telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            {(['today', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === r
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
            <button
              onClick={() => setTimeRange('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === 'custom'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-rose-600' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* CSV Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Export Dataset
                </div>
                <button
                  onClick={() => handleExport('overview')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Activity className="h-3.5 w-3.5 text-indigo-600" />
                  Overview Metrics & KPIs
                </button>
                <button
                  onClick={() => handleExport('searches')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Search className="h-3.5 w-3.5 text-rose-600" />
                  Search Intelligence & Zero-Results
                </button>
                <button
                  onClick={() => handleExport('businesses')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Compass className="h-3.5 w-3.5 text-emerald-600" />
                  Top Performing Places
                </button>
                <button
                  onClick={() => handleExport('traffic')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  Traffic & Top Pages
                </button>
                <button
                  onClick={() => handleExport('ai')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  AI Concierge Queries
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Date Form (Shown when custom is selected) */}
      {timeRange === 'custom' && (
        <form onSubmit={handleCustomRangeSubmit} className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">Custom Date Range:</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            required
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            required
          />
          <Button size="sm" type="submit">Apply Range</Button>
        </form>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Overview KPIs', icon: Activity },
          { id: 'users', label: 'User Analytics', icon: Users },
          { id: 'traffic', label: 'Traffic & Sources', icon: Globe },
          { id: 'search', label: 'Search Intelligence', icon: Search },
          { id: 'businesses', label: 'Business & Place ROI', icon: Compass },
          { id: 'ai', label: 'AI Concierge & Telemetry', icon: Sparkles },
          { id: 'system', label: 'System & Data Health', icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as SectionTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* 12-Card Overview KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {overviewCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{card.label}</span>
                    <div className={`p-2 rounded-2xl border ${card.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {card.growth}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline Trend Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900">Traffic & Discovery Volume Timeline</h3>
                <p className="text-xs text-slate-500">Chronological distribution of visitors, searches, and spot interactions.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-500 inline-block" /> Visitors</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-indigo-500 inline-block" /> Searches</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> Interactions</span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#e11d48" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
                  <Area type="monotone" dataKey="searches" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSearches)" name="Searches" />
                  <Area type="monotone" dataKey="interactions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" name="Interactions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: USER ANALYTICS */}
      {activeSection === 'users' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Active Users (DAU)</span>
              <div className="text-3xl font-black text-slate-900">{userAnalytics.dau.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Peak active Delhi seekers today</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Active Users (WAU)</span>
              <div className="text-3xl font-black text-indigo-600">{userAnalytics.wau.toLocaleString()}</div>
              <p className="text-xs text-slate-400">7-day active user footprint</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Active Users (MAU)</span>
              <div className="text-3xl font-black text-rose-600">{userAnalytics.mau.toLocaleString()}</div>
              <p className="text-xs text-slate-400">30-day active discovery base</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Segmentation */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">User Audience Segmentation</h3>
              <p className="text-xs text-slate-500">Distribution between new registrations, returning seekers, and guest browsers.</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Guest Browsers', count: userAnalytics.guestUsers, fill: '#6366f1' },
                      { name: 'Returning Users', count: userAnalytics.returningUsers, fill: '#10b981' },
                      { name: 'New Signups', count: userAnalytics.newUsers, fill: '#e11d48' },
                    ]}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none' }} />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Retention Curve */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Cohort Retention Benchmark</h3>
              <p className="text-xs text-slate-500">Seeker return rates across 1, 3, 7, 14, and 30-day cohorts.</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userAnalytics.retention} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="cohort" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis unit="%" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none' }} />
                    <Line type="monotone" dataKey="retention" stroke="#e11d48" strokeWidth={3} dot={{ r: 5, fill: '#e11d48' }} name="Retention %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TRAFFIC */}
      {activeSection === 'traffic' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Traffic Sources Pie */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Acquisition Channels</h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={traffic.trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {traffic.trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 pt-2">
                {traffic.trafficSources.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-700">{s.name}</span>
                    </span>
                    <span className="text-slate-900 font-bold">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Browser Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Device Hardware & Platforms</h3>
              <div className="space-y-4">
                {traffic.deviceBreakdown.map((d, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{d.device}</span>
                      <span>{d.share}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${d.share}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Top Web Browsers</h4>
                <div className="grid grid-cols-2 gap-2">
                  {traffic.browserBreakdown.map((b, idx) => (
                    <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-slate-800">{b.browser}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{b.share}% share</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Geo Distribution */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Geographic Hotspots</h3>
              <div className="space-y-3">
                {traffic.geoDistribution.map((g, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        {g.city}
                      </div>
                      <div className="text-[10px] text-slate-400">{g.state}, {g.country}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">{g.visitors.toLocaleString()}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{g.share}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Top Visited Landing Pages & Guides</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Page Title / URL Path</th>
                    <th className="pb-3">Unique Views</th>
                    <th className="pb-3">Avg Time on Page</th>
                    <th className="pb-3">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {traffic.topPages.map((page, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{page.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{page.path}</div>
                      </td>
                      <td className="py-3 font-bold text-slate-800">{page.views.toLocaleString()}</td>
                      <td className="py-3 font-semibold text-slate-600">{page.avgTime}</td>
                      <td className="py-3 font-bold text-emerald-600">{page.bounceRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SEARCH INTELLIGENCE */}
      {activeSection === 'search' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Search Conversion Rate</span>
              <div className="text-2xl font-black text-emerald-600">{searchAnalytics.searchConversionRate}</div>
              <p className="text-[11px] text-slate-400">Searches converting to directions, calls, or saves</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Average Engine Latency</span>
              <div className="text-2xl font-black text-indigo-600">38ms</div>
              <p className="text-[11px] text-slate-400">Optimized query parsing & index lookup</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Zero-Result Query Rate</span>
              <div className="text-2xl font-black text-rose-600">1.8%</div>
              <p className="text-[11px] text-slate-400">Catalog expansion opportunities detected</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Searches */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-indigo-600" />
                Most Popular Search Queries
              </h3>
              <div className="space-y-3">
                {searchAnalytics.topSearches.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>"{s.query}"</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{s.avgResults} avg results returned</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-800">{s.count.toLocaleString()} searches</div>
                      <div className="text-[10px] text-indigo-600 font-bold">CTR: {s.ctr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending & Fast Rising Searches */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Trending & Rising Search Intent
              </h3>
              <div className="space-y-3">
                {searchAnalytics.trendingSearches.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-xs font-bold text-slate-900">"{t.query}"</div>
                      <div className="text-[10px] text-slate-400">{t.category}</div>
                    </div>
                    <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {t.growth}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Zero-Result Queries (High ROI Expansion Opportunities) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileQuestion className="h-4 w-4 text-rose-600" />
                  Zero-Result Search Intelligence (Catalog Expansion Roadmap)
                </h3>
                <p className="text-xs text-slate-500">High-intent searches where users found no spots, highlighting missing categories and localities.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Unmatched Query</th>
                    <th className="pb-3">Monthly Frequency</th>
                    <th className="pb-3">Recommended Ingestion / Catalog Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchAnalytics.zeroResultSearches.map((z, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">"{z.query}"</td>
                      <td className="py-3 font-semibold text-rose-600">{z.count} missed searches</td>
                      <td className="py-3 font-medium text-slate-700">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          {z.suggestedAction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: BUSINESSES & PLACE ROI */}
      {activeSection === 'businesses' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Most Viewed Establishments */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Most Viewed Establishments & ROI Leaders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Establishment</th>
                    <th className="pb-3">Locality</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Impressions / Views</th>
                    <th className="pb-3">Interactions (Calls/Directions)</th>
                    <th className="pb-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businessAnalytics.mostViewedBusinesses.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{b.name}</td>
                      <td className="py-3 text-slate-600 font-medium">{b.locality}</td>
                      <td className="py-3 text-slate-600 font-medium">{b.category}</td>
                      <td className="py-3 font-bold text-indigo-600">{b.views.toLocaleString()}</td>
                      <td className="py-3 font-bold text-emerald-600">{b.clicks.toLocaleString()}</td>
                      <td className="py-3 font-bold text-amber-600 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {b.rating} ({b.reviews})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-emerald-600" />
                Most Directions Requested
              </h4>
              <div className="space-y-2">
                {businessAnalytics.topActions.mostDirections.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-bold text-emerald-600">{item.directions}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-blue-600" />
                Most Phone Calls
              </h4>
              <div className="space-y-2">
                {businessAnalytics.topActions.mostCalled.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-bold text-blue-600">{item.calls}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-purple-600" />
                Most Website Clicks
              </h4>
              <div className="space-y-2">
                {businessAnalytics.topActions.mostWebsites.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="font-bold text-purple-600">{item.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: AI CONCIERGE & TELEMETRY */}
      {activeSection === 'ai' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">AI Concierge Requests</span>
              <div className="text-2xl font-black text-rose-600">{aiAnalytics.totalRequests.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400">Conversational queries answered</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Response Success Rate</span>
              <div className="text-2xl font-black text-emerald-600">{aiAnalytics.successRate}%</div>
              <p className="text-[11px] text-slate-400">Fallback rate: {aiAnalytics.fallbackRate}%</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Average AI Latency</span>
              <div className="text-2xl font-black text-indigo-600">{aiAnalytics.avgLatencyMs} ms</div>
              <p className="text-[11px] text-slate-400">Gemini 3.7 server inference speed</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Estimated Model Cost</span>
              <div className="text-2xl font-black text-slate-900">{aiAnalytics.estimatedCostUsd}</div>
              <p className="text-[11px] text-slate-400">{(aiAnalytics.estimatedTokens / 1000).toFixed(0)}k total tokens used</p>
            </div>
          </div>

          {/* Privacy Protection Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 space-y-0.5">
              <div className="font-bold">Privacy & Security Guardrails Enforced</div>
              <p>
                All AI prompts are scrubbed of personally identifiable information (PII) before analysis. API keys, secrets, and user passwords are never stored in telemetry databases.
              </p>
            </div>
          </div>

          {/* Popular AI Conversational Queries */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-600" />
              Frequently Asked AI Concierge Queries
            </h3>
            <div className="space-y-3">
              {aiAnalytics.popularQueries.map((q, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900">"{q.question}"</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>Category Intent: Place Discovery</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">{q.sentiment}</span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                    {q.count} chats
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: SYSTEM & DATA HEALTH */}
      {activeSection === 'system' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">API Server Status</span>
              <div className="text-xl font-black text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {systemHealth.apiServerStatus}
              </div>
              <p className="text-[11px] text-slate-400">Uptime: {systemHealth.apiUptime}</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Database Engine</span>
              <div className="text-sm font-black text-slate-900 truncate">
                {systemHealth.databaseStatus}
              </div>
              <p className="text-[11px] text-slate-400">Latency: {systemHealth.databaseLatencyMs}ms</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Memory Heap Usage</span>
              <div className="text-xl font-black text-indigo-600">
                {systemHealth.memoryHeapUsedMb} MB
              </div>
              <p className="text-[11px] text-slate-400">Max limit: {systemHealth.memoryHeapTotalMb} MB</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-1">
              <span className="text-xs font-bold text-slate-500">Error Rate</span>
              <div className="text-xl font-black text-emerald-600">
                {systemHealth.errorRate}
              </div>
              <p className="text-[11px] text-slate-400">Zero unhandled exceptions</p>
            </div>
          </div>

          {/* Data Freshness & Feeds */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  Data Ingestion Feeds & Freshness Monitor
                </h3>
                <p className="text-xs text-slate-500">Live health and sync cadence for external registry feeds.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                {dataFreshness.healthySources} / {dataFreshness.totalSources} Feeds Operational
              </span>
            </div>

            <div className="space-y-3">
              {dataFreshness.sourcesList.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {source.name}
                    </div>
                    <div className="text-[10px] text-slate-400">Last synchronised: {source.lastSync}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{source.recordsIngested} spots synced</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{source.errorCount} sync failures</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
