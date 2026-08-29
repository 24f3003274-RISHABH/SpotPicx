export type DistanceBracket = 'under-100km' | '100-200km' | '200-300km' | '300-500km';

export type TripDuration = '1 Day (Day Trip)' | '2 Days / 1 Night' | '3 Days / 2 Nights' | 'Long Weekend (3-4 Days)';

export type BudgetLevel = 'Budget' | 'Moderate' | 'Luxury / Heritage';

export type DestinationCategory =
  | 'Hill Station'
  | 'Heritage & Forts'
  | 'Wildlife & Nature'
  | 'Spiritual & Pilgrimage'
  | 'Adventure & Camping'
  | 'Lakeside & Leisure'
  | 'Rural & Cultural'
  | 'Wellness & Spa';

export type TravellerType = 'Couples' | 'Families' | 'Friends' | 'Solo' | 'Corporate Groups' | 'Adventure Seekers';

export type BestSeason = 'Winter (Oct - Mar)' | 'Monsoon (Jul - Sep)' | 'Summer Hill Escape (Apr - Jun)' | 'All Year Round' | 'Autumn & Spring';

export type StateRegion =
  | 'Delhi / NCR'
  | 'Haryana'
  | 'Uttar Pradesh'
  | 'Uttarakhand'
  | 'Rajasthan'
  | 'Himachal Pradesh'
  | 'Punjab'
  | 'Madhya Pradesh';

export interface TransportOption {
  mode: 'Road / Self-Drive' | 'Vande Bharat / Express Train' | 'State / Private Volvo Bus' | 'Flight';
  details: string;
  estimatedTime: string;
  reliabilityNote?: string;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
  description: string;
}

export interface WeekendGetawayPlace {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  state: StateRegion;
  districtOrRegion: string;
  distanceKm: number;
  distanceBracket: DistanceBracket;
  heroImage: string;
  galleryImages: { url: string; caption: string }[];
  overview: string;
  whyGo: string[];
  
  // Logistics & Transit
  idealDuration: TripDuration;
  estimatedDriveTime: string;
  bestTransportOptions: TransportOption[];
  highwayRoute: string;
  nearestTrainStation: string;
  
  // Categorization & Suitability
  categories: DestinationCategory[];
  travellerTypes: TravellerType[];
  budgetLevel: BudgetLevel;
  approxBudgetPerCouple: string;
  
  // Climate & Timing
  bestSeason: BestSeason;
  bestMonths: string;
  monsoonFriendly: boolean;
  winterFavorite: boolean;
  summerEscape: boolean;
  
  // Experience & Things to Do
  topThingsToDo: string[];
  mustTryFood: string[];
  keyHighlights: string[];
  nearbyAttractions: NearbyAttraction[];
  
  // Tips & Etiquette
  travelTips: string[];
  roadConditionNote: string;
  
  // Coordinates & Sources
  coordinates: {
    lat: number;
    lng: number;
  };
  officialTourismWebsite: string;
  officialTourismBoard: string;
  
  // Internal Linking to Delhi Hubs
  connectedDelhiHubs: {
    name: string;
    route: string;
    context: string;
  }[];
}

export interface GetawayGuideSection {
  heading: string;
  subheading?: string;
  content: string;
  image?: string;
  imageCaption?: string;
  destinationSlug?: string;
  keyPoints?: string[];
  itinerarySummary?: {
    day: string;
    plan: string;
  }[];
  insiderTips?: string[];
}

export interface GetawayFaqItem {
  question: string;
  answer: string;
}

export interface GetawayEditorialGuide {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: string;
  heroImage: string;
  introduction: string;
  sections: GetawayGuideSection[];
  conclusion: string;
  faq: GetawayFaqItem[];
  featuredDestinationSlugs: string[];
  targetAudience: string;
}
