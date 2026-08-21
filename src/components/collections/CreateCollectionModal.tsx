import React, { useState } from 'react';
import { X, Layers, Globe, Lock, Sparkles, Image, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { collectionApi } from '../../api/collectionApi';
import { SpotCollection, CollectionVisibility } from '../../types';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCollection: SpotCollection) => void;
  initialBusinessId?: string;
}

const COVER_PRESETS = [
  { label: 'Cafes & Work', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80' },
  { label: 'Romantic Dates', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80' },
  { label: 'Street Food', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80' },
  { label: 'Heritage & Walks', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80' },
];

export const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialBusinessId,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cafes & Food');
  const [visibility, setVisibility] = useState<CollectionVisibility>('PUBLIC');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [customCover, setCustomCover] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide a collection title (at least 2 characters).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await collectionApi.createCollection({
        name: name.trim(),
        description: description.trim(),
        category,
        visibility,
        coverImage: customCover.trim() || coverImage,
        items: initialBusinessId ? [initialBusinessId] : [],
      });
      onSuccess(res.data);
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Layers className="h-4 w-4" />
            <h2 className="text-sm font-bold text-slate-900">Create New Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Collection Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Delhi Cafes, Date Places, Cheap Eats"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder:text-slate-400 font-medium"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this list special? Any specific insider tips or recommendations?"
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Category Tag</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-600"
            >
              <option value="Cafes & Food">Cafes & Coffee</option>
              <option value="Date Places">Date Places & Romantic</option>
              <option value="Street Food">Street Food & Cheap Eats</option>
              <option value="Weekend Plans">Weekend Plans & Heritage</option>
              <option value="Places to Visit">Must-Visit Landmarks</option>
              <option value="Nightlife">Nightlife & Lounges</option>
              <option value="Student Picks">Student Hostels & PGs</option>
              <option value="Services">Repairs & Tech Hubs</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Privacy & Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility('PUBLIC')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  visibility === 'PUBLIC'
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-medium ring-2 ring-indigo-100'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <Globe className="h-3.5 w-3.5" /> Public
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Anyone can view & follow this list
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility('PRIVATE')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  visibility === 'PRIVATE'
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-medium ring-2 ring-indigo-100'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Lock className="h-3.5 w-3.5" /> Private
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Only visible to your profile
                </span>
              </button>
            </div>
          </div>

          {/* Cover Photo Presets */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Choose Cover Photo</label>
            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCover('');
                  }}
                  className={`h-14 rounded-xl overflow-hidden border-2 relative transition-all ${
                    coverImage === preset.url && !customCover
                      ? 'border-indigo-600 ring-2 ring-indigo-200'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : undefined}
            >
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
