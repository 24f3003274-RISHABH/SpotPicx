import { SeedService } from './seed.service';

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
  state?: string;
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
  state?: string;
  coordinates?: [number, number]; // [lng, lat]
}

interface CategoryMapping {
  keywords: string[];
  canonicalSlug: string;
  defaultTags?: string[];
}

export class QueryParserService {
  // Landmark & Alias synonyms mapping for Indian cities & localities
  private static landmarkSynonyms: LocalityMapping[] = [
    {
      keywords: ['iit bombay', 'iit b', 'powai lake', 'hiranandani powai'],
      canonicalName: 'Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: [72.905, 19.1334],
    },
    {
      keywords: ['bandra west', 'bandstand', 'carter road', 'pali hill'],
      canonicalName: 'Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: [72.83, 19.0596],
    },
    {
      keywords: ['marine drive', 'nariman point', 'churchgate', 'fort mumbai', 'colaba'],
      canonicalName: 'South Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: [72.8258, 18.9322],
    },
    {
      keywords: ['jnu', 'jawaharlal nehru university', 'vasant kunj', 'vasant vihar', 'ambience mall vasant kunj'],
      canonicalName: 'Vasant Kunj',
      city: 'Delhi',
      state: 'Delhi',
      coordinates: [77.1578, 28.5244],
    },
    {
      keywords: ['iit delhi', 'hkv', 'hauz khas village', 'deer park', 'green park'],
      canonicalName: 'Hauz Khas',
      city: 'Delhi',
      state: 'Delhi',
      coordinates: [77.2065, 28.5494],
    },
    {
      keywords: ['cp', 'rajiv chowk', 'inner circle', 'outer circle', 'connaught place', 'janpath'],
      canonicalName: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      coordinates: [77.2197, 28.6304],
    },
    {
      keywords: ['du north', 'north campus', 'hudson lane', 'kamla nagar', 'delhi university', 'gtb nagar'],
      canonicalName: 'GTB Nagar',
      city: 'Delhi',
      state: 'Delhi',
      coordinates: [77.2069, 28.6983],
    },
    {
      keywords: ['mkt', 'tibetan colony', 'aruna nagar', 'majnu ka tilla'],
      canonicalName: 'Majnu Ka Tilla',
      city: 'Delhi',
      state: 'Delhi',
      coordinates: [77.2274, 28.7008],
    },
    {
      keywords: ['koramangala 5th block', 'koramangala 4th block', 'sony world signal'],
      canonicalName: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      coordinates: [77.6245, 12.9352],
    },
    {
      keywords: ['indiranagar 100ft road', '12th main indiranagar'],
      canonicalName: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      coordinates: [77.6412, 12.9716],
    },
    {
      keywords: ['iit madras', 'guindy', 'besant nagar', 'marina beach'],
      canonicalName: 'Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      coordinates: [80.2337, 13.0067],
    },
    {
      keywords: ['hitec city', 'cyberabad', 'gachibowli', 'madhapur'],
      canonicalName: 'Hitec City',
      city: 'Hyderabad',
      state: 'Telangana',
      coordinates: [78.3826, 17.4474],
    },
    {
      keywords: ['park street', 'flurys', 'victoria memorial', 'salt lake kolkata'],
      canonicalName: 'Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      coordinates: [88.3524, 22.5511],
    },
  ];

