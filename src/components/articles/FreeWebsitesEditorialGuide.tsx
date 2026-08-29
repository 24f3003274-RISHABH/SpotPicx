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
} from 'lucide-react';
import {
  FREE_WEBSITES_LIST,
  EDITORIAL_FAQS,
  LAST_REVIEWED_DATE,
  FreeWebsiteItem,
  ResourceCategory,
  FreeStatus,
} from '../../data/freeWebsitesData';
import { Link } from 'react-router-dom';

export const FreeWebsitesEditorialGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Coding', label: 'Coding & Web' },
    { id: 'DSA', label: 'DSA & Algorithms' },
    { id: 'AI/ML', label: 'AI & Machine Learning' },
    { id: 'Computer Science', label: 'CS Fundamentals' },
    { id: 'Mathematics', label: 'Mathematics' },
    { id: 'English & Writing', label: 'English & Writing' },
    { id: 'Resume Building', label: 'Resume Building' },
    { id: 'Interview Prep', label: 'Interview Prep' },
    { id: 'Certifications', label: 'Free Certifications' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Research Papers', label: 'Research Papers' },
    { id: 'Student Packs & Perks', label: 'Student Packs' },
    { id: 'Internships & Careers', label: 'Internships' },
  ];

  const statuses: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Pricing' },
    { id: '100% Free', label: '100% Free' },
    { id: 'Free with Student ID', label: 'Free with Student ID' },
    { id: 'Free to Audit', label: 'Free to Audit' },
    { id: 'Freemium', label: 'Freemium' },
  ];

  const filteredWebsites = useMemo(() => {
    return FREE_WEBSITES_LIST.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'ALL' && item.freeStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.bestFor.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.whyStudentsShouldUse.toLowerCase().includes(q) ||
          item.keyFeatures.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedStatus, searchQuery]);

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://spotpicks.delhi/articles/free-websites-every-college-student-should-know';
  const shareTitle =
    '25 Free Websites Every College Student Should Know | SpotPicks Editorial Guide';

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
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=CollegeLife,Students,Coding,FreeTools`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-12">
      {/* Editorial Hero Header Box */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              SpotPicks Mega Editorial
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Last Reviewed: {LAST_REVIEWED_DATE}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
              100% Verified Official Links
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            25 Free Websites Every College Student Should Know
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            You do not need an expensive tuition fund or overpriced subscriptions to master computer
            science, build ATS-grade resumes, conduct academic research, or land dream internships. 
            We rigorously tested and cataloged <strong>25+ essential, verified free tools</strong> covering 
            coding, algorithms, AI/ML, mathematics, communications, scholarships, and career prep.
          </p>

          {/* Social Share Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              Share this essential toolkit with classmates & student groups:
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

      {/* Editor's Fast-Track Starter Kit */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Editor’s Top 3 "Day One" Student Recommendations
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Where Every First & Second Year Student Should Begin
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              If you only bookmark three websites today, activate your <strong>GitHub Student Pack</strong> (for $200k+ in free developer credits and GitHub Copilot), build your first ATS resume with <strong>Reactive Resume</strong> (100% free with zero paywalls), and master CS thinking with Harvard's <strong>CS50</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <a
              href="https://education.github.com/pack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
            >
              <span>GitHub Pack</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://rx-resume.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
            >
              <span>Reactive Resume</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://cs50.harvard.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition"
            >
              <span>CS50 Harvard</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-600" />
              <span>Explore Verified Resources by Domain & Pricing Model</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredWebsites.length} of {FREE_WEBSITES_LIST.length} curated official platforms
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g., LeetCode, Resume, Calculus, AI)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
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

        {/* Pricing / Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Pricing Type:
          </span>
          {statuses.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStatus(s.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === s.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWebsites.map((item, index) => {
          const isFree = item.freeStatus === '100% Free';
          const isStudentId = item.freeStatus === 'Free with Student ID';
          const isAudit = item.freeStatus === 'Free to Audit';

          return (
            <article
              key={item.id}
              id={`resource-${item.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              {/* Header Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category badge */}
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                      {item.category}
                    </span>

                    {/* Free Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                        isFree
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isStudentId
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : isAudit
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.freeStatus}
                    </span>

                    {/* Level */}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {item.audienceLevel}
                    </span>
                  </div>

                  {/* Editor's Pick Badge */}
                  {item.isEditorsPick && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-600" />
                      Editor's Pick
                    </span>
                  )}
                </div>

                {/* Name & Official Link */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {item.name}
                  </h3>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                    title={`Visit official ${item.name} website`}
                  >
                    <span>Visit Official Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* "Best For" Callout Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80">
                  <Award className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Best for: {item.bestFor}</span>
                </div>

                {/* Short Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.shortDescription}
                </p>

                {/* Why Students Should Use It */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Why College Students Should Use It:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.whyStudentsShouldUse}
                  </p>
                </div>

                {/* Pricing / Access Note */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item.statusDetails}</span>
                </div>
              </div>

              {/* Key Features Chips */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                {item.keyFeatures.map((feat) => (
                  <span
                    key={feat}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">
            SpotPicks Transparency & Zero-Affiliate Guarantee
          </strong>
          <p>
            All links on this page point directly to the official, verified homepage or educational portal
            of each provider. SpotPicks does not use paid referral links, deceptive trial redirects, or
            sponsored rankings. Pricing tiers, audit allowances, and student ID eligibility reflect active
            policies as of <strong>{LAST_REVIEWED_DATE}</strong>.
          </p>
        </div>
      </div>

      {/* FAQ Section (Included in UI and JSON-LD) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Everything You Need to Know About Free Student Resources
          </h2>
        </div>

        <div className="space-y-3">
          {EDITORIAL_FAQS.map((faq, index) => {
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
            More SpotPicks Curations for Students & Engineers
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Continue Your Technical & College Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Explore our companion masterclasses and student city guides designed for developers, researchers, and campus innovators in Delhi NCR and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/articles/top-10-github-repositories-every-student-should-know"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                GitHub Masterclass
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                Top 10 GitHub Repositories for CS Students
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                OSSU CS, System Design Primer, TheAlgorithms, and ML for Beginners with live stats.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">
              <span>Read Guide</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/students"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                SpotPicks Student Hub
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                Delhi NCR Student Discounts & College Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Curated affordable student bites, laptop-friendly libraries, and study spots near DU & IIT.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Visit Student Hub</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/explore"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Workspaces & Cafes
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                Top Delhi Tech & Study Cafes
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                High-speed WiFi, silent zones, and charging sockets in South Delhi and Connaught Place.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Explore Cafes</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
