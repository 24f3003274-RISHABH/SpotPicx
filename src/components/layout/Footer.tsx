import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { POPULAR_DELHI_LOCALITIES } from '../../constants/locations';
import { ROUTES } from '../../constants/routes';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-sm">
      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Spot<span className="text-indigo-600">Picks</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Discover. Explore. Pick the Best.
              <br />
              The definitive data-driven local discovery platform curating restaurants, cafes, stays, heritage sights, and essential services across Delhi NCR.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-slate-700">SpotPicks API v1 Healthy</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/category/food-dining" className="hover:text-indigo-600 transition-colors">
                  Food & Cafes
                </Link>
              </li>
              <li>
                <Link to="/category/stays-living" className="hover:text-indigo-600 transition-colors">
                  Hotels & PGs
                </Link>
              </li>
              <li>
                <Link to="/category/places-heritage" className="hover:text-indigo-600 transition-colors">
                  Monuments & Parks
                </Link>
              </li>
              <li>
                <Link to="/category/shopping-markets" className="hover:text-indigo-600 transition-colors">
                  Shopping & Bazaars
                </Link>
              </li>
              <li>
                <Link to="/category/services-repairs" className="hover:text-indigo-600 transition-colors">
                  Repair & Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Localities in Delhi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Delhi Localities
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              {POPULAR_DELHI_LOCALITIES.slice(0, 6).map((loc) => (
                <li key={loc.id}>
                  <Link
                    to={`/explore?locality=${loc.id}`}
                    className="hover:text-indigo-600 transition-colors flex items-center justify-between"
                  >
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-slate-400">{loc.area}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              SpotPicks Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to={ROUTES.EXPLORE} className="hover:text-indigo-600 transition-colors">
                  Explore Directory
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="hover:text-indigo-600 transition-colors">
                  Business Owner Login
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="hover:text-indigo-600 transition-colors">
                  Claim or List a Spot
                </Link>
              </li>
              <li>
                <a
                  href="/api/v1/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1 font-semibold text-slate-700"
                >
                  System API Health <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} <span className="font-bold text-slate-700">SpotPicks</span> — Discover. Explore. Pick the Best.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Community Guidelines</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
