import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Award,
  Sparkles,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Code2,
  Globe2,
  ChevronDown,
  Layers,
  ArrowRight,
  BookOpen,
  Share2,
  HelpCircle,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '../components/opportunities/OpportunityDetailModal';
import { opportunityService } from '../services/opportunity.service';
import { Opportunity, OpportunityType, OpportunityStatus } from '../types';
import { ROUTES } from '../constants/routes';

const CATEGORY_TABS: Array<{ label: string; value: string; icon: any }> = [
  { label: 'All Opportunities', value: 'All', icon: Layers },
  { label: 'Hackathons', value: 'Hackathon', icon: Code2 },
  { label: 'Scholarships', value: 'Scholarship', icon: GraduationCap },
  { label: 'Fellowships', value: 'Fellowship', icon: Award },
  { label: 'Research', value: 'Research Program', icon: Compass },
  { label: 'Coding', value: 'Coding Competition', icon: Code2 },
  { label: 'Open Source', value: 'Open Source', icon: Globe2 },
  { label: 'Entrepreneurship', value: 'Entrepreneurship', icon: Sparkles },
  { label: 'Developer Programs', value: 'Developer Program', icon: Briefcase },
  { label: 'Conferences', value: 'Student Conference', icon: Calendar },
];

const FAQS = [
  {
    q: 'How does SpotPicks verify opportunity deadlines and links?',
    a: 'Every opportunity is validated directly against the primary host portal (e.g. Google, MIT, Reliance Foundation, AICTE). When an application date is explicitly stated by the organization, it is entered as a verified deadline; otherwise, it is explicitly flagged as "Deadline: Check official website" to prevent misleading applicants.',
  },
  {
    q: 'Are all listed scholarships and fellowships free to apply?',
    a: 'Yes. SpotPicks strictly curates legitimate academic, corporate, and government initiatives with zero application fee. Never pay any fee for applying to scholarships, open-source mentorships, or student fellowships.',
  },
  {
    q: 'How can I prepare for open-source programs like GSoC and LFX Mentorship?',
    a: 'Start early by familiarizing yourself with Git/GitHub, joining the organization’s mailing list or Slack/Discord server, fixing beginner-friendly issues tagged "good first issue", and authoring a well-scoped project proposal following the organization’s official template.',
  },
  {
    q: 'Can students outside Delhi apply for these opportunities?',
    a: 'Absolutely. The vast majority of listed programs (GSoC, MLH, Mitacs, Imagine Cup, ETHGlobal) are global or national programs open to all verified college students across India and worldwide.',
  },
];

