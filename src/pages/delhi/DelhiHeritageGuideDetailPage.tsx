import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Train,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Compass,
  Footprints,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getEditorialGuideBySlug, DELHI_HERITAGE_GUIDES } from '../../data/delhi/heritageGuidesData';
import { getDelhiHeritagePlaceBySlug } from '../../data/delhi/allDelhiHeritagePlaces';
import { HeritagePlaceCard } from '../../components/delhi/HeritagePlaceCard';
import { HeritageJsonLd } from '../../components/delhi/HeritageJsonLd';

export const DelhiHeritageGuideDetailPage: React.FC = () => {
  const { guideSlug } = useParams<{ guideSlug: string }>();

  const guide = guideSlug ? getEditorialGuideBySlug(guideSlug) : undefined;

  if (!guide) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <BookOpen className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Editorial Guide Not Found</h2>
          <p className="text-xs text-slate-600 mt-2 mb-6">
            The heritage guide you requested does not exist or has been updated.
          </p>
          <Link
            to="/delhi/heritage"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Delhi Heritage Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  // Load featured place objects
  const featuredPlaces = guide.featuredPlacesSlugs
    .map((slug) => getDelhiHeritagePlaceBySlug(slug))
    .filter((p) => p !== undefined);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <HeritageJsonLd type="guide" guide={guide} />

      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={guide.heroImage}
            alt={guide.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />

        <Container size="lg" className="relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/delhi" className="hover:text-white transition-colors">
              Delhi
            </Link>
            <span>/</span>
            <Link to="/delhi/heritage" className="hover:text-white transition-colors">
              Heritage & History
            </Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold truncate max-w-[220px]">
              {guide.title.split(':')[0]}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <BookOpen className="h-3.5 w-3.5" />
                Editorial Heritage Guide
              </span>
              <span className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <Clock className="inline h-3 w-3 mr-1 text-indigo-300" />
                {guide.readTime}
              </span>
              <span className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                {guide.publishedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {guide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
              {guide.subtitle}
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-white">{guide.author.name}</span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span className="text-slate-400">{guide.author.role}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Area */}
      <Container size="lg" className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Intro Lead */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif">
                {guide.intro}
              </p>

              {guide.historicalContext && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
                    Historical Context & Background
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {guide.historicalContext}
                  </p>
                </div>
              )}
            </div>

            {/* Key Takeaways Box */}
            <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
                <Sparkles className="h-4 w-4" />
                <span>Key Curated Takeaways</span>
              </div>
              <div className="space-y-3">
                {guide.keyTakeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-indigo-300 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Walking Route (If present) */}
            {guide.walkRouteSteps && guide.walkRouteSteps.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                  <Footprints className="h-4 w-4" />
                  <span>Step-by-Step Heritage Walking Route</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Detailed Trail Stops & Timings
                </h2>

                <div className="space-y-6">
                  {guide.walkRouteSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                            #{step.stepNumber}
                          </span>
                          <h3 className="text-base font-bold text-slate-900">
                            {step.placeName}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                          {step.durationAtStop}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="font-semibold text-slate-900">What to look for:</span>{' '}
                        {step.whatToLookFor}
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-900">Historical Insight:</span>{' '}
                        {step.historicalInsight}
                      </p>

                      {step.curatorTip && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                          💡 Curator Tip: {step.curatorTip}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>Walking to next: {step.walkingDistanceToNext}</span>
                        <Link
                          to={`/delhi/heritage/place/${step.placeSlug}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          View Monument Full Specs →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Editorial Sections */}
            <div className="space-y-8">
              {guide.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {section.heading}
                  </h2>
                  <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>

                  {section.proTip && (
                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950">
                      <span className="font-bold block mb-1">💡 Heritage Pro Tip:</span>
                      {section.proTip}
                    </div>
                  )}

                  {section.placeSlugRef && (
                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        to={`/delhi/heritage/place/${section.placeSlugRef}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        <span>Explore full details for this monument</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Featured Places Cards Grid */}
            {featuredPlaces.length > 0 && (
              <section className="mt-12 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Documented Landmarks in this Guide
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    Featured Historical Sites
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {featuredPlaces.map((place) => (
                    <HeritagePlaceCard key={place.slug} place={place} />
                  ))}
                </div>
              </section>
            )}

            {/* FAQs */}
            {guide.faqs && guide.faqs.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {guide.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900 mb-1.5">{faq.question}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Guide Meta Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Itinerary Overview
              </h3>

              {guide.recommendedTiming && (
                <div>
                  <span className="text-slate-400 font-medium block">Recommended Time:</span>
                  <span className="font-bold text-slate-800">{guide.recommendedTiming}</span>
                </div>
              )}

              {guide.startingPoint && (
                <div>
                  <span className="text-slate-400 font-medium block">Suggested Starting Point:</span>
                  <span className="font-bold text-indigo-900">{guide.startingPoint}</span>
                </div>
              )}

              {guide.metroConnectivitySummary && (
                <div>
                  <span className="text-slate-400 font-medium block">Metro Connectivity:</span>
                  <span className="font-medium text-slate-700">{guide.metroConnectivitySummary}</span>
                </div>
              )}
            </div>

            {/* Other Editorial Guides */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                More Heritage Guides
              </h3>

              <div className="space-y-3">
                {DELHI_HERITAGE_GUIDES.filter((g) => g.slug !== guide.slug).map((other) => (
                  <Link
                    key={other.slug}
                    to={`/delhi/heritage/guide/${other.slug}`}
                    className="group block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {other.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{other.readTime}</span>
                      <span className="font-semibold text-indigo-600 group-hover:underline">Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sources Reference Card */}
            {guide.sources && guide.sources.length > 0 && (
              <div className="bg-slate-100/80 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Authoritative References</span>
                </div>
                <ul className="space-y-2">
                  {guide.sources.map((src, idx) => (
                    <li key={idx} className="leading-snug">
                      <span className="font-semibold text-slate-800">{src.organization}:</span>{' '}
                      <span>{src.documentOrRecord}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
