import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  MapPin,
  Calendar,
  Bookmark,
  Layers,
  Shield,
  Briefcase,
  LogOut,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Star,
  Trash2,
  Plus,
  Heart,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CollectionCard } from '../components/collections/CollectionCard';
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal';
import { BusinessCard } from '../components/discovery/BusinessCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useSavedStore } from '../store/useSavedStore';
import { collectionApi } from '../api/collectionApi';
import { favoriteApi } from '../api/favoriteApi';
import { SpotCollection, Business, UserRole } from '../types';
import { ROUTES } from '../constants/routes';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const { savedSpots } = useSavedStore();

  const [activeTab, setActiveTab] = useState<'collections' | 'bookmarks' | 'portals'>('collections');
  const [collections, setCollections] = useState<SpotCollection[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (user) {
      loadMyCollections();
    }
  }, [user]);

  const loadMyCollections = async () => {
    setLoadingCollections(true);
    try {
      const res = await collectionApi.getMyCollections();
      setCollections(res.data || []);
    } catch (e) {
      console.warn('Failed to load user collections', e);
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await collectionApi.deleteCollection(collectionId);
      setCollections((prev) => prev.filter((c) => c._id !== collectionId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete collection');
    }
  };

  if (!user) {
    return null;
  }

  const roleColors: Record<UserRole, { badge: 'neutral' | 'indigo' | 'success' | 'warning' | 'accent'; label: string }> = {
    SUPER_ADMIN: { badge: 'indigo', label: 'Super Admin' },
    ADMIN: { badge: 'indigo', label: 'System Admin' },
    EDITOR: { badge: 'warning', label: 'Curator / Editor' },
    BUSINESS_OWNER: { badge: 'success', label: 'Business Owner' },
    USER: { badge: 'neutral', label: 'Spot Explorer' },
  };

  const currentRoleInfo = roleColors[user.role] || { badge: 'neutral', label: user.role };

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="py-8 md:py-12 space-y-8 min-h-screen pb-28 bg-slate-50/30">
      <Container size="xl" className="space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md overflow-hidden shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Identity details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {user.name}
                  </h1>
                  <Badge variant={currentRoleInfo.badge} size="sm">
                    {currentRoleInfo.label}
                  </Badge>
                  {user.isActive && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" /> Active Member
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-mono">
                  @{user.username || user.email.split('@')[0]}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {user.city || 'Delhi'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Joined{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout & Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyId}
              >
                {copiedId ? 'ID Copied!' : 'Copy User ID'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* User Bio */}
          {user.bio && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Bio:</span> {user.bio}
            </div>
          )}
        </div>

        {/* Profile Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('collections')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'collections'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>My Collections ({collections.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bookmarks')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Saved Spots ({savedSpots.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('portals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'portals'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Portals & Roles</span>
              </button>
            </div>

            {activeTab === 'collections' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                New Collection
              </Button>
            )}
          </div>

          {/* Tab 1: My Collections */}
          {activeTab === 'collections' && (
            <div className="space-y-6">
              {loadingCollections ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
                  <span className="text-xs font-medium">Loading your collections...</span>
                </div>
              ) : collections.length === 0 ? (
                <EmptyState
                  icon={<Layers className="h-8 w-8 text-indigo-500" />}
                  title="No Collections Yet"
                  description="Create personalized lists for date nights, study cafes, shopping spots, or food crawls."
                  actionLabel="Create Your First Collection"
                  onAction={() => setIsCreateModalOpen(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((col) => (
                    <CollectionCard
                      key={col._id}
                      collection={col}
                      onDelete={handleDeleteCollection}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Saved Spots */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6">
              {savedSpots.length === 0 ? (
                <EmptyState
                  icon={<Bookmark className="h-8 w-8 text-orange-500" />}
                  title="No Saved Spots"
                  description="Browse Delhi's best spots and click the heart/bookmark icon to save them for later."
                  actionLabel="Explore Spots"
                  onAction={() => navigate(ROUTES.EXPLORE)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedSpots.map((spot) => (
                    <BusinessCard key={spot.slug} business={spot} viewMode="grid" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Portals & Security */}
          {activeTab === 'portals' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Business Owner Portal */}
                <Link to={ROUTES.BUSINESS_DASHBOARD} className="group">
                  <Card className={`p-6 transition-all h-full flex flex-col justify-between ${
                    hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN'])
                      ? 'border-emerald-200 hover:border-emerald-300 hover:shadow-md bg-emerald-50/30'
                      : 'border-slate-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Briefcase className="h-6 w-6" />
                        </div>
                        <Badge variant={hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'success' : 'neutral'} size="sm">
                          {hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'Unlocked' : 'Role Restricted'}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Business Owner Hub
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Manage your claimed spots, edit business information, respond to customer reviews, and view discovery analytics.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600 flex items-center justify-between">
                      <span>{hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'Open Dashboard' : 'Owner Access Required'}</span>
                      <span>→</span>
                    </div>
                  </Card>
                </Link>

                {/* Admin Control Panel */}
                <Link to={ROUTES.ADMIN} className="group">
                  <Card className={`p-6 transition-all h-full flex flex-col justify-between ${
                    hasRole(['ADMIN', 'SUPER_ADMIN'])
                      ? 'border-indigo-200 hover:border-indigo-300 hover:shadow-md bg-indigo-50/30'
                      : 'border-slate-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Shield className="h-6 w-6" />
                        </div>
                        <Badge variant={hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'indigo' : 'neutral'} size="sm">
                          {hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'Admin Access' : 'Role Guarded'}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        Admin Moderation Panel
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Moderate reported reviews, audit platform metrics, manage user roles, and curate high-profile verified spots.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                      <span>{hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'Open Admin Portal' : 'Admin Access Required'}</span>
                      <span>→</span>
                    </div>
                  </Card>
                </Link>

                {/* Discover & Search Hub */}
                <Link to={ROUTES.EXPLORE} className="group">
                  <Card className="p-6 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Explore Delhi
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Discover trending localities, top-rated street food, student favorites, and hidden gems across Delhi NCR.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                      <span>Explore Now</span>
                      <span>→</span>
                    </div>
                  </Card>
                </Link>
              </div>

              {/* Security Status Box */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Phase 7 User Authentication & Discovery Layer
                    </span>
                  </div>
                  <Badge variant="indigo" size="sm">JWT Verified</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <div className="text-slate-400">User Role (RBAC)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{user.role}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <div className="text-slate-400">Social Discovery</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">Reviews + Collections + Favorites</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <div className="text-slate-400">Data Architecture</div>
                    <div className="text-sm font-bold text-sky-400 mt-0.5">Dual-Mode (MongoDB + InMemory Fallback)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Create Collection Modal */}
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
