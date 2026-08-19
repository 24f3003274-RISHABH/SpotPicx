export type SearchIntent =
  | 'BEST'
  | 'TOP'
  | 'CHEAP'
  | 'NEAR_ME'
  | 'NEAR_LOCATION'
  | 'UNDER_PRICE'
  | 'OPEN_NOW'
  | 'FOR_COUPLES'
  | 'FOR_STUDENTS'
  | 'FOR_FAMILIES'
  | 'FOR_FRIENDS'
  | 'FOR_SOLO'
  | 'TRENDING'
  | 'POPULAR'
  | 'HIDDEN_GEM'
  | 'STANDARD';

export interface ParsedSearchQuery {
  originalQuery: string;
  cleanedQuery: string;
  intent: SearchIntent;
  category?: string;
  locality?: string;
  city?: string;
  priceRange?: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
  priceMax?: number;
  priceMin?: number;
  minRating?: number;
  openNow?: boolean;
  isNearMe?: boolean;
  nearLocationTarget?: string;
  tags: string[];
  amenities: string[];
  confidence: number;
}

interface LocalityMapping {
  keywords: string[];
  canonicalName: string;
  city: string;
  coordinates?: [number, number]; // [lng, lat]
}

interface CategoryMapping {
  keywords: string[];
  canonicalSlug: string;
  defaultTags?: string[];
}

export class QueryParserService {
  // Known Delhi / NCR Localities with canonical names & landmark associations
  private static localityCatalog: LocalityMapping[] = [
    {
      keywords: ['hauz khas', 'hkv', 'hauz khas village'],
      canonicalName: 'Hauz Khas',
      city: 'Delhi',
      coordinates: [77.2065, 28.5494],
    },
    {
      keywords: ['majnu ka tilla', 'mkt', 'tibetan colony', 'aruna nagar'],
      canonicalName: 'Majnu Ka Tilla',
      city: 'Delhi',
      coordinates: [77.2274, 28.7008],
    },
    {
      keywords: ['connaught place', 'cp', 'rajiv chowk', 'inner circle', 'outer circle'],
      canonicalName: 'Connaught Place',
      city: 'Delhi',
      coordinates: [77.2197, 28.6304],
    },
    {
      keywords: ['nehru place', 'np', 'electronics market nehru place'],
      canonicalName: 'Nehru Place',
      city: 'Delhi',
      coordinates: [77.2536, 28.5489],
    },
    {
      keywords: ['chandni chowk', 'old delhi', 'purani dilli', 'dariba kalan', 'chawri bazar'],
      canonicalName: 'Chandni Chowk',
      city: 'Delhi',
      coordinates: [77.2309, 28.6562],
    },
    {
      keywords: ['jnu', 'jawaharlal nehru university', 'vasant kunj', 'vasant vihar'],
      canonicalName: 'Vasant Kunj',
      city: 'Delhi',
      coordinates: [77.1578, 28.5244],
    },
    {
      keywords: ['greater kailash', 'gk', 'gk1', 'gk2', 'gk 1', 'gk 2', 'm block gk'],
      canonicalName: 'Greater Kailash',
      city: 'Delhi',
      coordinates: [77.2425, 28.5482],
    },
    {
      keywords: ['saket', 'select citywalk', 'saket district centre'],
      canonicalName: 'Saket',
      city: 'Delhi',
      coordinates: [77.2144, 28.5245],
    },
    {
      keywords: ['dwarka', 'dwarka sector 12', 'dwarka sector 6', 'dwarka sector 21'],
      canonicalName: 'Dwarka',
      city: 'Delhi',
      coordinates: [77.0460, 28.5921],
    },
    {
      keywords: ['karol bagh', 'gaffar market', 'ajmal khan road'],
      canonicalName: 'Karol Bagh',
      city: 'Delhi',
      coordinates: [77.1906, 28.6517],
    },
    {
      keywords: ['gtb nagar', 'hudson lane', 'north campus', 'delhi university', 'kamla nagar', 'du north'],
      canonicalName: 'GTB Nagar',
      city: 'Delhi',
      coordinates: [77.2069, 28.6983],
    },
    {
      keywords: ['sarojini nagar', 'sn market', 'sarojini'],
      canonicalName: 'Sarojini Nagar',
      city: 'Delhi',
      coordinates: [77.1986, 28.5772],
    },
    {
      keywords: ['aerocity', 'igi airport', 'worldmark'],
      canonicalName: 'Aerocity',
      city: 'Delhi',
      coordinates: [77.1215, 28.5492],
    },
    {
      keywords: ['khan market', 'sujan singh park', 'prithviraj road'],
      canonicalName: 'Khan Market',
      city: 'Delhi',
      coordinates: [77.2270, 28.6003],
    },
  ];