  // Known Category mappings
  private static categoryCatalog: CategoryMapping[] = [
    {
      keywords: [
        'cafe', 'cafes', 'coffee', 'bakery', 'bakeries', 'tea', 'chai', 'roastery',
        'roasters', 'cold brew', 'pour over', 'cappuccino', 'latte', 'espresso',
        'croissant', 'pastry', 'cheesecake', 'waffle', 'pancake'
      ],
      canonicalSlug: 'cafes-bakeries',
      defaultTags: ['cafe', 'coffee', 'bakery'],
    },
    {
      keywords: [
        'momo', 'momos', 'street food', 'chaat', 'laphing', 'thukpa', 'vada pav',
        'misal pav', 'chole bhature', 'chole kulche', 'parantha', 'paranthas',
        'golgappa', 'pani puri', 'kachori', 'samosa', 'jalebi', 'kathi roll', 'shawarma',
        'tandoori', 'kebabs', 'street eats', 'food stall', 'dhaba'
      ],
      canonicalSlug: 'street-food',
      defaultTags: ['street-food', 'momos'],
    },
    {
      keywords: [
        'restaurant', 'restaurants', 'dining', 'fine dining', 'biryani', 'buffet',
        'chinese', 'tibetan', 'italian', 'mughlai', 'north indian', 'south indian',
        'dosa', 'thali', 'curry', 'pasta', 'pizza', 'burger', 'diner'
      ],
      canonicalSlug: 'food-dining',
      defaultTags: ['food', 'dining'],
    },
    {
      keywords: [
        'pg', 'pgs', 'hostel', 'hostels', 'paying guest', 'student stay', 'student housing',
        'co-living', 'coliving', 'boys pg', 'girls pg', 'shared room', 'dorm'
      ],
      canonicalSlug: 'pgs-hostels',
      defaultTags: ['pg', 'student-friendly'],
    },
    {
      keywords: [
        'hotel', 'hotels', 'resort', 'resorts', 'homestay', 'staycation', 'lodge',
        'boutique hotel', 'guest house'
      ],
      canonicalSlug: 'stays-living',
      defaultTags: ['stay', 'accommodation'],
    },
    {
      keywords: [
        'laptop repair', 'macbook repair', 'mobile repair', 'iphone repair',
        'computer repair', 'screen replacement', 'motherboard repair', 'gadget repair',
        'chip level repair', 'ssd upgrade', 'data recovery', 'electronics repair'
      ],
      canonicalSlug: 'laptop-mobile-repair',
      defaultTags: ['repair', 'electronics'],
    },
    {
      keywords: [
        'repair', 'plumbing', 'electrician', 'cleaning', 'mechanic', 'car service',
        'bike repair', 'service', 'dry cleaning', 'laundry', 'carpenter'
      ],
      canonicalSlug: 'services-repairs',
      defaultTags: ['repair', 'services'],
    },
    {
      keywords: [
        'monument', 'monuments', 'historical', 'heritage', 'fort', 'tomb', 'baoli',
        'unesco', 'palace', 'ancient', 'archaeology', 'red fort', 'qutub minar', 'humayun tomb'
      ],
      canonicalSlug: 'historical-monuments',
      defaultTags: ['heritage', 'monument'],
    },
    {
      keywords: [
        'park', 'parks', 'garden', 'gardens', 'lake', 'sunder nursery', 'lodhi garden',
        'deer park', 'green spaces', 'botanical', 'nature walk', 'biodiversity park'
      ],
      canonicalSlug: 'parks-gardens',
      defaultTags: ['nature', 'park'],
    },
    {
      keywords: [
        'places to visit', 'place to visit', 'tourist spots', 'tourist places',
        'sightseeing', 'attractions', 'delhi sightseeing', 'must visit'
      ],
      canonicalSlug: 'places-visit',
      defaultTags: ['sightseeing', 'places'],
    },
    {
      keywords: [
        'bar', 'bars', 'pub', 'pubs', 'club', 'clubs', 'nightlife', 'lounge',
        'cocktail', 'cocktails', 'live music', 'gig', 'brewery', 'microbrewery'
      ],
      canonicalSlug: 'nightlife-bars',
      defaultTags: ['nightlife', 'party'],
    },
    {
      keywords: [
        'shopping', 'market', 'markets', 'mall', 'malls', 'clothes', 'fashion',
        'thrifting', 'thrift', 'bazaar', 'street market', 'apparel', 'textiles', 'handloom'
      ],
      canonicalSlug: 'shopping-markets',
      defaultTags: ['shopping', 'retail'],
    },
    {
      keywords: [
        'gym', 'gyms', 'fitness', 'crossfit', 'workout', 'salon', 'spa', 'massage',
        'haircut', 'barbershop', 'yoga', 'pilates', 'wellness'
      ],
      canonicalSlug: 'gyms-fitness',
      defaultTags: ['fitness', 'wellness'],
    },
    {
      keywords: [
        'coaching', 'upsc coaching', 'iit coaching', 'classes', 'institute', 'course',
        'library', 'study room', 'tuition', 'music school', 'coding bootcamp'
      ],
      canonicalSlug: 'education-coaching',
      defaultTags: ['education', 'learning'],
    },
  ];

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
    let city: string | undefined;
    let state: string | undefined;
    let priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY' | undefined;
    let priceMax: number | undefined;
    let priceMin: number | undefined;
    let minRating: number | undefined;
    let openNow: boolean | undefined;
    let isNearMe: boolean = false;
    let nearLocationTarget: string | undefined;
    const extractedTags: Set<string> = new Set();
    const extractedAmenities: Set<string> = new Set();

