import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Tag,
  Ticket,
  Flame,
  Music,
  Smile,
  Film,
  Compass,
  Cpu,
  Coffee,
  Palette,
  Lightbulb,
  X,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { EventCard } from '../components/events/EventCard';
import { eventService, EventFilterParams } from '../services/event.service';
import { EventCategoryType } from '../types';
import { SEOHead } from '../components/seo/SEOHead';

const EVENT_CATEGORIES: { label: string; value: EventCategoryType | 'all'; icon: any }[] = [
  { label: 'All Events', value: 'all', icon: Compass },
  { label: 'Concerts & Live', value: 'Concert', icon: Music },
  { label: 'Stand-up Comedy', value: 'Comedy', icon: Smile },
  { label: 'Theatre & Plays', value: 'Theatre', icon: Film },
  { label: 'Food Festivals', value: 'Food Festival', icon: Coffee },
  { label: 'Hackathons & AI', value: 'Hackathon', icon: Cpu },
  { label: 'Workshops', value: 'Workshop', icon: Palette },
  { label: 'Startup Mixers', value: 'Startup', icon: Lightbulb },
  { label: 'Cultural & Melas', value: 'Cultural', icon: Sparkles },
  { label: 'Tech Summits', value: 'Tech', icon: Cpu },
];

const TIMEFRAMES: { label: string; value: 'all' | 'today' | 'tomorrow' | 'weekend' | 'month' }[] = [
  { label: 'All Dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Weekend', value: 'weekend' },
  { label: 'This Month', value: 'month' },
];

const LOCALITIES = [
  'All Delhi NCR',
  'Connaught Place',
  'Hauz Khas Village',
  'Saket',
  'Pragati Vihar',
  'Greater Kailash',
  'South Extension',
  'Gurgaon',
  'Noida',
];

export const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'today' | 'tomorrow' | 'weekend' | 'month'>('all');
  const [selectedPrice, setSelectedPrice] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const queryParams: EventFilterParams = {
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    timeframe: selectedTimeframe,
    price: selectedPrice,
    locality: selectedLocality !== 'all' && selectedLocality !== 'All Delhi NCR' ? selectedLocality : undefined,
    query: searchQuery.trim() || undefined,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => eventService.getEvents(queryParams),
  });

  const events = data?.events || [];
  const totalCount = data?.total || 0;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTimeframe('all');
    setSelectedPrice('all');
    setSelectedLocality('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SEOHead
        title="Events & Experiences in Delhi NCR - Live Music, Comedy & Tech Fests | SpotPicks"
        description="Discover trending events, upcoming concerts, standup comedy shows, hackathons, and cultural fests happening across Delhi NCR today and this weekend."
      />

      {/* Hero Header */}
      <section className="bg-slate-900 text-white pt-10 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        <Container size="xl" className="relative z-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>SpotPicks Live Experience Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              What’s Happening in Delhi NCR
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              From open-air indie concerts and standup gigs to hackathons and food carnivals. Discover, book, and explore the city's pulse.
            </p>
          </div>

          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTimeframe === tf.value
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Filter & Listing Section */}
      <Container size="xl" className="mt-8 space-y-6">
        {/* Category Horizontal Scrolling Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EVENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, artist, venue, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Secondary Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Locality select */}
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-indigo-500"
            >
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Price toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setSelectedPrice('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPrice === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPrice('free')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPrice === 'free' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setSelectedPrice('paid')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedPrice === 'paid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Paid
              </button>
            </div>

            {(selectedCategory !== 'all' ||
              selectedTimeframe !== 'all' ||
              selectedPrice !== 'all' ||
              selectedLocality !== 'all' ||
              searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Showing <strong className="text-slate-900">{totalCount}</strong> upcoming events
          </span>
          <span className="text-indigo-600 font-medium">All timings in IST</span>
        </div>

        {/* Event Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No matching events found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We couldn't find events matching your active filters. Try clearing some criteria or changing the date timeframe.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </Container>
    </div>
  );
};
