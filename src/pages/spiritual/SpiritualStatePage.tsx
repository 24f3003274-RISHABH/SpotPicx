import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MapPin,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getSpiritualStateBySlug, SPIRITUAL_STATES } from '../../data/spiritual/spiritualStatesData';
import { getSpiritualPlacesByState } from '../../data/spiritual/allSpiritualPlaces';
import { SPIRITUAL_EDITORIAL_GUIDES } from '../../data/spiritual/spiritualGuidesData';
import { SpiritualPlaceCard } from '../../components/spiritual/SpiritualPlaceCard';
import { SpiritualGuideCard } from '../../components/spiritual/SpiritualGuideCard';
import { SpiritualVerificationNotice } from '../../components/spiritual/SpiritualVerificationNotice';
import { SpiritualJsonLd } from '../../components/spiritual/SpiritualJsonLd';

export const SpiritualStatePage: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();

  const stateInfo = useMemo(() => {
    if (!stateSlug) return undefined;
    return getSpiritualStateBySlug(stateSlug);
  }, [stateSlug]);

  const statePlaces = useMemo(() => {
    if (!stateSlug) return [];
    return getSpiritualPlacesByState(stateSlug);
  }, [stateSlug]);

  const relatedGuides = useMemo(() => {
    if (!stateSlug) return [];
    return SPIRITUAL_EDITORIAL_GUIDES.filter((g) =>
      g.slug.includes(stateSlug) || g.title.toLowerCase().includes(stateInfo?.stateName.toLowerCase() || '')
    );
  }, [stateSlug, stateInfo]);

  if (!stateInfo) {
    return <Navigate to="/india/spiritual" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SpiritualJsonLd type="state" stateInfo={stateInfo} />

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={stateInfo.heroImage}
            alt={stateInfo.stateName}
            className="h-full w-full object-cover opacity-25 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <Container className="relative py-12 sm:py-16 space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/india" className="hover:text-white transition-colors">
              India
            </Link>
            <span>/</span>
            <Link to="/india/spiritual" className="hover:text-white transition-colors">
              Spiritual India
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{stateInfo.stateName}</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              <span>State Discovery Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Spiritual & Religious Destinations in {stateInfo.stateName}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {stateInfo.overview}
            </p>
          </div>

          {/* Spiritual Towns Quick Tags */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Important Spiritual Towns & Sacred Centers:
            </div>
            <div className="flex flex-wrap gap-2">
              {stateInfo.topSpiritualTowns.map((town, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1 text-xs font-medium text-amber-300"
                >
                  {town.name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        {/* Verification notice */}
        <SpiritualVerificationNotice />

        {/* Places Grid in this State */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Featured Destinations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Top Religious Places in {stateInfo.stateName}
              </h2>
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {statePlaces.length} verified sacred landmarks
            </div>
          </div>

          {statePlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statePlaces.map((place) => (
                <SpiritualPlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Detailed place listings for {stateInfo.stateName} are being actively updated from state tourism records.
              </p>
            </div>
          )}
        </section>

        {/* Major Pilgrimage Circuits in this State */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Compass className="h-4 w-4" />
              <span>Travel Trails</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Major Pilgrimage Circuits in {stateInfo.stateName}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stateInfo.majorPilgrimageCircuits.map((circuit, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {circuit.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {circuit.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2.5 py-1 text-xs font-bold">
                    {circuit.idealDays}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Key Sites along this Circuit:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {circuit.destinations.map((site, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Major Festivals & Celebrations in this State */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              <span>Sacred Calendar</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Festivals & Celebrations in {stateInfo.stateName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateInfo.keyFestivals.map((fest, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{fest.name}</h4>
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {fest.period}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {fest.significance}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Editorial Guides */}
        {relatedGuides.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Editorial Guides for {stateInfo.stateName}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedGuides.map((guide) => (
                <SpiritualGuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          </section>
        )}

        {/* Other Indian States Navigation */}
        <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Explore Other Indian States
            </h3>
            <Link
              to="/india/spiritual"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              All States Directory →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {SPIRITUAL_STATES.filter((s) => s.stateSlug !== stateSlug).map((otherState) => (
              <Link
                key={otherState.stateSlug}
                to={`/india/spiritual/${otherState.stateSlug}`}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm"
              >
                {otherState.stateName}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
};
