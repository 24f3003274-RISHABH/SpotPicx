/**
 * SpotPicx Production Canonical Site Domain & SEO Constants
 */
export const SITE_URL = (import.meta as any).env?.VITE_SITE_URL || 'https://spotpicx.me';

/**
 * Normalizes any URL, path, or legacy domain to the canonical production domain: https://spotpicx.me
 */
export function toCanonicalUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) {
    return typeof window !== 'undefined'
      ? `${SITE_URL}${window.location.pathname}`
      : SITE_URL;
  }

  // Replace legacy domains
  let normalized = pathOrUrl
    .replace(/^https?:\/\/(www\.)?spotpicks\.in/, SITE_URL)
    .replace(/^https?:\/\/(www\.)?spotpicks\.delhi/, SITE_URL)
    .replace(/^https?:\/\/(www\.)?spotpicx\.com/, SITE_URL)
    .replace(/^https?:\/\/(www\.)?spotpicks\.com/, SITE_URL);

  if (normalized.startsWith('/')) {
    normalized = `${SITE_URL}${normalized}`;
  } else if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `${SITE_URL}/${normalized}`;
  }

  return normalized;
}
