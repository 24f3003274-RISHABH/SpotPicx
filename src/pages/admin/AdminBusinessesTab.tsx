import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
  Filter,
  Star,
  MapPin,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Business } from '../../types';

export const AdminBusinessesTab: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getBusinesses({
        search: search.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setBusinesses(res.data || []);
    } catch (e) {
      console.error('Failed to load admin businesses:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadBusinesses();
  };

  const handleToggleVerify = async (id: string) => {
    try {
      setActionId(id);
      const updated = await adminService.toggleBusinessVerified(id);
      setBusinesses(businesses.map((b) => (b._id === id ? { ...b, verified: updated.verified } : b)));
    } catch (e: any) {
      alert(e.message || 'Failed to toggle verified badge');
    } finally {
      setActionId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setActionId(id);
      const updated = await adminService.updateBusinessStatus(id, newStatus);
      setBusinesses(businesses.map((b) => (b._id === id ? { ...b, status: updated.status } : b)));
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}" from SpotPicks Delhi directory?`)) return;
    try {
      setActionId(id);
      await adminService.deleteBusiness(id);
      setBusinesses(businesses.filter((b) => b._id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete business');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="h-5 w-5 text-rose-600" />
            <span>Establishment Moderation & Verification</span>
          </h2>
          <p className="text-xs text-slate-500">
            Grant SpotPicks Verified trust badges, moderate active statuses, and audit listings.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spots by name..."
              className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === s
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading establishments...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Store className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No establishments found matching query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Spot Details</th>
                  <th className="p-4">Locality & City</th>
                  <th className="p-4">Rating & Reviews</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {businesses.map((biz) => {
                  const isBusy = actionId === biz._id;
                  return (
                    <tr key={biz._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              biz.images && biz.images[0]
                                ? biz.images[0]
                                : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
                            }
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{biz.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">/{biz.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span>{biz.locality}, Delhi</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{biz.rating?.toFixed(1) || '4.5'}</span>
                          <span className="text-slate-400 font-normal">({biz.reviewCount || 0})</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleVerify(biz._id)}
                          disabled={isBusy}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            biz.verified
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{biz.verified ? 'Verified Badge' : 'Unverified (Click to Verify)'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <select
                          value={biz.status || 'ACTIVE'}
                          onChange={(e) => handleStatusChange(biz._id, e.target.value)}
                          disabled={isBusy}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/business/${biz.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500"
                            title="View Public Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(biz._id, biz.name)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 hover:border-rose-200"
                            title="Delete"
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
        </div>
      )}
    </div>
  );
};