  // Known Category mappings
  private static categoryCatalog: CategoryMapping[] = [
    {
      keywords: [
        'restaurant', 'restaurants', 'cafe', 'cafes', 'coffee', 'bakery', 'bakeries',
        'food', 'dining', 'momos', 'pizza', 'burger', 'rooftop cafe', 'breakfast',
        'street food', 'chaat', 'dessert', 'diner', 'dhaba', 'biryani', 'ramen', 'tibetan food'
      ],
      canonicalSlug: 'food-and-cafes',
      defaultTags: ['food', 'dining'],
    },
    {
      keywords: [
        'pg', 'pgs', 'hostel', 'hostels', 'hotel', 'hotels', 'student stay', 'stay',
        'co-living', 'coliving', 'room', 'paying guest', 'residency', 'accommodation'
      ],
      canonicalSlug: 'hotels-and-pgs',
      defaultTags: ['stay', 'accommodation'],
    },
    {
      keywords: [
        'repair', 'laptop repair', 'macbook repair', 'mobile repair', 'iphone repair',
        'electronics service', 'veterinary', 'pet clinic', 'cleaning', 'plumbing',
        'mechanic', 'car service', 'home repair', 'service'
      ],
      canonicalSlug: 'repair-and-services',
      defaultTags: ['repair', 'services'],
    },
    {
      keywords: [
        'shopping', 'market', 'markets', 'mall', 'malls', 'clothes', 'fashion',
        'bookstore', 'book store', 'thrifting', 'thrift', 'electronics market', 'boutique', 'jewellery'
      ],
      canonicalSlug: 'shopping-and-retail',
      defaultTags: ['shopping', 'retail'],
    },
    {
      keywords: [
        'monument', 'monuments', 'historical', 'heritage', 'museum', 'museums',
        'park', 'parks', 'garden', 'tomb', 'fort', 'sightseeing', 'temple', 'gallery', 'art gallery'
      ],
      canonicalSlug: 'places-and-heritage',
      defaultTags: ['sightseeing', 'heritage'],
    },
    {
      keywords: [
        'bar', 'bars', 'pub', 'pubs', 'club', 'clubs', 'nightlife', 'lounge',
        'cocktail', 'live music', 'gig', 'date place', 'romantic'
      ],
      canonicalSlug: 'nightlife-and-clubs',
      defaultTags: ['nightlife', 'party'],
    },
    {
      keywords: [
        'gym', 'gyms', 'fitness', 'crossfit', 'workout', 'salon', 'spa', 'massage',
        'haircut', 'barbershop', 'yoga', 'pilates', 'wellness'
      ],
      canonicalSlug: 'fitness-and-wellness',
      defaultTags: ['fitness', 'wellness'],
    },
    {
      keywords: [
        'coaching', 'upsc coaching', 'iit coaching', 'classes', 'institute', 'course',
        'library', 'study room', 'tuition', 'music school', 'coding bootcamp'
      ],
      canonicalSlug: 'education-and-coaching',
      defaultTags: ['education', 'learning'],
    },
  ];

  // Specific Tag Keywords
  private static tagCatalog: Record<string, string[]> = {
    momos: ['momos', 'dim sums', 'dumplings', 'tibetan'],
    cafe: ['cafe', 'coffee', 'brew', 'espresso'],
    wifi: ['wifi', 'wi-fi', 'high speed internet', 'work from cafe'],
    quiet: ['quiet', 'peaceful', 'study friendly', 'silent', 'cozy'],
    rooftop: ['rooftop', 'open air', 'terrace', 'sky view'],
    romantic: ['date', 'romantic', 'couple friendly', 'candlelight'],
    student: ['student', 'student friendly', 'pocket friendly', 'cheap', 'budget'],
    laptop: ['laptop repair', 'computer repair', 'macbook repair', 'hardware'],
    outdoor: ['outdoor seating', 'courtyard', 'garden seating', 'al fresco'],
    ac: ['ac', 'air conditioned'],
    pet: ['pet friendly', 'pets allowed', 'dog friendly'],
    alcohol: ['bar', 'beer', 'cocktails', 'wine', 'liquor'],
  };

