import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe,
  Award,
  Calendar,
  Building2,
  HelpCircle,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Landmark,
  Shield,
  FileText,
  Share2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  MapPin,
  RefreshCw,
  Info,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { SEOHead } from '../../components/seo/SEOHead';
import { bricsApi } from '../../api/bricsApi';
import {
  BricsHubPayload,
  BricsMember,
  BricsSummit,
  BricsFact,
  BricsFaq,
  BricsInstitution,
} from '../../types/brics.types';

// Tab identifiers
type ActiveTab = 'overview' | 'members' | 'summits' | 'institutions' | 'facts' | 'faqs' | 'sources';

export const BricsHubPage: React.FC = () => {
  const location = useLocation();
  const [data, setData] = useState<BricsHubPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Search and filters
  const [memberFilter, setMemberFilter] = useState<'all' | 'founding' | 'expanded_2024' | 'expanded_2025' | 'partner'>('all');
  const [summitSearch, setSummitSearch] = useState('');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load payload on mount
  useEffect(() => {
    let isMounted = true;
    const loadHubData = async () => {
      try {
        setLoading(true);
        const hub = await bricsApi.getHubData();
        if (isMounted) {
          setData(hub);
          setError(null);
        }
      } catch (err: any) {
        console.error('Failed to load BRICS data:', err);
        if (isMounted) {
          setError('Failed to load BRICS data. Please refresh.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle URL hash or path for direct sub-navigation
  useEffect(() => {
    if (location.pathname.includes('/2026')) {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    if (!data?.members) return [];
    if (memberFilter === 'all') return data.members;
    if (memberFilter === 'founding') {
      return data.members.filter((m) => m.membershipType === 'founding' || m.membershipType === 'expanded_2011');
    }
    if (memberFilter === 'expanded_2024') {
      return data.members.filter((m) => m.membershipType === 'expanded_2024');
    }
    if (memberFilter === 'expanded_2025') {
      return data.members.filter((m) => m.membershipType === 'expanded_2025');
    }
    return data.members;
  }, [data?.members, memberFilter]);

  // Filtered summits
  const filteredSummits = useMemo(() => {
    if (!data?.summits) return [];
    if (!summitSearch.trim()) return data.summits;
    const q = summitSearch.toLowerCase();
    return data.summits.filter(
      (s) =>
        s.hostCity.toLowerCase().includes(q) ||
        s.hostCountry.toLowerCase().includes(q) ||
        s.theme.toLowerCase().includes(q) ||
        s.year.toString().includes(q) ||
        s.declarationName.toLowerCase().includes(q)
    );
  }, [data?.summits, summitSearch]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    if (!data?.faqs) return [];
    return data.faqs.filter((faq) => {
      const matchesCat = faqCategory === 'all' || faq.category === faqCategory;
      const matchesSearch =
        !faqSearch.trim() ||
        faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [data?.faqs, faqCategory, faqSearch]);

  // FAQ Categories list
  const faqCategories = useMemo(() => {
    if (!data?.faqs) return [];
    const set = new Set(data.faqs.map((f) => f.category));
    return Array.from(set);
  }, [data?.faqs]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Structured Data Schema for Google Search
  const jsonLdData = useMemo(() => {
    if (!data) return undefined;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'BRICS 2026 India Knowledge Hub: 18th Leaders Summit, Members & Strategic Architecture',
        description:
          'Authoritative reference guide to the 18th BRICS Leaders Summit under India Chairship in 2026, member nations, economic scale, NDB institution, and Global South multilateral cooperation.',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200',
        author: {
          '@type': 'Organization',
          name: 'SpotPicx Geopolitical & Public Affairs Desk',
          url: 'https://spotpicx.me',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SpotPicx',
          logo: {
            '@type': 'ImageObject',
            url: 'https://spotpicx.me/favicon.ico',
          },
        },
        datePublished: '2026-03-01T00:00:00+05:30',
        dateModified: data.meta.lastVerified || '2026-03-01T00:00:00+05:30',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (data.faqs || []).slice(0, 10).map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://spotpicx.me',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Knowledge Hubs',
            item: 'https://spotpicx.me/articles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'BRICS 2026 India',
            item: 'https://spotpicx.me/brics',
          },
        ],
      },
    ];
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEOHead
        title="BRICS 2026 India Knowledge Hub | 18th Leaders Summit, Members & Strategic Architecture"
        description="Comprehensive, verified knowledge hub on the 18th BRICS Summit hosted by India in 2026. Detailed data on 11 member nations, rotating presidencies, New Development Bank (NDB), and India’s leadership in the Global South."
        canonicalUrl="/brics"
        ogType="article"
        ogImage="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200"
        keywords={[
          'BRICS 2026',
          'BRICS 2026 India',
          '18th BRICS Summit New Delhi',
          'BRICS Member Countries',
          'BRICS Expansion 2024 2025',
          'New Development Bank NDB',
          'India BRICS Presidency 2026',
          'Global South Cooperation',
          'BRICS Currency and CRA',
        ]}
        jsonLd={jsonLdData}
      />

      {/* Diplomatic Saffron/White/Green Micro-Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <Container size="xl" className="flex items-center justify-between text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link to="/articles" className="hover:text-indigo-600 transition-colors">
              Editorial & Guides
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate">
              BRICS 2026 India Knowledge Hub
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Verified Official Data
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Copy share link"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </Container>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <Container size="xl" className="relative z-10">
          <div className="max-w-4xl space-y-6">
            {/* Summit Announcement Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>18th BRICS Leaders Summit</span>
              <span className="text-slate-400">•</span>
              <span>New Delhi, India</span>
              <span className="text-slate-400">•</span>
              <span>September 12–13, 2026 (Planned)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
              BRICS 2026 India <span className="text-amber-400">Knowledge Hub</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              The verified, data-driven authority on the 18th BRICS Leaders Summit under India’s 4th Chairship. Explore verified profiles of all 11 member states, 18-summit historical milestones, New Development Bank (NDB) architecture, the 4 strategic pillars, and India’s vision for an equitable multipolar order.
            </p>

            {/* Official Credentials Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-amber-400" />
                <span>Host: <strong>Government of India (MEA)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Chairship Cycle: <strong>January 1 – December 31, 2026</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Sources: <strong>UN, MEA, NDB, IMF WEO 2025</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/articles/brics-summit-2026-india"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-slate-950" />
                <span>Read Full 2026 Summit Guide</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://www.brics2026.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                <span>brics2026.gov.in</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <button
                onClick={() => setActiveTab('members')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-sm transition-colors cursor-pointer"
              >
                <Globe className="h-4 w-4 text-indigo-400" />
                <span>Browse 11 Members</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Global Economic Impact Bar */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <Container size="xl" className="py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-slate-950 font-serif">11</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Member States</span>
            </div>
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-amber-600 font-serif">36.7%</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Global GDP (PPP)</span>
            </div>
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-indigo-600 font-serif">45.2%</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">World Population</span>
            </div>
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-emerald-600 font-serif">43.5%</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Global Crude Oil</span>
            </div>
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-slate-900 font-serif">$100B</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">NDB Capital Base</span>
            </div>
            <div className="px-3 py-2 text-center">
              <span className="block text-2xl lg:text-3xl font-extrabold text-rose-600 font-serif">18th</span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Summit in New Delhi</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Knowledge Hub Navigation Tabs */}
      <section className="sticky top-14 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
        <Container size="xl">
          <div className="flex items-center space-x-1 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm font-medium">
            {[
              { id: 'overview', label: '2026 Spotlight & Pillars', icon: Award },
              { id: 'members', label: 'Member Nations (11)', icon: Globe },
              { id: 'summits', label: 'Summit Timeline (2009–2026)', icon: Calendar },
              { id: 'institutions', label: 'Institutions & NDB', icon: Landmark },
              { id: 'facts', label: 'Key Facts & Data', icon: TrendingUp },
              { id: 'faqs', label: 'Verified FAQs (18)', icon: HelpCircle },
              { id: 'sources', label: 'Official Sources', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <main className="mt-8">
        <Container size="xl">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-slate-600 text-sm">Loading BRICS 2026 Knowledge Hub...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-4 max-w-md mx-auto">
              <Info className="h-8 w-8 text-rose-500 mx-auto" />
              <p className="text-slate-800 font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & 2026 SPOTLIGHT */}
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  {/* Official 2026 Theme & Four Pillars */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Official India Chairship Framework
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-1">
                          Theme: {data?.meta.officialTheme || 'Building for Resilience, Innovation, Cooperation and Sustainability'}
                        </h2>
                        <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                          Anchored by the acronym <strong>B.R.I.C.S.</strong>, the 2026 Chairship prioritizes practical multilateral deliverables across four strategic pillars that bridge the Global South and international financial systems.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 max-w-xs space-y-1 text-xs">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-600" />
                          <span>Status: ANNOUNCED</span>
                        </div>
                        <p className="text-slate-600">
                          Adopted formally by India’s Ministry of External Affairs for ministerial tracks commencing January 2026.
                        </p>
                      </div>
                    </div>

                    {/* 4 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                      {(data?.pillars || []).map((pillar) => (
                        <div
                          key={pillar.letter}
                          className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 font-bold font-serif text-lg flex items-center justify-center">
                              {pillar.letter}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Pillar
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">{pillar.title}</h3>
                            <p className="text-xs font-medium text-amber-700">{pillar.tagline}</p>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                          <div className="pt-2 border-t border-slate-200/80">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Key Priorities:
                            </span>
                            <ul className="space-y-1 text-xs text-slate-600">
                              {pillar.focusAreas.map((f, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* India's Chairship Journey */}
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-950 rounded-2xl text-white p-6 sm:p-8 border border-slate-800 shadow-sm">
                    <div className="max-w-3xl space-y-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                        India’s Diplomatic Legacy
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                        India’s 4th Rotating Chairship (2012, 2016, 2021, 2026)
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        India has historically driven structural institutionalization in BRICS. During the 4th Summit in New Delhi (2012), Prime Minister Dr. Manmohan Singh first initiated the idea of a dedicated multilateral development bank, which matured into the New Development Bank at the 2014 Fortaleza Summit.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-amber-400 font-serif font-bold text-xl">2012 • 4th Summit</span>
                        <h4 className="font-semibold text-white text-sm mt-1">New Delhi</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Conception of New Development Bank (NDB) and CRA swap mechanism initiated.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-amber-400 font-serif font-bold text-xl">2016 • 8th Summit</span>
                        <h4 className="font-semibold text-white text-sm mt-1">Goa</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Theme: Building Responsive, Inclusive and Collective Solutions. Focus on counter-terrorism and BIMSTEC outreach.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-amber-400 font-serif font-bold text-xl">2021 • 13th Summit</span>
                        <h4 className="font-semibold text-white text-sm mt-1">Virtual (New Delhi)</h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Theme: BRICS@15: Intra-BRICS Cooperation for Continuity, Consolidation and Consensus.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-400/40">
                        <span className="text-amber-300 font-serif font-bold text-xl">2026 • 18th Summit</span>
                        <h4 className="font-semibold text-amber-200 text-sm mt-1">New Delhi (Bharat Mandapam)</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          First summit hosted by India with expanded 11-member framework and 10 partner nations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Curated Editorial Callout: Link to Flagship Article */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                          Flagship Deep-Dive
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          12-minute read • Comprehensive Policy Blueprint
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                        Read: 18th BRICS Summit 2026 India: Complete Guide, Member Countries, and Global South Architecture
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Detailed chapters covering geopolitical significance, de-dollarization debates, local currency settlement mechanisms, and India’s strategic balance between BRICS and Quad.
                      </p>
                    </div>

                    <Link
                      to="/articles/brics-summit-2026-india"
                      className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm whitespace-nowrap shadow-sm transition-colors flex items-center gap-2"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="h-4 w-4 text-amber-400" />
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 2: MEMBER NATIONS (11 FULL + 10 PARTNERS) */}
              {activeTab === 'members' && (
                <div className="space-y-8">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'all', label: 'All 11 Members' },
                        { id: 'founding', label: 'Founding Core (5)' },
                        { id: 'expanded_2024', label: '2024 Expansion (5)' },
                        { id: 'expanded_2025', label: '2025 Expansion (1)' },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => setMemberFilter(btn.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            memberFilter === btn.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500">
                      Showing <strong>{filteredMembers.length}</strong> of 11 full member countries
                    </div>
                  </div>

                  {/* Member Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.slug}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="p-6 space-y-4">
                          {/* Flag & Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl" role="img" aria-label={member.name}>
                                {member.flagEmoji}
                              </span>
                              <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                  {member.name}
                                </h3>
                                <span className="text-xs text-slate-500 font-medium">
                                  {member.officialName}
                                </span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                              Joined {member.joinedYear}
                            </span>
                          </div>

                          {/* Quick Facts Grid */}
                          <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Capital</span>
                              <span className="font-semibold text-slate-800">{member.capital}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Region</span>
                              <span className="font-semibold text-slate-800">{member.region}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Population</span>
                              <span className="font-semibold text-slate-800">
                                {member.economicProfile.population || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">GDP (PPP) Share</span>
                              <span className="font-semibold text-emerald-700">
                                {member.economicProfile.gdpPppShare || 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Role description */}
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {member.bricsRole}
                          </p>

                          {/* Key Exports */}
                          {member.economicProfile.keyExports && member.economicProfile.keyExports.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Strategic Exports:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {member.economicProfile.keyExports.map((exp, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                                  >
                                    {exp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer Link */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Presidencies: <strong>{member.presidenciesHeld.length}</strong>
                          </span>
                          <Link
                            to={`/brics/countries/${member.slug}`}
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            <span>Country Dossier</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Partner Countries Accordion / Showcase */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          Kazan 2024 Framework
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 font-serif">
                          10 Official BRICS Partner Countries
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                          In October 2024 at the 16th Kazan Summit, BRICS created a structured "Partner Country" modality granting participation in ministerial tracks, joint working groups, and summit sessions without voting rights.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                      {(data?.partnerCountries || []).map((partner) => (
                        <div
                          key={partner.name}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1"
                        >
                          <span className="text-xs font-bold text-slate-900 block">{partner.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium block">{partner.region}</span>
                          <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                            Partner
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SUMMIT TIMELINE (2009–2026) */}
              {activeTab === 'summits' && (
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={summitSearch}
                        onChange={(e) => setSummitSearch(e.target.value)}
                        placeholder="Search summit by city, year, theme..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      Showing {filteredSummits.length} of {data?.summits.length || 18} Summits
                    </span>
                  </div>

                  {/* Vertical Chronological Summit Timeline */}
                  <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {filteredSummits.map((summit) => {
                      const is2026 = summit.year === 2026;
                      return (
                        <div key={summit.summitNumber} className="relative group">
                          {/* Dot marker */}
                          <div
                            className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                              is2026
                                ? 'bg-amber-500 border-amber-600 text-slate-950 ring-4 ring-amber-100'
                                : 'bg-white border-slate-400 text-slate-700 group-hover:border-indigo-600'
                            }`}
                          >
                            {summit.summitNumber}
                          </div>

                          {/* Summit Content Card */}
                          <div
                            className={`p-6 rounded-2xl border transition-all ${
                              is2026
                                ? 'bg-gradient-to-br from-amber-50/50 to-white border-amber-300 shadow-md ring-1 ring-amber-200'
                                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                                    {summit.summitNumber}th BRICS Summit • {summit.hostCity}, {summit.hostCountry}
                                  </span>
                                  {is2026 && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wide">
                                      Upcoming / Planned
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-500 font-medium">
                                  {summit.dates} • Presidency: {summit.presidencyCountry}
                                </span>
                              </div>

                              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 self-start sm:self-center">
                                {summit.year}
                              </span>
                            </div>

                            {/* Theme & Summary */}
                            <div className="mt-4 space-y-2 text-xs">
                              <div>
                                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                                  Official Theme:
                                </span>
                                <p className="font-semibold text-slate-900 text-sm">{summit.theme}</p>
                              </div>

                              <p className="text-slate-600 leading-relaxed text-xs pt-1">{summit.summary}</p>
                            </div>

                            {/* Key Outcomes */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-2">
                                Key Outcomes & Declarations:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                                {summit.keyOutcomes.map((outcome, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{outcome}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Declaration Link */}
                            {summit.declarationUrl && (
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  Outcome Document: <strong>{summit.declarationName}</strong>
                                </span>
                                <a
                                  href={summit.declarationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                  <span>View Official MEA/Portal Record</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: INSTITUTIONS & NDB */}
              {activeTab === 'institutions' && (
                <div className="space-y-8">
                  {/* Spotlight: New Development Bank (NDB) */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                          <Building2 className="h-3.5 w-3.5" />
                          <span>Flagship Multilateral Institution</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-2">
                          New Development Bank (NDB)
                        </h2>
                        <span className="text-xs text-slate-500 font-medium">
                          Headquarters: Shanghai, China • Established: 2014 (Fortaleza) • Operational: 2015
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1 text-center min-w-[180px]">
                        <span className="text-amber-400 font-bold font-serif text-2xl">$100 Billion</span>
                        <span className="block text-[11px] text-slate-300 uppercase tracking-wider">
                          Authorized Capital Base
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                      <div className="lg:col-span-2 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <p>
                          The New Development Bank was conceived during India’s 2012 Chairship in New Delhi to mobilize resources for infrastructure and sustainable development projects in BRICS and other emerging market economies.
                        </p>
                        <p>
                          Unlike traditional Bretton Woods institutions (IMF and World Bank) where voting shares are skewed by financial contributions, the NDB was founded on strict equality: each of the five original founding members held equal voting rights with equal $10B initial paid-in shares.
                        </p>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                            Key Operational Functions:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">✓</span>
                              <span>Financing clean energy, transport infrastructure, water sanitation, and digital connectivity.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">✓</span>
                              <span>Expanding local currency bond issuances (RMB, ZAR, INR) to insulate developing nations from FX volatility.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">✓</span>
                              <span>Non-BRICS prospective members admitted: Bangladesh, UAE, Egypt, Uruguay, and Algeria.</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Fact sheet */}
                      <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
                        <h4 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
                          NDB Governance Profile
                        </h4>
                        <div className="space-y-2 divide-y divide-indigo-100/80">
                          <div className="pt-2">
                            <span className="text-slate-500 block text-[10px]">First President</span>
                            <span className="font-bold text-slate-900">K. V. Kamath (India, 2015–2020)</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block text-[10px]">Regional Centers</span>
                            <span className="font-bold text-slate-900">Johannesburg, São Paulo, GIFT City (India)</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block text-[10px]">Approved Portfolios</span>
                            <span className="font-bold text-slate-900">100+ Projects, $35B+ Approved</span>
                          </div>
                          <div className="pt-2">
                            <span className="text-slate-500 block text-[10px]">Official Portal</span>
                            <a
                              href="https://www.ndb.int"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                            >
                              <span>www.ndb.int</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other BRICS Institutional Mechanisms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(data?.institutions || []).map((inst) => (
                      <div
                        key={inst.slug}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                              {inst.acronym}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Est. {inst.yearEstablished}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight font-serif">
                            {inst.name}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {inst.purpose}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Key Operational Scope:
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {inst.significance}
                          </p>
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">HQ / Host: {inst.headquarters}</span>
                            {inst.officialSourceUrl && (
                              <a
                                href={inst.officialSourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                              >
                                <span>Official Link</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: FACTS & DATA CARDS */}
              {activeTab === 'facts' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                      Verified Data Points & Strategic Facts
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      Every data point below is sourced directly from multilateral datasets including IMF World Economic Outlook, United Nations Population Division, and official BRICS joint declarations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(data?.facts || []).map((fact) => (
                      <div
                        key={fact.key}
                        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                              {fact.category.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-slate-500 block">{fact.label}</span>
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-serif block mt-1">
                              {fact.value}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {fact.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 truncate max-w-[160px]">
                            Source: {fact.sourceName}
                          </span>
                          {fact.sourceUrl && (
                            <a
                              href={fact.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                            >
                              <span>Verify</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* "Did You Know?" Carousel/Grid */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                      <h3 className="text-xl font-bold text-slate-900 font-serif">
                        Did You Know? Curated Geopolitical Insights
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(data?.didYouKnow || []).map((item) => (
                        <div
                          key={item.id}
                          className="bg-white/90 backdrop-blur rounded-xl p-4 border border-amber-200/80 shadow-xs space-y-2"
                        >
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.fact}
                          </p>
                          <span className="text-[10px] text-amber-800 font-medium block pt-1 border-t border-amber-100">
                            Source: {item.source}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: VERIFIED FAQS (18 QUESTIONS) */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  {/* FAQ Header & Filter Controls */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-serif">
                          Frequently Asked Questions on BRICS & 2026 Summit
                        </h2>
                        <p className="text-xs text-slate-600 mt-1">
                          Objective, fact-checked answers addressing expansion, currency proposals, de-dollarization, and India’s strategic posture.
                        </p>
                      </div>

                      <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={faqSearch}
                          onChange={(e) => setFaqSearch(e.target.value)}
                          placeholder="Search questions..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setFaqCategory('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          faqCategory === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All Categories
                      </button>
                      {faqCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFaqCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            faqCategory === cat
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accordion List */}
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={faq.slug}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                              {faq.question}
                            </span>
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180 text-indigo-600' : ''
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 space-y-3 bg-slate-50/40">
                              <p>{faq.answer}</p>
                              {faq.sourceName && (
                                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                                  <span>Source: <strong>{faq.sourceName}</strong></span>
                                  {faq.sourceUrl && (
                                    <a
                                      href={faq.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                      <span>Official Reference</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: OFFICIAL SOURCES & REPOSITORY */}
              {activeTab === 'sources' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                      Primary Sources & Diplomatic Document Repository
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      All research and data points contained within the SpotPicx BRICS 2026 Knowledge Hub trace directly to official intergovernmental portals, multilateral bank treaties, and government communiqués.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(data?.sources || []).map((source) => (
                      <div
                        key={source.sourceUrl}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                              {source.sourceType}
                            </span>
                            {source.isPrimary && (
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Primary Source
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm">{source.sourceName}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{source.description}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-400">
                            Accessed: {source.accessedDate}
                          </span>
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Related SpotPicx Internal Guides & Directories */}
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">
              Explore Related SpotPicx Knowledge Portals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/articles/brics-summit-2026-india"
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-colors space-y-1 block shadow-xs"
              >
                <span className="text-[10px] font-bold text-amber-600 uppercase">Editorial Guide</span>
                <h4 className="font-bold text-slate-900 text-sm">18th BRICS Summit 2026 Guide</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Complete 3,000+ word strategic deep-dive into themes and global architecture.</p>
              </Link>
              <Link
                to="/delhi/heritage"
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-colors space-y-1 block shadow-xs"
              >
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Summit Host City</span>
                <h4 className="font-bold text-slate-900 text-sm">Delhi Heritage & Bharat Mandapam</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Explore the historical monuments and world-class summit venues of New Delhi.</p>
              </Link>
              <Link
                to="/books"
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-colors space-y-1 block shadow-xs"
              >
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Geopolitics & Economy</span>
                <h4 className="font-bold text-slate-900 text-sm">Books Discovery Catalog</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Curated reading paths on Indian foreign policy and international economics.</p>
              </Link>
              <Link
                to="/guides"
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 transition-colors space-y-1 block shadow-xs"
              >
                <span className="text-[10px] font-bold text-rose-600 uppercase">Curated Resources</span>
                <h4 className="font-bold text-slate-900 text-sm">Top 10 Guides Engine</h4>
                <p className="text-xs text-slate-500 line-clamp-2">Editorial directory of education, tech, student tools, and career pathways.</p>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};
