import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Code2,
  Terminal,
  Cpu,
  GraduationCap,
  BookOpen,
  Compass,
  ArrowRight,
  Info,
  Clock,
  Flame,
  Check,
  Globe,
  Share,
  MessageCircle,
  Linkedin,
  Twitter,
  Award,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  Zap,
  Bookmark,
  AlertTriangle,
  Send,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Lightbulb,
} from 'lucide-react';
import {
  INTERNSHIP_PLATFORMS_LIST,
  APPLICATION_MISTAKES,
  APPLICATION_PLAYBOOK,
  INTERNSHIP_FAQS,
  LAST_VERIFIED_DATE,
  InternshipPlatform,
  InternshipCategory,
  OpportunityLocation,
} from '../../data/internshipsData';
import { Link } from 'react-router-dom';

export const InternshipPlatformsEditorialGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTabSection, setActiveTabSection] = useState<'directory' | 'playbook' | 'mistakes'>('directory');

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Software Engineering', label: 'Software Engineering' },
    { id: 'Data Science & AI/ML', label: 'Data Science & AI/ML' },
    { id: 'Startup Jobs', label: 'Startup Roles' },
    { id: 'Open-Source Programs', label: 'Open Source Fellowships' },
    { id: 'Research & Fellowships', label: 'Research & Ivy Labs' },
    { id: 'Government & Public Sector', label: 'Government & PSUs' },
    { id: 'Remote Internships', label: 'Remote Portals' },
    { id: 'Freelancing & Contract', label: 'Freelancing' },
  ];

  const tracks: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'All Tracks', icon: <Layers className="h-3.5 w-3.5" /> },
    { id: 'beginners', label: '1. Beginners', icon: <GraduationCap className="h-3.5 w-3.5 text-emerald-600" /> },
    { id: 'software', label: '2. Software Devs', icon: <Code2 className="h-3.5 w-3.5 text-indigo-600" /> },
    { id: 'aiml', label: '3. AI & Data Science', icon: <Cpu className="h-3.5 w-3.5 text-purple-600" /> },
    { id: 'remote', label: '4. Remote Jobs', icon: <Globe className="h-3.5 w-3.5 text-sky-600" /> },
    { id: 'research', label: '5. Academic Research', icon: <BookOpen className="h-3.5 w-3.5 text-amber-600" /> },
    { id: 'opensource', label: '6. Open Source', icon: <Terminal className="h-3.5 w-3.5 text-rose-600" /> },
    { id: 'government', label: '7. Government', icon: <Building2 className="h-3.5 w-3.5 text-orange-600" /> },
  ];

  const locations: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Locations' },
    { id: 'Remote', label: 'Remote / Global' },
    { id: 'On-site', label: 'On-site / Lab' },
    { id: 'India / Global', label: 'India / Hybrid' },
  ];

  const filteredPlatforms = useMemo(() => {
    return INTERNSHIP_PLATFORMS_LIST.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedTrack !== 'ALL' && item.primaryTrack !== selectedTrack) {
        return false;
      }
      if (selectedLocation !== 'ALL') {
        if (selectedLocation === 'Remote' && !item.locationType.includes('Remote')) return false;
        if (selectedLocation === 'On-site' && item.locationType !== 'On-site') return false;
        if (selectedLocation === 'India / Global' && !item.locationType.includes('India')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.suitableFor.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.importantTips.some((tip) => tip.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedTrack, selectedLocation, searchQuery]);

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://spotpicks.delhi/articles/best-internship-websites-for-college-students';
  const shareTitle =
    'Best Places to Find Internships & Jobs for College Students | SpotPicks Career Intelligence';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${shareTitle}\n\nRead here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${shareTitle}\n`);
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=Internships,StudentJobs,TechCareers,Coding`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-12">
      {/* Editorial Hero Header Box */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              SpotPicks Career Intelligence
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Last Verified: {LAST_VERIFIED_DATE}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Zero Fake Openings • Official Platforms Only
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Best Places to Find Internships & Jobs for College Students
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Tired of sending hundreds of resumes into automated job board black holes? We tested and
            cataloged the <strong>most reliable, high-yield platforms</strong> for Software Engineering,
            Data Science & AI, Remote Work, Funded Research Fellowships, Government Portals, and
            Open-Source Mentorships.
          </p>

          {/* Nav Tabs between Directory, Playbook, and Mistakes */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTabSection('directory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTabSection === 'directory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Platform Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSection('playbook')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTabSection === 'playbook'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>How to Apply Effectively</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabSection('mistakes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTabSection === 'mistakes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
              <span>Common Application Mistakes</span>
            </button>
          </div>

          {/* Social Share Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              Share this career directory with your college batch & clubs:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Share on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="px-3 py-1.5 rounded-xl bg-sky-700/90 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={handleShareTwitter}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
                title="Share on X / Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
                <span>X / Twitter</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/15"
                title="Copy Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Tracks Quick Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span>Curated Career Tracks (Select Your Focus Area)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Click any track to instantly filter top-tier platforms optimized for your specific career stage
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {tracks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTrack(t.id);
                setActiveTabSection('directory');
              }}
              className={`p-3 rounded-2xl text-left flex flex-col justify-between space-y-2 transition cursor-pointer border text-xs font-bold ${
                selectedTrack === t.id
                  ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                {t.icon}
                {selectedTrack === t.id && (
                  <Check className="h-3 w-3 text-indigo-600 shrink-0" />
                )}
              </div>
              <span className="text-[11px] leading-tight line-clamp-2">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Section Conditional Display */}
      {activeTabSection === 'playbook' ? (
        /* How to Apply Effectively Playbook */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-3 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/20">
              <Target className="h-3.5 w-3.5" />
              Strategic Career Playbook
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How to Apply Effectively: The 4-Stage Student Framework
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              Applying to 500 companies with a generic resume yields an interview rate under 1%. Follow this 4-step proof-of-work strategy utilized by students landing top startup and FAANG/MNC roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APPLICATION_PLAYBOOK.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-indigo-600/30">
                      {step.stepNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                      Stage {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{step.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Action Checklist:
                  </span>
                  <ul className="space-y-1.5">
                    {step.actionItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 font-medium flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTabSection('directory')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <span>Explore The Platform Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : activeTabSection === 'mistakes' ? (
        /* Common Application Mistakes */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-3 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              Pitfalls & Anti-Patterns
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              5 Common Application Mistakes (And How to Fix Them)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              Most rejected applications fail due to easily fixable execution errors rather than a lack of intelligence. Avoid these 5 common traps to immediately stand out.
            </p>
          </div>

          <div className="space-y-4">
            {APPLICATION_MISTAKES.map((mistake) => (
              <div
                key={mistake.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{mistake.title}</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                    <span className="text-[11px] font-black text-rose-800 uppercase tracking-wider block">
                      The Common Mistake & Why It Fails:
                    </span>
                    <p className="text-xs text-rose-950 font-medium leading-relaxed">
                      {mistake.mistake}
                    </p>
                    <p className="text-xs text-rose-700 leading-relaxed pt-1">
                      <em>Impact:</em> {mistake.whyItHurts}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      The High-Conversion Fix:
                    </span>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      {mistake.recommendedFix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveTabSection('directory')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition"
            >
              <span>Back to Platforms Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Standard Platform Directory View */
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-indigo-600" />
                  <span>Filter Opportunity Platforms</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredPlatforms.length} of {INTERNSHIP_PLATFORMS_LIST.length} curated official platforms
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search (e.g., GSoC, AICTE, Startups, ML)..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Domain:
              </span>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Location Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Work Mode:
              </span>
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedLocation(loc.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLocation === loc.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlatforms.map((platform) => {
              const isEasy = platform.difficulty === 'Beginner Friendly';
              const isModerate = platform.difficulty === 'Moderate';
              const isCompetitive = platform.difficulty === 'Competitive';

              return (
                <article
                  key={platform.id}
                  id={`platform-${platform.id}`}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
                >
                  {/* Card Header Badges */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Badge */}
                        <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                          {platform.category}
                        </span>

                        {/* Location Type */}
                        <span className="px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {platform.locationType}
                        </span>

                        {/* Difficulty */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            isEasy
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isModerate
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : isCompetitive
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {platform.difficulty}
                        </span>
                      </div>

                      {/* Recommended Badge */}
                      {platform.isRecommended && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-600" />
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Platform Title & Link Button */}
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {platform.name}
                      </h3>

                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                        title={`Visit official ${platform.name} portal`}
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {/* Compensation & Suitable For */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                        {platform.compensationStatus}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {platform.shortDescription}
                    </p>

                    {/* Who it is suitable for */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        Best Suited For:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {platform.suitableFor}
                      </p>
                    </div>

                    {/* Actionable Tips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        Important Application Tips:
                      </span>
                      <ul className="space-y-1">
                        {platform.importantTips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5"
                          >
                            <span className="text-indigo-500 font-bold shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tag Chips */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    {platform.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* SpotPicks Verified Quality & Transparency Box */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">
            SpotPicks Integrity Guarantee: No Paid Job Postings or Fabricated Listings
          </strong>
          <p>
            SpotPicks provides honest, verified reviews of platform ecosystems rather than generating
            fake job vacancies. Every link points directly to the official platform homepage or student
            intake system. We never accept payment from employers to promote fraudulent listings.
            Always confirm active hiring deadlines on the respective official portal.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student Internship & Job Search FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {INTERNSHIP_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100/80 transition cursor-pointer font-bold text-slate-900 text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed bg-white border-t border-slate-100 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal Cross-Linking Hub */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
            <Compass className="h-3.5 w-3.5" />
            Related Guides for College Students & Engineers
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Level Up Your Technical Skills & College Experience
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Explore our curated student toolkits, open-source masterclasses, and local campus hubs across Delhi NCR and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/articles/free-websites-every-college-student-should-know"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Student Toolkit
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                25 Free Websites Every College Student Should Know
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Coding sandboxes, free GPUs, ATS resume builders, and academic research papers.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
              <span>Read Directory</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/articles/top-10-github-repositories-every-student-should-know"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                GitHub Masterclass
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                Top 10 GitHub Repositories for CS Students
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                OSSU CS, System Design Primer, TheAlgorithms, and ML for Beginners.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Explore Repos</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/students"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                SpotPicks Student Hub
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                Delhi NCR Student Discounts & College Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Affordable student food, laptop-friendly study cafes, and campus hangouts.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Visit Hub</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
