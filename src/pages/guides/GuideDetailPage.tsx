import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  Calendar,
  Share2,
  Bookmark,
  Check,
  HelpCircle,
  ChevronDown,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Compass,
  ArrowRight,
  Info,
  ListOrdered,
} from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';
import { GuidesService } from '../../services/guides.service';
import { GuideMetaBadge } from '../../components/guides/GuideMetaBadge';
import { GuideItemCard } from '../../components/guides/GuideItemCard';
import { Top10Guide } from '../../types/guides.types';
import { getGuideFreshness } from '../../utils/guideFreshness';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [guide, setGuide] = useState<Top10Guide | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slug) {
      const found = GuidesService.getGuideBySlug(slug);
      if (found) {
        setGuide(found);
        GuidesService.incrementViewCount(slug);
      } else {
        setGuide(null);
      }
    }
  }, [slug]);

  // Related guides lookup
  const relatedGuides = useMemo(() => {
    if (!guide) return [];
    const all = GuidesService.getAllGuides(false);
    return all
      .filter(
        g =>
          g.slug !== guide.slug &&
          (guide.relatedGuideSlugs?.includes(g.slug) ||
            g.category === guide.category ||
            g.location === guide.location)
      )
      .slice(0, 3);
  }, [guide]);

  if (!guide) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Guide Not Found</h1>
        <p className="text-slate-600 max-w-md">
          The requested Top 10 guide does not exist or has been unpublished by the editorial team.
        </p>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Guides</span>
        </Link>
      </div>
    );
  }

  const freshness = getGuideFreshness(guide.lastReviewedDate);

  // Generate Comprehensive JSON-LD
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.subtitle || guide.seo.metaDescription,
      image: guide.heroImage,
      datePublished: guide.publishedDate,
      dateModified: guide.lastReviewedDate,
      author: {
        '@type': 'Organization',
        name: guide.author?.name || 'SpotPicks Editorial Desk',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SpotPicks',
        logo: {
          '@type': 'ImageObject',
          url: 'https://spotpicks.in/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': guide.seo.canonicalUrl || `https://spotpicks.in/guides/${guide.slug}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: guide.title,
      description: guide.subtitle,
      numberOfItems: guide.items.length,
      itemListElement: guide.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.factualDescription,
        image: item.image,
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
          item: 'https://spotpicks.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: 'https://spotpicks.in/guides',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: guide.title,
          item: guide.seo.canonicalUrl || `https://spotpicks.in/guides/${guide.slug}`,
        },
      ],
    },
    ...(guide.faq && guide.faq.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faq.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
        ]
      : []),
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <SEOHead
        title={guide.seo.metaTitle || `${guide.title} | SpotPicks Guide`}
        description={guide.seo.metaDescription || guide.subtitle}
        canonicalUrl={guide.seo.canonicalUrl || `https://spotpicks.in/guides/${guide.slug}`}
        ogImage={guide.heroImage}
        ogType="article"
        jsonLd={jsonLd}
        keywords={guide.seo.keywords}
      />

      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/guides" className="hover:text-slate-900">
            Top 10 Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[280px]">{guide.title}</span>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="bg-white border-b border-slate-200/90 pt-8 pb-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-4">
            {/* Badges & Meta */}
            <GuideMetaBadge
              lastReviewedDate={guide.lastReviewedDate}
              methodologyType={guide.methodologyType}
              selectionMethodology={guide.selectionMethodology}
              badgeText={guide.badgeText}
              authorName={guide.author?.name}
              authorRole={guide.author?.role}
              authorAvatar={guide.author?.avatar}
            />

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {guide.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{guide.location}, {guide.state}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Published: {guide.publishedDate}</span>
                </span>
                <span>• {guide.items.length} Curated Items</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Share Guide</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hero Banner Image */}
          {guide.heroImage && (
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={guide.heroImage}
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-8 space-y-10">
        {/* Quick Table of Contents / Jump Bar */}
        <section aria-label="Table of contents" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <ListOrdered className="w-4 h-4 text-amber-600" />
            <span>Quick Jump to Ranked Places (1 – {guide.items.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.items.map((item, idx) => (
              <a
                key={item.id}
                href={`#spot-${item.rank}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
              >
                <span className="font-bold text-amber-700">#{item.rank}</span>
                <span className="truncate max-w-[140px]">{item.name.split('(')[0].trim()}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Editorial Introduction */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Editorial Overview</span>
          </h2>
          <div className="text-sm md:text-base text-slate-700 leading-relaxed space-y-3">
            <p>{guide.introduction}</p>
            {guide.editorialNotes && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs md:text-sm text-slate-800">
                <strong className="text-amber-900 font-semibold block mb-1">
                  💡 Editorial Field Notes:
                </strong>
                <span>{guide.editorialNotes}</span>
              </div>
            )}
          </div>
        </section>

        {/* Sequential List of 10 Places */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              The Top {guide.items.length} Ranked Places
            </h2>
            <span className="text-xs text-slate-500 font-medium">Ranked by Selection Rationale</span>
          </div>

          <div className="space-y-6">
            {guide.items.map(item => (
              <GuideItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {guide.faq && guide.faq.length > 0 && (
          <section className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {guide.faq.map((faqItem, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm md:text-base hover:text-amber-700 transition-colors py-1"
                  >
                    <span>{faqItem.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 ml-3 transition-transform ${
                        openFaqIndex === index ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === index && (
                    <div className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed pl-1">
                      {faqItem.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources & Citations */}
        {guide.sources && guide.sources.length > 0 && (
          <section className="bg-slate-100/80 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Verified Data Sources & Archival References</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              {guide.sources.map((src, i) => (
                <li key={i}>
                  <strong className="text-slate-800">{src.title}</strong>
                  {src.publisher && <span> — {src.publisher}</span>}
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1 inline-flex items-center gap-0.5"
                    >
                      [View Source <ExternalLink className="w-2.5 h-2.5 inline" />]
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Guides Recommendation Section */}
        {relatedGuides.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Explore Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedGuides.map(rg => (
                <Link
                  key={rg.id}
                  to={`/guides/${rg.slug}`}
                  className="group bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                      {rg.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors line-clamp-2">
                      {rg.title}
                    </h3>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{rg.location}</span>
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Top 10 Guides Directory</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
