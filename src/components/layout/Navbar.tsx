import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Search,
  MapPin,
  Sparkles,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Activity,
  Bookmark,
  Layers,
  Shield,
  Briefcase,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationBell } from '../notifications/NotificationBell';
import { SUPPORTED_CITIES } from '../../constants/locations';
import { useFilterStore } from '../../store/useFilterStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useHealth } from '../../hooks/useHealth';
import { ROUTES } from '../../constants/routes';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { city, setCity } = useFilterStore();
  const { user, isAuthenticated, logout, hasRole } = useAuthStore();
  const { data: healthData, isSuccess, isLoading } = useHealth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const currentCityObj = SUPPORTED_CITIES.find((c) => c.id === city) || SUPPORTED_CITIES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      {/* Top micro-bar: Tagline & City selection */}
      <div className="border-b border-slate-100 bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <Container size="xl" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-slate-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Discover the Best Food, Stays & Sights in Delhi NCR
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors font-semibold cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                <span>{currentCityObj.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCityDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white text-slate-900 shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select City
                    </div>
                    {SUPPORTED_CITIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCity(c.id);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          c.id === city ? 'font-bold text-indigo-600 bg-indigo-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.tag}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Container size="xl" className="h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Spot<span className="text-indigo-600">Picx</span>
          </span>
        </Link>

        {/* Global Search Bar in Header */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-4 relative"
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search momos, cafes, PGs, laptop repair in Delhi..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link
            to={ROUTES.HOME}
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname === ROUTES.HOME
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/events')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Events
          </Link>
          <Link
            to="/offers"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/offers')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Offers
          </Link>
          <Link
            to="/students"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/students')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Students
          </Link>
          <Link
            to="/housing"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/housing')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Housing
          </Link>
          <Link
            to="/jobs"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/jobs')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/discover"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/discover') || location.pathname.startsWith('/special')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Vibes
          </Link>
          <Link
            to="/india"
            className={`transition-colors hover:text-indigo-600 flex items-center gap-1 ${
              location.pathname.startsWith('/india')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
            <span>India</span>
          </Link>
          <Link
            to="/best-restaurants-in-delhi"
            className={`transition-colors hover:text-indigo-600 flex items-center gap-1 ${
              location.pathname.startsWith('/best-')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Top 10</span>
          </Link>
          <Link
            to="/articles"
            className={`transition-colors hover:text-indigo-600 ${
              location.pathname.startsWith('/articles') || location.pathname.startsWith('/article')
                ? 'text-indigo-600 font-semibold'
                : ''
            }`}
          >
            Magazine
          </Link>
          {hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) && (
            <Link
              to={ROUTES.BUSINESS_DASHBOARD}
              className={`transition-colors hover:text-emerald-600 flex items-center gap-1 ${
                location.pathname === ROUTES.BUSINESS_DASHBOARD
                  ? 'text-emerald-600 font-semibold'
                  : ''
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Business</span>
            </Link>
          )}
          {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
            <Link
              to={ROUTES.ADMIN}
              className={`transition-colors hover:text-indigo-600 flex items-center gap-1 ${
                location.pathname === ROUTES.ADMIN
                  ? 'text-indigo-600 font-semibold'
                  : ''
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-indigo-600" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Actions / Auth */}
        <div className="hidden sm:flex items-center gap-2.5">
          <NotificationBell />
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-indigo-600 font-semibold leading-none">{user.role}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-900 shadow-xl border border-slate-200 py-2 z-50 space-y-1">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                    </div>

                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to={ROUTES.SAVED}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <Bookmark className="h-3.5 w-3.5 text-slate-400" />
                      <span>Saved Spots</span>
                    </Link>

                    <Link
                      to={ROUTES.COLLECTIONS}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>Collections</span>
                    </Link>

                    {hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) && (
                      <Link
                        to={ROUTES.BUSINESS_DASHBOARD}
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 font-semibold"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Business Hub</span>
                      </Link>
                    )}

                    {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
                      <Link
                        to={ROUTES.ADMIN}
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-indigo-50 text-indigo-700 font-semibold"
                      >
                        <Shield className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Admin Control Panel</span>
                      </Link>
                    )}

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <button
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search spots in Delhi..."
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="flex flex-col space-y-1 pt-2 border-t border-slate-100">
            <Link
              to={ROUTES.HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Live Events & Fests
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Deals & Coupons
            </Link>
            <Link
              to="/students"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Student Hub (PGs, Cafes, Cheap Food)
            </Link>
            <Link
              to="/housing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Housing & PGs
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Jobs & Internships
            </Link>
            <Link
              to="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Vibe Discovery (Couples, Friends, Luxury)
            </Link>
            <Link
              to="/best-restaurants-in-delhi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-50 text-indigo-700 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Top 10 Picks & SEO Guides</span>
            </Link>
            <Link
              to="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Editorial Magazine & Stories
            </Link>
            <Link
              to={ROUTES.EXPLORE}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Explore All Categories
            </Link>
            <Link
              to={ROUTES.LOCATIONS}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Localities & Hubs
            </Link>
            <Link
              to={ROUTES.BUSINESSES}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              All Spots & Directory
            </Link>
            <Link
              to={ROUTES.COLLECTIONS}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
            >
              Curated Collections
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to={ROUTES.PROFILE}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
                >
                  My Profile ({user?.role})
                </Link>
                <Link
                  to={ROUTES.SAVED}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-800"
                >
                  Saved Spots
                </Link>
                {hasRole(['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']) && (
                  <Link
                    to={ROUTES.BUSINESS_DASHBOARD}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Business Hub
                  </Link>
                )}
                {hasRole(['ADMIN', 'SUPER_ADMIN']) && (
                  <Link
                    to={ROUTES.ADMIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Sign Out ({user?.name})
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to={ROUTES.LOGIN} className="w-1/2" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} className="w-1/2" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
