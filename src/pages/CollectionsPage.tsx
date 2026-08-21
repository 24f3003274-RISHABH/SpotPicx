import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  Plus,
  Compass,
  Filter,
  Loader2,
  Lock,
  Globe,
  Heart,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { CollectionCard } from '../components/collections/CollectionCard';
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal';
import { collectionApi } from '../api/collectionApi';
import { SpotCollection } from '../types';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../components/ui/EmptyState';

const CATEGORIES = [
  'All',
  'Cafes & Food',
  'Date Places',
  'Street Food',
  'Weekend Plans',
  'Places to Visit',
  'Nightlife',
  'Student Picks',
  'Services',
];

export const CollectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<SpotCollection[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'curated' | 'my'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'my' && user) {
        const res = await collectionApi.getMyCollections();
        setCollections(res.data || []);
      } else {
        const res = await collectionApi.getCollections({
          curatedOnly: activeTab === 'curated',
          limit: 30,
        });
        setCollections(res.data || []);
      }
    } catch (e) {
      console.warn('Failed to load collections', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [activeTab, user]);

  const filteredCollections = collections.filter((col) => {
    if (selectedCategory === 'All') return true;
    return col.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await collectionApi.deleteCollection(collectionId);
      setCollections((prev) => prev.filter((c) => c._id !== collectionId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete collection');
    }
  };

  return (
    <div className="py-8 md:py-12 space-y-8 min-h-screen bg-slate-50/40">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>City Guides & Playlists</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated Delhi Collections
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Explore thematic itineraries, insider food walks, romantic dates, study cafes, and custom lists crafted by local Delhiites.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (!user) {
                  alert('Please sign in to create your own collections.');
                  return;
                }
                setIsCreateModalOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Collection
            </Button>
          </div>
        </div>

        {/* Tab & Category Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Main Tabs */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Collections
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('curated')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'curated'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curated Picks</span>
              </button>
              {user && (
                <button
                  type="button"
                  onClick={() => setActiveTab('my')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'my'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>My Lists</span>
                </button>
              )}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredCollections.length} collections
            </span>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="text-xs font-medium">Loading discovery collections...</span>
          </div>
        ) : filteredCollections.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-8 w-8 text-indigo-500" />}
            title={activeTab === 'my' ? 'You have not created any collections' : 'No collections found'}
            description={
              activeTab === 'my'
                ? 'Create custom collections to organize places you want to visit or share with friends.'
                : 'Try adjusting your category filter or create a new collection.'
            }
            actionLabel="Create Collection"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((col) => (
              <CollectionCard
                key={col._id}
                collection={col}
                onDelete={handleDeleteCollection}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Create Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newCol) => {
          setCollections([newCol, ...collections]);
        }}
      />
    </div>
  );
};
