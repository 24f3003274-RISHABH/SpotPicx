import React, { useEffect, useState } from 'react';
import {
  Tag,
  Trash2,
  Power,
  Loader2,
  Ticket,
} from 'lucide-react';
import { offerService, OfferItem } from '../../services/offerService';

export const AdminOffersTab: React.FC = () => {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const data = await offerService.getAllAdminOffers();
      setOffers(data);
    } catch (e) {
      console.error('Failed to load offers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await offerService.toggleOffer(id);
      setOffers(offers.map((o) => (o._id === id ? { ...o, isActive: updated.isActive } : o)));
    } catch (e: any) {
      alert(e.message || 'Failed to toggle offer status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete promotional offer?')) return;
    try {
      await offerService.deleteOffer(id);
      setOffers(offers.filter((o) => o._id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete offer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-rose-600" />
            <span>Platform Promotional Deals Audit ({offers.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Audit merchant discounts, coupon claim rates, and promotional policy compliance.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Ticket className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No active offers across the platform.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Establishment</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Offer Title</th>
                  <th className="p-4">Promo Code</th>
                  <th className="p-4">Claims</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {offers.map((o) => {
                  const bizName = typeof o.business === 'object' ? o.business.name : 'Spot';
                  return (
                    <tr key={o._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{bizName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[11px]">
                          {o.discount}
                        </span>
                      </td>
                      <td className="p-4">{o.title}</td>
                      <td className="p-4 font-mono font-bold text-indigo-600">{o.couponCode || 'DELHIPROMO'}</td>
                      <td className="p-4">{o.claimedCount || 0}</td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            o.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {o.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(o._id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                            title="Toggle status"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(o._id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
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
