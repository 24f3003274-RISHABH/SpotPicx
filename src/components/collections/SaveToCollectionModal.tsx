import React, { useState, useEffect } from 'react';
import { X, Layers, Plus, Check, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { collectionApi } from '../../api/collectionApi';
import { SpotCollection, Business } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { CreateCollectionModal } from './CreateCollectionModal';

interface SaveToCollectionModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export const SaveToCollectionModal: React.FC<SaveToCollectionModalProps> = ({
  business,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<SpotCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchUserCollections = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await collectionApi.getMyCollections();
      setCollections(res.data || []);
    } catch (e) {
      console.warn('Failed to load user collections', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserCollections();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleToggle = async (collectionId: string) => {
    setTogglingId(collectionId);
    try {
      const bizId = business._id || (business as any).id || business.slug;
      const res = await collectionApi.toggleItem(collectionId, bizId);

      setCollections((prev) =>
        prev.map((c) => {
          if (c._id === collectionId) {
            const hasItem = res.data.isPresent;
            return {
              ...c,
              itemCount: res.data.itemCount,
              itemIds: hasItem
                ? [...(c.itemIds || []), bizId]
                : (c.itemIds || []).filter((id) => id !== bizId),
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update collection');
    } finally {
      setTogglingId(null);
    }
  };

  const isBusinessInCollection = (col: SpotCollection) => {
    const bizId = business._id || (business as any).id || business.slug;
    if (col.itemIds && col.itemIds.includes(bizId)) return true;
    if (col.items && col.items.some((item) => (item as any)._id === bizId || item.slug === bizId))
      return true;
    return false;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Save Spot
              </span>
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-[220px]">
                {business.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List of user collections */}
          <div className="p-5 space-y-3 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="text-xs">Loading collections...</span>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">No collections yet</p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mt-0.5">
                    Create custom thematic lists like "Weekend Brunch", "Date Spots" or "Pocket-Friendly Cafes".
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map((col) => {
                  const saved = isBusinessInCollection(col);
                  const isBusy = togglingId === col._id;

                  return (
                    <button
                      key={col._id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggle(col._id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        saved
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <img
                            src={col.coverImage}
                            alt={col.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate">{col.name}</h4>
                          <span className="text-[10px] text-slate-500">
                            {col.itemCount || 0} places saved
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors shrink-0 ${
                          saved
                            ? 'bg-indigo-600 text-white'
                            : 'border border-slate-300 text-transparent hover:border-slate-400'
                        }`}
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Create New Collection button */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              className="w-full"
            >
              New Collection
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Inline Create Collection Modal */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(newCol) => {
          setCollections([newCol, ...collections]);
          setIsCreateModalOpen(false);
        }}
        initialBusinessId={business._id || business.slug}
      />
    </>
  );
};
