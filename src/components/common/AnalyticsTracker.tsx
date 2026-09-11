import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView, GA_MEASUREMENT_ID } from '../../utils/analytics';

/**
 * AnalyticsTracker component
 * 
 * Sits inside React Router's <BrowserRouter> to listen for SPA route changes
 * and sends clean, deduplicated page_view events to Google Analytics 4.
 */
export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const lastTrackedPathRef = useRef<string>('');

  // 1. Initialize Google Tag on mount (only once)
  useEffect(() => {
    initGA(GA_MEASUREMENT_ID);
  }, []);

  // 2. Track page views on route and query string changes
  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;

    // Prevent duplicate page_view events if path has not changed
    if (lastTrackedPathRef.current === currentPath) {
      return;
    }

    lastTrackedPathRef.current = currentPath;

    // Allow components (e.g. SEOHead) to update document.title first
    const timeoutId = setTimeout(() => {
      trackPageView(currentPath, document.title);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location.pathname, location.search]);

  return null;
};
