import React, { useEffect, useState } from 'react';
import {
  MapPin,
  PlusCircle,
  Trash2,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { discoveryService } from '../../services/discoveryService';
import { LocationItem } from '../../types';

export const AdminLocationsTab: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLocName, setNewLocName] = useState('');
  const [newLocSlug, setNewLocSlug] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const data = await discoveryService.getLocations();
      setLocations(data);
    } catch (e) {
      console.error('Failed to load locations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    const loc: LocationItem = {
      _id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      slug: newLocSlug.trim() || newLocName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      type: 'LOCALITY',
      latitude: 28.5244,
      longitude: 77.2066,
      pincode: '110030',
      isActive: true,
      businessCount: 0,
      description: `Explore top cafes, boutiques and spots in ${newLocName}.`,
    };
    setLocations([...locations, loc]);
    setNewLocName('');
    setNewLocSlug('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete location hub?')) return;
    setLocations(locations.filter((l) => (l._id || l.slug) !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rose-600" />
            <span>Delhi Locality & Neighborhood Hubs ({locations.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Manage discovery hubs: Saket, Hauz Khas, Connaught Place, Khan Market, Majnu Ka Tilla.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Hub</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddLocation} className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Create New Delhi Hub</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Locality Name (e.g. Shahpur Jat)"
              value={newLocName}
              onChange={(e) => {
                setNewLocName(e.target.value);
                setNewLocSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
            <input
              type="text"
              placeholder="URL Slug (e.g. shahpur-jat)"
              value={newLocSlug}
              onChange={(e) => setNewLocSlug(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
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
              Save Hub
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <div
            key={loc._id || loc.slug}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">{loc.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">/location/{loc.slug}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {loc.city}, Delhi NCR
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(loc._id || loc.slug)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
