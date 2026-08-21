import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Globe,
  Mail,
  Camera,
  Tag,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { businessOwnerService } from '../../services/businessOwnerService';
import { discoveryService } from '../../services/discoveryService';
import { ROUTES } from '../../constants/routes';

const DELHI_LOCALITIES = [
  'Hauz Khas Village',
  'Saidulajab, Saket',
  'Connaught Place',
  'Khan Market',
  'Chandni Chowk',
  'Greater Kailash 1 (M-Block)',
  'Shahpur Jat',
  'Majnu Ka Tilla',
  'Cyber Hub (NCR)',
  'Aerocity',
  'Vasant Kunj',
  'Green Park',
  'Defence Colony',
  'Old Delhi (Jama Masjid)',
];

const DEFAULT_HOURS: Record<string, string> = {
  Monday: '09:00 AM - 10:00 PM',
  Tuesday: '09:00 AM - 10:00 PM',
  Wednesday: '09:00 AM - 10:00 PM',
  Thursday: '09:00 AM - 10:00 PM',
  Friday: '09:00 AM - 11:00 PM',
  Saturday: '09:00 AM - 11:00 PM',
  Sunday: '09:00 AM - 11:00 PM',
};

export const BusinessListingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [locality, setLocality] = useState('Saidulajab, Saket');
  const [address, setAddress] = useState('');
  const [priceRange, setPriceRange] = useState('MODERATE');
  const [phone, setPhone] = useState('+91 98100 12345');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [latitude, setLatitude] = useState(28.5245);
  const [longitude, setLongitude] = useState(77.2066);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
  ]);
  const [imageInput, setImageInput] = useState('');
  const [amenities, setAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'Outdoor Seating',
    'Specialty Coffee',
    'Air Conditioned',
  ]);
  const [amenityInput, setAmenityInput] = useState('');
  const [openingHours, setOpeningHours] = useState<Record<string, string>>(DEFAULT_HOURS);

  useEffect(() => {
    const init = async () => {
      try {
        const catList = await discoveryService.getCategories();
        setCategories(catList);
        if (catList.length > 0 && !category) {
          setCategory(catList[0]._id || catList[0].slug);
        }

        if (isEditMode && id) {
          setIsLoading(true);
          const biz = await discoveryService.getBusinessBySlug(id);
          if (biz) {
            setName(biz.name || '');
            setDescription(biz.description || '');
            setShortDescription(biz.shortDescription || '');
            setCategory(
              typeof biz.category === 'object' ? (biz.category as any)._id : biz.category || ''
            );
            setLocality(biz.locality || 'Saidulajab, Saket');
            setAddress(biz.address || '');
            setPriceRange(biz.priceRange || 'MODERATE');
            setPhone(biz.phone || '');
            setEmail(biz.email || '');
            setWebsite(biz.website || '');
            setLatitude(biz.latitude || 28.6139);
            setLongitude(biz.longitude || 77.209);
            if (biz.images && biz.images.length > 0) setImages(biz.images);
            if (biz.amenities && biz.amenities.length > 0) setAmenities(biz.amenities);
            if (biz.openingHours) setOpeningHours({ ...DEFAULT_HOURS, ...biz.openingHours });
          }
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load business data');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id, isEditMode]);

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageInput.trim()) return;
    setImages([...images, imageInput.trim()]);
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amenityInput.trim()) return;
    if (!amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
    }
    setAmenityInput('');
  };

  const handleRemoveAmenity = (val: string) => {
    setAmenities(amenities.filter((a) => a !== val));
  };

  const handleHourChange = (day: string, value: string) => {
    setOpeningHours({ ...openingHours, [day]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Establishment name is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        shortDescription: shortDescription.trim() || description.substring(0, 160),
        category,
        locality,
        address: address.trim(),
        city: 'Delhi',
        priceRange,
        phone: phone.trim(),
        email: email.trim(),
        website: website.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        images,
        amenities,
        openingHours,
      };

      if (isEditMode && id) {
        await businessOwnerService.updateListing(id, payload);
        setSuccessMsg('Establishment listing updated successfully!');
      } else {
        await businessOwnerService.createListing(payload);
        setSuccessMsg('Establishment listing created and published!');
        setTimeout(() => navigate(ROUTES.BUSINESS_LISTINGS), 1200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to save listing');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading establishment editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.BUSINESS_LISTINGS}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Listings</span>
        </Link>
        <span className="text-xs text-slate-400">Delhi NCR Region</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Basic Details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="h-4 w-4 text-indigo-600" />
              <span>General Information</span>
            </h2>
            <p className="text-xs text-slate-500">
              Basic identification and Delhi categorization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Establishment Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Roastery Coffee House Delhi"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c._id || c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Price Tier</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="BUDGET">BUDGET (Under ₹500 for two)</option>
                <option value="MODERATE">MODERATE (₹500 - ₹1,500 for two)</option>
                <option value="PREMIUM">PREMIUM (₹1,500 - ₹3,000 for two)</option>
                <option value="LUXURY">LUXURY (₹3,000+ for two)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Short Catchphrase / Tagline</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Artisanal pour-overs, fresh sourdough bakes, and peaceful green courtyard in Saket."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed information regarding specialty menu items, aesthetic interior, seating capacity, parking availability..."
                className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 2. Delhi Location & Contact */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>Location & Contact Details</span>
            </h2>
            <p className="text-xs text-slate-500">
              Address in Delhi and coordinates for precise routing directions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Delhi Locality / Neighborhood</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {DELHI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">City</label>
              <input
                type="text"
                disabled
                value="Delhi"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-semibold"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Complete Physical Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 12, Champa Gali, Khasra 258, Lane 3, Saidulajab, Saket, New Delhi 110030"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98100 12345"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Official Website URL</label>
              <div className="relative">
                <Globe className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://examplecafe.com"
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 28.6139)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 77.209)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Photo Gallery */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="h-4 w-4 text-indigo-600" />
              <span>Photo Gallery</span>
            </h2>
            <p className="text-xs text-slate-500">
              High resolution photo URLs highlighting interior, dishes, and exterior facade.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste photo image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                  <img src={img} alt="Spot preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Operational Hours */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Opening Hours Schedule</span>
            </h2>
            <p className="text-xs text-slate-500">
              Operating hours displayed to customers in Delhi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(DEFAULT_HOURS).map((day) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 w-28">{day}</span>
                <input
                  type="text"
                  value={openingHours[day] || ''}
                  onChange={(e) => handleHourChange(day, e.target.value)}
                  placeholder="09:00 AM - 10:00 PM"
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-right font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 5. Amenities & Highlights */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-4 w-4 text-indigo-600" />
              <span>Amenities & Features</span>
            </h2>
            <p className="text-xs text-slate-500">
              Badges that help explorers filter for study cafes, rooftop views, valet parking, etc.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g. Pet Friendly, Valet Parking, Rooftop Lake View"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(item)}
                    className="hover:text-rose-600 cursor-pointer font-bold text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white flex items-center justify-between shadow-xl">
          <p className="text-xs text-slate-400 hidden sm:block">
            Changes will reflect immediately across Delhi directory and map indices.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to={ROUTES.BUSINESS_LISTINGS}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Save Listing Changes' : 'Publish New Listing'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
