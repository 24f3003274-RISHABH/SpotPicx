import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Users,
  Store,
  FolderTree,
  MapPin,
  ShieldCheck,
  MessageSquareQuote,
  Flag,
  Calendar,
  Tag,
  FileText,
  SearchCode,
  ExternalLink,
  Database,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { ROUTES } from '../../constants/routes';

export const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();

  const adminNav = [
    { label: 'Overview', path: ROUTES.ADMIN, icon: LayoutDashboard, exact: true },
    { label: 'Revenue & Monetization', path: ROUTES.ADMIN_REVENUE, icon: DollarSign },
    { label: 'Analytics & Command Center', path: ROUTES.ADMIN_ANALYTICS, icon: BarChart3 },
    { label: 'Data Ingestion & Feeds', path: ROUTES.ADMIN_DATA_SOURCES, icon: Database },
    { label: 'Users', path: ROUTES.ADMIN_USERS, icon: Users },
    { label: 'Businesses', path: ROUTES.ADMIN_BUSINESSES, icon: Store },
    { label: 'Ownership Claims', path: ROUTES.ADMIN_CLAIMS, icon: ShieldCheck },
    { label: 'Categories', path: ROUTES.ADMIN_CATEGORIES, icon: FolderTree },
    { label: 'Locations & Hubs', path: ROUTES.ADMIN_LOCATIONS, icon: MapPin },
    { label: 'Reviews Moderation', path: ROUTES.ADMIN_REVIEWS, icon: MessageSquareQuote },
    { label: 'User Reports', path: ROUTES.ADMIN_REPORTS, icon: Flag },
    { label: 'City Events', path: ROUTES.ADMIN_EVENTS, icon: Calendar },
    { label: 'Promotional Offers', path: ROUTES.ADMIN_OFFERS, icon: Tag },
    { label: 'Curated Articles', path: ROUTES.ADMIN_ARTICLES, icon: FileText },
    { label: 'SEO & Meta Pages', path: ROUTES.ADMIN_SEO_PAGES, icon: SearchCode },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 py-8">
      <Container size="xl">
        {/* Admin Header Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Super Admin Panel</span>
              </span>
              <span className="text-xs text-slate-400">• SpotPicks Core Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Full platform governance: claim approval, content moderation, spot verification, Delhi category taxonomy, events calendar, and SEO landing pages.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs transition-all border border-white/10"
            >
              <span>Back to Public App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Admin Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <nav className="bg-white rounded-3xl border border-slate-200 p-2.5 shadow-xs space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 rounded-3xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-700">
                <ShieldAlert className="h-3.5 w-3.5" /> Security Enforced
              </p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                All admin mutations enforce server-side JWT authentication & RBAC verification.
              </p>
            </div>
          </aside>

          {/* Admin Tab View */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </Container>
    </div>
  );
};