  /**
   * Deterministically parses a free-form search query string
   */
  public static parse(query: string): ParsedSearchQuery {
    if (!query || typeof query !== 'string') {
      return {
        originalQuery: '',
        cleanedQuery: '',
        intent: 'STANDARD',
        tags: [],
        amenities: [],
        confidence: 0,
      };
    }

    const raw = query.trim();
    const lower = raw.toLowerCase();
    let working = lower;

    let intent: SearchIntent = 'STANDARD';
    let category: string | undefined;
    let locality: string | undefined;
    let city: string | undefined = 'Delhi';
    let priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY' | undefined;
    let priceMax: number | undefined;
    let priceMin: number | undefined;
    let minRating: number | undefined;
    let openNow: boolean | undefined;
    let isNearMe: boolean = false;
    let nearLocationTarget: string | undefined;
    const extractedTags: Set<string> = new Set();
    const extractedAmenities: Set<string> = new Set();

    // 1. Detect Near Me / Near Location
    if (/\b(near me|nearby|around me|close to me|in my area)\b/.test(working)) {
      intent = 'NEAR_ME';
      isNearMe = true;
      working = working.replace(/\b(near me|nearby|around me|close to me|in my area)\b/g, '').trim();
    } else if (/\bnear\s+([a-z0-9\s]+)/i.test(working)) {
      const match = working.match(/\bnear\s+([a-z0-9\s]+)/i);
      if (match && match[1]) {
        intent = 'NEAR_LOCATION';
        nearLocationTarget = match[1].trim();
      }
    }

    // 2. Detect Price bounds (e.g. "under 200", "below 500", "under 1000 rupees", "cheap", "luxury")
    const underPriceMatch = working.match(/\b(under|below|less than|within)\s*(?:rs\.?|inr|₹)?\s*(\d+)/);
    if (underPriceMatch && underPriceMatch[2]) {
      priceMax = parseInt(underPriceMatch[2], 10);
      intent = 'UNDER_PRICE';
      if (priceMax <= 400) {
        priceRange = 'BUDGET';
      } else if (priceMax <= 1200) {
        priceRange = 'MODERATE';
      }
      working = working.replace(underPriceMatch[0], '').trim();
    } else if (/\b(cheap|budget|affordable|pocket friendly|low cost)\b/.test(working)) {
      intent = 'CHEAP';
      priceRange = 'BUDGET';
      priceMax = 400;
      extractedTags.add('pocket friendly');
      working = working.replace(/\b(cheap|budget|affordable|pocket friendly|low cost)\b/g, '').trim();
    } else if (/\b(luxury|fine dining|expensive|high end|posh)\b/.test(working)) {
      priceRange = 'LUXURY';
      extractedTags.add('luxury');
      working = working.replace(/\b(luxury|fine dining|expensive|high end|posh)\b/g, '').trim();
    }

    // 3. Detect Quality / Best / Top / Rating Intent
    if (/\b(best|top rated|highest rated|top 10|top 5|top)\b/.test(working)) {
      if (intent === 'STANDARD') intent = 'BEST';
      minRating = 4.3;
      working = working.replace(/\b(best|top rated|highest rated|top 10|top 5|top)\b/g, '').trim();
    } else if (/\b(hidden gem|secret spot|underrated)\b/.test(working)) {
      intent = 'HIDDEN_GEM';
      extractedTags.add('hidden gem');
      working = working.replace(/\b(hidden gem|secret spot|underrated)\b/g, '').trim();
    } else if (/\b(trending|viral|popular|famous)\b/.test(working)) {
      if (intent === 'STANDARD') intent = 'TRENDING';
      working = working.replace(/\b(trending|viral|popular|famous)\b/g, '').trim();
    }

    // 4. Detect Audience / Context Intent
    if (/\b(date|couple|romantic|girlfriend|boyfriend|anniversary)\b/.test(working)) {
      intent = 'FOR_COUPLES';
      extractedTags.add('romantic');
      extractedTags.add('date');
      working = working.replace(/\b(date|couple|romantic|girlfriend|boyfriend|anniversary)\b/g, '').trim();
    } else if (/\b(student|students|college|du|campus)\b/.test(working)) {
      if (intent === 'STANDARD') intent = 'FOR_STUDENTS';
      extractedTags.add('student friendly');
      working = working.replace(/\b(student|students|college|du|campus)\b/g, '').trim();
    } else if (/\b(family|kids|children)\b/.test(working)) {
      intent = 'FOR_FAMILIES';
      extractedTags.add('family friendly');
      working = working.replace(/\b(family|kids|children)\b/g, '').trim();
    } else if (/\b(friends|gang|group hangout)\b/.test(working)) {
      intent = 'FOR_FRIENDS';
      extractedTags.add('hangout');
      working = working.replace(/\b(friends|gang|group hangout)\b/g, '').trim();
    } else if (/\b(solo|alone|work alone|read alone)\b/.test(working)) {
      intent = 'FOR_SOLO';
      extractedTags.add('solo friendly');
      working = working.replace(/\b(solo|alone|work alone|read alone)\b/g, '').trim();
    }

    // 5. Detect Open Now / Late Night
    if (/\b(open now|open today|24\/7|late night|midnight)\b/.test(working)) {
      openNow = true;
      if (intent === 'STANDARD') intent = 'OPEN_NOW';
      working = working.replace(/\b(open now|open today|24\/7|late night|midnight)\b/g, '').trim();
    }

    // 6. Detect Amenities & Tags
    if (/\b(wifi|wi-fi|internet)\b/.test(working)) {
      extractedAmenities.add('Free High-Speed WiFi');
      extractedTags.add('work friendly');
      working = working.replace(/\b(with\s+)?(wifi|wi-fi|internet)\b/g, '').trim();
    }
    if (/\b(quiet|peaceful|silent)\b/.test(working)) {
      extractedTags.add('quiet');
      extractedAmenities.add('Quiet Environment');
      working = working.replace(/\b(quiet|peaceful|silent)\b/g, '').trim();
    }
    if (/\b(rooftop|terrace|outdoor)\b/.test(working)) {
      extractedAmenities.add('Outdoor Seating');
      extractedTags.add('rooftop');
      working = working.replace(/\b(rooftop|terrace|outdoor)\b/g, '').trim();
    }
    if (/\b(parking|valet)\b/.test(working)) {
      extractedAmenities.add('Valet Parking');
      working = working.replace(/\b(with\s+)?(parking|valet)\b/g, '').trim();
    }
    if (/\b(pet friendly|pets allowed|dog friendly)\b/.test(working)) {
      extractedAmenities.add('Pet Friendly');
      extractedTags.add('pet friendly');
      working = working.replace(/\b(pet friendly|pets allowed|dog friendly)\b/g, '').trim();
    }

    // 7. Match Locality Catalog
    for (const loc of this.localityCatalog) {
      for (const kw of loc.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(working) || (nearLocationTarget && new RegExp(`\\b${kw}\\b`, 'i').test(nearLocationTarget))) {
          locality = loc.canonicalName;
          city = loc.city;
          working = working.replace(regex, '').trim();
          break;
        }
      }
      if (locality) break;
    }

