import React, { useState, useEffect } from 'react';
import {
  Github,
  Star,
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
} from 'lucide-react';
import { GITHUB_REPOSITORIES_LIST, RELATED_RESOURCES_LIST, GitHubRepoItem } from '../../data/githubReposData';

interface LiveRepoData {
  stars?: number;
  lastUpdated?: string;
  language?: string;
}

export const GitHubReposEditorialGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedAudience, setSelectedAudience] = useState<string>('ALL');
  const [liveData, setLiveData] = useState<Record<string, LiveRepoData>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeModalResource, setActiveModalResource] = useState<string | null>(null);

  // Live GitHub statistics fetcher (respecting rule: NO hardcoded fake stats; omit if unavailable)
  useEffect(() => {
    let isCancelled = false;

    async function fetchGitHubStats() {
      const statsMap: Record<string, LiveRepoData> = {};

      // Batch query GitHub public API with timeout
      for (const repo of GITHUB_REPOSITORIES_LIST) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(`https://api.github.com/repos/${repo.repoOwner}/${repo.repoName}`, {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (typeof data.stargazers_count === 'number') {
              statsMap[repo.id] = {
                stars: data.stargazers_count,
                lastUpdated: data.pushed_at ? new Date(data.pushed_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined,
                language: data.language,
              };
            }
          }
        } catch {
          // If rate-limited, offline, or blocked, leave empty — will safely omit rather than fake
        }
      }

      if (!isCancelled) {
        setLiveData(statsMap);
      }
    }

    fetchGitHubStats();

    return () => {
      isCancelled = true;
    };
  }, []);

  const formatStars = (num?: number) => {
    if (!num) return null;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  const domainList = [
    { id: 'ALL', label: 'All Domains' },
    { id: 'DSA', label: 'DSA' },
    { id: 'Web Development', label: 'Web Dev' },
    { id: 'System Design', label: 'System Design' },
    { id: 'Machine Learning', label: 'Machine Learning' },
    { id: 'AI', label: 'AI & LLMs' },
    { id: 'DevOps', label: 'DevOps & Cloud' },
    { id: 'Open Source', label: 'Open Source' },
    { id: 'CS Fundamentals', label: 'CS Fundamentals' },
  ];

  const audienceList = [
    { id: 'ALL', label: 'All Levels' },
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' },
  ];

  const filteredRepos = GITHUB_REPOSITORIES_LIST.filter((repo) => {
    if (selectedDomain !== 'ALL' && repo.domainCategory !== selectedDomain) {
      return false;
    }
    if (selectedAudience !== 'ALL' && repo.targetAudience !== selectedAudience) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.domain.toLowerCase().includes(q) ||
        repo.shortDescription.toLowerCase().includes(q) ||
        repo.whyStudentsShouldKnow.toLowerCase().includes(q) ||
        repo.keyTopics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://spotpicks.delhi/articles/top-10-github-repositories-every-student-should-know';
  const shareTitle = 'Top 10 GitHub Repositories Every Computer Science Student Should Know | SpotPicks Editorial';

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
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=ComputerScience,GitHub,Coding,WebDev`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-12">
      {/* Editorial Overview Box */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              SpotPicks Editorial Curated
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
              10 Domain Masterclasses
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Transforming from a Tutorial Consumer to an Elite Software Engineer
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            GitHub is not merely a cloud backup for code; it is the largest living open university on Earth. We handpicked 
            <strong> 10 industry-defining repositories</strong> spanning Data Structures & Algorithms (DSA), System Design, 
            Generative AI, Web Architecture, and Open Source to give every Computer Science student an unfair advantage in interviews and building production systems.
          </p>

          {/* Social Share Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              Share this guide with your peer group:
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

      {/* Start Here Recommendation Hero Box */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Official Editorial Recommendation: Start Here
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Not sure where to begin? Start with OSSU Computer Science & First Contributions
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              If you are in your 1st or 2nd year of college, start with <strong>OSSU (Open Source Society University)</strong> for rigorous curriculum foundations, and execute your first PR in 5 minutes via <strong>First Contributions</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="https://github.com/ossu/computer-science"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
            >
              <Github className="h-4 w-4" />
              <span>Explore OSSU CS</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://github.com/firstcontributions/first-contributions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition"
            >
              <Github className="h-4 w-4" />
              <span>Make 1st PR (5 min)</span>
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
              <span>Filter Repositories by Tech Domain & Audience Level</span>
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredRepos.length} of 10 curated GitHub repositories
            </p>
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search algorithms, system design, AI..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Domain:</span>
          {domainList.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDomain === d.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Audience Level Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Audience:</span>
          {audienceList.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedAudience(a.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedAudience === a.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Repositories Cards List */}
      <div className="space-y-6">
        {filteredRepos.map((repo) => {
          const stats = liveData[repo.id];
          const hasStars = stats && typeof stats.stars === 'number';

          return (
            <article
              key={repo.id}
              id={`repo-${repo.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Header Badges & Rank */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Rank badge */}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-black">
                    #{repo.rank < 10 ? `0${repo.rank}` : repo.rank}
                  </span>

                  {/* Domain Tag */}
                  <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                    {repo.domain}
                  </span>

                  {/* Who should use this badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      repo.targetAudience === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : repo.targetAudience === 'Intermediate'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    Who Should Use: {repo.targetAudience}
                  </span>

                  {/* Start Here Flag */}
                  {repo.isStartHere && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-700" />
                      Start Here
                    </span>
                  )}
                </div>

                {/* Live Stars Badge (Rule: ONLY show when real live data is available; omit cleanly otherwise) */}
                <div className="flex items-center gap-3">
                  {hasStars && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold" title="Live GitHub Stars">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      <span>{formatStars(stats.stars)} Stars</span>
                    </div>
                  )}

                  {stats?.lastUpdated && (
                    <div className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>Updated {stats.lastUpdated}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & GitHub Link */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Github className="h-5 w-5 text-slate-700 shrink-0" />
                    <span>{repo.name}</span>
                  </h3>

                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Short Description */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {repo.shortDescription}
                </p>

                {/* Why Students Should Know Box */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Why Computer Science Students Should Know This:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {repo.whyStudentsShouldKnow}
                  </p>
                </div>

                {/* Key Topics Covered Chips */}
                <div className="pt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Key Modules:</span>
                  {repo.keyTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Disclaimer Box (Requirement 8 & 9) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">Live GitHub Popularity & Metrics Note</strong>
          <p>
            Repository stars, forks, and commit updates fluctuate continuously as open-source projects evolve. 
            All statistics shown above reflect verified real-time indicators fetched directly from the GitHub API, 
            or are omitted when live metrics are in transit or rate-limited.
          </p>
        </div>
      </div>

      {/* Related Content & Resource Hub (Requirement 11) */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-1">
              <Compass className="h-3.5 w-3.5" />
              Related Student Curations
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Essential Companion Guides for CS Explorers
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Hand-tested platforms and tools to pair with your GitHub repository learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RELATED_RESOURCES_LIST.map((resCard) => (
            <div
              key={resCard.slug}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {resCard.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {resCard.badgeText}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {resCard.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {resCard.description}
                </p>

                {/* Sub items preview */}
                <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  {resCard.items.map((item) => (
                    <li key={item.name} className="flex items-start justify-between gap-2 text-slate-700">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{item.description}</span>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition shrink-0"
                        title={`Open ${item.name}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-600 flex items-center gap-1">
                  {resCard.items.length} Platforms Curated
                </span>
                <span className="text-slate-400 text-[11px]">Free & Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
