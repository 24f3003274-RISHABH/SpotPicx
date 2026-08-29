export type SpiritualTradition =
  | 'Hindu'
  | 'Buddhist'
  | 'Jain'
  | 'Sikh'
  | 'Muslim'
  | 'Christian'
  | 'Zoroastrian'
  | 'Bahá\'í'
  | 'Jewish'
  | 'Interfaith & Spiritual';

export type SpiritualPlaceCategory =
  | 'Major Pilgrimage Destination'
  | 'Historic Temple & Shrine'
  | 'Spiritual Town & Ghat'
  | 'Monastery & Stupa'
  | 'Dargah & Mosque'
  | 'Cathedral & Church'
  | 'Agiyari & Synagogue'
  | 'Meditation & Ashrams';

export interface SpiritualPlaceImage {
  url: string;
  caption: string;
  credit?: string;
}

export interface SpiritualFestivalInfo {
  name: string;
  period: string;
  significance: string;
}

export interface NearbyAttractionLink {
  name: string;
  category?: string;
  distance?: string;
  link?: string;
  isHeritage?: boolean;
}

export interface NearbyFoodLink {
  name: string;
  type: string;
  link?: string;
}

export interface SpiritualPlace {
  id: string;
  name: string;
  slug: string;
  stateSlug: string;
  stateName: string;
  cityDistrict: string;
  tradition: SpiritualTradition;
  traditionDetail: string;
  category: SpiritualPlaceCategory;
  shortDescription: string;
  historicalSignificance: string;
  culturalSignificance: string;
  architecturalStyle: string;
  whyPeopleVisit: string[];
  festivals: SpiritualFestivalInfo[];
  suggestedDuration: string;
  bestTimeToVisit: string;
  nearbyAttractions: NearbyAttractionLink[];
  nearbyFoodAndCulture: NearbyFoodLink[];
  coordinates: {
    lat: number;
    lng: number;
  };
  officialSource: string;
  officialWebsite?: string;
  heroImage: string;
  galleryImages: SpiritualPlaceImage[];
  tags: string[];
  dressCodeEtiquette: string[];
  isTopPilgrimage: boolean;
  isTempleTown: boolean;
  weekendTripFromDelhi: boolean;
  verifiedNotice?: string;
  citySlug?: string;
  heritageLink?: string;
}

export interface SpiritualTownInfo {
  name: string;
  slug?: string;
  description: string;
  keyPlaces: string[];
  image?: string;
}

export interface SpiritualCircuit {
  name: string;
  description: string;
  destinations: string[];
  idealDays: string;
}

export interface SpiritualStateInfo {
  stateSlug: string;
  stateName: string;
  tagline: string;
  overview: string;
  heroImage: string;
  prominentTraditions: SpiritualTradition[];
  topSpiritualTowns: SpiritualTownInfo[];
  majorPilgrimageCircuits: SpiritualCircuit[];
  keyFestivals: SpiritualFestivalInfo[];
  travelAdvisory: string;
  suggestedStateDuration: string;
}

export interface SpiritualGuideSection {
  heading: string;
  subheading?: string;
  content: string;
  image?: string;
  imageCaption?: string;
  placeSlug?: string;
  keyHighlights?: string[];
  practicalTips?: string[];
}

export interface SpiritualGuideFAQ {
  question: string;
  answer: string;
}

export interface SpiritualGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  category: 'Overview' | 'Tradition Focus' | 'State Focus' | 'Travel Circuit' | 'Temple Towns';
  readTime: string;
  publishedDate: string;
  author: string;
  introduction: string;
  featuredPlacesSlugs: string[];
  sections: SpiritualGuideSection[];
  conclusion: string;
  faq: SpiritualGuideFAQ[];
}

export interface TraditionOverview {
  tradition: SpiritualTradition;
  title: string;
  overview: string;
  coreHeritagePoints: string[];
  architecturalHallmarks: string[];
  keySitesInIndia: string[];
  etiquetteTips: string[];
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    gradient: string;
  };
}
