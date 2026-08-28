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
  UtensilsCrossed,
  Sparkles,
  Check,
  Flame,
} from 'lucide-react';
import { businessOwnerService } from '../../services/businessOwnerService';
import { discoveryService } from '../../services/discoveryService';
import { ROUTES } from '../../constants/routes';
import { POPULAR_DELHI_LOCALITIES } from '../../constants/locations';
import { MenuItem } from '../../types';

const DEFAULT_HOURS: Record<string, string> = {
  Monday: '09:00 AM - 10:00 PM',
  Tuesday: '09:00 AM - 10:00 PM',
  Wednesday: '09:00 AM - 10:00 PM',
  Thursday: '09:00 AM - 10:00 PM',
  Friday: '09:00 AM - 11:00 PM',
  Saturday: '09:00 AM - 11:00 PM',
  Sunday: '09:00 AM - 11:00 PM',
};

const DEFAULT_5_MENU_ITEMS: MenuItem[] = [
  {
    name: 'Artisanal Cold Brew Coffee',
    category: 'Beverages',
    price: 240,
    isVeg: true,
    isBestseller: true,
    description: '18-hour slow steeped specialty Arabica beans served over ice.',
  },
  {
    name: 'Wild Mushroom & Truffle Sourdough Pizza',
    category: 'Main Course',
    price: 590,
    isVeg: true,
    isBestseller: true,
    description: 'Fresh mozzarella, roasted shiitake, button mushrooms, and white truffle oil drizzle.',
  },
  {
    name: 'Mediterranean Mezze Platter',
    category: 'Starters',
    price: 450,
    isVeg: true,
    isBestseller: false,
    description: 'House-made beetroot hummus, smoky baba ganoush, falafels, and warm woodfired pita.',
  },
  {
    name: 'Smoked Chicken & Sundried Tomato Pasta',
    category: 'Main Course',
    price: 520,
    isVeg: false,
    isBestseller: true,
    description: 'Al dente penne tossed in creamy garlic pesto with grilled herb chicken.',
  },
  {
    name: 'Lotus Biscoff Baked Cheesecake',
    category: 'Desserts',
    price: 360,
    isVeg: true,
    isBestseller: true,
    description: 'Silky cream cheese layer over spiced caramelized biscuit crust.',
  },
];

