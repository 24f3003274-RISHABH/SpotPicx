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
  Headphones,
  FileCode2,
  Presentation,
  PenTool,
  BrainCircuit,
  Database,
  Calculator,
  Layout,
  Table,
  CheckSquare,
} from 'lucide-react';
import {
  AI_TOOLS_LIST,
  AI_SPOTLIGHT_AWARDS,
  AI_TOOLS_FAQS,
  LAST_VERIFIED_DATE,
  AiTool,
  AiToolCategory,
  AiPricingModel,
} from '../../data/aiToolsData';
import { Link } from 'react-router-dom';

export const AiToolsEditorialGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPricing, setSelectedPricing] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'comparison'>('cards');

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'All AI Tools', icon: <Layers className="h-3.5 w-3.5" /> },
    { id: 'Studying', label: 'Studying', icon: <GraduationCap className="h-3.5 w-3.5 text-emerald-600" /> },
    { id: 'Coding', label: 'Coding', icon: <Code2 className="h-3.5 w-3.5 text-indigo-600" /> },
    { id: 'Research', label: 'Research', icon: <BookOpen className="h-3.5 w-3.5 text-purple-600" /> },
    { id: 'Writing', label: 'Writing', icon: <PenTool className="h-3.5 w-3.5 text-rose-600" /> },
    { id: 'Presentations', label: 'Presentations', icon: <Presentation className="h-3.5 w-3.5 text-amber-600" /> },
    { id: 'Note taking', label: 'Note Taking', icon: <Headphones className="h-3.5 w-3.5 text-teal-600" /> },
    { id: 'Productivity', label: 'Productivity', icon: <Zap className="h-3.5 w-3.5 text-sky-600" /> },
    { id: 'Resume/Career', label: 'Resume & Career', icon: <Briefcase className="h-3.5 w-3.5 text-blue-600" /> },
    { id: 'Design', label: 'Design', icon: <Layout className="h-3.5 w-3.5 text-pink-600" /> },
    { id: 'Data Analysis', label: 'Data Analysis', icon: <Calculator className="h-3.5 w-3.5 text-violet-600" /> },
  ];

  const pricingFilters: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Pricing' },
    { id: '100% Free', label: '100% Free' },
    { id: 'Freemium', label: 'Freemium (Free Tier)' },
    { id: 'Free with Student Discount', label: 'Free with Student ID' },
  ];

  const filteredTools = useMemo(() => {
    return AI_TOOLS_LIST.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedPricing !== 'ALL') {
        if (selectedPricing === '100% Free' && item.pricingModel !== '100% Free') return false;
        if (selectedPricing === 'Freemium' && item.pricingModel !== 'Freemium') return false;
        if (selectedPricing === 'Free with Student Discount' && item.pricingModel !== 'Free with Student Discount') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.whatItDoes.toLowerCase().includes(q) ||
          item.bestUseCase.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.practicalStudentUseCases.some((uc) => uc.toLowerCase().includes(q)) ||
          item.limitations.some((lim) => lim.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, selectedPricing, searchQuery]);

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://spotpicks.delhi/articles/best-ai-tools-for-college-students-2026';
  const shareTitle =
    '20 AI Tools Every College Student Should Know in 2026 | SpotPicks Editorial';

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
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=AITools,CollegeLife,StudentTech,StudyHacks,Coding`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-12">
      {/* Editorial Hero Header Box */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 rounded-3xl p-6 sm:p-10 text-white border border-violet-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5" />
              SpotPicks Tech & Academic Guide
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Edition: {LAST_VERIFIED_DATE}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Official Tools • Transparent Pricing
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            20 AI Tools Every College Student Should Know in 2026
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            From source-grounded studying with <strong>Google NotebookLM</strong> and literature synthesis on <strong>Consensus</strong> to full-codebase AI editors like <strong>Cursor</strong> and interactive decks with <strong>Gamma</strong>—here is the verified student toolkit to learn deeper, code faster, and produce exceptional academic work.
          </p>

          {/* Social Share Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-violet-400" />
              Share this AI intelligence guide with your campus study group:
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

      {/* "Best Tool For..." Spotlight Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Award className="h-3.5 w-3.5 text-amber-600" />
            SpotPicks Benchmark Awards
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Best AI Tools by Academic Task
          </h2>
          <p className="text-xs text-slate-500">
            Quick recommendations based on source verification, student friendliness, and real academic utility
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {AI_SPOTLIGHT_AWARDS.map((spotlight) => (
            <a
              key={spotlight.award}
              href={`#tool-${spotlight.toolId}`}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/70 border border-slate-200 hover:border-violet-200 transition-all flex flex-col justify-between space-y-2.5 group cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border inline-block ${spotlight.badgeColor}`}>
                  {spotlight.award}
                </span>
                <h3 className="font-black text-sm text-slate-900 group-hover:text-violet-900 transition-colors">
                  {spotlight.toolName}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {spotlight.reason}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-violet-700 border-t border-slate-200/60">
                <span>View Details</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-violet-600" />
              <span>Explore AI Tools Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTools.length} of {AI_TOOLS_LIST.length} curated, verified AI tools
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveViewMode('cards')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeViewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cards View
              </button>
              <button
                type="button"
                onClick={() => setActiveViewMode('comparison')}
                className={`px-3 py-1 rounded-lg transition ${
                  activeViewMode === 'comparison'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Comparison Matrix
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search (e.g., NotebookLM, Claude, Math)..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              />
            </div>
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {c.icon}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Pricing Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Pricing:
          </span>
          {pricingFilters.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPricing(p.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPricing === p.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Comparison Matrix */}
      {activeViewMode === 'comparison' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <th className="p-4 font-bold">Tool Name</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Best Use Case</th>
                  <th className="p-4 font-bold">Pricing Model</th>
                  <th className="p-4 font-bold">Proficiency</th>
                  <th className="p-4 font-bold text-right">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{tool.name}</span>
                        {tool.spotlightBadge && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">
                            ★ Pick
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-[11px]">
                        {tool.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs">{tool.bestUseCase}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          tool.pricingModel === '100% Free'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tool.pricingModel === 'Free with Student Discount'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tool.pricingModel}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap font-medium">
                      {tool.beginnerFriendliness}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-violet-600 text-white font-bold text-xs transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Rich Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTools.map((tool) => {
            const is100Free = tool.pricingModel === '100% Free';
            const isStudentPack = tool.pricingModel === 'Free with Student Discount';

            return (
              <article
                key={tool.id}
                id={`tool-${tool.id}`}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                {/* Header Metadata Badges */}
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Badge */}
                      <span className="px-2.5 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold">
                        {tool.category}
                      </span>

                      {/* Pricing Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                          is100Free
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isStudentPack
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {tool.pricingModel}
                      </span>

                      {/* Proficiency */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[11px] font-semibold border border-slate-200">
                        {tool.beginnerFriendliness}
                      </span>
                    </div>

                    {/* Spotlight Pick Badge */}
                    {tool.spotlightBadge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amber-600" />
                        {tool.spotlightBadge}
                      </span>
                    )}
                  </div>

                  {/* Tool Title & Outbound Link */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {tool.tagline}
                      </p>
                    </div>

                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-violet-600 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
                      title={`Visit official ${tool.name} website`}
                    >
                      <span>Visit Tool</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* What it does */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      What It Does:
                    </span>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                      {tool.whatItDoes}
                    </p>
                  </div>

                  {/* Best Use Case Highlight Box */}
                  <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-1">
                    <span className="text-[10px] font-black text-violet-800 uppercase tracking-wider flex items-center gap-1">
                      <Target className="h-3.5 w-3.5 text-violet-700" />
                      Best Academic Use Case:
                    </span>
                    <p className="text-xs text-violet-950 leading-relaxed font-medium">
                      {tool.bestUseCase}
                    </p>
                  </div>

                  {/* Practical Student Use Cases */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Practical Student Use Cases:
                    </span>
                    <ul className="space-y-1.5">
                      {tool.practicalStudentUseCases.map((useCase, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5"
                        >
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Important Limitations */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      Important Limitations & Warnings:
                    </span>
                    <ul className="space-y-1">
                      {tool.limitations.map((lim, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-amber-950 leading-relaxed flex items-start gap-1.5"
                        >
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Note with Official Pricing Link */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span className="truncate mr-2 font-medium">{tool.pricingNote}</span>
                    {tool.pricingUrl && (
                      <a
                        href={tool.pricingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-600 hover:text-violet-800 font-bold whitespace-nowrap inline-flex items-center gap-0.5"
                      >
                        <span>Official Pricing</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Tag Chips */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  {tool.tags.map((tag) => (
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
      )}

      {/* SpotPicks Verified Quality & Transparency Box */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">
            SpotPicks Pricing Notice & Academic Integrity Policy
          </strong>
          <p>
            AI tools and freemium quotas evolve rapidly. Free tiers and student offerings are verified as of {LAST_VERIFIED_DATE}. Always check the official pricing links provided on each card. Use AI tools to accelerate brainstorming, debugging, and comprehension—never submit uncredited AI-generated output as your own coursework.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student AI Tools & Academic Workflow FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {AI_TOOLS_FAQS.map((faq, index) => {
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
                    <ChevronUp className="h-4 w-4 text-violet-600 shrink-0" />
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
      <div className="bg-gradient-to-br from-slate-900 to-violet-950 rounded-3xl p-6 sm:p-8 text-white space-y-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-violet-300 text-xs font-bold">
            <Compass className="h-3.5 w-3.5" />
            Related Guides for College Students & Engineers
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Complete Your Student Technical Toolkit
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Explore our curated student directories for free resources, internship portals, open-source masterclasses, and local campus hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/articles/best-internship-websites-for-college-students"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                Career Intelligence
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition">
                Best Places to Find Internships & Jobs for College Students
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Software, AI/ML, YC Startups, GSoC, Mitacs, Remote jobs, and AICTE portals.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-400 flex items-center gap-1">
              <span>Explore Internships</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/articles/free-websites-every-college-student-should-know"
            className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Student Toolkit
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-rose-300 transition">
                25 Free Websites Every College Student Should Know
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Coding sandboxes, free GPUs, ATS resume builders, and academic research papers.
              </p>
            </div>
            <div className="text-xs font-bold text-rose-400 flex items-center gap-1">
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
        </div>
      </div>
    </div>
  );
};