    // Check if "delhi" or "new delhi" or "ncr" remains
    if (/\b(delhi|new delhi|ncr)\b/i.test(working)) {
      city = 'Delhi';
      working = working.replace(/\b(in\s+)?(delhi|new delhi|ncr)\b/gi, '').trim();
    }

    // 8. Match Category Catalog
    for (const cat of this.categoryCatalog) {
      for (const kw of cat.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(working)) {
          category = cat.canonicalSlug;
          if (cat.defaultTags) {
            cat.defaultTags.forEach((t) => extractedTags.add(t));
          }
          // Also add specific item tag if keyword is specific (e.g. momos, bakery, laptop repair)
          if (['momos', 'bakery', 'coffee', 'pizza', 'burger', 'laptop repair', 'bookstore', 'gym'].includes(kw)) {
            extractedTags.add(kw);
          }
          break;
        }
      }
      if (category) break;
    }

    // Remove common search fluff & stop words
    const cleanedQuery = working
      .replace(/\b(in|at|near|around|for|with|of|the|a|an|good|places|place|spots|spot|around|show me|find|lookup)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Calculate parser confidence
    let confidence = 0.5;
    if (category) confidence += 0.2;
    if (locality) confidence += 0.2;
    if (intent !== 'STANDARD') confidence += 0.1;

    return {
      originalQuery: raw,
      cleanedQuery: cleanedQuery || raw,
      intent,
      category,
      locality,
      city,
      priceRange,
      priceMax,
      priceMin,
      minRating,
      openNow,
      isNearMe,
      nearLocationTarget,
      tags: Array.from(extractedTags),
      amenities: Array.from(extractedAmenities),
      confidence: Math.min(1.0, confidence),
    };
  }
}
