import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  User,
  Share2,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { eventService } from '../services/event.service';
import { SEOHead } from '../components/seo/SEOHead';
import { EventCard } from '../components/events/EventCard';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => (slug ? eventService.getEventBySlug(slug) : Promise.reject('No slug')),
    enabled: !!slug,
  });

  const { data: relatedData } = useQuery({
    queryKey: ['related-events', event?.category],
    queryFn: () =>
      eventService.getEvents({
        category: event?.category as string,
        limit: 3,
      }),
    enabled: !!event?.category,
  });

  if (isLoading) {
    return (
      <Container size="lg" className="py-16">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-96 w-full bg-slate-200 rounded-3xl" />
          <div className="h-8 w-2/3 bg-slate-200 rounded" />
        </div>
      </Container>
    );
  }

  if (isError || !event) {
    return (
      <Container size="sm" className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested event may have been completed, rescheduled, or removed.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Events
        </Link>
      </Container>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isFree =
    String(event.ticketPrice).toLowerCase().includes('free') ||
    Number(event.ticketPrice) === 0;

  const dateFormatted = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeFormatted = `${startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  const relatedEvents = (relatedData?.events || []).filter((e) => e._id !== event._id);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      <SEOHead
        title={`${event.title} - ${event.venue}, Delhi NCR | SpotPicks Events`}
        description={event.description}
      />

      {/* Top breadcrumb navigation */}
      <div className="bg-white border-b border-slate-200">
        <Container size="xl" className="py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events Directory</span>
            </Link>

            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {event.category}
            </span>
          </div>
        </Container>
      </div>

      <Container size="xl" className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
              <img
                src={
                  event.images?.[0] ||
                  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'
                }
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                    {event.category}
                  </span>
                  {event.featured && (
                    <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Featured Pick
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Quick Meta Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Date & Schedule
                  </span>
                  <span className="block text-xs font-bold text-slate-900">{dateFormatted}</span>
                  <span className="block text-xs text-slate-500 font-medium">{timeFormatted}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Venue & Location
                  </span>
                  <span className="block text-xs font-bold text-slate-900">{event.venue}</span>
                  <span className="block text-xs text-slate-500 font-medium">
                    {event.location.address || event.location.locality}, {event.location.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About the Experience</h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {/* Highlights & Tags */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500">Tags & Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Booking & Organizer Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-20">
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ticket Pricing
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{event.ticketPrice}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {isFree ? 'Free registration' : 'per entry / pass'}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                {event.bookingUrl ? (
                  <a
                    href={event.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
                  >
                    <span>Book Tickets Online</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm text-center"
                  >
                    Walk-in Entry
                  </button>
                )}

                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 py-2 rounded-xl">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified SpotPicks Community Event</span>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Organized By
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{event.organizer}</span>
                    <span className="block text-[11px] text-slate-500">Official Host</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl font-black text-slate-900">
              More {event.category} Events You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((e) => (
                <EventCard key={e._id} event={e} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
