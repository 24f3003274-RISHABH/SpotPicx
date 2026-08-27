import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  Send,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { discoveryService } from '../services/discoveryService';

export const StateOverviewPage: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const navigate = useNavigate();
  const [stateData, setStateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  useEffect(() => {
    if (stateSlug) {
      loadState(stateSlug);
    }
  }, [stateSlug]);

  const loadState = async (slug: string) => {
    setLoading(true);
    try {
      const res = await discoveryService.getStateBySlug(slug);
      if (res && res.data) {
        setStateData(res.data);
      }
    } catch (err) {
      console.error('Failed to load state details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !stateData) return;
    navigate(`/search?q=${encodeURIComponent(`${searchQuery.trim()} in ${stateData.name}`)}`);
  };

  const handleJoinStateWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateData || !waitlistEmail) return;

    setSubmittingWaitlist(true);
    try {
      await discoveryService.joinCityWaitlist({
        citySlug: stateData.slug,
        email: waitlistEmail,
        name: 'State Explorer',
        role: 'EXPLORER',
      });
      setWaitlistSubmitted(true);
    } catch (err) {
      console.error('Failed to join state waitlist:', err);
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading State Hub...</p>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">State Region Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            The state slug '{stateSlug}' is not yet in our geographic registry.
          </p>
          <Link
            to="/india"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to India Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLive = stateData.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition">Home</Link>
            <span>/</span>
            <Link to="/india" className="hover:text-slate-900 transition">India</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{stateData.name}</span>
          </nav>
        </div>
      </div>

      {/* State Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link
              to="/india"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All States</span>
            </Link>

            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PRODUCTION REGION ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                EXPANSION REGION — READY IN SCHEMA
              </span>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {stateData.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {stateData.description || `Explore verified local businesses, dining spots, student housing, and neighborhood hubs in ${stateData.name}.`}
            </p>
          </div>

          {/* Search bar within this state */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl">
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search spots, cafes, or stays in ${stateData.name}...`}
                className="w-full bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold text-xs transition shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Total Cities:</span>
              <div className="text-lg font-bold text-white mt-0.5">{stateData.totalCities || stateData.cities?.length || 0}</div>
            </div>
            <div>
              <span className="text-slate-400">Status:</span>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{stateData.status}</div>
            </div>
            <div>
              <span className="text-slate-400">Readiness Score:</span>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">{stateData.readinessScore || 100}%</div>
            </div>
            <div>
              <span className="text-slate-400">State Code:</span>
              <div className="text-lg font-bold text-slate-200 mt-0.5">{stateData.shortCode || stateData.slug.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Cities Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cities in {stateData.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Database-driven city nodes & locality hierarchies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateData.cities && stateData.cities.length > 0 ? (
            stateData.cities.map((city: any) => {
              const cityLive = city.status === 'ACTIVE';
              return (
                <div
                  key={city.slug}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    cityLive ? 'border-emerald-200' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{city.name}</h3>
                        <span className="text-[11px] font-medium text-slate-400">City in {stateData.name}</span>
                      </div>

                      {cityLive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          COMING SOON
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 mb-4 leading-relaxed">
                      {city.description || `Municipal discovery hub for ${city.name}, including verified dining, student spots, and key neighborhoods.`}
                    </p>

                    {!cityLive && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 font-medium">Readiness:</span>
                          <span className="font-bold text-indigo-600">{city.readinessScore || 30}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${city.readinessScore || 30}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/india/${stateData.slug}/${city.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    >
                      <span>Explore City Hub</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    {cityLive ? (
                      <Link
                        to={`/india/${stateData.slug}/${city.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                      >
                        Browse Spots
                      </Link>
                    ) : (
                      <Link
                        to={`/india/${stateData.slug}/${city.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
                      >
                        Join Waitlist
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700">No Municipal Cities Registered Yet</h4>
              <p className="text-xs text-slate-400 mt-1">This state region is in active schema onboarding.</p>
            </div>
          )}
        </div>

        {/* State Early Access Opt-in */}
        {!isLive && (
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expansion Community Wave</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Want SpotPicks in {stateData.name} sooner?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Join our early curator & scout network for {stateData.name}. We prioritize city launches based on verified community demand and local scout nominations.
              </p>
            </div>

            {waitlistSubmitted ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You're on the early access priority list for {stateData.name}!</span>
              </div>
            ) : (
              <form onSubmit={handleJoinStateWaitlist} className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                />
                <button
                  type="submit"
                  disabled={submittingWaitlist}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shrink-0"
                >
                  {submittingWaitlist ? 'Joining...' : 'Notify Me'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
