import React, { useEffect } from 'react';
import { SITE_URL, toCanonicalUrl } from '../../constants/site';

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'place';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  keywords?: string[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200',
  ogType = 'website',
  jsonLd,
  keywords,
}) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('SpotPicx') || title.includes('SpotPicks')
      ? title
      : `${title} | SpotPicx`;
    document.title = fullTitle;

    // 2. Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard description
    setMeta('description', description);
    if (keywords && keywords.length > 0) {
      setMeta('keywords', keywords.join(', '));
    }

    // Canonical link calculation (strictly using https://spotpicx.me apex domain)
    const effectiveCanonicalUrl = toCanonicalUrl(canonicalUrl);

    // Resolve og:image absolute URL
    const resolvedOgImage = ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

    // OpenGraph metadata
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', resolvedOgImage, true);
    setMeta('og:url', effectiveCanonicalUrl, true);
    setMeta('og:site_name', 'SpotPicx', true);

    // Twitter Card metadata
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', resolvedOgImage);
    setMeta('twitter:url', effectiveCanonicalUrl);

    // Canonical link tag
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', effectiveCanonicalUrl);

    // 3. Inject JSON-LD Schema Script
    const scriptId = 'spotpicx-jsonld-schema';
    const legacyScript = document.getElementById('spotpicks-jsonld-schema');
    if (legacyScript) {
      legacyScript.remove();
    }
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      // Normalize any old domain strings in jsonLd payload
      const jsonStr = JSON.stringify(jsonLd)
        .replace(/https?:\/\/(www\.)?spotpicks\.in/g, SITE_URL)
        .replace(/https?:\/\/(www\.)?spotpicks\.delhi/g, SITE_URL)
        .replace(/https?:\/\/(www\.)?spotpicx\.com/g, SITE_URL);
      script.innerHTML = jsonStr;
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById(scriptId);
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, jsonLd, keywords]);

  return null;
};
