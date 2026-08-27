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
  Star,
  Compass,
  Users,
  Award,
} from 'lucide-react';
import { discoveryService } from '../services/discoveryService';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { Business } from '../types';

export const CityDiscoveryPage: React.FC = () => {
  const { stateSlug, citySlug } = useParams<{ stateSlug: string; citySlug: string }>();
  const navigate = useNavigate();
  const [cityData, setCityData] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Waitlist State
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistRole, setWaitlistRole] = useState('EXPLORER');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  useEffect(() => {
    if (stateSlug && citySlug) {
      loadCity(stateSlug, citySlug);
    }
  }, [stateSlug, citySlug]);

  const loadCity = async (state: string, city: string) => {
    setLoading(true);
    try {
      const res = await discoveryService.getCityBySlug(state, city);
      if (res && res.data) {
        setCityData(res.data);

        // If city is active or has businesses, fetch live businesses
        if (res.data.status === 'ACTIVE' || city === 'delhi') {
          const bizRes = await discoveryService.getBusinesses({
            city: res.data.name,
            limit: 12,
          });
          if (bizRes && bizRes.data) {
            setBusinesses(bizRes.data);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load city details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !cityData) return;
    navigate(`/search?q=${encodeURIComponent(`${searchQuery.trim()} in ${cityData.name}`)}`);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityData || !waitlistEmail) return;

    setSubmittingWaitlist(true);
    try {
      await discoveryService.joinCityWaitlist({
        citySlug: cityData.slug,
        email: waitlistEmail,
        name: waitlistName,
        role: waitlistRole,
      });
      setWaitlistSubmitted(true);
    } catch (err) {
      console.error('Failed to submit waitlist:', err);
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading City Hub...</p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">City Hub Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            The city '{citySlug}' under '{stateSlug}' could not be located in our geographic database.
          </p>
          <Link
            to="/india"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse India Expansion Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLive = cityData.status === 'ACTIVE';

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
            <Link to={`/india/${stateSlug}`} className="hover:text-slate-900 transition capitalize">
              {stateSlug?.replace(/-/g, ' ')}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{cityData.name}</span>
          </nav>
        </div>
      </div>

      {/* City Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <Link
              to={`/india/${stateSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to State Overview</span>
            </Link>

            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ACTIVE REGISTRY • VERIFIED SPOTS LIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                CITY EXPANSION IN PROGRESS • EARLY ACCESS WAITLIST
              </span>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {cityData.name}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {cityData.description || `Discover curated spots, verified student housing, artisanal cafes, and neighborhood gems in ${cityData.name}.`}
            </p>
          </div>

          {/* Search bar inside this city */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl">
            <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-xl">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search cafes, momos, or PGs in ${cityData.name}...`}
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

          {/* City Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">State:</span>
              <div className="text-base font-bold text-white mt-0.5">{cityData.state || stateSlug}</div>
            </div>
            <div>
              <span className="text-slate-400">Mapped Localities:</span>
              <div className="text-base font-bold text-indigo-400 mt-0.5">{cityData.localities?.length || 0} Key Hubs</div>
            </div>
            <div>
              <span className="text-slate-400">Readiness Score:</span>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{cityData.readinessScore || 100}%</div>
            </div>
            <div>
              <span className="text-slate-400">Waitlist Explorers:</span>
              <div className="text-base font-bold text-amber-400 mt-0.5">{cityData.waitlistCount || 120}+ registered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main City Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Localities & Neighborhood Micro-Hubs */}
        <section className="mb-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Localities & Neighborhoods in {cityData.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore micro-district hubs and community centers</p>
            </div>
          </div>

          {cityData.localities && cityData.localities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cityData.localities.map((loc: any) => (
                <Link
                  key={loc.slug}
                  to={`/location/${loc.slug}`}
                  className="bg-slate-50 hover:bg-indigo-50/50 p-3.5 rounded-xl border border-slate-200 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between">
                      <span>{loc.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide mt-1 block">
                      {loc.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-4">
              Localities for {cityData.name} are currently being mapped in our 6-level taxonomy.
            </div>
          )}
        </section>

        {/* If Active City (Delhi NCR): Display Live Curated Listings */}
        {isLive ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verified Spots in {cityData.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Top rated cafes, eateries, housing, and local services</p>
              </div>
              <Link
                to={`/search?city=${encodeURIComponent(cityData.name)}`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All Spots</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {businesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((biz) => (
                  <BusinessCard key={biz._id} business={biz} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800">No Listings in {cityData.name} Yet</h3>
                <p className="text-xs text-slate-500 mt-1">Be the first to list or scout a verified spot in this city.</p>
              </div>
            )}
          </section>
        ) : (
          /* If Expansion City (Mumbai, Bangalore, etc.): Display City Expansion Hub & Waitlist */
          <section className="space-y-8">
            {/* Expansion Card Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>SpotPicks Expansion Wave</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  SpotPicks is Coming to {cityData.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We are building an authentic, verified local index for {cityData.name}. No fake automated listings — every cafe, dining spot, and PG is curated by local scouts.
                </p>
              </div>

              {/* Waitlist Form */}
              <div className="mt-6 bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/15 max-w-xl">
                <h3 className="text-sm font-bold text-white mb-1">Join the Early Access Priority List</h3>
                <p className="text-xs text-slate-300 mb-4">Get first access to curated maps, secret spots, and launch perks.</p>

                {waitlistSubmitted ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>You're registered for {cityData.name} early access! We'll notify you soon.</span>
                  </div>
                ) : (
                  <form onSubmit={handleJoinWaitlist} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="email"
                          required
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          placeholder="Your email address *"
                          className="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={waitlistName}
                          onChange={(e) => setWaitlistName(e.target.value)}
                          placeholder="Your Name (Optional)"
                          className="w-full px-3 py-2 text-xs bg-white text-slate-900 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={waitlistRole}
                        onChange={(e) => setWaitlistRole(e.target.value)}
                        className="px-3 py-2 text-xs bg-white text-slate-900 rounded-lg focus:outline-none flex-1"
                      >
                        <option value="EXPLORER">City Explorer / Student</option>
                        <option value="BUSINESS_OWNER">Cafe / Business Owner in {cityData.name}</option>
                        <option value="COMMUNITY_SCOUT">Community Scout / Curator</option>
                      </select>

                      <button
                        type="submit"
                        disabled={submittingWaitlist}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shrink-0"
                      >
                        {submittingWaitlist ? 'Registering...' : 'Get Early Access'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Scout Nomination Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Community Verification Protocol</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Know an iconic spot in {cityData.name}?</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                SpotPicks prioritizes community-vetted recommendations. Tell us about your favorite cafe, quiet study nook, or hidden gem in {cityData.name}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/pricing"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                >
                  List a Business in {cityData.name}
                </Link>
                <Link
                  to="/india"
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  Explore Other States
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
