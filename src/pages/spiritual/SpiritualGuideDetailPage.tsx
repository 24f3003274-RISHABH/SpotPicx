import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getSpiritualGuideBySlug, SPIRITUAL_EDITORIAL_GUIDES } from '../../data/spiritual/spiritualGuidesData';
import { getSpiritualPlaceBySlug } from '../../data/spiritual/allSpiritualPlaces';
import { SpiritualPlaceCard } from '../../components/spiritual/SpiritualPlaceCard';
import { SpiritualVerificationNotice } from '../../components/spiritual/SpiritualVerificationNotice';
import { SpiritualJsonLd } from '../../components/spiritual/SpiritualJsonLd';

export const SpiritualGuideDetailPage: React.FC = () => {
  const { guideSlug } = useParams<{ guideSlug: string }>();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const guide = useMemo(() => {
    if (!guideSlug) return undefined;
    return getSpiritualGuideBySlug(guideSlug);
  }, [guideSlug]);

  const featuredPlaces = useMemo(() => {
    if (!guide?.featuredPlacesSlugs) return [];
    return guide.featuredPlacesSlugs
      .map((slug) => getSpiritualPlaceBySlug(slug))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [guide]);

  const otherGuides = useMemo(() => {
    if (!guide) return [];
    return SPIRITUAL_EDITORIAL_GUIDES.filter((g) => g.id !== guide.id).slice(0, 3);
  }, [guide]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide?.title,
        text: guide?.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!guide) {
    return <Navigate to="/india/spiritual" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SpiritualJsonLd type="guide" guide={guide} />

      {/* Guide Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <Container className="relative py-12 sm:py-16 space-y-6">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/india/spiritual" className="hover:text-white transition-colors">
              Spiritual India
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">Editorial Guides</span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <BookOpen className="h-3 w-3" />
                {guide.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                <Clock className="h-3 w-3 text-amber-400" />
                {guide.readTime}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">{guide.publishedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {guide.subtitle}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-white/10 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <User className="h-3.5 w-3.5 text-amber-400" />
                <span>{guide.author}</span>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Share2 className="h-3 w-3" />
                {copied ? 'Copied' : 'Share Guide'}
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        <SpiritualVerificationNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-8 space-y-10">
            {/* Introduction */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {guide.introduction}
              </p>
            </div>

            {/* Guide Sections */}
            <div className="space-y-10">
              {guide.sections.map((section, idx) => (
                <section
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-sm"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {section.heading}
                    </h2>
                    {section.subheading && (
                      <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-1">
                        {section.subheading}
                      </p>
                    )}
                  </div>

                  {section.image && (
                    <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        <img
                          src={section.image}
                          alt={section.imageCaption || section.heading}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {section.imageCaption && (
                        <p className="p-3 text-xs text-slate-500 dark:text-slate-400 italic">
                          {section.imageCaption}
                        </p>
                      )}
                    </div>
                  )}

                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.content}
                  </p>

                  {section.keyHighlights && section.keyHighlights.length > 0 && (
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Key Highlights:
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {section.keyHighlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.practicalTips && section.practicalTips.length > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        Practical Visitor Guidance:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {section.practicalTips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="text-amber-600">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.placeSlug && (
                    <div className="pt-2">
                      <Link
                        to={`/india/spiritual/place/${section.placeSlug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        View Full Place Dossier & Visiting Guidelines →
                      </Link>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Conclusion */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-6 sm:p-8 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Editorial Summary & Reflection
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {guide.conclusion}
              </p>
            </div>

            {/* Frequently Asked Questions */}
            {guide.faq && guide.faq.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <HelpCircle className="h-4 w-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Pilgrim & Visitor FAQs
                </h3>
                <div className="space-y-3">
                  {guide.faq.map((faqItem, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="flex w-full items-center justify-between p-4 text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <span>{faqItem.question}</span>
                        {openFaqIndex === idx ? (
                          <ChevronUp className="h-4 w-4 shrink-0 text-amber-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                        )}
                      </button>
                      {openFaqIndex === idx && (
                        <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                          {faqItem.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar with Featured Places */}
          <aside className="lg:col-span-4 space-y-6">
            {featuredPlaces.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Featured Sacred Sites in this Guide
                </h3>
                <div className="space-y-4">
                  {featuredPlaces.map((pl) => (
                    <SpiritualPlaceCard key={pl.id} place={pl} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Other Editorial Guides */}
        {otherGuides.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Explore More Editorial Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherGuides.map((g) => (
                <div
                  key={g.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-xs font-semibold">
                    {g.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {g.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {g.subtitle}
                  </p>
                  <Link
                    to={`/india/spiritual/guide/${g.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Read Guide →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};
