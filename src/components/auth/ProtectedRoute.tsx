import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ROUTES } from '../../constants/routes';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, user, hasRole } = useAuthStore();

  // 1. Not Authenticated -> Redirect to Login with state
  if (!isAuthenticated || !user) {
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Role Check: If allowedRoles is provided, verify user permissions
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <Badge variant="warning" size="sm">
              Role Access Restricted
            </Badge>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Access Restricted
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This portal requires one of the following permissions: <br />
              <span className="font-semibold text-slate-800">[{allowedRoles.join(', ')}]</span>.
            </p>
            <div className="pt-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
              Your active role is <span className="font-bold text-indigo-600">{user.role}</span>.
            </div>
          </div>

          <div className="pt-3 flex flex-col gap-2">
            <Link to={ROUTES.HOME}>
              <Button variant="primary" className="w-full">
                Return to Home
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                View My Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render children or Outlet
  return <>{children}</>;
};
