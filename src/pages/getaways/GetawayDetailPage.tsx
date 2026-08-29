import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Car,
  Train,
  Sparkles,
  ArrowRight,
  Navigation,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  Utensils,
  CheckCircle,
  HelpCircle,
  Share2,
  Bookmark,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { getGetawayBySlug, getRelatedGetaways } from '../../data/getaways/allWeekendGetaways';
import { GetawayCard } from '../../components/getaways/GetawayCard';
import { GetawayMapModal } from '../../components/getaways/GetawayMapModal';
import { GetawayVerificationNotice } from '../../components/getaways/GetawayVerificationNotice';
import { GetawayJsonLd } from '../../components/getaways/GetawayJsonLd';
import { WeekendGetawayPlace } from '../../types/weekendGetaways.types';

export const GetawayDetailPage: React.FC = () => {
  const { destinationSlug } = useParams<{ destinationSlug: string }>();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeMapPlace, setActiveMapPlace] = useState<WeekendGetawayPlace | null>(null);

  const place = useMemo(() => {
    if (!destinationSlug) return undefined;
    return getGetawayBySlug(destinationSlug);
  }, [destinationSlug]);

  const relatedPlaces = useMemo(() => {
    if (!place) return [];
    return getRelatedGetaways(place, 3);
  }, [place]);

  if (!place) {
    return <Navigate to="/delhi/weekend-getaways" replace />;
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Delhi NCR', url: '/delhi' },
    { name: 'Weekend Getaways', url: '/delhi/weekend-getaways' },
    { name: place.name, url: `/delhi/weekend-getaways/destination/${place.slug}` },
  ];

  const googleMapsUrl = `https://www.google.com/maps/dir/Delhi,+India/${encodeURIComponent(
    place.name + ', ' + place.state
  )}/@${place.coordinates.lat},${place.coordinates.lng},10z`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <GetawayJsonLd
        place={place}
        title={`${place.name} Weekend Trip From Delhi (${place.distanceKm} km) | Route, Itinerary & Tips`}
        description={`Plan your weekend trip to ${place.name} (${place.distanceKm} km from Delhi, ${place.state}). Complete guide with travel time (${place.estimatedDriveTime}), best route, trains, top things to do, and budget.`}
        canonicalUrl={`/delhi/weekend-getaways/destination/${place.slug}`}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header with Gallery & Metrics */}
      <div className="relative border-b border-slate-200 dark:border-slate-800 bg-slate-900">
        <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden">
          <img
            src={place.heroImage}
            alt={place.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between py-6 sm:py-8">
            <Container className="space-y-4">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link to="/delhi/weekend-getaways" className="hover:text-white transition-colors">
                  Weekend Getaways
                </Link>
                <span>/</span>
                <span className="text-sky-400 font-semibold">{place.name}</span>
              </nav>
            </Container>

            <Container className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-500/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md">
                  {place.distanceKm} km from Delhi
                </span>
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                  {place.state}
                </span>
                <span className="rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                  {place.budgetLevel}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {place.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
                {place.tagline}
              </p>
            </Container>
          </div>
        </div>
      </div>

      <Container className="py-10 space-y-10">
        <GetawayVerificationNotice />

        {/* Quick Action & Logistics Snapshot Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              <span>Ideal Duration</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {place.idealDuration}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              <Car className="h-4 w-4" />
              <span>Drive Time</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate" title={place.estimatedDriveTime}>
              {place.estimatedDriveTime.split('(')[0].trim()}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              <Calendar className="h-4 w-4" />
              <span>Best Months</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate" title={place.bestMonths}>
              {place.bestSeason.split('(')[0].trim()}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Estimated Budget</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate" title={place.approxBudgetPerCouple}>
              {place.approxBudgetPerCouple.split('(')[0].trim()}
            </div>
          </div>
        </div>

        {/* Main Content Layout: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center: Detailed Itinerary, Overview & Things to Do */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Why Visit */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  About {place.name}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {place.overview}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Why Go on This Weekend Break?
                </h3>
                <div className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
                  {place.whyGo.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Top Things To Do */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Top Things to Do & Experiences
                </h2>
                <span className="text-xs text-sky-600 font-bold">
                  {place.topThingsToDo.length} Activities
                </span>
              </div>

              <div className="space-y-3">
                {place.topThingsToDo.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-black text-white">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {act}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Must-Try Regional Food */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Utensils className="h-5 w-5" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Must-Try Regional Food & Specialties
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {place.mustTryFood.map((food, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-900 dark:text-amber-200"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </section>

            {/* Nearby Attractions */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Nearby Excursions & Attractions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {place.nearbyAttractions.map((att, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {att.name}
                      </h4>
                      <span className="rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 px-2 py-0.5 text-[11px] font-bold">
                        {att.distance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {att.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Practical Travel Tips */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
                <ShieldCheck className="h-5 w-5 text-sky-600" />
                <h3>Essential Traveler Tips & Advisory</h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {place.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Sidebar: Transport Logistics, Directions, Official Tourism & Related Hubs */}
          <div className="space-y-6">
            {/* Transit Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
              <div className="space-y-1">
                <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Transit & Logistics
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  How to Reach from Delhi
                </h3>
              </div>

              {/* Highway Route */}
              <div className="space-y-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <Car className="h-4 w-4 text-emerald-500" />
                  <span>Highway Route</span>
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                  {place.highwayRoute}
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Estimated Drive:</strong> {place.estimatedDriveTime}
                </div>
              </div>

              {/* Transit Options Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Transport Modes
                </div>
                {place.bestTransportOptions.map((opt, idx) => (
                  <div key={idx} className="space-y-1 text-xs border-l-2 border-sky-500 pl-3">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{opt.mode}</span>
                      <span className="text-sky-600 font-semibold">{opt.estimatedTime}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{opt.details}</p>
                  </div>
                ))}
              </div>

              {/* Google Maps Directions Action */}
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 py-3 text-xs font-bold text-white shadow-md transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Driving Route on Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Official Source & Tourism Board */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Official Tourism Source
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {place.officialTourismBoard}
              </div>
              <a
                href={place.officialTourismWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                <span>Visit Official State Tourism Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Connected Delhi Hubs for Internal Linking */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Connected Delhi Localities & Hubs
                </h4>
                <p className="text-[11px] text-slate-500">
                  Recommended Delhi pickup & boarding spots for this route.
                </p>
              </div>

              <div className="space-y-2">
                {place.connectedDelhiHubs.map((hub, idx) => (
                  <Link
                    key={idx}
                    to={hub.route}
                    className="block rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{hub.name}</span>
                      <ArrowRight className="h-3 w-3 text-sky-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {hub.context}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Destinations */}
        {relatedPlaces.length > 0 && (
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  More Escapes
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Similar Weekend Getaways You Might Like
                </h2>
              </div>
              <Link
                to="/delhi/weekend-getaways"
                className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlaces.map((relPlace) => (
                <GetawayCard
                  key={relPlace.id}
                  place={relPlace}
                  onOpenMap={(p) => setActiveMapPlace(p)}
                />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Map modal */}
      <GetawayMapModal
        place={activeMapPlace}
        onClose={() => setActiveMapPlace(null)}
      />
    </div>
  );
};
