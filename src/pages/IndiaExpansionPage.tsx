import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Users,
  ShieldCheck,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { discoveryService } from '../services/discoveryService';

export const IndiaExpansionPage: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMING_SOON'>('ALL');
  
  // Waitlist Modal State
  const [waitlistModalCity, setWaitlistModalCity] = useState<any>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('EXPLORER');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await discoveryService.getIndiaOverview();
      if (res && res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      console.error('Failed to load India overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistModalCity || !waitlistEmail) return;

    setSubmittingWaitlist(true);
    try {
      await discoveryService.joinCityWaitlist({
        citySlug: waitlistModalCity.slug,
        email: waitlistEmail,
        name: waitlistName,
        role: waitlistRole,
      });
      setWaitlistSuccess(true);
      setTimeout(() => {
        setWaitlistModalCity(null);
        setWaitlistSuccess(false);
        setWaitlistEmail('');
        setWaitlistName('');
        loadOverview();
      }, 2000);
    } catch (err) {
      console.error('Failed to submit waitlist:', err);
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  const filteredStates = overview?.states?.filter((state: any) => {
    if (activeTab === 'ACTIVE') return state.status === 'ACTIVE';
    if (activeTab === 'COMING_SOON') return state.status === 'COMING_SOON' || state.status === 'BETA';
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 21: India-Wide Scalability Engine</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <strong>Production Focus:</strong> Delhi NCR
              </span>
              <span className="text-slate-600">•</span>
              <span>13+ Expansion States Configured</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Discover Verified Local Spots Across India
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Database-driven discovery architected for India. Explore verified cafes, restaurants, housing, and services with 6-level geographic hierarchy.
          </p>

          {/* Search bar with India-wide intent support */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try: 'Best cafes in Mumbai', 'Best restaurants in Bangalore', 'PG near IIT Bombay'..."
                className="w-full bg-transparent px-3 py-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 flex items-center gap-1.5 shadow-md"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Quick Searches:</span>
              <button
                type="button"
                onClick={() => setSearchQuery('Best cafes in Mumbai')}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition"
              >
                Best cafes in Mumbai
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('Best restaurants in Bangalore')}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition"
              >
                Best restaurants in Bangalore
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('PG near IIT Bombay')}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition"
              >
                PG near IIT Bombay
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('Best street food in Kolkata')}
                className="bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-md transition"
              >
                Best street food in Kolkata
              </button>
            </div>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">{overview?.totalStates || 14}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">States Configured</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{overview?.activeStatesCount || 1} Live</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Production Region (Delhi NCR)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{overview?.comingSoonStatesCount || 13} Expansion</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Ready in Schema</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">{overview?.totalLocalities || 20}+ Localities</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Indexed & Mapped</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Level Geographic Hierarchy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>6-Level Database Geographic Architecture</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { level: '1. Country', name: 'India', desc: 'Root Country Entity' },
              { level: '2. State', name: '14+ States', desc: 'Delhi, MH, KA, TN, etc.' },
              { level: '3. District', name: 'Districts', desc: 'South Delhi, Mumbai Suburban' },
              { level: '4. City', name: 'Major Cities', desc: 'Delhi, Mumbai, Bangalore' },
              { level: '5. Locality', name: 'Key Localities', desc: 'Hauz Khas, Bandra, Koramangala' },
              { level: '6. Neighborhood', name: 'Micro-Zones', desc: 'HKV, Pali Hill, Sony Signal' },
            ].map((node, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-indigo-600">{node.level}</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{node.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">{node.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Expansion States Directory */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">States & Territorial Regions</h2>
            <p className="text-sm text-slate-500 mt-1">Browse verified spots in active regions or preview expansion readiness</p>
          </div>

          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All States ({overview?.states?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live ({overview?.activeStatesCount || 1})
            </button>
            <button
              onClick={() => setActiveTab('COMING_SOON')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'COMING_SOON' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expansion Wave ({overview?.comingSoonStatesCount || 0})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStates.map((state: any) => {
              const isLive = state.status === 'ACTIVE';
              return (
                <div
                  key={state.slug}
                  className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isLive ? 'border-emerald-200 ring-2 ring-emerald-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {state.shortCode || state.type}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{state.name}</h3>
                      </div>

                      {isLive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          LIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          COMING SOON
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-5">
                      {state.description || `State level geographic hub for ${state.name} with structured municipal subdivisions.`}
                    </p>

                    {/* Cities Preview */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Configured Cities ({state.cities?.length || 0})</span>
                        {isLive && <span className="text-emerald-600">50+ Verified Spots</span>}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {state.cities && state.cities.length > 0 ? (
                          state.cities.map((city: any) => (
                            <Link
                              key={city.slug}
                              to={`/india/${state.slug}/${city.slug}`}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                                city.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              <span>{city.name}</span>
                              {city.status === 'ACTIVE' ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              ) : (
                                <span className="text-[10px] text-slate-400">({city.readinessScore || 30}%)</span>
                              )}
                            </Link>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Cities being mapped</span>
                        )}
                      </div>
                    </div>

                    {/* Readiness Progress Bar for Non-Live States */}
                    {!isLive && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                          <span className="font-medium">Expansion Readiness:</span>
                          <span className="font-bold text-indigo-600">{state.readinessScore || 35}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${state.readinessScore || 35}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/india/${state.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    >
                      <span>Explore State Node</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    {!isLive ? (
                      <button
                        onClick={() => {
                          const primaryCity = state.cities?.[0] || { name: state.name, slug: state.slug };
                          setWaitlistModalCity(primaryCity);
                        }}
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Join Waitlist</span>
                      </button>
                    ) : (
                      <Link
                        to="/delhi"
                        className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        Open Live Registry
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Expansion Roadmap Section */}
        <section className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Structured Multi-Wave Rollout Plan</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">India Expansion Roadmap</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {overview?.expansionRoadmap?.map((item: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">{item.phase}</span>
                    {item.status === 'ACTIVE' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {item.target}
                      </span>
                    )}
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 mt-2">
                    {item.states.map((st: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Waitlist Modal */}
      {waitlistModalCity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Get Notified: {waitlistModalCity.name}</h4>
                  <p className="text-xs text-slate-500">Be first to access verified spots upon rollout</p>
                </div>
              </div>
              <button
                onClick={() => setWaitlistModalCity(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {waitlistSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h5 className="font-bold text-slate-900">You're on the early access list!</h5>
                <p className="text-xs text-slate-500 mt-1">We will notify you as soon as SpotPicks launches in {waitlistModalCity.name}.</p>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">I am a...</label>
                  <select
                    value={waitlistRole}
                    onChange={(e) => setWaitlistRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="EXPLORER">City Explorer / Student</option>
                    <option value="BUSINESS_OWNER">Local Cafe / Business Owner</option>
                    <option value="COMMUNITY_SCOUT">Community Scout / Curator</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingWaitlist}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
                  >
                    {submittingWaitlist ? 'Registering...' : `Join ${waitlistModalCity.name} Early Access`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
