import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { HomePage } from '../pages/HomePage';
import { ExplorePage } from '../pages/ExplorePage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { CategoryDetailPage } from '../pages/CategoryDetailPage';
import { LocationsPage } from '../pages/LocationsPage';
import { LocationDetailPage } from '../pages/LocationDetailPage';
import { LocationHubPage } from '../pages/LocationHubPage';
import { SearchPage } from '../pages/SearchPage';
import { BusinessDetailPage } from '../pages/BusinessDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SavedSpotsPage } from '../pages/SavedSpotsPage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { AdminPage } from '../pages/AdminPage';
import { BusinessDashboardPage } from '../pages/BusinessDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        
        {/* Curated Explore Route */}
        <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />

        {/* Categories Routes */}
        <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
        <Route path={ROUTES.CATEGORY_DETAILS} element={<CategoryDetailPage />} />
        
        {/* Locations Routes */}
        <Route path={ROUTES.LOCATIONS} element={<LocationsPage />} />
        <Route path={ROUTES.LOCATION_DETAILS} element={<LocationDetailPage />} />

        {/* Database-Driven Location Dynamic Hubs */}
        <Route path="/delhi" element={<LocationHubPage />} />
        <Route path="/delhi/:categorySlug" element={<LocationHubPage />} />
        <Route path="/city/:citySlug" element={<LocationHubPage />} />
        <Route path="/city/:citySlug/:categorySlug" element={<LocationHubPage />} />

        {/* Search & Discovery Routes */}
        <Route path={ROUTES.BUSINESSES} element={<SearchPage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.BUSINESS_DETAILS} element={<BusinessDetailPage />} />
        <Route path={ROUTES.SPOT_DETAILS} element={<BusinessDetailPage />} />

        {/* Collections */}
        <Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />

        {/* Protected Routes (All Authenticated Users) */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SAVED}
          element={
            <ProtectedRoute>
              <SavedSpotsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes (Role: BUSINESS_OWNER, ADMIN, SUPER_ADMIN) */}
        <Route
          path={ROUTES.BUSINESS_DASHBOARD}
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']}>
              <BusinessDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes (Role: ADMIN, SUPER_ADMIN) */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>

      {/* Auth layout routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};
