import React, { useEffect, useState } from 'react';
import {
  Calendar,
  PlusCircle,
  MapPin,
  Trash2,
  Clock,
  Tag,
  Loader2,
} from 'lucide-react';
import { adminService, AdminEvent } from '../../services/adminService';

export const AdminEventsTab: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('Champa Gali, Saket');
  const [locality, setLocality] = useState('Saidulajab, Saket');
  const [date, setDate] = useState('This Saturday, 6:00 PM');
  const [price, setPrice] = useState('Free Entry');
  const [category, setCategory] = useState('Music & Live Gigs');
  const [description, setDescription] = useState('');

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getEvents();
      setEvents(data);
    } catch (e) {
      console.error('Failed to load events:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const ev = await adminService.createEvent({
        title: title.trim(),
        venue: venue.trim(),
        locality: locality.trim(),
        city: 'Delhi',
        date: date.trim(),
        time: '6:00 PM - 10:00 PM',
        price: price.trim(),
        category,
        description: description.trim() || 'Exciting community weekend event in Delhi.',
        organizer: 'SpotPicks Delhi Curations',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        featured: true,
        status: 'UPCOMING',
      });
      setEvents([ev, ...events]);
      setIsAdding(false);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete event?')) return;
    try {
      await adminService.deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-600" />
            <span>Delhi City Events & Pop-ups ({events.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Publish weekend flea markets, indie gigs, artisanal coffee tastings, and heritage walks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Event</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Publish New Delhi Event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunset Acoustic Jam & Artisanal Brew Tasting"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Venue</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Locality</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Date / Time</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Ticket / Entry</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              Publish Event
            </button>
          </div>
        </form>
      )}

      {/* Events Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No events published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                    {ev.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {ev.price}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{ev.title}</h3>
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{ev.venue}, {ev.locality}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{ev.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">SpotPicks Featured</span>
                <button
                  type="button"
                  onClick={() => handleDelete(ev._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
