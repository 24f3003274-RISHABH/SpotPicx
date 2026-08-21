import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { CollectionDetailPage } from '../pages/CollectionDetailPage';
import { ArticlesPage } from '../pages/ArticlesPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { OffersPage } from '../pages/OffersPage';
import { StudentHubPage } from '../pages/StudentHubPage';
import { HousingPage } from '../pages/HousingPage';
import { JobsPage } from '../pages/JobsPage';
import { SpecialDiscoveryPage } from '../pages/SpecialDiscoveryPage';
import { SeoPageTemplate } from '../pages/SeoPageTemplate';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';

// Business Owner Dashboard Components
import { BusinessDashboardLayout } from '../pages/business/BusinessDashboardLayout';
import { BusinessOverviewTab } from '../pages/business/BusinessOverviewTab';
import { BusinessListingsTab } from '../pages/business/BusinessListingsTab';
import { BusinessListingEditor } from '../pages/business/BusinessListingEditor';
import { BusinessReviewsTab } from '../pages/business/BusinessReviewsTab';
import { BusinessOffersTab } from '../pages/business/BusinessOffersTab';
import { BusinessAnalyticsTab } from '../pages/business/BusinessAnalyticsTab';

// Admin Dashboard Components
import { AdminDashboardLayout } from '../pages/admin/AdminDashboardLayout';
import { AdminOverviewTab } from '../pages/admin/AdminOverviewTab';
import { AdminUsersTab } from '../pages/admin/AdminUsersTab';
import { AdminBusinessesTab } from '../pages/admin/AdminBusinessesTab';
import { AdminClaimsTab } from '../pages/admin/AdminClaimsTab';
import { AdminCategoriesTab } from '../pages/admin/AdminCategoriesTab';
import { AdminLocationsTab } from '../pages/admin/AdminLocationsTab';
import { AdminReviewsTab } from '../pages/admin/AdminReviewsTab';
import { AdminReportsTab } from '../pages/admin/AdminReportsTab';
import { AdminEventsTab } from '../pages/admin/AdminEventsTab';
import { AdminOffersTab } from '../pages/admin/AdminOffersTab';
import { AdminArticlesTab } from '../pages/admin/AdminArticlesTab';
import { AdminSeoPagesTab } from '../pages/admin/AdminSeoPagesTab';

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

        {/* Articles & Editorial Magazine */}
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />

        {/* Phase 10: Events, Offers, Jobs & Specialized Discovery */}
        <Route path={ROUTES.EVENTS} element={<EventsPage />} />
        <Route path={ROUTES.EVENT_DETAILS} element={<EventDetailPage />} />
        <Route path={ROUTES.OFFERS} element={<OffersPage />} />
        <Route path={ROUTES.STUDENTS} element={<StudentHubPage />} />
        <Route path={ROUTES.HOUSING} element={<HousingPage />} />
        <Route path={ROUTES.JOBS} element={<JobsPage />} />
        <Route path={ROUTES.SPECIAL_DISCOVERY} element={<SpecialDiscoveryPage />} />
        <Route path="/special" element={<SpecialDiscoveryPage />} />

        {/* Dynamic SEO Landing Pages (Top 10 Guides & Neighborhood Picks) */}
        <Route path="/best-:slug" element={<SeoPageTemplate />} />
        <Route path="/top-:slug" element={<SeoPageTemplate />} />
        <Route path="/guide/:slug" element={<SeoPageTemplate />} />

        {/* Collections */}
        <Route path={ROUTES.COLLECTIONS} element={<CollectionsPage />} />
        <Route path={ROUTES.COLLECTION_DETAILS} element={<CollectionDetailPage />} />

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

        {/* Protected Business Owner Dashboard */}
        <Route
          path="/business"
          element={
            <ProtectedRoute allowedRoles={['BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN']}>
              <BusinessDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.BUSINESS_DASHBOARD} replace />} />
          <Route path="dashboard" element={<BusinessOverviewTab />} />
          <Route path="businesses" element={<BusinessListingsTab />} />
          <Route path="businesses/new" element={<BusinessListingEditor />} />
          <Route path="businesses/:id/edit" element={<BusinessListingEditor />} />
          <Route path="reviews" element={<BusinessReviewsTab />} />
          <Route path="offers" element={<BusinessOffersTab />} />
          <Route path="analytics" element={<BusinessAnalyticsTab />} />
        </Route>

        {/* Protected Admin Control Center */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewTab />} />
          <Route path="users" element={<AdminUsersTab />} />
          <Route path="businesses" element={<AdminBusinessesTab />} />
          <Route path="claims" element={<AdminClaimsTab />} />
          <Route path="categories" element={<AdminCategoriesTab />} />
          <Route path="locations" element={<AdminLocationsTab />} />
          <Route path="reviews" element={<AdminReviewsTab />} />
          <Route path="reports" element={<AdminReportsTab />} />
          <Route path="events" element={<AdminEventsTab />} />
          <Route path="offers" element={<AdminOffersTab />} />
          <Route path="articles" element={<AdminArticlesTab />} />
          <Route path="seo-pages" element={<AdminSeoPagesTab />} />
        </Route>

        {/* Generic SEO Page & Guide Slug Matcher */}
        <Route path="/:slug" element={<SeoPageTemplate />} />

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

