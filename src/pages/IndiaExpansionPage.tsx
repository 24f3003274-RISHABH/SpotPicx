import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Landmark,
  Trees,
  Mountain,
  Utensils,
  ExternalLink,
  Layers,
  Award,
  Globe2,
} from 'lucide-react';
import { getAllIndiaStates, getStatesByRegion } from '../data/india/allStatesRegistry';

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'North East', 'Union Territories'];

export const IndiaExpansionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allStates = useMemo(() => getAllIndiaStates(), []);

  const filteredStates = useMemo(() => {
    return allStates.filter((state) => {
      // Region filter
      if (selectedRegion === 'Union Territories') {
        if (state.type !== 'UT' && state.type !== 'UNION_TERRITORY') return false;
      } else if (selectedRegion !== 'All') {
        if (state.region !== selectedRegion && !(selectedRegion === 'North East' && state.region === 'Northeast')) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = state.name.toLowerCase().includes(q);
        const matchesCapital = state.capital.toLowerCase().includes(q);
        const matchesTagline = state.tagline?.toLowerCase().includes(q);
        const matchesPlaces = (state.topPlaces || []).some(
          (p) => p.name.toLowerCase().includes(q) || p.cityDistrict.toLowerCase().includes(q)
        );
        return matchesName || matchesCapital || matchesTagline || matchesPlaces;
      }

      return true;
    });
  }, [allStates, selectedRegion, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Find closest state match or redirect
    const match = allStates.find((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    if (match) {
      navigate(`/india/${match.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Grand Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80"
            alt="India Taj Mahal & Landscapes"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore India • All 28 States & 8 Union Territories</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <strong>Primary Local Hub:</strong>
                <Link to="/delhi" className="text-emerald-400 underline hover:text-emerald-300 ml-1">
                  Delhi NCR
                </Link>
              </span>
              <span className="text-slate-600">•</span>
              <span>100% Verified Editorial Facts</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            Discover Incredible India, State by State
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Detailed, factual discovery guides for every Indian state and union territory. Explore top heritage monuments, sacred shrines, nature reserves, hill stations, authentic local foods, and travel itineraries.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any state, monument, hill station (e.g. 'Uttarakhand', 'Konark', 'Gulmarg')..."
                className="w-full bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-200"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-6 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400">Total States:</span>
              <div className="text-xl font-bold text-white mt-0.5">28 States</div>
            </div>
            <div>
              <span className="text-slate-400">Union Territories:</span>
              <div className="text-xl font-bold text-indigo-400 mt-0.5">8 UTs</div>
            </div>
            <div>
              <span className="text-slate-400">Categories Per State:</span>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">15 Deep Guides</div>
            </div>
            <div>
              <span className="text-slate-400">Data Integrity:</span>
              <div className="text-xl font-bold text-amber-400 mt-0.5">100% Verified Sources</div>
            </div>
          </div>
        </div>
      </section>

      {/* Region Filter Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedRegion === region
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main States & UTs Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedRegion === 'All' ? 'All States & Union Territories' : `${selectedRegion} Region`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredStates.length} destinations with comprehensive 15-category travel guides
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => (
            <Link
              key={state.slug}
              to={`/india/${state.slug}`}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Hero Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={state.heroImage}
                    alt={state.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Region & Type Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm">
                    {state.region} • {state.type}
                  </span>

                  {/* State Name overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition">
                      {state.name}
                    </h3>
                    {state.tagline && (
                      <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{state.tagline}</p>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {state.overview}
                  </p>

                  {/* Highlights Pill */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Top Places:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(state.topPlaces || []).slice(0, 3).map((p, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700"
                        >
                          {p.name.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                <span>View Full 15-Category Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};