export const BusinessListingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id && id !== 'new');
  const navigate = useNavigate();

  // Mode: 'single' (1 by 1) or 'batch5' (5 in one go)
  const [editorMode, setEditorMode] = useState<'single' | 'batch5'>('single');

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
  const [status, setStatus] = useState('PUBLISHED');
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
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  ]);
  const [imageInput, setImageInput] = useState('');
  const [amenities, setAmenities] = useState<string[]>([
    'High-Speed Wi-Fi',
    'Outdoor Seating',
    'Specialty Coffee',
    'Air Conditioned',
  ]);
  const [amenityInput, setAmenityInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Artisanal Coffee', 'Work Cafe', 'Brunch Spot']);
  const [tagInput, setTagInput] = useState('');
  const [openingHours, setOpeningHours] = useState<Record<string, string>>(DEFAULT_HOURS);

  // Restaurant Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_5_MENU_ITEMS);
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    name: '',
    category: 'Main Course',
    price: 350,
    isVeg: true,
    isBestseller: false,
    description: '',
  });

  // Batch 5 Creator state
  const [batchListings, setBatchListings] = useState<any[]>([
    {
      name: 'The Blue Door Cafe',
      categoryName: 'Cafes & Coffee',
      locality: 'Khan Market',
      address: 'Shop 66, Middle Lane, Khan Market, New Delhi',
      priceRange: 'PREMIUM',
      rating: 4.6,
      tags: ['Italian', 'Artisanal Coffee', 'Breakfast'],
      shortDescription: 'Charming European style bistro popular for hearty breakfasts and Italian mains.',
      menuCount: 5,
    },
    {
      name: 'Diggin Cafe',
      categoryName: 'Cafes & Coffee',
      locality: 'Chanakyapuri',
      address: 'Santushti Shopping Complex, Chanakyapuri, New Delhi',
      priceRange: 'PREMIUM',
      rating: 4.7,
      tags: ['Aesthetic', 'Outdoor Seating', 'Pasta'],
      shortDescription: 'Iconic lush green brick-walled cafe offering handcrafted pizzas, pastas and shakes.',
      menuCount: 5,
    },
    {
      name: 'Olive Bar & Kitchen',
      categoryName: 'Fine Dining & Restaurants',
      locality: 'Mehrauli',
      address: 'One Style Mile, Haveli 6, Kalka Das Marg, Mehrauli, New Delhi',
      priceRange: 'LUXURY',
      rating: 4.8,
      tags: ['Romantic Date', 'Mediterranean', 'Courtyard'],
      shortDescription: 'White-walled Mediterranean haven set under a banyan tree with culinary excellence.',
      menuCount: 5,
    },
    {
      name: 'Roastery Coffee House',
      categoryName: 'Cafes & Coffee',
      locality: 'Noida Sector 104',
      address: 'BL-004, Sector 104, Noida, Uttar Pradesh',
      priceRange: 'MODERATE',
      rating: 4.6,
      tags: ['Pour Over', 'Cascara', 'Specialty Roastery'],
      shortDescription: 'Celebrated specialty coffee house roasting fresh Indian estate single-origin beans.',
      menuCount: 5,
    },
    {
      name: 'Grammar Room',
      categoryName: 'Cafes & Coffee',
      locality: 'Mehrauli',
      address: 'One Style Mile, Kalka Das Marg, Mehrauli, New Delhi',
      priceRange: 'PREMIUM',
      rating: 4.7,
      tags: ['Forest View', 'Cocktails', 'Pancakes'],
      shortDescription: 'Scenic overlook cafe with sunny conservatory vibes serving artisanal cocktails and brunch.',
      menuCount: 5,
    },
  ]);

  const groupedLocalities = React.useMemo(() => {
    const groups: Record<string, typeof POPULAR_DELHI_LOCALITIES> = {};
    POPULAR_DELHI_LOCALITIES.forEach((item) => {
      const area = item.area || 'Delhi NCR';
      if (!groups[area]) groups[area] = [];
      groups[area].push(item);
    });
    return groups;
  }, []);

  const handleLocalityChange = (locName: string) => {
    setLocality(locName);
    const found = POPULAR_DELHI_LOCALITIES.find(
      (l) => l.name.toLowerCase() === locName.toLowerCase() || l.id === locName
    );
    if (found) {
      setLatitude(found.latitude);
      setLongitude(found.longitude);
    }
  };

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
            setStatus(biz.status || 'PUBLISHED');
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
            if (biz.tags && biz.tags.length > 0) setTags(biz.tags);
            if (biz.openingHours) setOpeningHours({ ...DEFAULT_HOURS, ...biz.openingHours });
            if (biz.menu && biz.menu.length > 0) setMenuItems(biz.menu);
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

  // Bulk add photo URLs (comma, space, or newline separated)
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageInput.trim()) return;
    const splitUrls = imageInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5 && u.startsWith('http'));

    if (splitUrls.length > 0) {
      const unique = Array.from(new Set([...images, ...splitUrls]));
      setImages(unique);
    }
    setImageInput('');
  };

  const handleBulkAddImages = () => {
    const curated5Photos = [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800',
    ];
    setImages(Array.from(new Set([...images, ...curated5Photos])));
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Amenities handlers
  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amenityInput.trim()) return;
    const splitItems = amenityInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 1);

    const merged = Array.from(new Set([...amenities, ...splitItems]));
    setAmenities(merged);
    setAmenityInput('');
  };

  const handleBulkAdd5Amenities = () => {
    const top5Amenities = [
      'Pet Friendly',
      'Valet Parking',
      'Rooftop Seating',
      'High-Speed Wi-Fi',
      'Outdoor Courtyard',
    ];
    setAmenities(Array.from(new Set([...amenities, ...top5Amenities])));
  };

  const handleRemoveAmenity = (val: string) => {
    setAmenities(amenities.filter((a) => a !== val));
  };

  // Menu items handlers
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.name.trim()) return;
    setMenuItems([
      ...menuItems,
      {
        ...newMenuItem,
        name: newMenuItem.name.trim(),
        price: Number(newMenuItem.price) || 250,
      },
    ]);
    setNewMenuItem({
      name: '',
      category: 'Main Course',
      price: 350,
      isVeg: true,
      isBestseller: false,
      description: '',
    });
  };

  const handleAdd5PopularMenuItems = () => {
    setMenuItems(DEFAULT_5_MENU_ITEMS);
  };

  const handleRemoveMenuItem = (idx: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== idx));
  };

  // Tags handlers
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    const splitTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    setTags(Array.from(new Set([...tags, ...splitTags])));
    setTagInput('');
  };

  const handleBulkAdd5Tags = () => {
    const top5Tags = ['Artisanal Coffee', 'Co-Working Friendly', 'Aesthetic Decor', 'Live Music', 'Brunch Hub'];
    setTags(Array.from(new Set([...tags, ...top5Tags])));
  };

  const handleRemoveTag = (val: string) => {
    setTags(tags.filter((t) => t !== val));
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
        status,
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
        tags,
        menu: menuItems,
        openingHours,
      };

      if (isEditMode && id) {
        await businessOwnerService.updateListing(id, payload);
        setSuccessMsg('Establishment listing and menu updated successfully in MongoDB Atlas!');
      } else {
        await businessOwnerService.createListing(payload);
        setSuccessMsg('Establishment listing created and published to MongoDB Atlas!');
        setTimeout(() => navigate(ROUTES.BUSINESS_LISTINGS), 1200);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save listing';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit 5 batch establishments at once
  const handleBatch5Submit = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const targetCategoryId = categories[0]?._id || categories[0]?.slug || 'cafes';

      const itemsToCreate = batchListings.map((b) => ({
        name: b.name,
        description: `${b.name} in ${b.locality}. ${b.shortDescription}`,
        shortDescription: b.shortDescription,
        category: targetCategoryId,
        locality: b.locality,
        address: b.address,
        city: 'Delhi',
        priceRange: b.priceRange,
        phone: '+91 98100 12345',
        latitude: 28.5355,
        longitude: 77.2145,
        images: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        ],
        amenities: ['Outdoor Seating', 'High-Speed Wi-Fi', 'Specialty Coffee', 'Air Conditioned'],
        tags: b.tags,
        menu: DEFAULT_5_MENU_ITEMS,
        status: 'PUBLISHED',
      }));

      await businessOwnerService.createBatchListings(itemsToCreate);
      setSuccessMsg(`Successfully created all 5 establishments with complete menus in MongoDB Atlas!`);
      setTimeout(() => navigate(ROUTES.BUSINESS_LISTINGS), 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to batch create listings';
      setError(msg);
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top bar & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.BUSINESS_LISTINGS}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Listings</span>
          </Link>
          <span className="text-xs text-slate-400">Delhi NCR Region</span>
        </div>

        {/* Mode Switcher */}
        {!isEditMode && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setEditorMode('single')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editorMode === 'single'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1 By 1 Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('batch5')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editorMode === 'batch5'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>⚡ 5-In-One-Go Batch Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* Banner Alerts */}
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

      {/* MODE 1: ⚡ 5-IN-ONE-GO BATCH CREATOR */}
      {editorMode === 'batch5' && !isEditMode ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs">
                  ⚡ Multi-Add Feature
                </span>
                <h2 className="text-lg font-bold text-slate-900">Add 5 Establishments in One Go</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Batch creates 5 full venues with locations, menus, amenities, and tags directly to your MongoDB Atlas database.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBatch5Submit}
              disabled={isSaving}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving 5 Venues to Atlas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Save All 5 Establishments Now</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {batchListings.map((biz, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={biz.name}
                      onChange={(e) => {
                        const updated = [...batchListings];
                        updated[idx].name = e.target.value;
                        setBatchListings(updated);
                      }}
                      className="font-bold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                    <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                      {biz.priceRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{biz.locality}, Delhi</span>
                    <span>•</span>
                    <UtensilsCrossed className="h-3.5 w-3.5 text-amber-500" />
                    <span>Includes 5 Popular Menu Items</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">{biz.shortDescription}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {biz.tags.map((t: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div className="text-xs text-indigo-900">
              <span className="font-bold">Ready to batch save:</span> Clicking save will instantly insert these 5 complete restaurant profiles and menus into MongoDB Atlas.
            </div>
            <button
              type="button"
              onClick={handleBatch5Submit}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Check className="h-4 w-4" />
              <span>Publish 5 to MongoDB Atlas</span>
            </button>
          </div>
        </div>
      ) : (
        /* MODE 2: SINGLE LISTING FORM (With Restaurant Menu) */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Store className="h-4 w-4 text-indigo-600" />
                <span>Establishment Basics</span>
              </h2>
              <p className="text-xs text-slate-500">
                Core identity of the restaurant, cafe, or venue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Establishment Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Blue Tokai Coffee Roasters"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Primary Category *</label>
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
                  <option value="BUDGET">Budget (₹ - Under ₹400 for two)</option>
                  <option value="MODERATE">Moderate (₹₹ - ₹400 to ₹1,200 for two)</option>
                  <option value="PREMIUM">Premium (₹₹₹ - ₹1,200 to ₹2,500 for two)</option>
                  <option value="LUXURY">Luxury (₹₹₹₹ - ₹2,500+ for two)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Short Pitch / Headline</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Award-winning artisanal micro-roastery and bakehouse in Saidulajab."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">Full Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details about atmosphere, specialties, history, and seating..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Restaurant Menu Builder */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-amber-500" />
                  <span>Restaurant Menu & Signature Dishes</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Add individual menu items, prices in ₹, veg/non-veg tags, and categories.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAdd5PopularMenuItems}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer"
              >
                ⚡ Add 5 Popular Menu Items
              </button>
            </div>

            {/* Add single menu item form */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700">Add Menu Item</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Truffle Pizza)"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Starters">Starters / Small Plates</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Breads & Sides">Breads & Sides</option>
                  <option value="Beverages">Beverages / Coffee</option>
                  <option value="Desserts">Desserts / Bakery</option>
                </select>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newMenuItem.price || ''}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                    className="w-full text-xs pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMenuItem.isVeg}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, isVeg: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🌱 Veg</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMenuItem}
                    className="ml-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
            </div>

            {/* Current Menu Items List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Menu ({menuItems.length} items)
              </div>
              {menuItems.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No menu items added yet. Click &quot;Add 5 Popular Menu Items&quot; above to get started.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {menuItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                          <span className="text-xs font-bold text-slate-900">{item.name}</span>
                          <span className="text-xs font-extrabold text-indigo-700">₹{item.price}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {item.category}
                          </span>
                          {item.description && <span className="truncate max-w-[180px]">{item.description}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Location & Coordinates */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-600" />
                <span>Location & Geo-Coordinates</span>
              </h2>
              <p className="text-xs text-slate-500">
                Delhi NCR neighborhood mapping and routing coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Delhi Locality *</label>
                <select
                  value={locality}
                  onChange={(e) => handleLocalityChange(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {Object.entries(groupedLocalities).map(([zone, locs]) => (
                    <optgroup key={zone} label={zone}>
                      {locs.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Haveli 6, Kalka Das Marg, Near Qutub Minar"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Photos & Gallery */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-indigo-600" />
                  <span>Photos & Gallery</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Add image URLs for hero carousel and photo gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBulkAddImages}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold cursor-pointer"
              >
                ⚡ Add 5 Curated Photos
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-video border border-slate-200">
                    <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Amenities */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-600" />
                  <span>Amenities & Features</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Badges that help explorers filter for study cafes, rooftop views, valet parking, etc.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBulkAdd5Amenities}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold cursor-pointer"
              >
                ⚡ Add 5 Amenities
              </button>
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
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Add
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

          {/* 6. Tags */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600" />
                  <span>Search Tags & Highlights</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Keywords that power natural search and mood filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleBulkAdd5Tags}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold cursor-pointer"
              >
                ⚡ Add 5 Tags
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. Artisanal Coffee, Sourdough Pizza, Romantic Date"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
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
              Listing and menu will persist directly in MongoDB Atlas.
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
                    <span>{isEditMode ? 'Save Listing & Menu Changes' : 'Publish Listing to MongoDB Atlas'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
