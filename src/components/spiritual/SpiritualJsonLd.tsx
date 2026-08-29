import React, { useEffect } from 'react';
import { SpiritualPlace, SpiritualStateInfo, SpiritualGuide } from '../../types/spiritual.types';

interface SpiritualJsonLdProps {
  type: 'hub' | 'place' | 'state' | 'guide';
  place?: SpiritualPlace;
  stateInfo?: SpiritualStateInfo;
  guide?: SpiritualGuide;
}

export const SpiritualJsonLd: React.FC<SpiritualJsonLdProps> = ({
  type,
  place,
  stateInfo,
  guide,
}) => {
  useEffect(() => {
    let schemaData: Record<string, any> | Array<Record<string, any>> = {};

    if (type === 'hub') {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: 'Spiritual India Discovery Directory',
        description:
          'Comprehensive, respectful directory of sacred destinations, temple towns, pilgrimage circuits, and historic religious architecture across India covering Hindu, Buddhist, Jain, Sikh, Muslim, Christian, Zoroastrian, and other traditions.',
        url: 'https://spotpicks.com/india/spiritual',
        touristType: ['Pilgrimage', 'Cultural Tourism', 'Religious Heritage', 'Spiritual Retreat'],
      };
    } else if (type === 'place' && place) {
      schemaData = [
        {
          '@context': 'https://schema.org',
          '@type': 'PlaceOfWorship',
          name: place.name,
          description: place.shortDescription,
          url: `https://spotpicks.com/india/spiritual/place/${place.slug}`,
          image: place.heroImage,
          address: {
            '@type': 'PostalAddress',
            addressLocality: place.cityDistrict,
            addressRegion: place.stateName,
            addressCountry: 'India',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.coordinates.lat,
            longitude: place.coordinates.lng,
          },
          publicAccess: true,
          isAccessibleForFree: true,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://spotpicks.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Spiritual India',
              item: 'https://spotpicks.com/india/spiritual',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: place.stateName,
              item: `https://spotpicks.com/india/spiritual/${place.stateSlug}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: place.name,
              item: `https://spotpicks.com/india/spiritual/place/${place.slug}`,
            },
          ],
        },
      ];
    } else if (type === 'state' && stateInfo) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: `Spiritual & Pilgrimage Destinations in ${stateInfo.stateName}`,
        description: stateInfo.overview,
        url: `https://spotpicks.com/india/spiritual/${stateInfo.stateSlug}`,
        touristType: ['Pilgrimage', 'Religious Architecture', 'Spiritual Towns'],
      };
    } else if (type === 'guide' && guide) {
      schemaData = [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.title,
          description: guide.subtitle,
          image: guide.heroImage,
          author: {
            '@type': 'Organization',
            name: guide.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'SpotPicks',
            logo: {
              '@type': 'ImageObject',
              url: 'https://spotpicks.com/logo.png',
            },
          },
          datePublished: '2026-08-01',
          url: `https://spotpicks.com/india/spiritual/guide/${guide.slug}`,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faq.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ];
    }

    const scriptId = 'spiritual-structured-data';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.text = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [type, place, stateInfo, guide]);

  return null;
};