export const StudentOpportunitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [thisWeekOpportunities, setThisWeekOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Modal selection
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load opportunities
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [oppsRes, thisWeekRes] = await Promise.all([
          opportunityService.getOpportunities({
            opportunityType: selectedType !== 'All' ? selectedType : undefined,
            status: selectedStatus !== 'All' ? selectedStatus : undefined,
            search: searchQuery.trim() || undefined,
            sort: sortBy,
          }),
          opportunityService.getThisWeek(),
        ]);

        if (isMounted) {
          setOpportunities(oppsRes.opportunities);
          setThisWeekOpportunities(thisWeekRes);

          // If query param 'opp' exists, auto-open modal
          const oppSlug = searchParams.get('opp');
          if (oppSlug) {
            const found = oppsRes.opportunities.find((o) => o.slug === oppSlug);
            if (found) {
              setSelectedOpportunity(found);
              setIsModalOpen(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedType, selectedStatus, searchQuery, sortBy, searchParams]);

  // Update URL search parameters when filters change
  const handleTypeChange = (typeVal: string) => {
    setSelectedType(typeVal);
    const newParams = new URLSearchParams(searchParams);
    if (typeVal !== 'All') newParams.set('type', typeVal);
    else newParams.delete('type');
    setSearchParams(newParams);
  };

  const handleStatusChange = (statusVal: string) => {
    setSelectedStatus(statusVal);
    const newParams = new URLSearchParams(searchParams);
    if (statusVal !== 'All') newParams.set('status', statusVal);
    else newParams.delete('status');
    setSearchParams(newParams);
  };

  const handleOpenDetail = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setIsModalOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('opp', opp.slug);
    setSearchParams(newParams);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('opp');
    setSearchParams(newParams);
  };

  const openOpportunitiesCount = useMemo(() => {
    return opportunities.filter((o) => o.status === 'Open').length;
  }, [opportunities]);

  // Inject JSON-LD Schema
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          name: 'Student Opportunities Hub - Scholarships, Hackathons & Fellowships',
          description:
            'A verified directory of premier student opportunities including scholarships, hackathons, coding competitions, research programs, and open source fellowships.',
          url: 'https://spotpicks.delhi/student-opportunities',
          numberOfItems: opportunities.length,
          itemListElement: opportunities.map((opp, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: opp.name,
            url: opp.officialApplicationLink,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://spotpicks.delhi/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Student Opportunities Hub',
              item: 'https://spotpicks.delhi/student-opportunities',
            },
          ],
        },
      ],
    };

    const scriptId = 'opportunities-hub-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLd);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [opportunities]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-16 px-4 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <Container size="xl" className="relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SpotPicks Verified Student Opportunities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Student Opportunities <span className="text-rose-400">Hub</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore authentic scholarships, premier hackathons, coding competitions, fully-funded research internships, open-source fellowships, and developer grants.
            </p>

            {/* Search Input Box */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-700/50">
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by program name, organization, eligibility, skill (e.g. Google, Python, AICTE)..."
                  className="w-full px-3 py-2.5 text-sm text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{openOpportunitiesCount} Open Opportunities</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <Award className="h-4 w-4 text-amber-400" />
                <span>100% Verified Official Links</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <span>Zero Application Fees</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* "This Week's Opportunities" Spotlight */}
      {thisWeekOpportunities.length > 0 && selectedType === 'All' && !searchQuery && (
        <section className="pt-10 pb-6">
          <Container size="xl">
            <div className="rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-rose-900/40 relative overflow-hidden mb-8">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold uppercase tracking-wider">
                      Closing Soon / Spotlight
                    </span>
                    <span className="text-xs text-slate-400">• High Priority</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    This Week's Opportunities
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    High-impact student initiatives with active registration cycles or closing soon deadlines.
                  </p>
                </div>
              </div>

              {/* Grid of This Week items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {thisWeekOpportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id || opp._id || opp.slug}
                    className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-rose-300">
                          {opp.opportunityType}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                          {opp.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug line-clamp-1 mb-1">
                        {opp.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                        {opp.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-300">
                        {opp.isDeadlineVerified && opp.deadline
                          ? `Deadline: ${new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : 'Check website'}
                      </span>
                      <a
                        href={opp.officialApplicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Main Browse & Filters Section */}
      <section className="pt-6">
        <Container size="xl">
          {/* Category Tabs Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedType === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls Bar: Status Filter & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-200 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Status:
              </span>
              {['All', 'Open', 'Upcoming', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'All' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer shadow-xs"
              >
                <option value="recommended">Recommended & Featured</option>
                <option value="deadline">Application Deadline (Earliest)</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Opportunity Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 border border-slate-200 space-y-4 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-200 rounded-sm w-1/3" />
                      <div className="h-4 bg-slate-200 rounded-sm w-3/4" />
                    </div>
                  </div>
                  <div className="h-16 bg-slate-100 rounded-xl" />
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No opportunities found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                We couldn't find any opportunities matching your current search or filter combination.
              </p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                  setSearchParams(new URLSearchParams());
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id || opp._id || opp.slug}
                  opportunity={opp}
                  onSelect={handleOpenDetail}
                  onShare={handleOpenDetail}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Editorial Student Hub Playbook & Cross-Links */}
      <section className="pt-16">
        <Container size="xl">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-3">
                <BookOpen className="h-3.5 w-3.5 text-rose-500" />
                <span>SpotPicks Student Academic & Career Playbook</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recommended Student Guides & Intelligence
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                Explore our editorial guides designed to help you prepare your applications, discover free dev tools, master AI workflows, and land top internships.
              </p>
            </div>

            {/* Editorial Guides Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/articles/best-places-to-find-internships-college-students"
                className="group rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-2">
                    Career Intelligence
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors mb-2 leading-snug">
                    Best Places to Find Internships & Jobs
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    Curated platforms for Software, Data Science, AI/ML, YC Startups, Remote, GSoC, and Mitacs.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                to="/articles/best-ai-tools-for-college-students-2026"
                className="group rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-2">
                    AI & Productivity
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                    20 AI Tools Every Student Should Know
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    Verified AI tools for studying, coding, research, writing, note-taking, and resume building.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                to="/articles/25-free-websites-every-college-student-should-know"
                className="group rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">
                    Academic Directory
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2 leading-snug">
                    25 Free Websites Every Student Should Know
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    Free developer credits, academic papers, books, datasets, and design assets.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                to="/articles/top-10-github-repositories-every-student-should-star"
                className="group rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-2">
                    Developer Assets
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2 leading-snug">
                    Top 10 GitHub Repositories to Star
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    Open-source computer science curricula, coding interview roadmaps, and free developer packs.
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>

            {/* FAQ Accordion Section */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-5 w-5 text-rose-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Detail Modal Component */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};
