import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  TrendingUp,
  Landmark,
  ExternalLink,
  Shield,
  Calendar,
  Share2,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { SEOHead } from '../../components/seo/SEOHead';
import { bricsApi } from '../../api/bricsApi';
import { BricsMember } from '../../types/brics.types';

export const BricsCountryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<BricsMember | null>(null);
  const [allMembers, setAllMembers] = useState<BricsMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMember = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const [memData, allData] = await Promise.all([
          bricsApi.getMemberBySlug(slug),
          bricsApi.getMembers(),
        ]);
        if (isMounted) {
          setMember(memData);
          setAllMembers(allData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Country record not found in BRICS database.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMember();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
        <p className="text-sm text-slate-600">Loading BRICS Country Profile...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Country Not Found</h2>
        <p className="text-xs text-slate-600">{error || 'Requested country does not exist.'}</p>
        <Link
          to="/brics"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to BRICS Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title={`${member.name} in BRICS | Strategic Role, Economic Scale & Membership Dossier`}
        description={`Comprehensive profile of ${member.name} (${member.officialName}) as a member of BRICS. Capital: ${member.capital}, Population: ${member.economicProfile.population}, GDP PPP Share: ${member.economicProfile.gdpPppShare}.`}
        canonicalUrl={`/brics/countries/${member.slug}`}
        ogType="article"
      />

      {/* Saffron/Navy Header Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600" />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <Container size="xl" className="flex items-center justify-between text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link to="/brics" className="hover:text-indigo-600 transition-colors">
              BRICS 2026 Hub
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate">{member.name}</span>
          </nav>

          <Link
            to="/brics"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Members</span>
          </Link>
        </Container>
      </div>

      <main className="mt-8">
        <Container size="xl" className="space-y-8">
          {/* Country Banner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-5xl" role="img" aria-label={member.name}>
                  {member.flagEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                      {member.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      {member.status === 'full_member' ? 'Full Member State' : 'Partner State'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {member.officialName} • Region: {member.region} • ISO: {member.isoCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Joined Year:</span>
                <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm">
                  {member.joinedYear}
                </span>
              </div>
            </div>

            {/* Economic Profile Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Capital City</span>
                <span className="text-base font-bold text-slate-900 block mt-1">{member.capital}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Population</span>
                <span className="text-base font-bold text-slate-900 block mt-1">
                  {member.economicProfile.population || 'N/A'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nominal GDP</span>
                <span className="text-base font-bold text-slate-900 block mt-1">
                  {member.economicProfile.gdpNominal || 'N/A'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">GDP (PPP) Global Share</span>
                <span className="text-base font-bold text-emerald-700 block mt-1">
                  {member.economicProfile.gdpPppShare || 'N/A'}
                </span>
              </div>
            </div>

            {/* Strategic Role & Description */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Strategic Geopolitical & Economic Role
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed mt-2">
                  {member.bricsRole}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  General Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {member.description}
                </p>
              </div>

              {/* Key Strategic Exports */}
              {member.economicProfile.keyExports && member.economicProfile.keyExports.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Key Commodities & Export Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.economicProfile.keyExports.map((exp, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Presidencies Held */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  BRICS Presidencies Held:
                </span>
                {member.presidenciesHeld && member.presidenciesHeld.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.presidenciesHeld.map((yr) => (
                      <span
                        key={yr}
                        className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-xs"
                      >
                        {yr} Summit
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Yet to hold rotating presidency (admitted in recent expansion waves).
                  </span>
                )}
              </div>

              {/* Official Citation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Verified Source: <strong>{member.sourceName}</strong></span>
                {member.officialSourceUrl && (
                  <a
                    href={member.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                  >
                    <span>View Official Government / Portal Record</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Browse Other Members */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Explore Other BRICS Member States
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {allMembers
                .filter((m) => m.slug !== member.slug)
                .map((m) => (
                  <Link
                    key={m.slug}
                    to={`/brics/countries/${m.slug}`}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-center space-y-1 block shadow-xs transition-colors"
                  >
                    <span className="text-2xl block">{m.flagEmoji}</span>
                    <span className="text-xs font-bold text-slate-900 block truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 block">{m.joinedYear}</span>
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};
