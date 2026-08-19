import React, { useState } from 'react';
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
} from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { UserRole } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [copiedId, setCopiedId] = useState(false);

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
    <div className="py-10 space-y-8">
      <Container size="xl" className="space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

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
                      <CheckCircle2 className="h-3 w-3" /> Active Account
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

        {/* Portals & Role-Based Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saved Spots */}
          <Link to={ROUTES.SAVED} className="group">
            <Card className="p-5 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Bookmark className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Saved Spots
                </h3>
                <p className="text-xs text-slate-500">
                  Your bookmarked cafes, PGs, and local listings in Delhi
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                <span>View Bookmarks</span>
                <span>→</span>
              </div>
            </Card>
          </Link>

          {/* Curated Collections */}
          <Link to={ROUTES.COLLECTIONS} className="group">
            <Card className="p-5 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Curated Collections
                </h3>
                <p className="text-xs text-slate-500">
                  Curated lists: "Best Momos", "Late Night Cafes", "North Campus PGs"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                <span>Explore Lists</span>
                <span>→</span>
              </div>
            </Card>
          </Link>

          {/* Business Owner Portal (Guarded / Active for Owners & Admins) */}
          <Link to={ROUTES.BUSINESS_DASHBOARD} className="group">
            <Card className={`p-5 transition-all h-full flex flex-col justify-between ${
              hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN'])
                ? 'border-emerald-200 hover:border-emerald-300 hover:shadow-md bg-emerald-50/20'
                : 'border-slate-200 opacity-90'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <Badge variant={hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'success' : 'neutral'} size="sm">
                    {hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'Unlocked' : 'Role Restricted'}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Business Hub
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your claimed spots, inquiries, and customer leads
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600 flex items-center justify-between">
                <span>{hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) ? 'Open Dashboard' : 'Owner Only'}</span>
                <span>→</span>
              </div>
            </Card>
          </Link>

          {/* Admin Control Panel (Guarded / Active for Admins) */}
          <Link to={ROUTES.ADMIN} className="group">
            <Card className={`p-5 transition-all h-full flex flex-col justify-between ${
              hasRole(['ADMIN', 'SUPER_ADMIN'])
                ? 'border-indigo-200 hover:border-indigo-300 hover:shadow-md bg-indigo-50/20'
                : 'border-slate-200 opacity-90'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <Badge variant={hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'indigo' : 'neutral'} size="sm">
                    {hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'Admin Access' : 'Role Guarded'}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Admin Panel
                </h3>
                <p className="text-xs text-slate-500">
                  Manage user roles, platform security, and system metrics
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 flex items-center justify-between">
                <span>{hasRole(['ADMIN', 'SUPER_ADMIN']) ? 'Open Admin Portal' : 'Admin Only'}</span>
                <span>→</span>
              </div>
            </Card>
          </Link>
        </div>

        {/* Security & Token Info Inspection Widget */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Phase 2 Security & Authentication State
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
              <div className="text-slate-400">Token Protocol</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">JWT Access (15m) + HTTP-only Cookie (7d)</div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-slate-400">Password Encryption</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">Bcrypt (Salt Rounds 10)</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
