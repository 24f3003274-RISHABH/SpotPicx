import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  MapPin,
  Globe,
  Lock,
  ArrowLeft,
  Share2,
  Trash2,
  Map,
  Grid,
  Plus,
  Loader2,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { MapView } from '../components/location/MapView';
import { ShareButton } from '../components/common/ShareButton';
import { collectionApi } from '../api/collectionApi';
import { SpotCollection, Business } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { EmptyState } from '../components/ui/EmptyState';

export const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { coordinates: userCoords } = useGeolocation();

  const [collection, setCollection] = useState<SpotCollection | null>(null);
  const [items, setItems] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedSpot, setSelectedSpot] = useState<Business | null>(null);

  const fetchCollection = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await collectionApi.getCollectionById(id);
      setCollection(res.data);
      setItems((res.data.items as Business[]) || []);
    } catch (e) {
      console.warn('Failed to load collection', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="text-xs font-medium">Loading collection...</span>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="py-20 text-center space-y-4">
        <Container size="md">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Collection Not Found</h2>
          <p className="text-sm text-slate-500">
            This collection does not exist or may have been deleted by the owner.
          </p>
          <Link to="/collections">
            <Button size="md" variant="primary">
              Browse All Collections
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const isOwner = user && user.id === collection.owner?._id;

  const handleRemoveSpot = async (businessId: string) => {
    if (!confirm('Remove this spot from collection?')) return;
    try {
      await collectionApi.toggleItem(collection._id, businessId);
      setItems((prev) => prev.filter((b) => (b._id || b.slug) !== businessId));
    } catch (e: any) {
      alert(e.message || 'Failed to update collection');
    }
  };

  return (
    <div className="py-8 space-y-8 min-h-screen pb-24">
      <Container size="xl" className="space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Collections</span>
          </Link>
        </div>

        {/* Collection Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <div className="h-64 sm:h-80 bg-slate-900 relative">
            <img
              src={
                collection.coverImage ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'
              }
              alt={collection.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {collection.isCurated && (
                  <Badge variant="indigo" size="sm" className="bg-indigo-600 text-white font-bold">
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Curator Pick
                  </Badge>
                )}
                <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur font-semibold text-slate-900">
                  {collection.category || 'Delhi Explorer'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-white backdrop-blur flex items-center gap-1.5">
                  {collection.visibility === 'PRIVATE' ? (
                    <>
                      <Lock className="h-3 w-3 text-amber-400" /> Private Collection
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3 text-emerald-400" /> Public Guide
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> {items.length} Curated Spots
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          {/* Sub-bar: Creator info & Actions */}
          <div className="bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {collection.owner?.avatar ? (
                  <img src={collection.owner.avatar} alt={collection.owner.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span>{collection.owner?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Curated by {collection.owner?.name || 'SpotPicks Team'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Updated{' '}
                  {new Date(collection.updatedAt || collection.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grid view"
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    viewMode === 'map'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Map view"
                >
                  <Map className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>

              <ShareButton
                title={collection.name}
                text={`Explore this curated collection on SpotPicks: "${collection.name}"`}
                variant="outline"
                size="sm"
                label="Share Collection"
              />
            </div>
          </div>
        </div>

        {/* Spots Content */}
        {items.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-8 w-8 text-indigo-500" />}
            title="Collection is Empty"
            description="Browse Delhi spots and click 'Add to Collection' to populate this playlist!"
            actionLabel="Discover Spots"
            onAction={() => navigate('/search')}
          />
        ) : viewMode === 'map' ? (
          <div className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <MapView
              businesses={items}
              selectedBusiness={selectedSpot}
              onSelectBusiness={setSelectedSpot}
              userCoords={userCoords}
              interactive={true}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((spot) => (
              <div key={spot._id || spot.slug} className="relative group">
                <BusinessCard business={spot} viewMode="grid" />
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpot(spot._id || spot.slug)}
                    className="absolute top-3 right-12 z-20 p-1.5 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white transition-colors shadow-md opacity-0 group-hover:opacity-100"
                    title="Remove from collection"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
