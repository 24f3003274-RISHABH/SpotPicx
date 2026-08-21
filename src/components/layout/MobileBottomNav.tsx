import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Bookmark, User } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuthStore } from '../../store/useAuthStore';

export const MobileBottomNav: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    {
      label: 'Home',
      to: ROUTES.HOME,
      icon: Home,
      exact: true,
    },
    {
      label: 'Explore',
      to: ROUTES.EXPLORE,
      icon: Compass,
    },
    {
      label: 'Search',
      to: ROUTES.SEARCH,
      icon: Search,
    },
    {
      label: 'Saved',
      to: isAuthenticated ? ROUTES.SAVED : ROUTES.LOGIN,
      icon: Bookmark,
    },
    {
      label: 'Profile',
      to: isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN,
      icon: User,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[44px] transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-600 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    <Icon className={`h-5 w-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
