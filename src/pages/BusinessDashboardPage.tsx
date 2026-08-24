import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  PlusCircle,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { useBusinesses, useCreateBusiness, useCategories, useLocations } from '../hooks/useDiscovery';
import { ROUTES } from '../constants/routes';

export const BusinessDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('food-and-cafes');
  const [locality, setLocality] = useState('Hauz Khas');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [priceRange, setPriceRange] = useState<'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY'>('MODERATE');
  const [tags, setTags] = useState('cafe, hangout, food');

  const { data: categories } = useCategories();
  const { data: locations } = useLocations();
  const { data: businessesData, refetch } = useBusinesses({ limit: 20 });
  const createBusinessMutation = useCreateBusiness();

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBusinessMutation.mutateAsync({
        name,
        category,
        locality,
        city: 'Delhi',
        address,
        description,
        phone,
        priceRange,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        verified: true,
        claimed: true,
        images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'],
      });
      setFormSuccess(`Successfully registered "${name}" on SpotPicks!`);
      setShowAddModal(false);
      setName('');
      setAddress('');
      setDescription('');
      refetch();
    } catch (err: any) {
      alert(`Failed to create business: ${err.message}`);
    }
  };

  const businessListings = businessesData?.data?.slice(0, 6) || [];

  return (
    <div className="py-10 space-y-8 pb-24">
      <Container size="xl" className="space-y-8">
        {/* Business Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                Verified Business Portal
              </Badge>
              <span className="text-xs text-slate-500 font-mono">SpotPicks Partner Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-emerald-600" />
              Business Owner Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Welcome back, <span className="font-bold text-slate-800">{user?.name}</span>. Manage your Delhi business listings, customer reach, and reviews.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Add New Spot
            </Button>
          </div>
        </div>

        {formSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{formSuccess}</span>
            </div>
            <button type="button" onClick={() => setFormSuccess('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Business Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Managed Spots</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{businessListings.length} Listings</div>
            <div className="text-[11px] text-emerald-600 font-semibold">100% Active in Delhi</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Views</span>
              <Eye className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">34,500+</div>
            <div className="text-[11px] text-indigo-600 font-semibold">+24% this month</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Inquiries</span>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">412</div>
            <div className="text-[11px] text-purple-600 font-semibold">Leads from Delhi NCR</div>
          </Card>

          <Card className="p-5 border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Rating</span>
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">4.82 / 5.0</div>
            <div className="text-[11px] text-amber-600 font-semibold">Across verified reviews</div>
          </Card>
        </div>

        {/* Listings Table */}
        <Card className="p-6 border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Business Listings</h2>
              <p className="text-xs text-slate-500">Live spots indexed on SpotPicks Discovery</p>
            </div>
            <Link to="/businesses">
              <Button size="sm" variant="outline">
                View Public Directory
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businessListings.map((biz) => (
                  <tr key={biz._id || biz.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{biz.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{biz.address}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                        {typeof biz.category === 'object' ? (biz.category as any)?.name : biz.locality}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{biz.locality}, {biz.city}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {biz.priceRange}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{biz.rating ? biz.rating.toFixed(1) : '4.5'}</span>
                        <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/business/${biz.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>

      {/* Add Spot Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Add New Business Spot</h3>
                <p className="text-xs text-slate-500">Post a new verified spot to Delhi NCR discovery</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Blue Tokai Coffee Roasters"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {categories?.map((c) => (
                      <option key={c._id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Locality *</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {locations?.map((l) => (
                      <option key={l._id || l.slug} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Shop No. 4, Main Market, Delhi"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Tier</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="BUDGET">₹ Budget-Friendly</option>
                    <option value="MODERATE">₹₹ Moderate</option>
                    <option value="PREMIUM">₹₹₹ Premium</option>
                    <option value="LUXURY">₹₹₹₹ Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your offerings, atmosphere, specialty items..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. coffee, bakery, outdoor seating"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={createBusinessMutation.isPending}
                >
                  Create & List Spot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
