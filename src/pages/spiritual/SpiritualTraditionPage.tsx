import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Building,
  ArrowRight,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getTraditionBySlug, SPIRITUAL_TRADITIONS, traditionToSlug } from '../../data/spiritual/traditionsData';
import { getSpiritualPlacesByTradition } from '../../data/spiritual/allSpiritualPlaces';
import { SpiritualPlaceCard } from '../../components/spiritual/SpiritualPlaceCard';
import { SpiritualVerificationNotice } from '../../components/spiritual/SpiritualVerificationNotice';

export const SpiritualTraditionPage: React.FC = () => {
  const { traditionSlug } = useParams<{ traditionSlug: string }>();

  const tradition = useMemo(() => {
    if (!traditionSlug) return undefined;
    return getTraditionBySlug(traditionSlug);
  }, [traditionSlug]);

  const places = useMemo(() => {
    if (!tradition) return [];
    return getSpiritualPlacesByTradition(tradition.tradition);
  }, [tradition]);

  if (!tradition) {
    return <Navigate to="/india/spiritual" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent py-12">
        <Container className="space-y-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/india/spiritual" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Spiritual India
            </Link>
            <span>/</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              {tradition.tradition} Tradition
            </span>
          </nav>

          <div className="max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Living Spiritual Heritage</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {tradition.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {tradition.overview}
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-10">
        <SpiritualVerificationNotice />

        {/* Core Heritage Points & Architecture Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Core Heritage Points</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Spiritual Geography
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {tradition.coreHeritagePoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Building className="h-4 w-4" />
              <span>Architectural Hallmarks</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sacred Architecture & Design
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {tradition.architecturalHallmarks.map((arch, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{arch}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Visitor Etiquette</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Respectful Guidelines
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {tradition.etiquetteTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Destinations in this Tradition */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Sacred Destinations in the {tradition.tradition} Tradition ({places.length})
            </h2>
          </div>

          {places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <SpiritualPlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500">
              Additional {tradition.tradition} heritage sites are currently being cataloged.
            </div>
          )}
        </section>

        {/* Other Traditions Quick Links */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Explore Other Spiritual Traditions
          </h3>
          <div className="flex flex-wrap gap-2">
            {SPIRITUAL_TRADITIONS.filter((t) => traditionToSlug(t.tradition) !== traditionSlug).map((other) => {
              const otherSlug = traditionToSlug(other.tradition);
              return (
                <Link
                  key={otherSlug}
                  to={`/india/spiritual/tradition/${otherSlug}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-amber-500/40 hover:text-amber-600 transition-colors shadow-sm"
                >
                  {other.tradition} Tradition
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </div>
  );
};
