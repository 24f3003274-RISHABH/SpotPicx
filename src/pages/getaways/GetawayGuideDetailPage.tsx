import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Share2,
  Navigation,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getGetawayGuideBySlug, GETAWAY_EDITORIAL_GUIDES } from '../../data/getaways/getawayGuidesData';
import { ALL_WEEKEND_GETAWAYS } from '../../data/getaways/allWeekendGetaways';
import { GetawayCard } from '../../components/getaways/GetawayCard';
import { GetawayVerificationNotice } from '../../components/getaways/GetawayVerificationNotice';
import { GetawayJsonLd } from '../../components/getaways/GetawayJsonLd';

export const GetawayGuideDetailPage: React.FC = () => {
  const { guideSlug } = useParams<{ guideSlug: string }>();

  const guide = useMemo(() => {
    if (!guideSlug) return undefined;
    return getGetawayGuideBySlug(guideSlug);
  }, [guideSlug]);

  const featuredPlaces = useMemo(() => {
    if (!guide) return [];
    return guide.featuredDestinationSlugs
      .map((slug) => ALL_WEEKEND_GETAWAYS.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [guide]);

  const otherGuides = useMemo(() => {
    if (!guide) return [];
    return GETAWAY_EDITORIAL_GUIDES.filter((g) => g.id !== guide.id).slice(0, 4);
  }, [guide]);

  if (!guide) {
    return <Navigate to="/delhi/weekend-getaways" replace />;
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Delhi NCR', url: '/delhi' },
    { name: 'Weekend Getaways', url: '/delhi/weekend-getaways' },
    { name: guide.title, url: `/delhi/weekend-getaways/guide/${guide.slug}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <GetawayJsonLd
        guide={guide}
        title={`${guide.title} | SpotPicks Travel Guide`}
        description={guide.subtitle}
        canonicalUrl={`/delhi/weekend-getaways/guide/${guide.slug}`}
        breadcrumbs={breadcrumbs}
      />

      {/* Guide Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent py-12 lg:py-16">
        <Container className="space-y-6">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/delhi/weekend-getaways" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Weekend Getaways
            </Link>
            <span>/</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold truncate">
              {guide.category}
            </span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-500/10 border border-sky-500/30 px-3.5 py-1 text-xs font-bold text-sky-800 dark:text-sky-300">
                {guide.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                {guide.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.subtitle}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                By {guide.author}
              </span>
              <span>•</span>
              <span>Updated {guide.publishedDate}</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        <GetawayVerificationNotice />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Article Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <p>{guide.introduction}</p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {guide.sections.map((section, idx) => {
                const linkedPlace = section.destinationSlug
                  ? ALL_WEEKEND_GETAWAYS.find((p) => p.slug === section.destinationSlug)
                  : null;

                return (
                  <article
                    key={idx}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-sm"
                  >
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {section.heading}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.content}
                    </p>

                    {section.keyPoints && (
                      <div className="rounded-2xl bg-sky-50 dark:bg-slate-800/50 p-4 space-y-2 text-xs sm:text-sm">
                        <div className="font-bold text-sky-900 dark:text-sky-200 uppercase tracking-wider text-xs">
                          Key Trip Highlights:
                        </div>
                        <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                          {section.keyPoints.map((kp, kIdx) => (
                            <li key={kIdx} className="flex items-start gap-2">
                              <span className="text-sky-500 font-bold">•</span>
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {linkedPlace && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {linkedPlace.distanceKm} km from Delhi • {linkedPlace.state}
                        </span>
                        <Link
                          to={`/delhi/weekend-getaways/destination/${linkedPlace.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-500 transition-colors"
                        >
                          <span>View Full {linkedPlace.name} Dossier</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Conclusion */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-3 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SpotPicks Editorial Takeaway
              </h3>
              <p>{guide.conclusion}</p>
            </div>

            {/* FAQ Section with Structured FAQ Schema */}
            {guide.faq && guide.faq.length > 0 && (
              <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-2 text-sky-600 font-bold">
                  <HelpCircle className="h-5 w-5" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-4">
                  {guide.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/30 p-4 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Featured Getaways Cards & Other Editorial Guides */}
          <div className="space-y-6">
            {/* Featured Destinations List */}
            {featuredPlaces.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs text-sky-600">
                  Featured in this Guide
                </h3>
                <div className="space-y-4">
                  {featuredPlaces.map((place) => (
                    <GetawayCard key={place.id} place={place} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Editorial Guides */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                More Weekend Guides
              </h3>
              <div className="space-y-3">
                {otherGuides.map((other) => (
                  <Link
                    key={other.id}
                    to={`/delhi/weekend-getaways/guide/${other.slug}`}
                    className="block group space-y-1 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                      {other.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                      {other.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
