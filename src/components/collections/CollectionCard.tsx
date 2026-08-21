import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Lock, Globe, Sparkles, MapPin, Heart, Share2, Trash2 } from 'lucide-react';
import { SpotCollection } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShareButton } from '../common/ShareButton';
import { useAuth } from '../../hooks/useAuth';

interface CollectionCardProps {
  collection: SpotCollection;
  onDelete?: (collectionId: string) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onDelete }) => {
  const { user, hasRole } = useAuth();
  const isOwner = user && user.id === collection.owner?._id;
  const canDelete = isOwner || hasRole(['ADMIN', 'SUPER_ADMIN']);

  const shareUrl = `${window.location.origin}/collections/${collection._id || collection.slug}`;

  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-xs hover:shadow-md transition-all rounded-2xl flex flex-col justify-between group bg-white">
      {/* Cover Image Header */}
      <div className="h-48 bg-slate-900 relative overflow-hidden">
        <img
          src={
            collection.coverImage ||
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
          }
          alt={collection.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {collection.isCurated && (
              <Badge variant="indigo" size="sm" className="bg-indigo-600 text-white font-bold">
                <Sparkles className="h-3 w-3 mr-1" /> Curator Pick
              </Badge>
            )}
            <Badge variant="neutral" size="sm" className="bg-white/90 backdrop-blur font-medium text-slate-800">
              {collection.category || 'Delhi Explorer'}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`p-1.5 rounded-full text-xs backdrop-blur ${
                collection.visibility === 'PRIVATE'
                  ? 'bg-slate-900/80 text-amber-300'
                  : 'bg-white/80 text-slate-800'
              }`}
              title={collection.visibility === 'PRIVATE' ? 'Private to you' : 'Public collection'}
            >
              {collection.visibility === 'PRIVATE' ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Globe className="h-3 w-3" />
              )}
            </span>
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(collection._id);
                }}
                className="p-1.5 rounded-full bg-slate-900/80 text-rose-300 hover:text-rose-100 hover:bg-rose-900/80 transition-colors"
                title="Delete Collection"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Title & Item Count */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <Layers className="h-3 w-3" /> {collection.itemCount || collection.items?.length || 0} Spots Included
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5 leading-snug drop-shadow-xs">
            {collection.name}
          </h3>
        </div>
      </div>

      {/* Body & Creator Info */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {collection.description || 'A handpicked compilation of notable spots in Delhi NCR.'}
        </p>

        {/* Creator details & actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
              {collection.owner?.avatar ? (
                <img src={collection.owner.avatar} alt={collection.owner.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{collection.owner?.name?.charAt(0).toUpperCase() || 'E'}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate">
              {collection.owner?.name || 'SpotPicks Community'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ShareButton
              title={collection.name}
              text={`Check out this curated Delhi collection: "${collection.name}"`}
              url={shareUrl}
              variant="ghost"
              size="sm"
              label=""
            />
            <Link to={`/collections/${collection._id || collection.slug}`}>
              <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">
                View List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
