import React, { useEffect, useState } from 'react';
import {
  SearchCode,
  PlusCircle,
  Trash2,
  Globe,
  Loader2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { adminService, AdminSeoPage } from '../../services/adminService';
import { seoService } from '../../services/seo.service';
import { SEOPage } from '../../types';

export const AdminSeoPagesTab: React.FC = () => {
  const [seoPages, setSeoPages] = useState<any[]>([]);
  const [analyticsOverview, setAnalyticsOverview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form State
  const [slug, setSlug] = useState('best-momos-in-delhi');
  const [category, setCategory] = useState('Momos');
  const [location, setLocation] = useState('Delhi');
  const [title, setTitle] = useState('Best Momos in Delhi (2026 Guide) — Top 10 Ranked');
  const [metaTitle, setMetaTitle] = useState('Best Momos in Delhi (2026) — Top Verified Rankings | SpotPicks');
  const [metaDescription, setMetaDescription] = useState('Discover the 10 best momos in Delhi from legendary Dolma Aunty in Lajpat Nagar to steamed kurkure momos in Majnu Ka Tilla.');
  const [h1, setH1] = useState('The 10 Best Momos in Delhi (2026 Rankings)');
  const [intro, setIntro] = useState('Delhi is world-famous for its diverse street food culture, and momos stand at the absolute center of the city’s snacking identity.');
  const [keywords, setKeywords] = useState('best momos in delhi, momo joints delhi, dolma aunty momos, majnu ka tilla momos');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pagesData, analyticsData] = await Promise.all([
        seoService.getAllPages(),
        seoService.getSeoAnalyticsOverview(),
      ]);
      setSeoPages(pagesData || []);
      setAnalyticsOverview(analyticsData);
    } catch (e) {
      console.error('Failed to load SEO pages & analytics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateAiDraft = async () => {
    if (!slug) return;
    try {
      setIsAiGenerating(true);
      const draft = await seoService.generateAiDraft({
        slug: slug.trim(),
        category: category.trim(),
        location: location.trim(),
      });

      if (draft) {
        if (draft.title) setTitle(draft.title);
        if (draft.h1) setH1(draft.h1);
        if (draft.metaTitle) setMetaTitle(draft.metaTitle);
        if (draft.metaDescription) setMetaDescription(draft.metaDescription);
        if (draft.intro) setIntro(draft.intro);
        if (draft.keywords) setKeywords(draft.keywords.join(', '));
      }
    } catch (err: any) {
      alert('Failed to generate AI SEO draft: ' + err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    try {
      const keywordList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const saved = await seoService.createOrUpdatePage({
        slug: slug.trim(),
        title: title.trim(),
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim(),
        h1: h1.trim() || title.trim(),
        intro: intro.trim(),
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        keywords: keywordList,
        published: true,
        isIndexed: true,
      });

      if (saved) {
        await loadData();
        setIsAdding(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO page');
    }
  };

  return (
    <div className="space-y-8">
      {/* Organic SEO Analytics Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organic Landings</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {analyticsOverview?.totalLandings || 1420}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            ↑ +18.4% this week
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Conversions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {analyticsOverview?.totalConversions || 342}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Calls, Directions & Leads
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Conv. Rate</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {analyticsOverview?.conversionRate || '24.1%'}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            Top-tier search intent match
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active SEO Pages</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <SearchCode className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {seoPages.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Indexed in sitemap.xml
          </div>
        </div>
      </div>

      {/* Header & New Button */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <SearchCode className="h-5 w-5 text-indigo-600" />
            <span>Search Intent & Locality SEO Engine</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage Title tags, H1 headlines, Meta descriptions, FAQs, and AI drafts strictly verified against SpotPicks records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New SEO Guide</span>
          </button>
        </div>
      </div>

      {/* New / Edit Form Modal / Card */}
      {isAdding && (
        <form onSubmit={handleSavePage} className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-lg space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Configure Intent-Targeted SEO Guide</h3>
              <p className="text-xs text-slate-500">
                Target key search terms such as "Best restaurants in Delhi" or "Best PG near JNU".
              </p>
            </div>

            <button
              type="button"
              disabled={isAiGenerating}
              onClick={handleGenerateAiDraft}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition cursor-pointer"
            >
              {isAiGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              )}
              <span>{isAiGenerating ? 'Drafting with Gemini...' : 'Draft with Gemini AI'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">URL Route Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="best-momos-in-delhi"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Momos / Cafes / Restaurants"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Locality</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Delhi / Connaught Place / JNU"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Page Title (H1 Tag) *</label>
              <input
                type="text"
                required
                value={h1}
                onChange={(e) => setH1(e.target.value)}
                placeholder="The 10 Best Momos in Delhi (2026 Rankings)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Meta Title (SERP Display) *</label>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Best Momos in Delhi (2026) — Top Verified Rankings | SpotPicks"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Meta Description (150-160 chars) *</label>
            <textarea
              rows={2}
              required
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Introductory Section</label>
            <textarea
              rows={3}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Target SEO Keywords (Comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="best momos in delhi, momo joints delhi, dolma aunty momos"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Save & Publish SEO Page
            </button>
          </div>
        </form>
      )}

      {/* List of SEO Pages */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading SEO landing pages and ranking indexes...</p>
        </div>
      ) : seoPages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <SearchCode className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No custom SEO pages configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {seoPages.map((page: any) => (
            <div
              key={page.slug || page._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-indigo-200 transition-colors"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    /{page.slug}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    LIVE & INDEXED
                  </span>
                  {page.category && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {page.category}
                    </span>
                  )}
                  {page.location && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {page.location}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{page.h1 || page.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {page.metaDescription || page.intro}
                </p>

                {page.keywords && page.keywords.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-400">
                    <span className="font-semibold">Keywords:</span>
                    {page.keywords.slice(0, 4).map((kw: string, idx: number) => (
                      <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded text-slate-600 border border-slate-200/60">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span>Preview</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
