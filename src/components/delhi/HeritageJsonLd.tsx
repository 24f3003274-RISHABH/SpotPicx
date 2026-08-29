import React from 'react';
import { DelhiHeritagePlace, EditorialHeritageGuide } from '../../types/delhiHeritage.types';

interface HeritageJsonLdProps {
  type: 'place' | 'guide' | 'hub';
  place?: DelhiHeritagePlace;
  guide?: EditorialHeritageGuide;
  categoryName?: string;
}

export const HeritageJsonLd: React.FC<HeritageJsonLdProps> = ({
  type,
  place,
  guide,
  categoryName,
}) => {
  const schemas: object[] = [];

  if (type === 'place' && place) {
    const isMuseum = place.category === 'Museums' || place.isMuseum;

    // Attraction Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': isMuseum ? 'Museum' : 'TouristAttraction',
      name: place.name,
      alternateName: place.hindiName || place.urduName,
      description: place.historicalSignificance,
      image: place.heroImage,
      address: {
        '@type': 'PostalAddress',
        streetAddress: place.location.address,
        addressLocality: place.location.locality,
        addressRegion: 'Delhi',
        postalCode: '110001',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: place.location.coordinates.lat,
        longitude: place.location.coordinates.lng,
      },
      publicAccess: true,
      isAccessibleForFree: place.visitingInfo.entryFee.indianCitizens.toLowerCase().includes('free'),
    });

    // FAQ Schema if available
    if (place.faqs && place.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: place.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    // Breadcrumb Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://spotpicks.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Delhi Heritage',
          item: 'https://spotpicks.in/delhi/heritage',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: place.category,
          item: `https://spotpicks.in/delhi/heritage/category/${place.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: place.name,
          item: `https://spotpicks.in/delhi/heritage/place/${place.slug}`,
        },
      ],
    });
  } else if (type === 'guide' && guide) {
    // Article Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.subtitle,
      image: guide.heroImage,
      author: {
        '@type': 'Organization',
        name: guide.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'SpotPicks',
        logo: {
          '@type': 'ImageObject',
          url: 'https://spotpicks.in/logo.png',
        },
      },
      datePublished: '2026-01-01',
      dateModified: '2026-03-01',
    });

    if (guide.faqs && guide.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }
  } else {
    // Hub Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: categoryName ? `${categoryName} in Delhi` : 'Delhi Heritage & History Discovery Guide',
      description:
        'Comprehensive guide to historical places, Mughal architecture, Sultanate monuments, ancient stepwells, and museums across Delhi.',
      url: 'https://spotpicks.in/delhi/heritage',
    });
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
