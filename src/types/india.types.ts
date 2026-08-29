export interface IndiaPlace {
  id: string;
  name: string;
  cityDistrict: string;
  shortDescription: string;
  category:
    | 'Top Attraction'
    | 'Heritage & History'
    | 'Religious & Spiritual'
    | 'Nature & Scenic'
    | 'Hill Station'
    | 'Family Friendly'
    | 'Couples & Romance'
    | 'Student & Youth'
    | 'Hidden Gem'
    | 'Weekend Getaway'
    | 'Wildlife & Safari'
    | 'Beach & Coastal'
    | string;
  whyVisit: string;
  idealDuration: string;
  officialSource: string;
  sourceUrl?: string;
  verifiedInfo: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  tags: string[];
  nearbyAttractions: string[];
  relatedPlaces?: string[];
  timings?: string;
  entryFee?: string;
}

export interface IndiaFood {
  name: string;
  localName?: string;
  type:
    | 'Vegetarian'
    | 'Non-Vegetarian'
    | 'Sweet / Dessert'
    | 'Beverage'
    | 'Street Food'
    | 'Snack'
    | 'Breakfast'
    | 'Seafood'
    | 'Traditional'
    | string;
  cityOrRegion: string;
  description: string;
  famousSpotsOrOrigin: string;
  image?: string;
}

export interface IndiaFestival {
  name: string;
  month: string;
  location: string;
  significance: string;
  description: string;
}

export interface IndiaExperience {
  title: string;
  category: string;
  location: string;
  description: string;
  idealFor: string;
}

export interface IndiaStateData {
  slug: string;
  name: string;
  type: 'STATE' | 'UNION_TERRITORY' | 'State' | 'UT';
  region: 'North' | 'South' | 'West' | 'East' | 'Northeast' | 'North East' | 'Central' | 'Union Territory';
  capital: string;
  tagline: string;
  heroImage: string;
  overview: string;
  quickFacts: {
    capital: string;
    largestCity: string;
    languages: string[];
    bestTimeToVisit: string;
    peakSeason: string;
    climateSummary: string;
    majorAirports: string[];
    railwayHubs: string[];
  };
  tourismBoard: {
    name: string;
    website: string;
    tollFree?: string;
  };
  topPlaces: IndiaPlace[];
  heritagePlaces: IndiaPlace[];
  spiritualPlaces: IndiaPlace[];
  naturePlaces: IndiaPlace[];
  hillStations: IndiaPlace[];
  famousFood: IndiaFood[];
  localExperiences: IndiaExperience[];
  weekendGetaways: IndiaPlace[];
  bestTimeToVisitGuide: {
    overview: string;
    peakSeasonMonths: string;
    peakSeasonNotes: string;
    moderateSeasonMonths: string;
    moderateSeasonNotes: string;
    offSeasonMonths: string;
    offSeasonNotes: string;
    monthByMonthTip: string;
  };
  famousFestivals: IndiaFestival[];
  placesForFamilies: IndiaPlace[];
  placesForCouples: IndiaPlace[];
  placesForStudents: IndiaPlace[];
  budgetTravelTips: {
    avgDailyBudget: string;
    stayTips: string[];
    transitTips: string[];
    foodTips: string[];
    freeOrLowCostActivities: string[];
  };
  hiddenGems: IndiaPlace[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export type IndiaRegion =
  | 'All'
  | 'North'
  | 'South'
  | 'West'
  | 'East'
  | 'Northeast'
  | 'North East'
  | 'Central'
  | 'Union Territory';
