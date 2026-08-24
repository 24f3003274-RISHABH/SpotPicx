import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  Star,
  MapPin,
  Clock,
  Phone,
  Compass,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Share2,
  HelpCircle,
  TrendingUp,
  Filter,
  Navigation,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { seoService } from '../services/seo.service';
import { SEOPage, Business } from '../types';
import { businessOwnerService } from '../services/businessOwnerService';

export const SeoPageTemplate: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<SEOPage | null>(null);
  const [jsonLd, setJsonLd] = useState<any>(null);
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [selectedPrice, setSelectedPrice] = useState<string>('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const result = await seoService.getPageBySlug(slug);
        if (isMounted) {
          if (result) {
            setPageData(result.page);
            setJsonLd(result.jsonLd);
          } else {
            setPageData(null);
          }
        }
      } catch (err) {
        console.error('Error loading SEO page data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-sm font-medium text-slate-500">Curating Delhi’s definitive Top 10 rankings...</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
          <Compass className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Curated Guide Not Found</h1>
        <p className="text-slate-600 max-w-md mb-6">
          We could not find the exact curated guide you requested. Explore our other top-rated Delhi spots.
        </p>
        <Link
          to="/explore"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
        >
          Explore All Delhi Guides
        </Link>
      </div>
    );
  }

  const items = pageData.top10 || [];

  // Filter items by locality / price if requested
  const filteredItems = items.filter((item) => {
    if (selectedLocality !== 'ALL' && item.locality !== selectedLocality) return false;
    if (selectedPrice !== 'ALL' && item.priceRange !== selectedPrice) return false;
    return true;
  });

  const uniqueLocalities = Array.from(new Set(items.map((i) => i.locality).filter(Boolean)));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageData.metaTitle || pageData.title,
        text: pageData.metaDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-amber-200/50 shadow-md';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-900 border-slate-300 shadow-sm';
      case 3:
        return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white border-amber-600 shadow-sm';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SEO Head with JSON-LD Schema */}
      <SEOHead
        title={pageData.metaTitle || pageData.title}
        description={pageData.metaDescription}
        canonicalUrl={pageData.canonicalUrl || `https://spotpicks.delhi/${pageData.slug}`}
        keywords={pageData.keywords}
        jsonLd={jsonLd}
      />

      {/* Hero / Header Section */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-900/50 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-indigo-300 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/explore" className="hover:text-white transition">Delhi</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {pageData.category && (
              <>
                <Link to={`/category/${pageData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-white transition">
                  {pageData.category}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-white font-semibold truncate">{pageData.h1}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                SpotPicks Editorial Curated Guide • Updated 2026
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {pageData.h1}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {pageData.intro}
              </p>
            </div>

            {/* Quick Stats & Share */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition backdrop-blur-md"
              >
                <Share2 className="h-4 w-4" />
                {copiedLink ? 'Link Copied!' : 'Share Guide'}
              </button>

              <div className="flex items-center gap-4 text-xs text-indigo-200 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div>
                  <span className="text-slate-400 block">Verified Spots</span>
                  <strong className="text-sm text-white">{items.length} Evaluated</strong>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="text-slate-400 block">Avg Rating</span>
                  <strong className="text-sm text-amber-400 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {pageData.stats?.avgRating || 4.7}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Jump Ribbon */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Quick Jump:
            </span>
            {items.map((biz, idx) => (
              <a
                key={biz._id || idx}
                href={`#spot-${idx + 1}`}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-200 hover:text-white whitespace-nowrap transition flex items-center gap-1.5 shrink-0"
              >
                <span className="font-bold text-amber-400">#{idx + 1}</span>
                <span>{biz.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Top 10 Listings & Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Filter className="h-4 w-4 text-indigo-600" />
                <span>Filter Listings ({filteredItems.length}):</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Locality Filter */}
                {uniqueLocalities.length > 1 && (
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="ALL">All Neighborhoods</option>
                    {uniqueLocalities.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                )}

                {/* Price Filter */}
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ALL">All Price Tiers</option>
                  <option value="BUDGET">Budget (₹)</option>
                  <option value="MODERATE">Moderate (₹₹)</option>
                  <option value="EXPENSIVE">Fine Dining (₹₹₹₹)</option>
                </select>
              </div>
            </div>

            {/* Top 10 Ranked Cards */}
            <div className="space-y-6">
              {filteredItems.map((biz, index) => {
                const rankNumber = biz.rank || index + 1;
                const spotId = `spot-${rankNumber}`;
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${biz.name}, ${biz.address || biz.locality}, Delhi`
                )}`;

                return (
                  <article
                    id={spotId}
                    key={biz._id || index}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden scroll-mt-24"
                  >
                    {/* Card Header & Rank */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {/* Rank Badge */}
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base border shrink-0 ${getRankBadgeColor(
                            rankNumber
                          )}`}
                        >
                          #{rankNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition">
                              <Link to={`/business/${biz.slug || biz._id}`}>{biz.name}</Link>
                            </h2>
                            {biz.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified Spot
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                            <span className="font-medium text-slate-700">{biz.locality || 'Delhi'}</span>
                            <span>•</span>
                            <span>{typeof biz.category === 'object' && biz.category !== null ? (biz.category as any).name : String(biz.category || 'Spot')}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-900">
                              {biz.priceRange === 'BUDGET' ? '₹ (Budget)' : biz.priceRange === 'MODERATE' ? '₹₹ (Moderate)' : '₹₹₹₹ (Luxury)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating Score Pill */}
                      <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-right shrink-0">
                        <div className="flex items-center justify-end gap-1 text-sm font-black text-amber-700">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                          <span>{biz.rating?.toFixed(1) || '4.8'}</span>
                        </div>
                        <span className="text-[10px] text-amber-900/70 font-medium">
                          {biz.reviewCount || 420}+ reviews
                        </span>
                      </div>
                    </div>

                    {/* Image & Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-0 border-b border-slate-100">
                      <div className="sm:col-span-5 h-52 sm:h-auto relative overflow-hidden bg-slate-100">
                        <img
                          src={
                            biz.images?.[0] ||
                            (biz as any).coverImage ||
                            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
                          }
                          alt={biz.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          Rank #{rankNumber} in Delhi
                        </div>
                      </div>

                      <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                        {/* Description / Why it made Top 10 */}
                        <div>
                          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5" />
                            Curator’s Pick & Insider Review
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {biz.description ||
                              `Celebrated across Delhi for outstanding kitchen precision, hospitable ambiance, and authentic culinary consistency in ${biz.locality}. A must-visit destination.`}
                          </p>
                        </div>

                        {/* Tags & Highlights */}
                        {biz.tags && biz.tags.length > 0 && (
                          <div>
                            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                              Specialties & Vibe:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {biz.tags.slice(0, 5).map((tag: string) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Address & Timings */}
                        <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="truncate">{biz.address || `${biz.locality}, Delhi`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 font-medium">Open Daily (11:00 AM – 11:30 PM)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-slate-50/70 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => businessOwnerService.trackInteraction(biz._id, 'direction_click')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          Directions
                        </a>

                        {biz.phone && (
                          <a
                            href={`tel:${biz.phone}`}
                            onClick={() => businessOwnerService.trackInteraction(biz._id, 'phone_click')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition"
                          >
                            <Phone className="h-3.5 w-3.5 text-slate-500" />
                            Call
                          </a>
                        )}

                        {biz.website && (
                          <a
                            href={biz.website}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => businessOwnerService.trackInteraction(biz._id, 'website_click')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold transition"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                            Website
                          </a>
                        )}
                      </div>

                      <Link
                        to={`/business/${biz.slug || biz._id}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
                      >
                        View Full Spot Profile
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Detailed Content Sections */}
            {pageData.contentSections && pageData.contentSections.length > 0 && (
              <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-900">Curator Insights & Evaluation Guide</h2>
                </div>

                {pageData.contentSections.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{sec.body}</p>
                    {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                      <ul className="space-y-2 mt-3">
                        {sec.bulletPoints.map((bp, bpIdx) => (
                          <li key={bpIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                            <span>{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* FAQs Accordion */}
            {pageData.faq && pageData.faq.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <HelpCircle className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                  {pageData.faq.map((item, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full p-4 text-left font-bold text-sm text-slate-900 hover:text-indigo-600 flex items-center justify-between gap-4 bg-slate-50/50"
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={`h-4 w-4 text-slate-500 transition-transform ${
                              isOpen ? 'transform rotate-180 text-indigo-600' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-4 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Quick Summary, Map Preview, Related Guides & Categories (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Summary Table */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 sticky top-24">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Delhi Top 10 Summary (2026)
              </h3>

              <div className="divide-y divide-slate-100">
                {items.slice(0, 10).map((biz, idx) => (
                  <div key={biz._id || idx} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-black text-slate-400 w-5">#{idx + 1}</span>
                      <a
                        href={`#spot-${idx + 1}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 truncate transition"
                      >
                        {biz.name}
                      </a>
                    </div>
                    <span className="text-slate-500 shrink-0 font-medium">{biz.locality}</span>
                  </div>
                ))}
              </div>

              {/* Related Curated Guides */}
              {pageData.relatedPages && pageData.relatedPages.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Related Curated Guides:
                  </span>
                  <div className="space-y-1.5">
                    {pageData.relatedPages.map((rSlug) => {
                      const displayTitle = rSlug
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');

                      return (
                        <Link
                          key={rSlug}
                          to={`/${rSlug}`}
                          className="block text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition"
                        >
                          → {displayTitle}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Related Categories */}
              {pageData.relatedCategories && pageData.relatedCategories.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Explore Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pageData.relatedCategories.map((rc) => (
                      <Link
                        key={rc}
                        to={`/category/${rc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-medium transition"
                      >
                        {rc}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Neighborhoods */}
              {pageData.relatedLocations && pageData.relatedLocations.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Top Neighborhoods:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pageData.relatedLocations.map((loc) => (
                      <Link
                        key={loc}
                        to={`/location/${loc.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-medium transition"
                      >
                        {loc}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
