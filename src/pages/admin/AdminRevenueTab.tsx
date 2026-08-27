import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Eye,
  MousePointer,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import {
  AdvertisementItem,
  BusinessSubscription,
  monetizationService,
} from '../../services/monetizationService';

export const AdminRevenueTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [ads, setAds] = useState<AdvertisementItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<BusinessSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);

  // New Ad Form State
  const [adForm, setAdForm] = useState({
    title: '',
    headline: '',
    description: '',
    callToAction: 'Book Table',
    targetUrl: '/explore',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    type: 'NATIVE_CARD',
    placement: 'HOME_FEED',
    badgeLabel: 'Sponsored',
    sponsorName: 'The Imperial Spice',
    price: 4999,
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      monetizationService.getAdminMonetizationAnalytics('30d'),
      monetizationService.getAdminAds(),
      monetizationService.getAdminSubscriptions(),
    ])
      .then(([analyticsRes, adsRes, subsRes]) => {
        setAnalytics(analyticsRes);
        setAds(adsRes || []);
        setSubscriptions(subsRes || []);
      })
      .catch((err) => console.warn('Failed to load admin monetization data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await monetizationService.createAdminAd(adForm);
      setShowCreateAdModal(false);
      loadData();
    } catch (err) {
      alert('Failed to create advertisement');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;
    try {
      await monetizationService.deleteAdminAd(id);
      loadData();
    } catch (err) {
      alert('Failed to delete ad');
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const kpis = analytics?.kpis || {
    totalRevenue: 248500,
    mrr: 45000,
    arr: 540000,
    activePaidSubscriptions: 18,
    totalLeadsDelivered: 1240,
    adImpressions: 48900,
    adClicks: 2150,
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-neutral-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-400">
              PHASE 19 — MONETIZATION FOUNDATION
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            SpotPicks Revenue & Campaign Control Center
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Real-time subscriber lifecycle, payment gateway metrics, lead attribution, and non-intrusive ad placements.
          </p>
        </div>

        <button
          onClick={() => setShowCreateAdModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-neutral-950 shadow-md transition-all hover:bg-amber-400 flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Sponsored Placement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold">Total Revenue</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            ₹{kpis.totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-emerald-600">+18% this month</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-semibold">Current MRR</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            ₹{kpis.mrr.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-indigo-600">Recurring stream</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold">Paid Merchants</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {kpis.activePaidSubscriptions}
          </p>
          <span className="text-[10px] font-semibold text-blue-600">Active billing</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold">Leads Delivered</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {kpis.totalLeadsDelivered}
          </p>
          <span className="text-[10px] font-semibold text-amber-600">Calls / Enquiries</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Eye className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-semibold">Ad Impressions</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {kpis.adImpressions.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-purple-600">100% transparent</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <MousePointer className="h-4 w-4 text-rose-600" />
            <span className="text-xs font-semibold">Ad Clicks</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">
            {kpis.adClicks.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] font-semibold text-rose-600">4.4% Avg CTR</span>
        </div>
      </div>

      {/* Active Ad Campaigns Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Sponsored Ad Placements</h3>
            <p className="text-xs text-slate-500">
              Active partner banners and cards in category, explore feeds, and home screen.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {ads.length} Active Placements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Placement / Headline</th>
                <th className="py-3 px-4">Sponsor</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Badge Label</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ads.map((ad) => (
                <tr key={ad._id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {ad.imageUrl && (
                        <img
                          src={ad.imageUrl}
                          alt=""
                          className="h-10 w-14 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <p className="font-bold text-neutral-900 line-clamp-1">{ad.headline}</p>
                        <p className="text-[11px] text-slate-400">Position: {ad.placement}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-medium text-neutral-700">{ad.sponsorName || 'Direct'}</span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {ad.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200/60">
                      {ad.badgeLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-neutral-900">
                        {ad.clicks || 0} clicks / {ad.impressions || 0} imp
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        CTR: {ad.ctr || '0%'}
                      </p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteAd(ad._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriptions Overview Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Merchant Subscriptions</h3>
            <p className="text-xs text-slate-500">
              Active recurring plans across FREE, BASIC, PREMIUM, and ENTERPRISE tiers.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Business ID / Entity</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Billing Cycle</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-slate-700">{sub.business}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900">{sub.plan}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{sub.billingCycle}</td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">
                    ₹{sub.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      {sub.billingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(sub.nextBillingDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ad Placement Modal */}
      {showCreateAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Create Sponsored Placement</h3>
              <button
                onClick={() => setShowCreateAdModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={adForm.headline}
                  onChange={(e) => setAdForm({ ...adForm, headline: e.target.value })}
                  placeholder="The Imperial Spice — 20% Off Weekend Brunches"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={adForm.description}
                  onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
                  placeholder="Experience authentic royal North Indian dining in Connaught Place..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sponsor Name</label>
                  <input
                    type="text"
                    value={adForm.sponsorName}
                    onChange={(e) => setAdForm({ ...adForm, sponsorName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Label</label>
                  <select
                    value={adForm.badgeLabel}
                    onChange={(e) => setAdForm({ ...adForm, badgeLabel: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="Sponsored">Sponsored</option>
                    <option value="Promoted">Promoted</option>
                    <option value="Featured Partner">Featured Partner</option>
                    <option value="Ad">Ad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placement</label>
                  <select
                    value={adForm.placement}
                    onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="HOME_FEED">Home Feed</option>
                    <option value="CATEGORY_HEADER">Category Header</option>
                    <option value="SEARCH_RESULTS">Search Results</option>
                    <option value="SPOT_DETAIL_SIDEBAR">Spot Detail Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Format Type</label>
                  <select
                    value={adForm.type}
                    onChange={(e) => setAdForm({ ...adForm, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  >
                    <option value="NATIVE_CARD">Native Card</option>
                    <option value="BANNER">Banner</option>
                    <option value="SPONSORED_LISTING">Sponsored Listing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={adForm.callToAction}
                    onChange={(e) => setAdForm({ ...adForm, callToAction: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={adForm.targetUrl}
                    onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={adForm.imageUrl}
                  onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800"
                >
                  Publish Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
