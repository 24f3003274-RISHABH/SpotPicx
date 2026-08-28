import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
  Star,
  MapPin,
  Plus,
  Edit,
  X,
  Save,
  Tag,
  Phone,
  Globe,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Business } from '../../types';

interface BusinessFormData {
  name: string;
  category: string;
  locality: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  website: string;
  priceRange: string;
  rating: number;
  shortDescription: string;
  description: string;
  images: string;
  tags: string;
  status: string;
  verified: boolean;
}

const initialForm: BusinessFormData = {
  name: '',
  category: 'cafes',
  locality: 'Saket',
  city: 'Delhi',
  state: 'Delhi',
  address: '',
  phone: '+91 98100 12345',
  website: 'https://',
  priceRange: '₹₹',
  rating: 4.8,
  shortDescription: '',
  description: '',
  images: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  tags: 'Artisanal, Specialty Coffee, Free Wifi, Outdoor Seating',
  status: 'PUBLISHED',
  verified: true,
};

export const AdminBusinessesTab: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleOpenAddModal = () => {
    setEditingBusinessId(null);
    setFormData(initialForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (biz: Business) => {
    setEditingBusinessId(biz._id);
    const catSlug = typeof biz.category === 'object' && biz.category !== null ? (biz.category as any).slug : biz.category || 'cafes';
    setFormData({
      name: biz.name || '',
      category: catSlug,
      locality: biz.locality || 'Delhi',
      city: biz.city || 'Delhi',
      state: biz.state || 'Delhi',
      address: biz.address || '',
      phone: biz.phone || '',
      website: biz.website || '',
      priceRange: biz.priceRange || '₹₹',
      rating: biz.rating || 4.5,
      shortDescription: biz.shortDescription || '',
      description: biz.description || '',
      images: biz.images && biz.images.length > 0 ? biz.images.join(', ') : '',
      tags: biz.tags ? biz.tags.join(', ') : '',
      status: biz.status || 'PUBLISHED',
      verified: biz.verified ?? true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: any = {
        name: formData.name.trim(),
        category: formData.category,
        locality: formData.locality.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        address: formData.address.trim() || `${formData.locality}, ${formData.city}`,
        phone: formData.phone.trim(),
        website: formData.website.trim(),
        priceRange: formData.priceRange,
        rating: Number(formData.rating) || 4.5,
        shortDescription: formData.shortDescription.trim() || formData.name,
        description: formData.description.trim() || formData.shortDescription || formData.name,
        images: formData.images
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        status: formData.status,
        verified: formData.verified,
      };

      if (editingBusinessId) {
        await adminService.updateBusiness(editingBusinessId, payload);
      } else {
        await adminService.createBusiness(payload);
      }

      setIsModalOpen(false);
      await loadBusinesses();
    } catch (err: any) {
      console.error('Failed to save business:', err);
      setFormError(err.response?.data?.error?.message || err.message || 'Failed to save business to MongoDB');
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Search & Action Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="h-5 w-5 text-rose-600" />
            <span>Establishment Moderation & Directory Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Create, edit, grant SpotPicks Verified trust badges, and persist establishments to MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spots..."
                className="text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 w-44"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Filter
            </button>
          </form>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add Establishment</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {['ALL', 'PUBLISHED', 'ACTIVE', 'DRAFT', 'PENDING_REVIEW', 'SUSPENDED'].map((s) => (
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
          <p className="text-xs text-slate-500">Loading establishments from database...</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Store className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">No establishments found matching query.</p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
          >
            + Create First Listing
          </button>
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
                          <span>{biz.verified ? 'Verified Badge' : 'Unverified'}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <select
                          value={biz.status || 'PUBLISHED'}
                          onChange={(e) => handleStatusChange(biz._id, e.target.value)}
                          disabled={isBusy}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white cursor-pointer"
                        >
                          <option value="PUBLISHED">PUBLISHED</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="DRAFT">DRAFT</option>
                          <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(biz)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
                            title="Edit Spot Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            to={`/business/${biz.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(biz._id, biz.name)}
                            disabled={isBusy}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
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

      {/* Add / Edit Establishment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingBusinessId ? 'Edit Establishment' : 'Add New Establishment'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBusiness} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Spot Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Establishment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Blue Tokai Coffee Roasters"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="cafes">Cafes & Bakeries</option>
                    <option value="restaurants">Fine Dining & Restaurants</option>
                    <option value="street-food">Street Food & Chaat</option>
                    <option value="nightlife">Nightlife & Bars</option>
                    <option value="co-working">Co-Working & Workspaces</option>
                    <option value="shopping">Markets & Boutiques</option>
                    <option value="hotels">Luxury & Boutique Stays</option>
                    <option value="wellness">Spas & Fitness</option>
                    <option value="services">Local Services & Repairs</option>
                  </select>
                </div>

                {/* Locality */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Locality *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g., Saket, Hauz Khas, Connaught Place"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* City & State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Delhi"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Price Range</label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="₹">₹ (Budget / Street)</option>
                    <option value="₹₹">₹₹ (Moderate / Casual)</option>
                    <option value="₹₹₹">₹₹₹ (Upscale)</option>
                    <option value="₹₹₹₹">₹₹₹₹ (Fine Dining / Luxury)</option>
                  </select>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98100 12345"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Full Physical Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Shop 4, Champa Gali, Saidulajab, Saket, New Delhi 110030"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Images */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Cover & Gallery Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium font-mono text-[11px]"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tags / Features (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Artisanal, Specialty Coffee, Free Wifi, Outdoor Seating, Pet Friendly"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Short Summary / Highlights</label>
                  <textarea
                    rows={3}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief description of the venue, menu specialties, and vibes..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Status & Verification */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="h-4 w-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Grant SpotPicks Verified Badge
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving to MongoDB...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Establishment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
