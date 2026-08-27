import React from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  MessageSquareQuote,
  Tag,
  BarChart3,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Users,
  CreditCard,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const BusinessDashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: 'Overview',
      path: ROUTES.BUSINESS_DASHBOARD,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'My Listings',
      path: ROUTES.BUSINESS_LISTINGS,
      icon: Store,
    },
    {
      label: 'Customer Leads & CRM',
      path: ROUTES.BUSINESS_LEADS,
      icon: Users,
    },
    {
      label: 'Plans & Subscription',
      path: ROUTES.BUSINESS_SUBSCRIPTION,
      icon: CreditCard,
    },
    {
      label: 'Customer Reviews',
      path: ROUTES.BUSINESS_REVIEWS,
      icon: MessageSquareQuote,
    },
    {
      label: 'Promotional Offers',
      path: ROUTES.BUSINESS_OFFERS,
      icon: Tag,
    },
    {
      label: 'Analytics & Insights',
      path: ROUTES.BUSINESS_ANALYTICS,
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <Container size="xl">
        {/* Header Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Proprietor Portal</span>
              </span>
              <span className="text-xs text-slate-400">• Delhi NCR Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Business Owner Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage your Delhi spot listings, engage directly with customer reviews, publish promotional deals, and track real-time discovery analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to={ROUTES.BUSINESS_CREATE}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Listing</span>
            </Link>
            <Link
              to={ROUTES.EXPLORE}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs transition-all cursor-pointer border border-white/10"
            >
              <span>View Public Directory</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <nav className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                <span>Delhi Growth Tip</span>
              </div>
              <p className="text-xs text-indigo-950/80 leading-relaxed">
                Establishments offering an active promotional coupon receive <strong>3.4x more direction requests</strong> from weekend explorers.
              </p>
              <Link
                to={ROUTES.BUSINESS_OFFERS}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Create offer now</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </Container>
    </div>
  );
};