    // Ensure in-memory database of locations is initialized
    SeedService.initializeInMemoryStore();
    const dbLocations = Array.from(SeedService.inMemoryLocations.values());

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

    // 2. Detect Price bounds
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
    } else if (/\b(student|students|college|du|campus|iit)\b/.test(working)) {
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

    // 7. Check Landmark & Campus Synonyms First (e.g. "PG near IIT Bombay", "best cafes near JNU")
    for (const syn of this.landmarkSynonyms) {
      for (const kw of syn.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(working) || (nearLocationTarget && new RegExp(`\\b${kw}\\b`, 'i').test(nearLocationTarget))) {
          locality = syn.canonicalName;
          city = syn.city;
          state = syn.state;
          working = working.replace(regex, '').trim();
          break;
        }
      }
      if (locality) break;
    }

    // 8. Match Dynamic Locality Database (Localities & Neighborhoods)
    if (!locality) {
      const localities = dbLocations.filter((l) => l.type === 'LOCALITY' || l.type === 'NEIGHBORHOOD');
      for (const loc of localities) {
        const nameRegex = new RegExp(`\\b${loc.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        const slugClean = loc.slug.replace(/-/g, ' ');
        const slugRegex = new RegExp(`\\b${slugClean}\\b`, 'i');

        if (nameRegex.test(working) || slugRegex.test(working) || (nearLocationTarget && (nameRegex.test(nearLocationTarget) || slugRegex.test(nearLocationTarget)))) {
          locality = loc.name;
          city = loc.city;
          state = loc.state;
          working = working.replace(nameRegex, '').replace(slugRegex, '').trim();
          break;
        }
      }
    }

    // 9. Match Dynamic City Database (e.g. Mumbai, Bangalore, Kolkata, Hyderabad, Chennai, Pune, etc.)
    if (!city) {
      const cities = dbLocations.filter((l) => l.type === 'CITY');
      for (const c of cities) {
        const cityRegex = new RegExp(`\\b${c.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        const citySlugRegex = new RegExp(`\\b${c.slug.replace(/-/g, ' ')}\\b`, 'i');

        if (cityRegex.test(working) || citySlugRegex.test(working)) {
          city = c.name;
          state = c.state;
          working = working.replace(new RegExp(`\\b(in|at|near|of)\\s+${c.name}\\b`, 'gi'), '').replace(cityRegex, '').trim();
          break;
        }
      }
    }

    // 10. Match Dynamic State Database (e.g. Maharashtra, Karnataka, Delhi, Tamil Nadu, etc.)
    if (!state) {
      const states = dbLocations.filter((l) => l.type === 'STATE');
      for (const s of states) {
        const stateRegex = new RegExp(`\\b${s.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        if (stateRegex.test(working)) {
          state = s.name;
          working = working.replace(new RegExp(`\\b(in|at|of)\\s+${s.name}\\b`, 'gi'), '').replace(stateRegex, '').trim();
          break;
        }
      }
    }

    // Default city fallback if locality is in Delhi or no city was identified
    if (!city && !state) {
      if (/\b(delhi|new delhi|ncr)\b/i.test(working)) {
        city = 'Delhi';
        state = 'Delhi';
        working = working.replace(/\b(in\s+)?(delhi|new delhi|ncr)\b/gi, '').trim();
      } else {
        city = 'Delhi'; // Production focus default
      }
    }

    // 11. Match Category Catalog
    for (const cat of this.categoryCatalog) {
      for (const kw of cat.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(working)) {
          category = cat.canonicalSlug;
          if (cat.defaultTags) {
            cat.defaultTags.forEach((t) => extractedTags.add(t));
          }
          // Also add specific item tag if keyword is specific
          if (['momos', 'bakery', 'coffee', 'pizza', 'burger', 'laptop repair', 'bookstore', 'gym', 'vada pav', 'misal pav', 'biryani', 'street food', 'dosa'].includes(kw)) {
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
    if (locality || city) confidence += 0.2;
    if (intent !== 'STANDARD') confidence += 0.1;

    return {
      originalQuery: raw,
      cleanedQuery: cleanedQuery || raw,
      intent,
      category,
      locality,
      city,
      state,
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

