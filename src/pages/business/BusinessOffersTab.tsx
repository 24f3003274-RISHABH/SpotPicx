import React, { useEffect, useState } from 'react';
import {
  Tag,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Power,
  Loader2,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { offerService, OfferItem, CreateOfferPayload } from '../../services/offerService';
import { businessOwnerService } from '../../services/businessOwnerService';
import { Business } from '../../types';

export const BusinessOffersTab: React.FC = () => {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form
  const [businessId, setBusinessId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('20% OFF');
  const [couponCode, setCouponCode] = useState('DELHISPECIAL');
  const [terms, setTerms] = useState('Valid on all beverages and bakery items.\nDine-in only.\nCannot be combined with other offers.');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [oList, bList] = await Promise.all([
        offerService.getOwnerOffers(),
        businessOwnerService.getMyBusinesses(),
      ]);
      setOffers(oList);
      setBusinesses(bList);
      if (bList.length > 0 && !businessId) {
        setBusinessId(bList[0]._id);
      }
    } catch (e) {
      console.error('Failed to load offers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    if (!window.confirm('Are you sure you want to remove this promotion?')) return;
    try {
      await offerService.deleteOffer(id);
      setOffers(offers.filter((o) => o._id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete offer');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !discount.trim()) {
      setError('Offer title and discount percentage/amount are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const targetBiz = businessId || (businesses[0] ? businesses[0]._id : 'spot-1');
      const payload: CreateOfferPayload = {
        businessId: targetBiz,
        title: title.trim(),
        description: description.trim(),
        discount: discount.trim(),
        couponCode: couponCode.trim().toUpperCase(),
        terms: terms.split('\n').filter((t) => t.trim().length > 0),
      };

      const newOffer = await offerService.createOffer(payload);
      setOffers([newOffer, ...offers]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to create offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="h-5 w-5 text-indigo-600" />
            <span>Promotional Offers & Deals</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish coupon codes to attract Delhi foodies, students, and weekend travellers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading promotional deals...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Ticket className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No promotions currently active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a promo discount like "Flat 20% Off" or "Free Coffee on First Visit" to drive footfall.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Offer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => {
            const bizName = typeof offer.business === 'object' ? offer.business.name : 'My Establishment';

            return (
              <div
                key={offer._id}
                className={`bg-white rounded-3xl border p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                  offer.isActive ? 'border-slate-200 hover:border-purple-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-sm">
                      {offer.discount}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          offer.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {offer.isActive ? 'Active in Delhi' : 'Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-900">{offer.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{offer.description}</p>
                    <p className="text-[11px] font-semibold text-indigo-600 pt-0.5">at {bizName}</p>
                  </div>

                  {offer.terms && offer.terms.length > 0 && (
                    <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc pl-4">
                      {offer.terms.slice(0, 2).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {offer.couponCode || 'DELHIPROMO'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {offer.claimedCount || 0} claims
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggle(offer._id)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        offer.isActive
                          ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                      title={offer.isActive ? 'Pause offer' : 'Activate offer'}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(offer._id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Delete offer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Create Promotional Offer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              {businesses.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Target Establishment</label>
                  <select
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {businesses.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.locality})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% Off Artisanal Coffee & Bakery"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Discount Badge *</label>
                  <input
                    type="text"
                    required
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="e.g. 20% OFF or Free Drink"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Coupon Promo Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="DELHIFIRST20"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono uppercase focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Offer Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Valid all week on manual brew pour-overs, croissants, and dessert boards."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Terms & Conditions (One per line)</label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
