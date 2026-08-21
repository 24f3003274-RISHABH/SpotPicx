import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  PlusCircle,
  MapPin,
  Star,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Phone,
  Globe,
  Search,
} from 'lucide-react';
import { businessOwnerService } from '../../services/businessOwnerService';
import { Business } from '../../types';
import { ROUTES } from '../../constants/routes';

export const BusinessListingsTab: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const data = await businessOwnerService.getMyBusinesses();
      setBusinesses(data);
    } catch (e) {
      console.error('Failed to load listings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeletingId(id);
      await businessOwnerService.deleteListing(id);
      setBusinesses(businesses.filter((b) => b._id !== id));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete listing');
    } finally {
      setIsDeletingId(null);
    }
  };

  const filtered = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.locality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-600" />
            <span>My Establishments ({businesses.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Edit listing details, operational hours, photos, and contact info.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spots..."
              className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link
            to={ROUTES.BUSINESS_CREATE}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Listing</span>
          </Link>
        </div>
      </div>

      {/* Listings Cards */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your listings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Store className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No listings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any registered establishments matching your filter.
            </p>
          </div>
          <Link
            to={ROUTES.BUSINESS_CREATE}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Listing</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((biz) => (
            <div
              key={biz._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={
                    biz.images && biz.images[0]
                      ? biz.images[0]
                      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
                  }
                  alt={biz.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900">{biz.name}</h3>
                    {biz.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                        <ShieldAlert className="h-3 w-3" />
                        <span>Pending Claim Verification</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {biz.priceRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span>{biz.address || biz.locality}, Delhi</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating?.toFixed(1) || '4.5'}</span>
                      <span className="text-slate-400 font-normal">({biz.reviewCount || 0} reviews)</span>
                    </div>

                    {biz.phone && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <Phone className="h-3 w-3" />
                        <span>{biz.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <Link
                  to={`/business/businesses/${biz._id}/edit`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-700 border border-transparent font-bold text-xs transition-colors cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Listing</span>
                </Link>

                <Link
                  to={`/business/${biz.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="View Public Page"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(biz._id, biz.name)}
                  disabled={isDeletingId === biz._id}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                  title="Delete Listing"
                >
                  {isDeletingId === biz._id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
