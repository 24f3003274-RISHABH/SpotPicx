import React, { useEffect } from 'react';
import { WeekendGetawayPlace, GetawayEditorialGuide } from '../../types/weekendGetaways.types';

interface GetawayJsonLdProps {
  place?: WeekendGetawayPlace;
  guide?: GetawayEditorialGuide;
  title: string;
  description: string;
  canonicalUrl: string;
  breadcrumbs: { name: string; url: string }[];
}

export const GetawayJsonLd: React.FC<GetawayJsonLdProps> = ({
  place,
  guide,
  title,
  description,
  canonicalUrl,
  breadcrumbs,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update Canonical Link
    const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `https://spotpicks.in${canonicalUrl}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = fullUrl;

    // 4. Update OpenGraph Tags
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:url': fullUrl,
      'og:type': guide ? 'article' : 'website',
    };

    if (place?.heroImage) {
      ogTags['og:image'] = place.heroImage;
    } else if (guide?.heroImage) {
      ogTags['og:image'] = guide.heroImage;
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = content;
    });

    // 5. Build JSON-LD Structured Data Schema
    const schemas: Array<Record<string, any>> = [];

    // Breadcrumb Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url.startsWith('http') ? b.url : `https://spotpicks.in${b.url}`,
      })),
    });

    // Tourist Destination Schema (for Place details)
    if (place) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: place.name,
        description: place.overview,
        touristType: place.travellerTypes,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.coordinates.lat,
          longitude: place.coordinates.lng,
        },
        image: [place.heroImage, ...place.galleryImages.map((g) => g.url)],
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: place.state,
        },
        includesAttraction: place.nearbyAttractions.map((a) => ({
          '@type': 'TouristAttraction',
          name: a.name,
          description: a.description,
        })),
        potentialAction: {
          '@type': 'TravelAction',
          fromLocation: {
            '@type': 'Place',
            name: 'Delhi NCR, India',
          },
          distance: `${place.distanceKm} km`,
        },
      });
    }

    // Article Schema (for Editorial Guides)
    if (guide) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.subtitle,
        image: [guide.heroImage],
        datePublished: '2026-08-01',
        dateModified: '2026-08-29',
        author: {
          '@type': 'Organization',
          name: guide.author || 'SpotPicks Travel Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SpotPicks',
          logo: {
            '@type': 'ImageObject',
            url: 'https://spotpicks.in/logo.png',
          },
        },
      });

      // FAQPage Schema
      if (guide.faq && guide.faq.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        });
      }
    }

    // Inject Script Tag
    const scriptId = 'weekend-getaway-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [place, guide, title, description, canonicalUrl, breadcrumbs]);

  return null;
};
