import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  Wind,
  Utensils,
  Train,
  CheckCircle2,
  Search,
  Filter,
  ShieldCheck,
  Phone,
  Sparkles,
  Bed,
  Layers,
  MapPin,
  Star,
  DollarSign,
  X,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { discoveryService } from '../services/discoveryService';
import { SEOHead } from '../components/seo/SEOHead';
import { Business } from '../types';

const HOUSING_TYPES = [
  { label: 'All Housing', value: 'all' },
  { label: 'PG (Paying Guest)', value: 'pg' },
  { label: 'Student Hostels', value: 'hostel' },
  { label: 'Co-living Spaces', value: 'coliving' },
  { label: 'Furnished Flats', value: 'flat' },
];

const GENDERS = [
  { label: 'Any Gender', value: 'all' },
  { label: 'Girls Only', value: 'girls' },
  { label: 'Boys Only', value: 'boys' },
  { label: 'Co-ed / Unisex', value: 'unisex' },
];

const COLLEGE_HUBS = [
  { label: 'All Hubs', value: 'all' },
  { label: 'North Campus (GTB / Kamla)', value: 'north' },
  { label: 'South Campus (Satya Niketan)', value: 'south' },
];

export const HousingPage: React.FC = () => {
  const [housingType, setHousingType] = useState<string>('all');
  const [gender, setGender] = useState<string>('all');
  const [acOnly, setAcOnly] = useState<boolean>(false);
  const [foodIncluded, setFoodIncluded] = useState<boolean>(false);
  const [furnishedOnly, setFurnishedOnly] = useState<boolean>(false);
  const [nearMetro, setNearMetro] = useState<boolean>(false);
  const [collegeHub, setCollegeHub] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: [
      'housing-discovery',
      housingType,
      gender,
      acOnly,
      foodIncluded,
      furnishedOnly,
      nearMetro,
      collegeHub,
      searchQuery,
    ],
    queryFn: () =>
      discoveryService.getHousingDiscovery({
        housingType,
        gender,
        acOnly,
        foodIncluded,
        furnishedOnly,
        nearMetro,
        collegeHub,
        query: searchQuery.trim() || undefined,
      }),
  });

  const items = data?.items || [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <SEOHead
        title="Student Housing & PGs in Delhi NCR - Verified Hostels & Flats | SpotPicks"
        description="Find verified student PGs and hostels near North Campus and South Campus. Filter by AC, food included, girls/boys, and near metro connectivity."
      />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-10 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px]" />
        <Container size="xl" className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Home className="h-4 w-4 text-cyan-400" />
            <span>Zero Brokerage Verified Stays</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Find Your Ideal PG & Co-Living
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Pre-verified rooms with hygienic mess dining, high-speed Wi-Fi, 24/7 security, and walking distance to metro stations and universities.
          </p>

          {/* Quick Filter Toggles */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setAcOnly(!acOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                acOnly
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Wind className="h-3.5 w-3.5" />
              <span>AC Rooms</span>
            </button>

            <button
              onClick={() => setFoodIncluded(!foodIncluded)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                foodIncluded
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>Food Included (3 Meals)</span>
            </button>

            <button
              onClick={() => setFurnishedOnly(!furnishedOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                furnishedOnly
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Bed className="h-3.5 w-3.5" />
              <span>Fully Furnished</span>
            </button>

            <button
              onClick={() => setNearMetro(!nearMetro)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                nearMetro
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Train className="h-3.5 w-3.5" />
              <span>Near Metro</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Main Filter Section */}
      <Container size="xl" className="mt-8 space-y-6">
        {/* Housing Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {HOUSING_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setHousingType(type.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                housingType === type.value
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by PG name, locality (GTB Nagar, Satya Niketan), or landlord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Gender Select */}
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none"
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

            {/* Campus Hub Select */}
            <select
              value={collegeHub}
              onChange={(e) => setCollegeHub(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none"
            >
              {COLLEGE_HUBS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Found <strong className="text-slate-900">{data?.total || 0}</strong> verified housing options
          </span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Direct Contact & Zero Commission
          </span>
        </div>

        {/* Housing Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((spot: Business) => {
              const coverImage =
                spot.images && spot.images.length > 0
                  ? spot.images[0]
                  : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800';

              return (
                <div
                  key={spot._id || spot.id}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={spot.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-slate-900 font-bold text-xs shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{spot.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({spot.reviewCount})</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-bold flex items-center gap-1 drop-shadow-sm">
                        <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {spot.locality}
                      </span>
                      <span className="bg-cyan-500/90 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-lg shadow-sm">
                        Verified PG
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 space-y-3">
                    <div>
                      <Link to={`/biz/${spot.slug}`} className="block">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition line-clamp-1">
                          {spot.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {spot.description}
                      </p>
                    </div>

                    {/* Features Strip */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {spot.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {t.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="p-5 pt-0 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <Link
                      to={`/biz/${spot.slug}`}
                      className="flex-1 py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-center text-xs font-bold transition"
                    >
                      View Details
                    </Link>
                    {spot.phone && (
                      <a
                        href={`tel:${spot.phone}`}
                        className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition"
                        title="Call Host"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Home className="h-8 w-8 text-cyan-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching housing options</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your AC, meals, or locality filters to discover available stays.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};
