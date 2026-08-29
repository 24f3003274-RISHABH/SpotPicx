import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building,
  Utensils,
  ExternalLink,
  ChevronRight,
  Compass,
  CheckCircle,
  AlertCircle,
  Share2,
  Bookmark,
  Navigation,
  Globe,
  Info,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getSpiritualPlaceBySlug, getRelatedSpiritualPlaces } from '../../data/spiritual/allSpiritualPlaces';
import { SpiritualPlaceCard } from '../../components/spiritual/SpiritualPlaceCard';
import { SpiritualVerificationNotice } from '../../components/spiritual/SpiritualVerificationNotice';
import { SpiritualJsonLd } from '../../components/spiritual/SpiritualJsonLd';

export const SpiritualPlaceDetailPage: React.FC = () => {
  const { placeSlug } = useParams<{ placeSlug: string }>();
  const [copied, setCopied] = useState(false);

  const place = useMemo(() => {
    if (!placeSlug) return undefined;
    return getSpiritualPlaceBySlug(placeSlug);
  }, [placeSlug]);

  const relatedPlaces = useMemo(() => {
    if (!place) return [];
    return getRelatedSpiritualPlaces(place, 3);
  }, [place]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name,
        text: place?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!place) {
    return <Navigate to="/india/spiritual" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SpiritualJsonLd type="place" place={place} />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={place.heroImage}
            alt={place.name}
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <Container className="relative py-12 sm:py-16 space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/india/spiritual" className="hover:text-white transition-colors">
              Spiritual India
            </Link>
            <span>/</span>
            <Link to={`/india/spiritual/${place.stateSlug}`} className="hover:text-white transition-colors">
              {place.stateName}
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold truncate max-w-[200px] sm:max-w-none">
              {place.name}
            </span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                {place.tradition} Tradition
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/10">
                <MapPin className="h-3 w-3 text-amber-400" />
                {place.cityDistrict}, {place.stateName}
              </span>
              <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-medium text-slate-300 border border-white/5">
                {place.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {place.name}
            </h1>

            <p className="text-base sm:text-lg text-amber-200/90 font-medium">
              {place.traditionDetail}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {place.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 text-xs font-bold transition-colors shadow-lg shadow-amber-600/20"
              >
                <Navigation className="h-4 w-4" />
                Get Directions / Map
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                <Share2 className="h-4 w-4" />
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 space-y-12">
        {/* Verification and source banner */}
        <SpiritualVerificationNotice
          officialSource={place.officialSource}
          officialWebsite={place.officialWebsite}
        />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Historical Significance */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Building className="h-4 w-4" />
                <span>Historical Heritage</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Historical Significance
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.historicalSignificance}
              </p>

              {place.culturalSignificance && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Cultural & Devotional Significance
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {place.culturalSignificance}
                  </p>
                </div>
              )}
            </section>

            {/* Architecture Section */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Compass className="h-4 w-4" />
                <span>Architectural Design</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Architecture & Sacred Layout
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {place.architecturalStyle}
              </p>
            </section>

            {/* Why People Visit & Things to See */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Pilgrimage Experience</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Why People Visit & Key Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {place.whyPeopleVisit.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5"
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Festivals & Observances */}
            {place.festivals && place.festivals.length > 0 && (
              <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Calendar className="h-4 w-4" />
                  <span>Associated Festivals</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Festivals & Special Celebrations
                </h2>
                <div className="space-y-3 pt-2">
                  {place.festivals.map((fest, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {fest.name}
                        </h4>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                          {fest.period}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {fest.significance}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Image Gallery */}
            {place.galleryImages && place.galleryImages.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {place.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {img.caption && (
                        <p className="p-3 text-xs text-slate-600 dark:text-slate-400 italic">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Practical Visitor Guide Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Visitor Information & Logistics
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Suggested Duration:
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                    {place.suggestedDuration}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Best Time & Darshan Timings:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {place.bestTimeToVisit}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-500 dark:text-slate-400 mb-0.5">
                    Official Authority / Trust:
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {place.officialSource}
                  </div>
                </div>
              </div>
            </div>

            {/* Dress Code & Etiquette Box */}
            {place.dressCodeEtiquette && place.dressCodeEtiquette.length > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Dress Code & Etiquette</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {place.dressCodeEtiquette.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nearby Heritage Attractions */}
            {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Nearby Heritage & Sightseeing
                </h3>
                <div className="space-y-2">
                  {place.nearbyAttractions.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-2.5 text-xs"
                    >
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {attr.name}
                        {attr.isHeritage && (
                          <span className="ml-1.5 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                            Heritage
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 shrink-0 font-medium">
                        {attr.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Food & Cultural Spots */}
            {place.nearbyFoodAndCulture && place.nearbyFoodAndCulture.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Utensils className="h-3.5 w-3.5 text-amber-600" />
                  <span>Nearby Food & Langar / Prasadam</span>
                </div>
                <div className="space-y-2">
                  {place.nearbyFoodAndCulture.map((food, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {food.name}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                        {food.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Places Carousel / Grid */}
        {relatedPlaces.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Related Spiritual Destinations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Explore other sacred places in {place.stateName} or within the {place.tradition} tradition
                </p>
              </div>
              <Link
                to={`/india/spiritual/${place.stateSlug}`}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                View all in {place.stateName} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlaces.map((relPlace) => (
                <SpiritualPlaceCard key={relPlace.id} place={relPlace} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};
