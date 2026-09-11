/**
 * Google Analytics 4 (GA4) Integration Utility for SpotPicx SPA
 * 
 * Provides unified, duplicate-safe pageview and event tracking using Google gtag.js.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Default production GA4 Measurement ID for SpotPicx
export const DEFAULT_GA_MEASUREMENT_ID = 'G-XE6TKDXPNN';

export const GA_MEASUREMENT_ID: string =
  (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;

let isInitialized = false;

/**
 * Initializes Google Analytics 4 script and global gtag function once.
 * Note: 'send_page_view: false' is explicitly configured so GA4 does NOT
 * send an automatic page_view before our SPA router can coordinate it,
 * preventing duplicate pageview events on initial load.
 */
export function initGA(measurementId: string = GA_MEASUREMENT_ID): void {
  if (typeof window === 'undefined') return;

  // Prevent multiple script insertions
  if (isInitialized || document.getElementById('ga4-gtag-script')) {
    return;
  }

  if (!measurementId || !measurementId.trim()) {
    if ((import.meta as any).env?.DEV) {
      console.warn('[GA4] No Measurement ID provided; skipping Google Analytics initialization.');
    }
    return;
  }

  // 1. Initialize dataLayer and gtag stub
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  window.gtag('js', new Date());

  // 2. Configure GA4 with automatic pageview disabled for SPA coordination
  window.gtag('config', measurementId, {
    send_page_view: false,
    transport_type: 'beacon',
  });

  // 3. Inject the Google Tag script element asynchronously
  const script = document.createElement('script');
  script.id = 'ga4-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  isInitialized = true;
}

/**
 * Tracks a Single Page Application (SPA) route change as a GA4 'page_view' event.
 * Coordinates with React Router and document.title to send clean, deduplicated metrics.
 */
export function trackPageView(path?: string, title?: string): void {
  if (typeof window === 'undefined') return;

  // If gtag hasn't been initialized yet, initialize it
  if (!isInitialized) {
    initGA();
  }

  if (typeof window.gtag !== 'function') return;

  const currentPath = path || `${window.location.pathname}${window.location.search}`;
  const currentTitle = title || document.title || 'SpotPicx';
  const fullLocation = window.location.href;

  window.gtag('event', 'page_view', {
    page_title: currentTitle,
    page_location: fullLocation,
    page_path: currentPath,
  });
}

/**
 * Custom event tracking helper for user interactions
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  if (!isInitialized) {
    initGA();
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}
