import React, { useEffect, useState } from 'react';
import {
  MapPin,
  PlusCircle,
  Trash2,
  ExternalLink,
  Navigation,
  Layers,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Building2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { discoveryService } from '../../services/discoveryService';
import { LocationItem, LocationType } from '../../types';

export const AdminLocationsTab: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add/Edit Modal
  const [isAdding, setIsAdding] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocSlug, setNewLocSlug] = useState('');
  const [newLocType, setNewLocType] = useState<LocationType>('CITY');
  const [newLocState, setNewLocState] = useState('Delhi');
  const [newLocCity, setNewLocCity] = useState('Delhi');
  const [newLocStatus, setNewLocStatus] = useState<'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE'>('COMING_SOON');
  const [newLocReadiness, setNewLocReadiness] = useState<number>(50);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await discoveryService.getLocations();
      setLocations(data);
    } catch (e) {
      console.error('Failed to load locations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleToggleStatus = async (loc: LocationItem, newStatus: 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE') => {
    try {
      await discoveryService.updateLocationStatus(loc.slug, newStatus);
      setLocations(
        locations.map((l) => (l.slug === loc.slug ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error('Failed to update location status:', err);
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    const generatedSlug = newLocSlug.trim() || newLocName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const loc: LocationItem = {
      _id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      slug: generatedSlug,
      city: newLocCity,
      state: newLocState,
      country: 'India',
      type: newLocType,
      status: newLocStatus,
      readinessScore: newLocReadiness,
      waitlistCount: 0,
      latitude: 28.5244,
      longitude: 77.2066,
      pincode: '110001',
      isActive: true,
      businessCount: 0,
      description: `Geographic discovery node for ${newLocName}.`,
    };
    setLocations([loc, ...locations]);
    setNewLocName('');
    setNewLocSlug('');
    setIsAdding(false);
  };

  const handleDelete = (idOrSlug: string) => {
    if (!window.confirm('Delete this geographic node?')) return;
    setLocations(locations.filter((l) => (l._id || l.slug) !== idOrSlug && l.slug !== idOrSlug));
  };

  const filteredLocations = locations.filter((loc) => {
    if (typeFilter !== 'ALL' && loc.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && (loc.status || 'ACTIVE') !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.slug.toLowerCase().includes(q) ||
        (loc.city && loc.city.toLowerCase().includes(q)) ||
        (loc.state && loc.state.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const stateCount = locations.filter((l) => l.type === 'STATE').length;
  const cityCount = locations.filter((l) => l.type === 'CITY').length;
  const localityCount = locations.filter((l) => l.type === 'LOCALITY' || l.type === 'NEIGHBORHOOD').length;
  const activeCount = locations.filter((l) => l.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span>India-Wide Geographic Hierarchy Manager ({locations.length} Total Nodes)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure 6-level taxonomy: Country &rarr; State &rarr; District &rarr; City &rarr; Locality &rarr; Neighborhood.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/india"
              target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View India Directory</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Node</span>
            </button>
          </div>
        </div>

        {/* Quick Hierarchy Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-500">States Configured</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stateCount}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-500">Cities / Municipalities</span>
            <div className="text-xl font-black text-indigo-600 mt-0.5">{cityCount}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-500">Localities & Micro-Zones</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">{localityCount}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl">
            <span className="text-[11px] font-medium text-slate-500">Live Active Nodes</span>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by node name, city, state, or slug..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Levels</option>
            <option value="STATE">States</option>
            <option value="DISTRICT">Districts</option>
            <option value="CITY">Cities</option>
            <option value="LOCALITY">Localities</option>
            <option value="NEIGHBORHOOD">Neighborhoods</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Live (ACTIVE)</option>
            <option value="COMING_SOON">COMING_SOON</option>
            <option value="BETA">BETA</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Create Node Form */}
      {isAdding && (
        <form onSubmit={handleAddLocation} className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Create New Geographic Hierarchy Node</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Node Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra or Mumbai"
                value={newLocName}
                onChange={(e) => {
                  setNewLocName(e.target.value);
                  setNewLocSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">URL Slug *</label>
              <input
                type="text"
                required
                placeholder="e.g. bandra"
                value={newLocSlug}
                onChange={(e) => setNewLocSlug(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Geographic Level *</label>
              <select
                value={newLocType}
                onChange={(e) => setNewLocType(e.target.value as LocationType)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="STATE">STATE</option>
                <option value="DISTRICT">DISTRICT</option>
                <option value="CITY">CITY</option>
                <option value="LOCALITY">LOCALITY</option>
                <option value="NEIGHBORHOOD">NEIGHBORHOOD</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">State / Province</label>
              <input
                type="text"
                placeholder="e.g. Maharashtra"
                value={newLocState}
                onChange={(e) => setNewLocState(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">City / Municipality</label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={newLocCity}
                onChange={(e) => setNewLocCity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Status</label>
              <select
                value={newLocStatus}
                onChange={(e) => setNewLocStatus(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="COMING_SOON">COMING_SOON (Expansion)</option>
                <option value="ACTIVE">ACTIVE (Live)</option>
                <option value="BETA">BETA</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            >
              Save Hierarchy Node
            </button>
          </div>
        </form>
      )}

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((loc) => {
          const isLive = (loc.status || 'ACTIVE') === 'ACTIVE';
          return (
            <div
              key={loc._id || loc.slug}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all ${
                isLive ? 'border-emerald-200 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wide">
                        {loc.type}
                      </span>
                      {loc.shortCode && (
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          [{loc.shortCode}]
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{loc.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">/{loc.slug}</p>
                  </div>

                  {/* Status Tag */}
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      LIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      {loc.status || 'COMING_SOON'}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-0.5 mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Jurisdiction: </span>
                    <span className="font-semibold text-slate-700">{loc.city || loc.name}, {loc.state || 'India'}</span>
                  </div>
                  {loc.type === 'CITY' && (
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">Readiness Score:</span>
                      <span className="font-bold text-indigo-600">{loc.readinessScore || (isLive ? 100 : 30)}%</span>
                    </div>
                  )}
                  {loc.waitlistCount !== undefined && loc.waitlistCount > 0 && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Waitlist Signups:</span>
                      <span className="font-bold text-amber-600">{loc.waitlistCount} users</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {/* Status Toggle Button */}
                  <select
                    value={loc.status || 'ACTIVE'}
                    onChange={(e) => handleToggleStatus(loc, e.target.value as any)}
                    className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMING_SOON">COMING_SOON</option>
                    <option value="BETA">BETA</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  {loc.type === 'STATE' ? (
                    <Link
                      to={`/india/${loc.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Preview State Hub"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  ) : loc.type === 'CITY' ? (
                    <Link
                      to={`/india/${loc.stateSlug || 'india'}/${loc.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Preview City Hub"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      to={`/location/${loc.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      title="Preview Locality Page"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(loc._id || loc.slug)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Node"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
