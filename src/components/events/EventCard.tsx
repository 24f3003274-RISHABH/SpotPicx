import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { EventItem } from '../../types';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.startDate);
  const monthName = startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNumber = startDate.getDate();
  const timeFormatted = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isFree =
    String(event.ticketPrice).toLowerCase().includes('free') ||
    Number(event.ticketPrice) === 0;

  const coverImage =
    event.images && event.images.length > 0
      ? event.images[0]
      : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Date Ribbon */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Date Box */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl p-2 text-center shadow-md border border-slate-100 min-w-[52px]">
          <span className="block text-[10px] font-bold text-indigo-600 tracking-wider">
            {monthName}
          </span>
          <span className="block text-lg font-black text-slate-900 leading-none">
            {dayNumber}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
            {event.category}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg shadow-sm ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            <Ticket className="h-3 w-3" />
            {event.ticketPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {timeFormatted}
            </span>
            <span>•</span>
            <span className="truncate">{event.organizer}</span>
          </div>

          <Link to={`/events/${event.slug}`} className="block">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 text-slate-700 font-medium truncate max-w-[200px]">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}, {event.location.locality}</span>
            </div>
            {event.featured && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                <Sparkles className="h-2.5 w-2.5 fill-amber-500" /> Featured
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.slug}`}
              className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-800 hover:text-indigo-600 font-bold text-xs transition-colors"
            >
              View Details
            </Link>
            {event.bookingUrl && (
              <a
                href={event.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center justify-center gap-1 transition-colors shadow-sm"
              >
                <span>Book</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
