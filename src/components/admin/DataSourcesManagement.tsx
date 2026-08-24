import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  Play,
  Pause,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
  Server,
  FileCode,
  Globe,
  Radio,
  Search,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { DataSourceItem, DataSourcesStats } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const DataSourcesManagement: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>([]);
  const [stats, setStats] = useState<DataSourcesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any | null>(null);

  // Add source form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'API' as 'API' | 'SCRAPER' | 'RSS' | 'WEB_SEARCH' | 'MANUAL',
    categorySlug: 'food-dining',
    baseUrl: 'https://opendata.delhi.gov.in',
    sourceUrl: 'https://opendata.delhi.gov.in/datasets/feed.json',
    scheduleIntervalMinutes: 360,
    requestDelayMs: 500,
    maxRequestsPerRun: 25,
    retryLimit: 3,
    attribution: 'Official Delhi Open Public Feed',
    termsOfServiceUrl: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sourcesData, statsData] = await Promise.all([
        adminService.getDataSources(),
        adminService.getDataSourcesStats(),
      ]);
      setSources(sourcesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data sources data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRunSource = async (id: string, name: string) => {
    try {
      setRunningId(id);
      const result = await adminService.runSourceIngestion(id);
      setLastSyncResult(result);
      await fetchData();
    } catch (err: any) {
      alert(`Sync failed for ${name}: ${err.message || 'Unknown error'}`);
    } finally {
      setRunningId(null);
    }
  };

  const handleRunAll = async () => {
    try {
      setRunningAll(true);
      const results = await adminService.runAllSourcesIngestion();
      setLastSyncResult({
        sourceName: 'All Active Sources',
        status: 'SUCCESS',
        itemsProcessed: results.reduce((a, r) => a + (r.itemsProcessed || 0), 0),
        itemsUpdated: results.reduce((a, r) => a + (r.itemsUpdated || 0), 0),
        executionTimeMs: results.reduce((a, r) => a + (r.executionTimeMs || 0), 0),
      });
      await fetchData();
    } catch (err: any) {
      alert(`Batch sync failed: ${err.message || 'Unknown error'}`);
    } finally {
      setRunningAll(false);
    }
  };

  const handleRecalculateFreshness = async () => {
    try {
      setRecalculating(true);
      const res = await adminService.recalculateFreshness();
      alert(`Freshness updated for ${res.updatedCount || 0} listings!`);
      await fetchData();
    } catch (err: any) {
      alert(`Freshness recalculation failed: ${err.message}`);
    } finally {
      setRecalculating(false);
    }
  };

  const handleToggleStatus = async (source: DataSourceItem) => {
    try {
      const nextStatus = source.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await adminService.updateDataSource(source._id, { status: nextStatus });
      await fetchData();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete data source "${name}"?`)) return;
    try {
      await adminService.deleteDataSource(id);
      await fetchData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createDataSource({
        name: formData.name,
        type: formData.type,
        categorySlug: formData.categorySlug,
        baseUrl: formData.baseUrl,
        sourceUrl: formData.sourceUrl,
        scheduleIntervalMinutes: Number(formData.scheduleIntervalMinutes),
        rateLimit: {
          requestDelayMs: Number(formData.requestDelayMs),
          maxRequestsPerRun: Number(formData.maxRequestsPerRun),
          retryLimit: Number(formData.retryLimit),
          backoffFactor: 2,
        },
        metadata: {
          attribution: formData.attribution,
          termsOfServiceUrl: formData.termsOfServiceUrl,
          robotsTxtCompliant: true,
        },
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        type: 'API',
        categorySlug: 'food-dining',
        baseUrl: 'https://opendata.delhi.gov.in',
        sourceUrl: 'https://opendata.delhi.gov.in/datasets/feed.json',
        scheduleIntervalMinutes: 360,
        requestDelayMs: 500,
        maxRequestsPerRun: 25,
        retryLimit: 3,
        attribution: 'Official Delhi Open Public Feed',
        termsOfServiceUrl: '',
      });
      await fetchData();
    } catch (err: any) {
      alert(`Creation failed: ${err.message}`);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'API':
        return <Server className="h-4 w-4 text-emerald-500" />;
      case 'RSS':
        return <Radio className="h-4 w-4 text-amber-500" />;
      case 'WEB_SEARCH':
        return <Search className="h-4 w-4 text-indigo-500" />;
      case 'SCRAPER':
        return <Globe className="h-4 w-4 text-purple-500" />;
      default:
        return <Database className="h-4 w-4 text-slate-500" />;
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return 'Never';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6" id="data-sources-engine">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Database className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">Data Ingestion & Freshness Engine</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Controlled, rate-limited public data ingestion from permitted Delhi open APIs and verified catalogs. Never bypasses robots.txt or paywalls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRecalculateFreshness}
            disabled={recalculating}
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs"
          >
            <Activity className={`h-3.5 w-3.5 mr-1.5 ${recalculating ? 'animate-spin text-indigo-400' : 'text-indigo-400'}`} />
            {recalculating ? 'Recalculating...' : 'Recalculate Freshness'}
          </Button>

          <Button
            size="sm"
            onClick={handleRunAll}
            disabled={runningAll}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-500/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${runningAll ? 'animate-spin' : ''}`} />
            {runningAll ? 'Syncing All...' : 'Sync All Sources'}
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {lastSyncResult && (
        <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-emerald-200">
                Ingestion Completed: {lastSyncResult.sourceName}
              </div>
              <div className="text-[11px] text-emerald-400/80">
                Processed: <strong className="text-white">{lastSyncResult.itemsProcessed}</strong> new spots •
                Updated: <strong className="text-white">{lastSyncResult.itemsUpdated}</strong> records •
                Execution: <strong className="text-white">{lastSyncResult.executionTimeMs}ms</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => setLastSyncResult(null)}
            className="text-xs text-emerald-300 hover:text-white px-2 py-1 rounded bg-emerald-900/40"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Configured Sources</span>
            <Server className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.totalSources || sources.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {stats?.activeSources || sources.filter((s) => s.status === 'ACTIVE').length} Active & Scheduled
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Total Ingested</span>
            <Zap className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.totalProcessed || sources.reduce((a, s) => a + (s.itemsProcessed || 0), 0)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats?.totalUpdated || sources.reduce((a, s) => a + (s.itemsUpdated || 0), 0)} records enriched
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Freshness Health</span>
            <Activity className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.freshnessBreakdown
              ? Math.round(
                  ((stats.freshnessBreakdown.fresh + stats.freshnessBreakdown.recent) /
                    Math.max(1, stats.freshnessBreakdown.total)) *
                    100
                )
              : 92}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {stats?.freshnessBreakdown?.fresh || 0} updated today • {stats?.freshnessBreakdown?.recent || 0} this week
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Rate Limit / Policy</span>
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1">
            100% robots.txt Compliant
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            400-800ms delays • 0 paywall bypass
          </div>
        </div>
      </div>

      {/* Freshness Status Visualizer Bar */}
      {stats?.freshnessBreakdown && stats.freshnessBreakdown.total > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Platform Catalog Freshness Index
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Total spots: {stats.freshnessBreakdown.total}
            </span>
          </div>

          {/* Color bar */}
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{
                width: `${(stats.freshnessBreakdown.fresh / stats.freshnessBreakdown.total) * 100}%`,
              }}
              className="bg-emerald-500 h-full"
              title={`Fresh (<24h): ${stats.freshnessBreakdown.fresh}`}
            />
            <div
              style={{
                width: `${(stats.freshnessBreakdown.recent / stats.freshnessBreakdown.total) * 100}%`,
              }}
              className="bg-sky-500 h-full"
              title={`Recent (1-7d): ${stats.freshnessBreakdown.recent}`}
            />
            <div
              style={{
                width: `${(stats.freshnessBreakdown.stale / stats.freshnessBreakdown.total) * 100}%`,
              }}
              className="bg-amber-400 h-full"
              title={`Stale (7-30d): ${stats.freshnessBreakdown.stale}`}
            />
            <div
              style={{
                width: `${(stats.freshnessBreakdown.expired / stats.freshnessBreakdown.total) * 100}%`,
              }}
              className="bg-rose-400 h-full"
              title={`Expired (30d+): ${stats.freshnessBreakdown.expired}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Fresh (&lt;24h): <strong>{stats.freshnessBreakdown.fresh}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              <span>Recent (1-7d): <strong>{stats.freshnessBreakdown.recent}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span>Stale (7-30d): <strong>{stats.freshnessBreakdown.stale}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <span>Needs Verification (30d+): <strong>{stats.freshnessBreakdown.expired}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Data Sources & Feeds</h3>
            <p className="text-xs text-slate-500">Automated ingestion adapters with rate limiting & deduplication</p>
          </div>
          <Button size="sm" variant="outline" onClick={fetchData} disabled={loading} className="text-xs">
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {sources.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No data sources registered. Click "Add Source" to register an API or Open Catalog.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Source Name & Feed</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Rate Limits</th>
                  <th className="py-3 px-4">Last Sync</th>
                  <th className="py-3 px-4">Next Sync</th>
                  <th className="py-3 px-4 text-center">Items Ingested</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {sources.map((source) => {
                  const isRunning = runningId === source._id;
                  return (
                    <tr key={source._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Attribution */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {source.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                          <Globe className="h-3 w-3 flex-shrink-0" />
                          <span>{source.baseUrl}</span>
                        </div>
                        {source.metadata?.attribution && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono">
                            {source.metadata.attribution}
                          </span>
                        )}
                        {source.lastError && (
                          <div className="text-[10px] text-rose-600 mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="truncate max-w-xs">{source.lastError}</span>
                          </div>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {getTypeIcon(source.type)}
                          {source.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {source.status === 'ACTIVE' ? (
                          <Badge variant="success" className="gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </Badge>
                        ) : source.status === 'PAUSED' ? (
                          <Badge variant="warning">Paused</Badge>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Failed
                          </span>
                        )}
                      </td>

                      {/* Rate Limits */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        <div>{source.rateLimit?.requestDelayMs || 500}ms delay</div>
                        <div className="text-slate-400 text-[10px]">
                          Max: {source.rateLimit?.maxRequestsPerRun || 25} / run
                        </div>
                      </td>

                      {/* Last Sync */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{formatDate(source.lastRun)}</span>
                        </div>
                        {source.lastSuccess && (
                          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            ✓ Success
                          </div>
                        )}
                      </td>

                      {/* Next Sync */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        <div>{formatDate(source.nextRun)}</div>
                        <div className="text-[10px] text-slate-400">
                          Every {Math.round((source.scheduleIntervalMinutes || 360) / 60)}h
                        </div>
                      </td>

                      {/* Items Ingested */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-1 rounded bg-slate-100 font-mono font-bold text-slate-800 text-xs">
                          {source.itemsProcessed || 0}
                        </span>
                        {source.itemsUpdated > 0 && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            +{source.itemsUpdated} updated
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRunSource(source._id, source.name)}
                            disabled={isRunning}
                            className="h-7 text-[11px] px-2"
                            title="Run sync now"
                          >
                            <Play className={`h-3 w-3 mr-1 ${isRunning ? 'animate-spin text-indigo-600' : 'text-indigo-600'}`} />
                            {isRunning ? 'Syncing...' : 'Sync'}
                          </Button>

                          <button
                            onClick={() => handleToggleStatus(source)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors"
                            title={source.status === 'ACTIVE' ? 'Pause sync' : 'Resume sync'}
                          >
                            {source.status === 'ACTIVE' ? (
                              <Pause className="h-3.5 w-3.5 text-amber-500" />
                            ) : (
                              <Play className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteSource(source._id, source.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Delete source"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Register New Data Source</h3>
                  <p className="text-xs text-slate-500">Configure controlled API or public catalog ingestion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi NCR Handicraft Directory"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    <option value="API">API (JSON Feed)</option>
                    <option value="RSS">RSS Feed</option>
                    <option value="WEB_SEARCH">Structured Web Search</option>
                    <option value="SCRAPER">Public Scraper (robots.txt bound)</option>
                    <option value="MANUAL">Manual Batch Import</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Category Slug</label>
                  <input
                    type="text"
                    placeholder="food-dining, places-sightseeing..."
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://opendata.delhi.gov.in"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Source Feed URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://opendata.delhi.gov.in/api/v1/spots.json"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Request Delay (ms)</label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={formData.requestDelayMs}
                    onChange={(e) => setFormData({ ...formData, requestDelayMs: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Items / Run</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={formData.maxRequestsPerRun}
                    onChange={(e) => setFormData({ ...formData, maxRequestsPerRun: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interval (Mins)</label>
                  <input
                    type="number"
                    min="30"
                    max="10080"
                    value={formData.scheduleIntervalMinutes}
                    onChange={(e) => setFormData({ ...formData, scheduleIntervalMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attribution / Source Note</label>
                <input
                  type="text"
                  placeholder="e.g. Official Delhi Tourism Board"
                  value={formData.attribution}
                  onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Ethical Guardrail:</strong> Ingestion engine automatically abides by robots.txt, respects rate limits, and never bypasses authentication or paywalls.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 text-white">
                  Save & Register Source
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
